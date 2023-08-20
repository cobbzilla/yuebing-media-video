import { ApplyProfileResponse, MediaOperationFunc, MediaPlugin, MediaProperties, ParsedProfile } from "yuebing-media";
import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { MediaOperationType } from "yuebing-model";
import { TranscodeTypeDef } from "./config.js";
import { transcode } from "./op/transcode.js";

const OP_MAP: Record<string, MediaOperationFunc> = {
    transcode,
};

const OP_CONFIG: Record<string, MobilettoOrmTypeDef> = {
    transcode: TranscodeTypeDef,
};

export const mediaDriver: MediaPlugin = {
    applyProfile: async (
        downloaded: string,
        profile: ParsedProfile,
        props: MediaProperties,
        outDir: string,
    ): Promise<ApplyProfileResponse> => {
        if (profile.noop) throw new Error(`applyProfile: cannot apply noop profile: ${profile.name}`);
        if (!profile.enabled) throw new Error(`applyProfile: profile not enabled: ${profile.name}`);
        if (!profile.operation) throw new Error(`applyProfile: no operation defined for profile: ${profile.name}`);
        return await OP_MAP[profile.operation](
            downloaded,
            profile,
            props,
            `${outDir}/${profile.operation}.${profile.ext}`,
        );
    },
    operationConfigType: (operation: MediaOperationType) => OP_CONFIG[operation.name],
};
