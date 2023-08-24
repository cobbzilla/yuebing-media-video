import { ApplyProfileResponse, MediaOperationFunc, ParsedProfile } from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";

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
    const args = [];
    args.push("-i");
    args.push(infile);
    args.push("-s");
    args.push(profile.size);
    args.push("-vf");
    args.push("fps=" + profile.fps);
    args.push("-y");
    args.push(outfile);
    return { args };
};
