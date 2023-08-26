import { MediaProfileType, MediaType } from "yuebing-model";
import { MediaOperationFunc, MediaOperationType, MediaPlugin } from "yuebing-media";
import { load } from "./op/index.js";
import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";

const VIDEO_MEDIA: MediaType = {
    name: "video",
    ext: ["mp4", "m4v", "avi", "mpg", "mpeg", "mov", "webm", "mkv", "flv", "3gp", "wmv"],
};

const OP_MAP: Record<string, MediaOperationFunc> = {};
const OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef> = {};
const OPERATIONS: Record<string, MediaOperationType> = {};
const DEFAULT_PROFILES: MediaProfileType[] = [];

export const mediaPlugin: MediaPlugin = {
    initialize: () => load(OPERATIONS, OP_MAP, DEFAULT_PROFILES, OP_CONFIG_TYPES),
    media: VIDEO_MEDIA,
    operations: () => OPERATIONS,
    operationFunction: (op: string) => OP_MAP[op],
    operationConfigType: (op: string) => OP_CONFIG_TYPES[op],
    defaultProfiles: () => DEFAULT_PROFILES,
};
