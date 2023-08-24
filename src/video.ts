import { MobilettoConnection } from "mobiletto-base";
import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { ApplyProfileResponse, MediaOperationFunc, MediaPlugin, ParsedProfile, ParsedProperties } from "yuebing-media";
import { VideoTranscodeTypeDef, transcode } from "./op/transcode.js";
import { VideoDashTypeDef, dash } from "./op/dash.js";
import { VideoThumbnailsTypeDef, thumbnails } from "./op/thumbnails.js";
import { VideoFirstThumbnailTypeDef, firstThumbnail } from "./op/firstThumbnail";

const OP_MAP: Record<string, MediaOperationFunc> = {
    transcode,
    dash,
    thumbnails,
    firstThumbnail,
};

const OP_CONFIG: Record<string, MobilettoOrmTypeDef> = {
    transcode: VideoTranscodeTypeDef,
    dash: VideoDashTypeDef,
    thumbnails: VideoThumbnailsTypeDef,
    firstThumbnail: VideoFirstThumbnailTypeDef,
};

export const mediaDriver: MediaPlugin = {
    applyProfile: async (
        downloaded: string,
        profile: ParsedProfile,
        outDir: string,
        sourcePath: string,
        conn: MobilettoConnection,
    ): Promise<ApplyProfileResponse> => {
        if (profile.noop) throw new Error(`applyProfile: cannot apply noop profile: ${profile.name}`);
        if (!profile.enabled) throw new Error(`applyProfile: profile not enabled: ${profile.name}`);
        if (!profile.operation) throw new Error(`applyProfile: no operation defined for profile: ${profile.name}`);
        return await OP_MAP[profile.operation](
            downloaded,
            profile,
            `${outDir}/${profile.operation}.${profile.ext}`,
            sourcePath,
            conn,
        );
    },
    operationConfigType: (operation: string, parsedProps: ParsedProperties) => {
        const typeDef = OP_CONFIG[operation];
        const ffmpegSizes = parsedProps.ffmpeg_sizes as Record<string, string>;
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
        } else if (typeDef === VideoDashTypeDef) {
            return typeDef.extend({
                fields: {
                    subProfiles: {
                        required: true,
                        test: {
                            message: "err_video_dash_noSubProfiles",
                            valid: (v: Record<string, unknown>) =>
                                Array.isArray(v.subProfiles) && v.subProfiles.length > 0,
                        },
                    },
                },
            });
        } else if (typeDef === VideoThumbnailsTypeDef || typeDef === VideoFirstThumbnailTypeDef) {
            return typeDef.extend({
                fields: { size: ffmpegSizeConfig },
            });
        }
        return typeDef;
    },
};
