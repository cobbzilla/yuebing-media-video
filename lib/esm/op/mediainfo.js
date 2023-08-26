import { mediaPlugin as infoPlugin } from "yuebing-media-info";
export const OP_MEDIAINFO = "mediainfo";
export const load = (OPERATIONS, OP_MAP, DEFAULT_PROFILES) => {
    if (infoPlugin.initialize)
        infoPlugin.initialize();
    OPERATIONS.mediainfo = infoPlugin.operations().mediainfo;
    OP_MAP.mediainfo = infoPlugin.operationFunction(OP_MEDIAINFO);
    DEFAULT_PROFILES.push(...infoPlugin.defaultProfiles().map((p) => {
        const copy = structuredClone(p);
        copy.priority = -1;
        return copy;
    }));
};
