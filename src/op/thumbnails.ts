import { ApplyProfileResponse, MediaOperationFunc, MediaOperationType, ParsedProfile } from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { VideoProfileThumbnailsType } from "../type/VideoProfileThumbnailsType.js";
import { OP_CONFIG_TYPES, OP_MAP, OPERATIONS } from "../operations.js";
import { ffmpegSizeConfig } from "../properties.js";

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
OP_CONFIG_TYPES.thumbnails = VideoThumbnailsTypeDef;

export const VideoThumbnailsOperation: MediaOperationType = {
    name: "thumbnails",
    command: "ffmpeg",
    minFileSize: 64,
};
OPERATIONS.thumbnails = VideoThumbnailsOperation;

export const thumbnails: MediaOperationFunc = async (
    infile: string,
    profile: ParsedProfile,
    outfile: string,
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
    args.push(outfile);
    return { args };
};
OP_MAP.thumbnails = thumbnails;
