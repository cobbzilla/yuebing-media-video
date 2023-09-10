export declare const FFMPEG_COMMAND = "ffmpeg";
export declare const MOCK_FFMPEG_COMMAND = "ffmpeg-mock.sh";
export declare const ffmpegCommand: () => string;
export declare const textTrackTypes: string[];
export declare const textTrackRegex: RegExp;
export declare const FFMPEG_BITRATE_REGEX: RegExp;
export declare const ffmpegBitrate: (rate: string) => number | undefined;
export declare const widthByHeightRegex: RegExp;
export declare const ffmpegWidth: (size: string) => number | undefined;
export declare const ffmpegHeight: (size: string) => number | undefined;
export declare const ffmpegSizes: Record<string, string>;
export declare const ffmpegSizeConfig: {
    items: {
        value: string;
        label: string;
        rawLabel: boolean;
    }[];
    values: string[];
    labels: string[];
};
