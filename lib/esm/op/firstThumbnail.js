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
    fps: {
        required: true,
        type: "string",
        regex: /^[\d+]\/[\d+]$/,
    },
};
export const VideoFirstThumbnailTypeDef = new MobilettoOrmTypeDef({
    typeName: "VideoProfileFirstThumbnail",
    fields: VideoFirstThumbnailTypeDefFields,
});
const DEFAULT_FIRST_THUMBNAIL_OFFSET = 3;
export const firstThumbnail = (infile, profile, outfile) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = profile.offset && profile.offset > 0 ? profile.offset : DEFAULT_FIRST_THUMBNAIL_OFFSET;
    const args = [];
    args.push("-ss");
    args.push("" + offset);
    args.push("-accurate_seek");
    args.push("-i");
    args.push(infile);
    args.push("-s");
    args.push(profile.size);
    args.push("-frames:v");
    args.push("1");
    args.push("-y");
    args.push(outfile);
    return { args };
});
