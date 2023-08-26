import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { MediaOperationFunc, MediaOperationType } from "yuebing-media";
import { MediaProfileType } from "yuebing-model";
import { DEFAULT_PROFILES as infoProfiles } from "yuebing-media-info";

export const OP_MAP: Record<string, MediaOperationFunc> = {};

export const OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef> = {};

export const OPERATIONS: Record<string, MediaOperationType> = {};

export const DEFAULT_PROFILES: MediaProfileType[] = [
    ...infoProfiles.map((p) => {
        const copy = structuredClone(p);
        copy.media = "video";
        return copy;
    }),
];
