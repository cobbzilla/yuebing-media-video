import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { MediaOperationFunc, MediaOperationType, MediaPluginProfileType } from "yuebing-media";
export declare const VideoDashTypeDefFields: MobilettoOrmFieldDefConfigs;
export declare const VideoDashTypeDef: MobilettoOrmTypeDef;
export declare const VideoDashOperation: MediaOperationType;
export declare const dash: MediaOperationFunc;
export declare const load: (OPERATIONS: Record<string, MediaOperationType>, OP_MAP: Record<string, MediaOperationFunc>, DEFAULT_PROFILES: MediaPluginProfileType[], OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef>) => void;
