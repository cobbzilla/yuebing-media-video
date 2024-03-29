import { MediaOperationFunc, MediaOperationType, MediaPluginProfileType } from "yuebing-media";
export declare const VideoExtractTextTracksOperation: MediaOperationType;
export declare const extractTextTracks: MediaOperationFunc;
export declare const load: (OPERATIONS: Record<string, MediaOperationType>, OP_MAP: Record<string, MediaOperationFunc>, DEFAULT_PROFILES: MediaPluginProfileType[]) => void;
