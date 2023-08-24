import { ApplyProfileResponse, MediaOperationFunc, ParsedProfile } from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { VideoProfileThumbnailsType } from "../type/VideoProfileThumbnailsType.js";

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
});

export const thumbnails: MediaOperationFunc = async (
    infile: string,
    profile: ParsedProfile,
    outfile: string,
): Promise<ApplyProfileResponse> => {
    if (!profile.operationConfig) throw new Error(`transcode: profile.operationConfig not defined`);

    const config = JSON.parse(profile.operationConfig) as VideoProfileThumbnailsType;
    if (!config) throw new Error(`thumbnails: no operationConfig found on profile: ${profile.name}`);

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
