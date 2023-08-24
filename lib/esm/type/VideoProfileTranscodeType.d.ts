import { MobilettoOrmObject } from "mobiletto-orm-typedef";
export type VideoProfileTranscodeType = MobilettoOrmObject & {
    videoCodec: string;
    videoSize: string;
    videoBitrate: string;
    frameRate: number;
    audioCodec: string;
    audioChannels: number;
    audioRate: number;
    audioBitrate: string;
};
