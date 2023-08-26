import { MediaOperationFunc, MediaOperationType, MediaPluginProfileType } from "yuebing-media";
export declare const VideoSrt2VttTracksOperation: MediaOperationType;
export declare const srt2vttTextTracks: MediaOperationFunc;
export declare const load: (OPERATIONS: Record<string, MediaOperationType>, OP_MAP: Record<string, MediaOperationFunc>, DEFAULT_PROFILES: MediaPluginProfileType[]) => void;
