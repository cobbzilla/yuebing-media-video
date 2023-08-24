import { ApplyProfileResponse, MediaOperationFunc, ParsedProfile } from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { VideoProfileTranscodeType } from "../type/VideoProfileTranscodeType.js";

const FFMPEG_BITRATE_REGEX = /^\d+([bkMG]|(\.\d+[kMG]))?$/;

export const VideoTranscodeTypeDefFields: MobilettoOrmFieldDefConfigs = {
    videoCodec: {
        required: true,
        type: "string",
        values: ["libx264", "libx265", "libwebp", "mpeg4", "wmv3"],
    },
    videoSize: {
        required: true,
        type: "string",
    },
    videoBitrate: {
        required: true,
        type: "string",
        regex: FFMPEG_BITRATE_REGEX,
    },
    frameRate: {
        required: true,
        type: "number",
        values: [23.976, 24, 25, 30, 29.97, 50, 60],
    },
    audioCodec: {
        required: true,
        type: "string",
        values: ["aac", "mp3", "flac"],
    },
    audioChannels: {
        required: true,
        type: "number",
        values: [1, 2, 2.1, 5.1, 7.1, 9.1],
    },
    audioRate: {
        required: true,
        type: "number",
        values: [8000, 22050, 44100, 48000, 96000],
    },
    audioBitrate: {
        required: true,
        type: "string",
        regex: FFMPEG_BITRATE_REGEX,
    },
};

export const VideoTranscodeTypeDef: MobilettoOrmTypeDef = new MobilettoOrmTypeDef({
    typeName: "VideoProfileTranscode",
    fields: VideoTranscodeTypeDefFields,
});

export const transcode: MediaOperationFunc = async (
    infile: string,
    profile: ParsedProfile,
    outfile: string,
): Promise<ApplyProfileResponse> => {
    if (!profile.operationConfig) throw new Error(`transcode: profile.operationConfig not defined`);

    const config = JSON.parse(profile.operationConfig) as VideoProfileTranscodeType;
    if (!config) throw new Error(`transcode: no operationConfig found on profile: ${profile.name}`);

    const args: string[] = [];
    args.push("-i");
    args.push(infile);
    args.push("-vcodec");
    args.push("" + config.videoCodec);
    args.push("-s");
    args.push("" + config.videoSize);
    args.push("-r");
    args.push("" + config.frameRate);
    args.push("-b:v");
    args.push("" + config.videoBitrate);
    args.push("-acodec");
    args.push("" + config.audioCodec);
    args.push("-ac");
    args.push("" + config.audioChannels);
    args.push("-ar");
    args.push("" + config.audioRate);
    args.push("-b:a");
    args.push("" + config.audioBitrate);
    args.push("-y");
    args.push(outfile);
    return { args };
};
