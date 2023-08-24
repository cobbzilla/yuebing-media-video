import { MobilettoOrmObject } from "mobiletto-orm-typedef";
export type VideoProfileDashType = MobilettoOrmObject & {
    manifestAssets: string[];
    hlsProfile: string;
};
