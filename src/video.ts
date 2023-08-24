import { MobilettoConnection } from "mobiletto-base";
import { ApplyProfileResponse, MediaPlugin, ParsedProfile } from "yuebing-media";
import { OP_CONFIG_TYPES, OP_MAP, OPERATIONS } from "./operations.js";

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
    operations: OPERATIONS,
    operationConfigType: (operation: string) => OP_CONFIG_TYPES[operation],
};
