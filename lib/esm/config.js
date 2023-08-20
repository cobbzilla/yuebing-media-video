import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
export const TranscodeTypeDefFields = {
    manifestAssets: { type: "string[]" },
    videoCodec: { type: "string" },
    videoSize: { type: "string" },
    videoBitrate: { type: "string" },
    frameRate: { type: "number" },
    audioCodec: { type: "string" },
    audioChannels: { type: "number" },
    audioRate: { type: "number" },
    audioBitrate: { type: "string" },
};
export const TranscodeTypeDef = new MobilettoOrmTypeDef({
    typeName: "transcode",
    fields: TranscodeTypeDefFields,
});
