import { basename } from "path";
import { MobilettoConnection } from "mobiletto-base";
import { ALL_LANGS_ARRAY } from "hokey-runtime";
import {
    ApplyProfileResponse,
    MediaOperationFunc,
    MediaOperationType,
    MediaPluginProfileType,
    ParsedProfile,
} from "yuebing-media";
import { ProfileJobType } from "yuebing-model";
import { textTrackRegex } from "../properties.js";
import { OP_MEDIAINFO } from "./mediainfo.js";

export const VideoExtractTextTracksOperation: MediaOperationType = {
    name: "extractTextTracks",
    command: "ffmpeg",
    analysis: true, // srt extraction must run during analysis, so if srt2vtt is enabled, srt files will be present
    minFileSize: 7, // minimum size of webvtt file is 7 bytes (and any srt < 7 bytes is also almost certainly invalid)
};

const codecForTextTrackContentType = (contentType: string): string | null => {
    const ct = contentType.toLowerCase();
    if (ct === "text/vtt") return "webvtt";
    if (ct === "application/x-subrip") return "subrip";
    // todo: support other text track types?
    return null;
};

export const extractTextTracks: MediaOperationFunc = async (
    infile: string,
    profile: ParsedProfile,
    outDir: string,
    sourcePath: string,
    conn?: MobilettoConnection,
    analysisResults?: ProfileJobType[],
): Promise<ApplyProfileResponse> => {
    if (!profile.contentType) {
        throw new Error(`extractTextTracks: profile.contentType not defined. profile=${profile.name}`);
    }
    const logPrefix = `extractTextTracks(sourcePath=${sourcePath}, profile=${profile.name}):`;
    const codec = codecForTextTrackContentType(profile.contentType);
    if (codec == null) {
        console.warn(`${logPrefix} skipping (unsupported text track contentType: ${profile.contentType})`);
        return {};
    }
    if (!analysisResults || analysisResults.length === 0) {
        throw new Error(`extractTextTracks: no analysisResult, cannot proceed`);
    }

    const textTracks = [];
    const mediainfoJob = analysisResults.find((r) => r.operation === OP_MEDIAINFO);
    if (!mediainfoJob) {
        console.warn(`${logPrefix} skipping (no job with profile.operation=mediainfo found)`);
        return {};
    }
    if (!mediainfoJob.result) {
        console.warn(`${logPrefix} skipping job.result was undefined for mediainfoJob=${mediainfoJob.name}`);
        return {};
    }
    const mediainfo = JSON.parse(mediainfoJob.result);
    if (!(mediainfo && "media" in mediainfo && "track" in mediainfo.media)) {
        console.warn(`${logPrefix} skipping (no tracks found)`);
        return {};
    }
    for (const track of mediainfo.media.track) {
        if (!("@type" in track && track["@type"] === "Text")) {
            console.debug(`${logPrefix} skipping non-text track: ${JSON.stringify(track)}`);
            continue;
        }
        if (!("Format" in track)) {
            console.warn(`${logPrefix} skipping text track (no Format): ${JSON.stringify(track)}`);
            continue;
        }
        if (!("Language" in track && ALL_LANGS_ARRAY.includes(track.Language))) {
            console.warn(
                `${logPrefix} skipping unsupported text track (expected valid Language): ${JSON.stringify(track)}`,
            );
            continue;
        }
        textTracks.push(track);
    }

    if (textTracks.length === 0) {
        console.info(`${logPrefix} no supported text tracks found, skipping`);
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
            console.error(
                `${logPrefix} invalid destOutfileBase (${destOutfileBase}) did not match textTrackRegex=${textTrackRegex}`,
            );
            continue;
        }
        args.push(langOutputFile);
    }
    args.push("-y");
    return { args };
};

export const load = (
    OPERATIONS: Record<string, MediaOperationType>,
    OP_MAP: Record<string, MediaOperationFunc>,
    DEFAULT_PROFILES: MediaPluginProfileType[],
) => {
    OPERATIONS.extractTextTracks = VideoExtractTextTracksOperation;
    OP_MAP.extractTextTracks = extractTextTracks;
    DEFAULT_PROFILES.push({
        name: "vttTracks_extract",
        operation: "extractTextTracks",
        ext: "vtt",
        contentType: "text/vtt",
        multiFile: true,
    });
};
