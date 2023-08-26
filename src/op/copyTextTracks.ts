import { basename, dirname } from "path";
import { existsSync, writeFileSync } from "fs";
import { MobilettoConnection } from "mobiletto-base";
import { ApplyProfileResponse, MediaOperationFunc, MediaOperationType, ParsedProfile } from "yuebing-media";
import { OP_MAP, OPERATIONS } from "../common.js";
import { textTrackRegex } from "../properties.js";
import { toLang } from "../util/lang.js";

export const VideoCopyTextTracksOperation: MediaOperationType = {
    name: "copyTextTracks",
    func: true,
    minFileSize: 7, // minimum size of webvtt file is 7 bytes (and any srt < 7 bytes is also almost certainly invalid)
};
OPERATIONS.copyTextTracks = VideoCopyTextTracksOperation;

export const copyTextTracks: MediaOperationFunc = async (
    infile: string,
    profile: ParsedProfile,
    outDir: string,
    sourcePath: string,
    conn?: MobilettoConnection,
): Promise<ApplyProfileResponse> => {
    const TRACK_REGEX = new RegExp("(.+?)(\\.(\\w{2}(\\.(sdh))?))?\\." + profile.ext + "$", "ui");
    const sourceDir = dirname(sourcePath);

    if (!conn) throw new Error(`copyTextTracks: conn was not defined`);
    const dirFiles = await conn.safeList(sourceDir, { recursive: true });
    const copied = [];
    const alreadyExist = [];
    for (let i = 0; i < dirFiles.length; i++) {
        const f = dirFiles[i];
        const filename = basename(f.name);
        const m = f.type && f.type === "file" && f.name ? filename.match(TRACK_REGEX) : false;
        if (m && m[0] === filename) {
            const sdh = typeof m[5] !== "undefined" && m[5] === "sdh" ? ".sdh" : "";
            const lang = typeof m[3] !== "undefined" ? toLang(m[3]) : "default";
            const index = String(i).padStart(3, "0");
            const destOutfile = `${outDir}/${profile.name}~${index}.${lang}${sdh}.${profile.ext}`;
            const destOutfileBase = basename(destOutfile);
            // sanity check
            if (!destOutfileBase.match(textTrackRegex)) {
                console.warn(
                    `copyTextTracks: invalid destOutfileBase (${destOutfileBase}) did not match textTrackRegex=${textTrackRegex}`,
                );
                continue;
            }
            if (!existsSync(destOutfile)) {
                writeFileSync(destOutfile, await conn.readFile(f.name));
                copied.push({ source: f.name, dest: destOutfile });
            } else {
                alreadyExist.push({ source: f.name, dest: destOutfile });
            }
        }
    }
    return { result: { copied, alreadyExist } };
};
OP_MAP.copyTextTracks = copyTextTracks;
