var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { basename, dirname } from "path";
import { existsSync, writeFileSync } from "fs";
import { textTrackRegex } from "../properties.js";
import { toLang } from "../util/lang.js";
export const VideoCopyTextTracksOperation = {
    name: "copyTextTracks",
    func: true,
    minFileSize: 7, // minimum size of webvtt file is 7 bytes (and any srt < 7 bytes is also almost certainly invalid)
};
export const copyTextTracks = (logger, infile, profile, outDir, sourcePath, conn) => __awaiter(void 0, void 0, void 0, function* () {
    const TRACK_REGEX = new RegExp("(.+?)(\\.(\\w{2}(\\.(sdh))?))?\\." + profile.ext + "$", "ui");
    const sourceDir = dirname(sourcePath);
    if (!conn)
        throw new Error(`copyTextTracks: conn was not defined`);
    const dirFiles = yield conn.safeList(sourceDir, { recursive: true });
    const copied = [];
    const alreadyExist = [];
    for (let i = 0; i < dirFiles.length; i++) {
        const f = dirFiles[i];
        const filename = basename(f.name);
        const m = f.type && f.type === "file" && f.name ? filename.match(TRACK_REGEX) : false;
        if (m && m[0] === filename) {
            const sdh = typeof m[5] !== "undefined" && m[5] === "sdh" ? ".sdh" : "";
            const lang = typeof m[3] !== "undefined" ? toLang(m[3], logger) : "default";
            const index = String(i).padStart(3, "0");
            const destOutfile = `${outDir}/${profile.name}~${index}.${lang}${sdh}.${profile.ext}`;
            const destOutfileBase = basename(destOutfile);
            // sanity check
            if (!destOutfileBase.match(textTrackRegex)) {
                logger.warn(`copyTextTracks: invalid destOutfileBase (${destOutfileBase}) did not match textTrackRegex=${textTrackRegex}`);
                continue;
            }
            if (!existsSync(destOutfile)) {
                writeFileSync(destOutfile, yield conn.readFile(f.name));
                copied.push({ source: f.name, dest: destOutfile });
            }
            else {
                alreadyExist.push({ source: f.name, dest: destOutfile });
            }
        }
    }
    return { result: { copied, alreadyExist } };
});
export const load = (OPERATIONS, OP_MAP, DEFAULT_PROFILES) => {
    OPERATIONS.copyTextTracks = VideoCopyTextTracksOperation;
    OP_MAP.copyTextTracks = copyTextTracks;
    DEFAULT_PROFILES.push({
        name: "vttTracks_copy",
        operation: "copyTextTracks",
        ext: "vtt",
        contentType: "text/vtt",
    });
    DEFAULT_PROFILES.push({
        name: "srtTracks_copy",
        operation: "copyTextTracks",
        ext: "srt",
        contentType: "application/x-subrip",
    });
};
//# sourceMappingURL=copyTextTracks.js.map