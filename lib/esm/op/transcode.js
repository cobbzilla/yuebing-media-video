var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const transcode = (infile, profile, props, outfile) => __awaiter(void 0, void 0, void 0, function* () {
    const config = profile.operationConfig;
    if (!config)
        throw new Error(`transcode: no operationConfig found on profile: ${profile.name}`);
    const args = [];
    args.push("-i");
    args.push(infile);
    args.push("-vcodec");
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
    args.push("-y");
    args.push(outfile);
    return { args };
});
