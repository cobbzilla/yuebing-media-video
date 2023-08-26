import { MobilettoConnection } from "mobiletto-base";
import { ProfileJobType } from "yuebing-model";
import { ApplyProfileResponse, MediaPlugin, ParsedProfile } from "yuebing-media";
import { DEFAULT_PROFILES, OP_CONFIG_TYPES, OP_MAP, OPERATIONS } from "./common.js";

export const mediaDriver: MediaPlugin = {
    applyProfile: async (
        downloaded: string,
        profile: ParsedProfile,
        outDir: string,
        sourcePath: string,
        conn?: MobilettoConnection,
        analysisResults?: ProfileJobType[],
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
            analysisResults,
        );
    },
    operations: OPERATIONS,
    operationConfigType: (operation: string) => OP_CONFIG_TYPES[operation],
    defaultProfiles: DEFAULT_PROFILES,
};
