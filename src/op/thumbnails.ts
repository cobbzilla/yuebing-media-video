import { MobilettoLogger } from "mobiletto-base";
import {
    ApplyProfileResponse,
    MediaOperationFunc,
    MediaOperationType,
    MediaPluginProfileType,
    ParsedProfile,
} from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { VideoProfileThumbnailsType } from "../type/VideoProfileThumbnailsType.js";
import { FFMPEG_COMMAND, ffmpegSizeConfig } from "../properties.js";

export const VideoThumbnailsTypeDefFields: MobilettoOrmFieldDefConfigs = {
    size: {
        required: true,
        type: "string",
    },
    fps: {
        required: true,
        type: "string",
        regex: /^[\d+]\/[\d+]$/,
    },
};

export const VideoThumbnailsTypeDef: MobilettoOrmTypeDef = new MobilettoOrmTypeDef({
    typeName: "VideoProfileThumbnails",
    fields: VideoThumbnailsTypeDefFields,
}).extend({
    fields: { size: ffmpegSizeConfig },
});

export const VideoThumbnailsOperation: MediaOperationType = {
    name: "thumbnails",
    command: FFMPEG_COMMAND,
    minFileSize: 64,
};

export const thumbnails: MediaOperationFunc = async (
    logger: MobilettoLogger,
    infile: string,
    profile: ParsedProfile,
    outDir: string,
): Promise<ApplyProfileResponse> => {
    if (!profile.operationConfigObject) throw new Error(`thumbnails: profile.operationConfigObject not defined`);
    const config = profile.operationConfigObject as VideoProfileThumbnailsType;

    const args = [];
    args.push("-i");
    args.push(infile);
    args.push("-s");
    args.push(config.size);
    args.push("-vf");
    args.push("fps=" + config.fps);
    args.push("-y");
    args.push(`${outDir}/${profile.name}_%04d.${profile.ext}`);
    return { args };
};

export const load = (
    OPERATIONS: Record<string, MediaOperationType>,
    OP_MAP: Record<string, MediaOperationFunc>,
    DEFAULT_PROFILES: MediaPluginProfileType[],
    OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef>,
) => {
    OP_CONFIG_TYPES.thumbnails = VideoThumbnailsTypeDef;
    OPERATIONS.thumbnails = VideoThumbnailsOperation;
    OP_MAP.thumbnails = thumbnails;
    DEFAULT_PROFILES.push(
        {
            name: "thumbnails_small",
            operation: "thumbnails",
            ext: "jpg",
            contentType: "image/jpeg",
            operationConfig: JSON.stringify({
                size: "vga",
                fps: "1/60",
            }),
        },
        {
            name: "thumbnails_medium",
            from: "thumbnails_small",
            operationConfig: JSON.stringify({
                size: "hd720",
            }),
        },
        {
            name: "thumbnails_large",
            from: "thumbnails_small",
            operationConfig: JSON.stringify({
                size: "hd1080",
            }),
        },
    );
};
