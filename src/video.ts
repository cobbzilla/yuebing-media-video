import { DestinationAssetType } from "yuebing-model";
import { MediaDriver, MediaPlugin, ParsedProfile } from "yuebing-media";
import { transcode } from "./op/transcode";

export type VideoOperation = (infile: string, profile: ParsedProfile, outfile: string) => Promise<string[]>;

const OP_MAP: Record<string, VideoOperation> = {
    transcode,
};

export const mediaDriver: MediaPlugin = {
    transform: async (
        asset: DestinationAssetType,
        driver: MediaDriver,
        profile: ParsedProfile,
        outdir: string,
    ): Promise<string[]> => {
        return await OP_MAP[profile.operation](asset.name, profile, `${outdir}/${profile.operation}.${profile.ext}`);
    },
};
