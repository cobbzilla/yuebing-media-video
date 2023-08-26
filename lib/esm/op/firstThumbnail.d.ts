import { MediaOperationFunc, MediaOperationType, MediaPluginProfileType } from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
export declare const VideoFirstThumbnailTypeDefFields: MobilettoOrmFieldDefConfigs;
export declare const VideoFirstThumbnailTypeDef: MobilettoOrmTypeDef;
export declare const VideoFirstThumbnailOperation: MediaOperationType;
export declare const firstThumbnail: MediaOperationFunc;
export declare const load: (OPERATIONS: Record<string, MediaOperationType>, OP_MAP: Record<string, MediaOperationFunc>, DEFAULT_PROFILES: MediaPluginProfileType[], OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef>) => void;
