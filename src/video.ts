import { DestinationAssetType, MediaPropertyType } from "yuebing-model";
import { ApplyProfileResponse, MediaOperationFunc, MediaPlugin, ParsedProfile } from "yuebing-media";
import { transcode } from "./op/transcode";

const OP_MAP: Record<string, MediaOperationFunc> = {
    transcode,
};

export const mediaDriver: MediaPlugin = {
    applyProfile: async (
        asset: DestinationAssetType,
        profile: ParsedProfile,
        props: MediaPropertyType[],
        outDir: string,
    ): Promise<ApplyProfileResponse> => {
        return await OP_MAP[profile.operation](asset.name, profile, `${outDir}/${profile.operation}.${profile.ext}`);
    },
};
