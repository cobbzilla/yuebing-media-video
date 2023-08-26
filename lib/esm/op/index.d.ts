import { MediaOperationFunc, MediaOperationType } from "yuebing-media";
import { MediaProfileType } from "yuebing-model";
import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
export declare const load: (OPERATIONS: Record<string, MediaOperationType>, OP_MAP: Record<string, MediaOperationFunc>, DEFAULT_PROFILES: MediaProfileType[], OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef>) => void;
