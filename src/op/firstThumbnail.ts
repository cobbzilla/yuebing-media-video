import { ApplyProfileResponse, MediaOperationFunc, ParsedProfile } from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";

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
    fps: {
        required: true,
        type: "string",
        regex: /^[\d+]\/[\d+]$/,
    },
};

export const VideoFirstThumbnailTypeDef: MobilettoOrmTypeDef = new MobilettoOrmTypeDef({
    typeName: "VideoProfileFirstThumbnail",
    fields: VideoFirstThumbnailTypeDefFields,
});

const DEFAULT_FIRST_THUMBNAIL_OFFSET = 3;

export const firstThumbnail: MediaOperationFunc = async (
    infile: string,
    profile: ParsedProfile,
    outfile: string,
): Promise<ApplyProfileResponse> => {
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
};
