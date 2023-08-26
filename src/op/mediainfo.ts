import { mediaPlugin as infoPlugin } from "yuebing-media-info";
import { MediaOperationFunc, MediaOperationType, MediaPluginProfileType } from "yuebing-media";

export const OP_MEDIAINFO = "mediainfo";

export const load = (
    OPERATIONS: Record<string, MediaOperationType>,
    OP_MAP: Record<string, MediaOperationFunc>,
    DEFAULT_PROFILES: MediaPluginProfileType[],
) => {
    if (infoPlugin.initialize) infoPlugin.initialize();
    OPERATIONS.mediainfo = infoPlugin.operations().mediainfo;
    OP_MAP.mediainfo = infoPlugin.operationFunction(OP_MEDIAINFO);
    DEFAULT_PROFILES.push(
        ...infoPlugin.defaultProfiles().map((p) => {
            const copy = structuredClone(p);
            copy.priority = -1;
            return copy;
        }),
    );
};
