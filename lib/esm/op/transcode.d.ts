import { MediaOperationFunc, MediaOperationType, MediaPluginProfileType } from "yuebing-media";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
export declare const VideoTranscodeTypeDefFields: MobilettoOrmFieldDefConfigs;
export declare const VideoTranscodeTypeDef: MobilettoOrmTypeDef;
export declare const VideoTranscodeOperation: MediaOperationType;
export declare const transcode: MediaOperationFunc;
export declare const load: (OPERATIONS: Record<string, MediaOperationType>, OP_MAP: Record<string, MediaOperationFunc>, DEFAULT_PROFILES: MediaPluginProfileType[], OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef>) => void;
