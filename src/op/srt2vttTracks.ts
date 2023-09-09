import { basename, dirname } from "path";
import { existsSync, writeFileSync } from "fs";
import { MobilettoConnection, MobilettoLogger } from "mobiletto-base";
import { sha } from "mobiletto-orm-typedef";
import {
    ApplyProfileResponse,
    MediaOperationFunc,
    MediaOperationType,
    MediaPluginProfileType,
    ParsedProfile,
} from "yuebing-media";
import { textTrackRegex } from "../properties.js";
import { toLang } from "../util/lang.js";
import { srt2webvtt } from "../util/video_srt2vtt.js";

export const VideoSrt2VttTracksOperation: MediaOperationType = {
    name: "srt2vttTracks",
    func: true,
    minFileSize: 7, // minimum size of webvtt file is 7 bytes (and any srt < 7 bytes is also almost certainly invalid)
};

const SRT_TRACK_REGEX = new RegExp("(.+?)(\\.(\\w{2}(\\.(sdh))?))?\\.srt$", "ui");

export const srt2vttTextTracks: MediaOperationFunc = async (
    logger: MobilettoLogger,
    infile: string,
    profile: ParsedProfile,
    outDir: string,
    sourcePath: string,
    conn?: MobilettoConnection,
): Promise<ApplyProfileResponse> => {
    if (profile.ext !== "vtt") {
        throw new Error(`srt2vttTracks: expected profile.ext === 'vtt' but was '${profile.ext}'`);
    }
    if (!conn) throw new Error(`srt2vttTracks: conn was not defined`);
    const sourceDir = dirname(sourcePath);

    const dirFiles = await conn.safeList(sourceDir, { recursive: true });
    const converted = [];
    const alreadyExist = [];
    for (let i = 0; i < dirFiles.length; i++) {
        const f = dirFiles[i];
        const filename = basename(f.name);
        const srtMatch = f.type && f.type === "file" && f.name ? filename.match(SRT_TRACK_REGEX) : false;
        if (srtMatch && srtMatch[0] === filename) {
            const sdh = typeof srtMatch[5] !== "undefined" && srtMatch[5] === "sdh" ? ".sdh" : "";
            const lang = typeof srtMatch[3] !== "undefined" ? toLang(srtMatch[3], logger) : "default";
            const vttHash = sha(profile.name + i + " " + lang + sdh);
            const destOutfile = `${outDir}/${profile.name}~${vttHash}.${lang}${sdh}.vtt`;
            const destOutfileBase = basename(destOutfile);
            // sanity check
            if (!destOutfileBase.match(textTrackRegex)) {
                logger.error(
                    `srt2vttTracks: invalid destOutfileBase (${destOutfileBase}) did not match textTrackRegex=${textTrackRegex}`,
                );
                continue;
            }
            if (!existsSync(destOutfile)) {
                try {
                    const srtData = await conn.readFile(f.name);
                    const vttData = srt2webvtt(srtData);
                    writeFileSync(destOutfile, vttData);
                    converted.push({ source: f.name, dest: destOutfile });
                } catch (e) {
                    logger.error(`srt2vttTracks: error: ${JSON.stringify(e)}`);
                }
            } else {
                alreadyExist.push({ source: f.name, dest: destOutfile });
            }
        }
    }
    return { result: { converted, alreadyExist }, upload: true };
};

export const load = (
    OPERATIONS: Record<string, MediaOperationType>,
    OP_MAP: Record<string, MediaOperationFunc>,
    DEFAULT_PROFILES: MediaPluginProfileType[],
) => {
    OPERATIONS.srt2vttTracks = VideoSrt2VttTracksOperation;
    OP_MAP.srt2vttTextTracks = srt2vttTextTracks;
    DEFAULT_PROFILES.push({
        name: "srt2vttTracks",
        operation: "srt2vttTracks",
        ext: "vtt",
        contentType: "text/vtt",
    });
};
