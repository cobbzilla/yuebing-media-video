import { ApplyProfileResponse, MediaOperationFunc, ParsedProfile } from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { VideoProfileFirstThumbnailType } from "../type/VideoProfileFirstThumbnailType.js";

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
});

const DEFAULT_FIRST_THUMBNAIL_OFFSET = 3;

export const firstThumbnail: MediaOperationFunc = async (
    infile: string,
    profile: ParsedProfile,
    outfile: string,
): Promise<ApplyProfileResponse> => {
    if (!profile.operationConfig) throw new Error(`transcode: profile.operationConfig not defined`);

    const config = JSON.parse(profile.operationConfig) as VideoProfileFirstThumbnailType;
    if (!config) throw new Error(`thumbnails: no operationConfig found on profile: ${profile.name}`);

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
    args.push(outfile);
    return { args };
};
