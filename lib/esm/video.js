import { load } from "./op/index.js";
const VIDEO_MEDIA = {
    name: "video",
    ext: ["mp4", "m4v", "avi", "mpg", "mpeg", "mov", "webm", "mkv", "flv", "3gp", "wmv"],
};
const OP_MAP = {};
const OP_CONFIG_TYPES = {};
const OPERATIONS = {};
const DEFAULT_PROFILES = [];
export const mediaPlugin = {
    initialize: () => load(OPERATIONS, OP_MAP, DEFAULT_PROFILES, OP_CONFIG_TYPES),
    media: VIDEO_MEDIA,
    operations: () => OPERATIONS,
    operationFunction: (op) => OP_MAP[op],
    operationConfigType: (op) => OP_CONFIG_TYPES[op],
    defaultProfiles: () => DEFAULT_PROFILES,
};
