import { MediaOperationFunc, MediaOperationType, MediaPluginProfileType } from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
export declare const VideoThumbnailsTypeDefFields: MobilettoOrmFieldDefConfigs;
export declare const VideoThumbnailsTypeDef: MobilettoOrmTypeDef;
export declare const VideoThumbnailsOperation: MediaOperationType;
export declare const thumbnails: MediaOperationFunc;
export declare const load: (OPERATIONS: Record<string, MediaOperationType>, OP_MAP: Record<string, MediaOperationFunc>, DEFAULT_PROFILES: MediaPluginProfileType[], OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef>) => void;
