var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { basename } from "path";
import { ALL_LANGS_ARRAY } from "hokey-runtime";
import { textTrackRegex, ffmpegCommand } from "../properties.js";
import { OP_MEDIAINFO } from "./mediainfo.js";
export const VideoExtractTextTracksOperation = {
    name: "extractTextTracks",
    command: ffmpegCommand(),
    analysis: true,
    minFileSize: 7, // minimum size of webvtt file is 7 bytes (and any srt < 7 bytes is also almost certainly invalid)
};
const codecForTextTrackContentType = (contentType) => {
    const ct = contentType.toLowerCase();
    if (ct === "text/vtt")
        return "webvtt";
    if (ct === "application/x-subrip")
        return "subrip";
    // todo: support other text track types?
    return null;
};
export const extractTextTracks = (logger, infile, profile, outDir, sourcePath, conn, analysisResults) => __awaiter(void 0, void 0, void 0, function* () {
    if (!profile.contentType) {
        throw new Error(`extractTextTracks: profile.contentType not defined. profile=${profile.name}`);
    }
    const logPrefix = `extractTextTracks(sourcePath=${sourcePath}, profile=${profile.name}):`;
    const codec = codecForTextTrackContentType(profile.contentType);
    if (codec == null) {
        logger.warn(`${logPrefix} skipping (unsupported text track contentType: ${profile.contentType})`);
        return {};
    }
    if (!analysisResults || analysisResults.length === 0) {
        throw new Error(`extractTextTracks: no analysisResult, cannot proceed`);
    }
    const textTracks = [];
    const mediainfoJob = analysisResults.find((r) => r.operation === OP_MEDIAINFO);
    if (!mediainfoJob) {
        logger.warn(`${logPrefix} skipping (no job with profile.operation=mediainfo found)`);
        return {};
    }
    if (!mediainfoJob.result) {
        logger.warn(`${logPrefix} skipping job.result was undefined for mediainfoJob=${mediainfoJob.name}`);
        return {};
    }
    const mediainfo = JSON.parse(mediainfoJob.result);
    if (!(mediainfo && "media" in mediainfo && "track" in mediainfo.media)) {
        logger.warn(`${logPrefix} skipping (no tracks found)`);
        return {};
    }
    for (const track of mediainfo.media.track) {
        if (!("@type" in track && track["@type"] === "Text")) {
            logger.debug(`${logPrefix} skipping non-text track: ${JSON.stringify(track)}`);
            continue;
        }
        if (!("Format" in track)) {
            logger.warn(`${logPrefix} skipping text track (no Format): ${JSON.stringify(track)}`);
            continue;
        }
        if (!("Language" in track && ALL_LANGS_ARRAY.includes(track.Language))) {
            logger.warn(`${logPrefix} skipping unsupported text track (expected valid Language): ${JSON.stringify(track)}`);
            continue;
        }
        textTracks.push(track);
    }
    if (textTracks.length === 0) {
        logger.info(`${logPrefix} no supported text tracks found, skipping`);
        return {};
    }
    const outfilePrefix = `${outDir}/${profile.name}~`;
    const args = [];
    args.push("-i");
    args.push(infile);
    for (let i = 0; i < textTracks.length; i++) {
        const track = textTracks[i];
        args.push("-c");
        args.push(codec);
        args.push("-map");
        args.push(`0:s:${i}`);
        const index = String(i).padStart(3, "0");
        const langOutputFile = `${outfilePrefix}${index}.${track.Language}.${profile.ext}`;
        const destOutfileBase = basename(langOutputFile);
        // sanity check
        if (!destOutfileBase.match(textTrackRegex)) {
            logger.error(`${logPrefix} invalid destOutfileBase (${destOutfileBase}) did not match textTrackRegex=${textTrackRegex}`);
            continue;
        }
        args.push(langOutputFile);
    }
    args.push("-y");
    return { args };
});
export const load = (OPERATIONS, OP_MAP, DEFAULT_PROFILES) => {
    OPERATIONS.extractTextTracks = VideoExtractTextTracksOperation;
    OP_MAP.extractTextTracks = extractTextTracks;
    DEFAULT_PROFILES.push({
        name: "vttTracks_extract",
        operation: "extractTextTracks",
        ext: "vtt",
        contentType: "text/vtt",
    });
};
//# sourceMappingURL=extractTextTracks.js.map