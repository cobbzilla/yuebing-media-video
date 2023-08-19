var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { transcode } from "./op/transcode";
const OP_MAP = {
    transcode,
};
export const mediaDriver = {
    applyProfile: (asset, profile, props, outDir) => __awaiter(void 0, void 0, void 0, function* () {
        return yield OP_MAP[profile.operation](asset.name, profile, `${outDir}/${profile.operation}.${profile.ext}`);
    }),
};
