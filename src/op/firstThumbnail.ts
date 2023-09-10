import {
    ApplyProfileResponse,
    MediaOperationFunc,
    MediaOperationType,
    MediaPluginProfileType,
    ParsedProfile,
} from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { VideoProfileFirstThumbnailType } from "../type/VideoProfileFirstThumbnailType.js";
import { ffmpegCommand, ffmpegSizeConfig } from "../properties.js";
import { MobilettoLogger } from "mobiletto-base";

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

export const VideoFirstThumbnailOperation: MediaOperationType = {
    name: "firstThumbnail",
    command: ffmpegCommand(),
    minFileSize: 64,
};

const DEFAULT_FIRST_THUMBNAIL_OFFSET = 3;

export const firstThumbnail: MediaOperationFunc = async (
    logger: MobilettoLogger,
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

export const load = (
    OPERATIONS: Record<string, MediaOperationType>,
    OP_MAP: Record<string, MediaOperationFunc>,
    DEFAULT_PROFILES: MediaPluginProfileType[],
    OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef>,
) => {
    OP_CONFIG_TYPES.firstThumbnail = VideoFirstThumbnailTypeDef;
    OPERATIONS.firstThumbnail = VideoFirstThumbnailOperation;
    OP_MAP.firstThumbnail = firstThumbnail;
    DEFAULT_PROFILES.push(
        {
            name: "firstThumbnail_small",
            operation: "firstThumbnail",
            ext: "jpg",
            contentType: "image/jpeg",
            operationConfig: JSON.stringify({
                size: "vga",
                offset: 6,
            }),
        },
        {
            name: "firstThumbnail_medium",
            from: "firstThumbnail_small",
            operationConfig: JSON.stringify({
                size: "hd720",
            }),
        },
        {
            name: "firstThumbnail_large",
            from: "firstThumbnail_small",
            operationConfig: JSON.stringify({
                size: "hd1080",
            }),
        },
    );
};
