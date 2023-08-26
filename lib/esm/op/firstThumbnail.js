var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { OP_CONFIG_TYPES, OP_MAP, OPERATIONS } from "../common.js";
import { ffmpegSizeConfig } from "../properties.js";
export const VideoFirstThumbnailTypeDefFields = {
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
export const VideoFirstThumbnailTypeDef = new MobilettoOrmTypeDef({
    typeName: "VideoProfileFirstThumbnail",
    fields: VideoFirstThumbnailTypeDefFields,
}).extend({
    fields: { size: ffmpegSizeConfig },
});
OP_CONFIG_TYPES.firstThumbnail = VideoFirstThumbnailTypeDef;
export const VideoFirstThumbnailOperation = {
    name: "firstThumbnail",
    command: "ffmpeg",
    minFileSize: 64,
};
OPERATIONS.firstThumbnail = VideoFirstThumbnailOperation;
const DEFAULT_FIRST_THUMBNAIL_OFFSET = 3;
export const firstThumbnail = (infile, profile, outDir) => __awaiter(void 0, void 0, void 0, function* () {
    if (!profile.operationConfigObject)
        throw new Error(`firstThumbnail: profile.operationConfigObject not defined`);
    const config = profile.operationConfigObject;
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
});
OP_MAP.firstThumbnail = firstThumbnail;
