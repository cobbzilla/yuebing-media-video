var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OP_CONFIG_TYPES, OP_MAP, OPERATIONS } from "./operations.js";
export const mediaDriver = {
    applyProfile: (downloaded, profile, outDir, sourcePath, conn) => __awaiter(void 0, void 0, void 0, function* () {
        if (profile.noop)
            throw new Error(`applyProfile: cannot apply noop profile: ${profile.name}`);
        if (!profile.enabled)
            throw new Error(`applyProfile: profile not enabled: ${profile.name}`);
        if (!profile.operation)
            throw new Error(`applyProfile: no operation defined for profile: ${profile.name}`);
        return yield OP_MAP[profile.operation](downloaded, profile, `${outDir}/${profile.operation}.${profile.ext}`, sourcePath, conn);
    }),
    operations: OPERATIONS,
    operationConfigType: (operation) => OP_CONFIG_TYPES[operation],
};
