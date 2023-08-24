var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VideoTranscodeTypeDef, transcode } from "./op/transcode.js";
import { VideoDashTypeDef, dash } from "./op/dash.js";
import { VideoThumbnailsTypeDef, thumbnails } from "./op/thumbnails.js";
import { VideoFirstThumbnailTypeDef, firstThumbnail } from "./op/firstThumbnail";
const OP_MAP = {
    transcode,
    dash,
    thumbnails,
    firstThumbnail,
};
const OP_CONFIG = {
    transcode: VideoTranscodeTypeDef,
    dash: VideoDashTypeDef,
    thumbnails: VideoThumbnailsTypeDef,
    firstThumbnail: VideoFirstThumbnailTypeDef,
};
export const mediaDriver = {
    applyProfile: (downloaded, profile, outDir, sourcePath, conn) => __awaiter(void 0, void 0, void 0, function* () {
        if (profile.noop)
            throw new Error(`applyProfile: cannot apply noop profile: ${profile.name}`);
        if (!profile.enabled)
            throw new Error(`applyProfile: profile not enabled: ${profile.name}`);
        if (!profile.operation)
            throw new Error(`applyProfile: no operation defined for profile: ${profile.name}`);
        return yield OP_MAP[profile.operation](downloaded, profile, `${outDir}/${profile.operation}.${profile.ext}`, sourcePath, conn);
    }),
    operationConfigType: (operation, parsedProps) => {
        const typeDef = OP_CONFIG[operation];
        const ffmpegSizes = parsedProps.ffmpeg_sizes;
        const ffmpegItems = [];
        for (const sym of Object.keys(ffmpegSizes)) {
            ffmpegItems.push({ value: sym, label: `${sym} (${ffmpegSizes[sym]})`, rawLabel: true });
        }
        const ffmpegSizeConfig = {
            items: ffmpegItems,
            values: ffmpegItems.map((i) => i.value),
            labels: ffmpegItems.map((i) => i.label),
        };
        if (typeDef === VideoTranscodeTypeDef) {
            return typeDef.extend({
                fields: { videoSize: ffmpegSizeConfig },
            });
        }
        else if (typeDef === VideoDashTypeDef) {
            return typeDef.extend({
                fields: {
                    subProfiles: {
                        required: true,
                        test: {
                            message: "err_video_dash_noSubProfiles",
                            valid: (v) => Array.isArray(v.subProfiles) && v.subProfiles.length > 0,
                        },
                    },
                },
            });
        }
        else if (typeDef === VideoThumbnailsTypeDef || typeDef === VideoFirstThumbnailTypeDef) {
            return typeDef.extend({
                fields: { size: ffmpegSizeConfig },
            });
        }
        return typeDef;
    },
};
