import * as fs from "fs";
import { before, after, describe, it } from "mocha";
import { expect } from "chai";
import { newTest, cleanupTest, waitForNonemptyQuery } from "./setup.js";
import { connectVolume } from "yuebing-model";
import { destinationPath } from "yuebing-media";

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

        // wait for all transform jobs to finish
        for (const profile of test.profiles) {
            const finishedTransforms = await waitForNonemptyQuery(
                () =>
                    test.profileJobRepo.safeFindBy("asset", test.assetName, {
                        predicate: (a) => a.profile === profile.name,
                    }),
                (a) => a.status === "finished",
            );
            expect(finishedTransforms[0].asset).eq(test.assetName);

            // UploadJob should already be finished
            const uploadJobs = await test.uploadJobRepo.safeFindBy("asset", test.assetName);
            expect(uploadJobs.length).gte(1);
            const uploadJob = uploadJobs[0];
            expect(uploadJob.status).eq("finished");
            expect(uploadJob.finished).lt(finishedTransforms[0].finished); // upload finishes, then xform

            // todo: based on profile, what can we compare?
            // const origStat = fs.statSync(test.testDir + "/source/moon.mp4");
            const dataStat = fs.statSync(uploadJob.localPath);

            // transformed file should now be available at the destination
            const destConn = await connectVolume(test.destination);
            const destPath = destinationPath(uploadJob.asset, uploadJob.media, uploadJob.profile, uploadJob.localPath);
            const uploadedMeta = await destConn.safeMetadata(destPath);
            expect(uploadedMeta).is.not.null;
            expect(uploadedMeta.size).eq(dataStat.size);
        }
    });
});

after((done) => cleanupTest(test, done));
