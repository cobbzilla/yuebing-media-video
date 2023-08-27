import * as fs from "fs";
import { before, after, describe, it } from "mocha";
import { expect } from "chai";
import { newTest, cleanupTest, waitForNonemptyQuery } from "./setup.js";
import { connectVolume } from "yuebing-server-util";
import { destinationPath } from "yuebing-media";
import { mediaPlugin as videoPlugin } from "../lib/esm/index.js";

let test;

before(async () => {
    test = await newTest();
});

describe("test yuebing-media-video", async () => {
    it("should find, analyze, process and upload files for a video asset", async () => {
        // wait for scanner to create sourceAsset with status==pending
        const scanned = await waitForNonemptyQuery(() => test.sourceAssetRepo.findAll());
        expect(scanned[0].name).eq(test.assetName);

        // wait for analyzer to update sourceAsset with status==finished
        const finishedScans = await waitForNonemptyQuery(
            () => test.sourceAssetRepo.findAll(),
            (a) => a.status === "finished",
            1000 * 60 * 100,
        );
        expect(finishedScans[0].name).eq(test.assetName);

        // when the source asset is finished, the analysis profile should also be finished
        const analyzed = await test.profileJobRepo.safeFindBy("asset", test.assetName, {
            predicate: (a) => a.profile === "mediainfo",
        });
        expect(analyzed[0].status).eq("finished");

        // find transform profiles that should have run
        const xformProfiles = test.profiles.filter(
            // enabled, not noop, not analysis, not text-track-related (no files for those)
            (p) =>
                p.enabled &&
                !p.noop &&
                !videoPlugin.operations()[p.operation].analysis &&
                !["vtt", "srt"].includes(p.ext),
        );

        // wait for all transform jobs to finish
        for (const profile of xformProfiles) {
            const finishedTransforms = await waitForNonemptyQuery(
                () =>
                    test.profileJobRepo.safeFindBy("asset", test.assetName, {
                        predicate: (a) => a.profile === profile.name,
                    }),
                (a) => a.status === "finished",
            );
            expect(finishedTransforms[0].asset).eq(test.assetName);

            // UploadJob should already be finished
            const uploadJobs = await test.uploadJobRepo.safeFindBy("asset", test.assetName, {
                predicate: (a) => a.profile === profile.name,
            });
            expect(uploadJobs.length).gte(1, `expected 1+ uploadJobs for profile=${profile.name}`);
            const uploadJob = uploadJobs[0];
            expect(uploadJob.status).eq("finished");

            // upload finishes, then xform; both could finish at the same millisecond
            expect(uploadJob.finished).lte(finishedTransforms[0].finished);

            // todo: based on profile, what can we compare?
            // const origStat = fs.statSync(test.testDir + "/source/moon.mp4");
            const dataStat = fs.statSync(uploadJob.localPath);

            // transformed file should now be available at the destination
            const destConnResult = await connectVolume(test.destination);
            const destConn = destConnResult.connection;
            expect(destConn).is.not.undefined;
            expect(destConn).is.not.null;
            const destPath = destinationPath(uploadJob.asset, uploadJob.media, uploadJob.profile, uploadJob.localPath);
            const uploadedMeta = await destConn.safeMetadata(destPath);
            expect(uploadedMeta).is.not.null;
            expect(uploadedMeta.size).eq(dataStat.size);
        }
    });
});

after((done) => cleanupTest(test, done));
