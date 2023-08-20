import { ApplyProfileResponse, MediaOperationFunc, MediaProperties, ParsedProfile } from "yuebing-media";

export const transcode: MediaOperationFunc = async (
    infile: string,
    profile: ParsedProfile,
    props: MediaProperties,
    outfile: string,
): Promise<ApplyProfileResponse> => {
    const config = profile.operationConfig;
    if (!config) throw new Error(`transcode: no operationConfig found on profile: ${profile.name}`);
    const args: string[] = [];
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
};
