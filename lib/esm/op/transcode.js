var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const transcode = (infile, profile, outfile) => __awaiter(void 0, void 0, void 0, function* () {
    const args = [];
    args.push("-i");
    args.push(infile);
    args.push("-vcodec");
    args.push(profile.videoCodec);
    args.push("-s");
    args.push(profile.videoSize);
    args.push("-r");
    args.push(profile.frameRate);
    args.push("-b:v");
    args.push(profile.videoBitrate);
    args.push("-acodec");
    args.push(profile.audioCodec);
    args.push("-ac");
    args.push(profile.audioChannels);
    args.push("-ar");
    args.push(profile.audioRate);
    args.push("-b:a");
    args.push(profile.audioBitrate);
    args.push("-y");
    args.push(outfile);
    return args;
});
