import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { MobilettoLogger } from "mobiletto-base";
import {
    ApplyProfileResponse,
    MediaOperationFunc,
    MediaOperationType,
    MediaPluginProfileType,
    ParsedProfile,
} from "yuebing-media";
import { VideoProfileTranscodeType } from "../type/VideoProfileTranscodeType.js";
import { FFMPEG_BITRATE_REGEX, ffmpegCommand, ffmpegSizeConfig } from "../properties.js";

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
}).extend({
    fields: { videoSize: ffmpegSizeConfig },
});

export const VideoTranscodeOperation: MediaOperationType = {
    name: "transcode",
    command: ffmpegCommand(),
    minFileSize: 1024 * 64,
};

export const transcode: MediaOperationFunc = async (
    logger: MobilettoLogger,
    infile: string,
    profile: ParsedProfile,
    outDir: string,
): Promise<ApplyProfileResponse> => {
    if (!profile.operationConfigObject) {
        throw new Error(`transcode: profile.operationConfigObject not defined for PROFILE=${profile.name}`);
    }
    const config = profile.operationConfigObject as VideoProfileTranscodeType;

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
    args.push(`${outDir}/${profile.name}.${profile.ext}`);
    return { args };
};

export const load = (
    OPERATIONS: Record<string, MediaOperationType>,
    OP_MAP: Record<string, MediaOperationFunc>,
    DEFAULT_PROFILES: MediaPluginProfileType[],
    OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef>,
) => {
    OP_CONFIG_TYPES.transcode = VideoTranscodeTypeDef;
    OPERATIONS.transcode = VideoTranscodeOperation;
    OP_MAP.transcode = transcode;
    DEFAULT_PROFILES.push(
        {
            name: "transcode_high_mp4",
            enabled: false,
            operation: "transcode",
            primary: true,
            ext: "mp4",
            contentType: "video/mp4",
            operationConfig: JSON.stringify({
                videoCodec: "libx264",
                videoSize: "hd1080",
                videoBitrate: "2048k",
                frameRate: 30,
                audioCodec: "aac",
                audioChannels: 2,
                audioRate: 44100,
                audioBitrate: "128k",
            }),
        },
        {
            name: "transcode_mid_mp4",
            from: "transcode_high_mp4",
            operationConfig: JSON.stringify({
                videoBitrate: "1024k",
            }),
        },
        {
            name: "transcode_low_mp4",
            from: "transcode_mid_mp4",
            operationConfig: JSON.stringify({
                videoSize: "hd720",
                videoBitrate: "384k",
                frameRate: 24,
                audioChannels: 1,
                audioBitrate: "64k",
            }),
        },
        {
            name: "transcode_min_mp4",
            from: "transcode_low_mp4",
            operationConfig: JSON.stringify({
                videoSize: "640x360",
                videoBitrate: "192k",
                audioBitrate: "48k",
            }),
        },
    );
};
