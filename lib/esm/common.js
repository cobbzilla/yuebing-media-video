import { DEFAULT_PROFILES as infoProfiles } from "yuebing-media-info";
export const OP_MAP = {};
export const OP_CONFIG_TYPES = {};
export const OPERATIONS = {};
export const DEFAULT_PROFILES = [
    ...infoProfiles.map((p) => {
        const copy = structuredClone(p);
        copy.media = "video";
        return copy;
    }),
];
