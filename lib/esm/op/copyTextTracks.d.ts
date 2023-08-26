import { MediaOperationFunc, MediaOperationType, MediaPluginProfileType } from "yuebing-media";
export declare const VideoCopyTextTracksOperation: MediaOperationType;
export declare const copyTextTracks: MediaOperationFunc;
export declare const load: (OPERATIONS: Record<string, MediaOperationType>, OP_MAP: Record<string, MediaOperationFunc>, DEFAULT_PROFILES: MediaPluginProfileType[]) => void;
