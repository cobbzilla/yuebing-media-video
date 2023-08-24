var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
const FFMPEG_BITRATE_REGEX = /^\d+([bkMG]|(\.\d+[kMG]))?$/;
export const VideoTranscodeTypeDefFields = {
    videoCodec: {
        required: true,
        type: "string",
        values: ["libx264", "libx265", "libwebp", "mpeg4", "wmv3"],
    },
    videoSize: {
        required: true,
        type: "string",
    },
    videoBitrate: {
        required: true,
        type: "string",
        regex: FFMPEG_BITRATE_REGEX,
    },
    frameRate: {
        required: true,
        type: "number",
        values: ["23.976", "24", "25", "30", "29.97", "50", "60"],
    },
    audioCodec: {
        required: true,
        type: "string",
        values: ["aac", "mp3", "flac"],
    },
    audioChannels: {
        required: true,
        type: "string",
        values: ["1", "2", "2.1", "5.1", "7.1", "9.1"],
    },
    audioRate: {
        required: true,
        type: "number",
        values: [8000, 22050, 44100, 48000, 96000],
    },
    audioBitrate: {
        required: true,
        type: "string",
        regex: FFMPEG_BITRATE_REGEX,
    },
};
export const VideoTranscodeTypeDef = new MobilettoOrmTypeDef({
    typeName: "VideoProfileTranscode",
    fields: VideoTranscodeTypeDefFields,
});
export const transcode = (infile, profile, outfile) => __awaiter(void 0, void 0, void 0, function* () {
    const config = profile.operationConfig;
    if (!config)
        throw new Error(`transcode: no operationConfig found on profile: ${profile.name}`);
    const args = [];
    args.push("-i");
    args.push(infile);
    args.push("-vcodec");
    /*
    args.push("" + config.videoCodec);
    args.push("-s");
    args.push("" + config.videoSize);
    args.push("-r");
    args.push("" + config.frameRate);
    args.push("-b:v");
    args.push("" + config.videoBitrate);
    args.push("-acodec");
    args.push("" + config.audioCodec);
    args.push("-ac");
    args.push("" + config.audioChannels);
    args.push("-ar");
    args.push("" + config.audioRate);
    args.push("-b:a");
    args.push("" + config.audioBitrate);
    */
    args.push("-y");
    args.push(outfile);
    return { args };
});
