import { ParsedProfile } from "yuebing-media";

export const transcode = async (infile: string, profile: ParsedProfile, outfile: string) => {
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
};
