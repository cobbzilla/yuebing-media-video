import { ApplyProfileResponse, MediaOperationFunc, MediaOperationType, ParsedProfile } from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { VideoProfileFirstThumbnailType } from "../type/VideoProfileFirstThumbnailType.js";
import { OP_CONFIG_TYPES, OP_MAP, OPERATIONS } from "../common.js";
import { ffmpegSizeConfig } from "../properties.js";

export const VideoFirstThumbnailTypeDefFields: MobilettoOrmFieldDefConfigs = {
    size: {
        required: true,
        type: "string",
    },
    offset: {
        required: true,
        type: "number",
        control: "text",
    },
};

export const VideoFirstThumbnailTypeDef: MobilettoOrmTypeDef = new MobilettoOrmTypeDef({
    typeName: "VideoProfileFirstThumbnail",
    fields: VideoFirstThumbnailTypeDefFields,
}).extend({
    fields: { size: ffmpegSizeConfig },
});
OP_CONFIG_TYPES.firstThumbnail = VideoFirstThumbnailTypeDef;

export const VideoFirstThumbnailOperation: MediaOperationType = {
    name: "firstThumbnail",
    command: "ffmpeg",
    minFileSize: 64,
};
OPERATIONS.firstThumbnail = VideoFirstThumbnailOperation;

const DEFAULT_FIRST_THUMBNAIL_OFFSET = 3;

export const firstThumbnail: MediaOperationFunc = async (
    infile: string,
    profile: ParsedProfile,
    outDir: string,
): Promise<ApplyProfileResponse> => {
    if (!profile.operationConfigObject) throw new Error(`firstThumbnail: profile.operationConfigObject not defined`);
    const config = profile.operationConfigObject as VideoProfileFirstThumbnailType;

    const offset = config.offset && config.offset > 0 ? config.offset : DEFAULT_FIRST_THUMBNAIL_OFFSET;
    const args = [];
    args.push("-ss");
    args.push("" + offset);
    args.push("-accurate_seek");
    args.push("-i");
    args.push(infile);
    args.push("-s");
    args.push(config.size);
    args.push("-frames:v");
    args.push("1");
    args.push("-y");
    args.push(`${outDir}/${profile.name}.${profile.ext}`);
    return { args };
};
OP_MAP.firstThumbnail = firstThumbnail;
