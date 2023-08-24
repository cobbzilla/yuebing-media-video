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
import { OP_CONFIG_TYPES, OP_MAP, OPERATIONS } from "../operations.js";
import { ffmpegSizeConfig } from "../properties.js";
export const VideoThumbnailsTypeDefFields = {
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
export const VideoThumbnailsTypeDef = new MobilettoOrmTypeDef({
    typeName: "VideoProfileThumbnails",
    fields: VideoThumbnailsTypeDefFields,
}).extend({
    fields: { size: ffmpegSizeConfig },
});
OP_CONFIG_TYPES.thumbnails = VideoThumbnailsTypeDef;
export const VideoThumbnailsOperation = {
    name: "thumbnails",
    command: "ffmpeg",
    minFileSize: 64,
};
OPERATIONS.thumbnails = VideoThumbnailsOperation;
export const thumbnails = (infile, profile, outfile) => __awaiter(void 0, void 0, void 0, function* () {
    if (!profile.operationConfigObject)
        throw new Error(`thumbnails: profile.operationConfigObject not defined`);
    const config = profile.operationConfigObject;
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
});
OP_MAP.thumbnails = thumbnails;
