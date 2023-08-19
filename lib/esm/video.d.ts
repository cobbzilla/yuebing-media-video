import { MediaPlugin, ParsedProfile } from "yuebing-media";
export type VideoOperation = (infile: string, profile: ParsedProfile, outfile: string) => Promise<string[]>;
export declare const mediaDriver: MediaPlugin;
