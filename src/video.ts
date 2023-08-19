import { MediaPropertyType } from "yuebing-model";
import { ApplyProfileResponse, MediaOperationFunc, MediaPlugin, ParsedProfile } from "yuebing-media";
import { transcode } from "./op/transcode";

const OP_MAP: Record<string, MediaOperationFunc> = {
    transcode,
};

export const mediaDriver: MediaPlugin = {
    applyProfile: async (
        downloaded: string,
        profile: ParsedProfile,
        props: MediaPropertyType[],
        outDir: string,
    ): Promise<ApplyProfileResponse> => {
        return await OP_MAP[profile.operation](downloaded, profile, `${outDir}/${profile.operation}.${profile.ext}`);
    },
};
