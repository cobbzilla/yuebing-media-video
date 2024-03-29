import { fileURLToPath } from "url";
import path from "path";
export const FFMPEG_COMMAND = "ffmpeg";
export const MOCK_FFMPEG_COMMAND = "ffmpeg-mock.sh";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPT_DIR = `${__dirname}/../../scripts`;
export const ffmpegCommand = () => {
    if (process.env.MOCK_FFMPEG ||
        process.env.MOCHA_COLORS ||
        (process.env.NODE_OPTIONS && process.env.NODE_OPTIONS.includes("debugConnector.js"))) {
        return SCRIPT_DIR + "/" + MOCK_FFMPEG_COMMAND;
    }
    return FFMPEG_COMMAND;
};
// assets with these content-types will be treated as text-tracks
// by the web video player
export const textTrackTypes = ["text/vtt", "application/x-subrip"];
// Text track output filenames must match this regex for the web player to recognize them.
// The regex (matching groups), from left to right, are:
// 1. (\\w+)     : the video profile name (for example vttTracks_extract)
// 2. (\\w+)     : the index/differentiating hash to avoid collisions when a single profile
//                 produces multiple outputs with the same language
// 3. (\\w{2,3}) : the 2 (or 3) letter ISO language code
// 4. (\.sdh)?   : optional, if present, it means the track includes captions for non-verbal audio
// 5. (vtt|srt)  : vtt and srt are the only file extensions supported by yuebing; the web player only
//                 supports vtt
export const textTrackRegex = new RegExp(`^(\\w+)~(\\w+).(\\w{2,3})(.sdh)?.(vtt|srt)$`);
export const FFMPEG_BITRATE_REGEX = /^[1-9]\d*([bkMG]|(\.\d+[kMG]))?$/;
export const ffmpegBitrate = (rate) => {
    if (FFMPEG_BITRATE_REGEX.test(rate)) {
        const suffix = rate.substring(rate.length - 1);
        switch (suffix) {
            case "G":
                return 1000000000 * +rate.substring(0, rate.length - 1);
            case "M":
                return 1000000 * +rate.substring(0, rate.length - 1);
            case "k":
                return 1000 * +rate.substring(0, rate.length - 1);
            case "b":
                return +rate.substring(0, rate.length - 1);
            default:
                return +rate; // raw bitrate, without suffix
        }
    }
    return undefined;
};
export const widthByHeightRegex = /^[1-9]\d+x[1-9]\d+$/;
export const ffmpegWidth = (size) => {
    if (ffmpegSizes[size]) {
        size = ffmpegSizes[size];
    }
    if (widthByHeightRegex.test(size)) {
        return +size.substring(0, size.indexOf("x"));
    }
    return undefined;
};
export const ffmpegHeight = (size) => {
    if (ffmpegSizes[size]) {
        size = ffmpegSizes[size];
    }
    if (widthByHeightRegex.test(size)) {
        return +size.substring(size.indexOf("x") + 1);
    }
    return undefined;
};
export const ffmpegSizes = {
    ntsc: "720x480",
    pal: "720x576",
    qntsc: "352x240",
    qpal: "352x288",
    sntsc: "640x480",
    spal: "768x576",
    film: "352x240",
    "ntsc-film": "352x240",
    sqcif: "128x96",
    qcif: "176x144",
    cif: "352x288",
    "4cif": "704x576",
    "16cif": "1408x1152",
    qqvga: "160x120",
    qvga: "320x240",
    vga: "640x480",
    svga: "800x600",
    xga: "1024x768",
    uxga: "1600x1200",
    qxga: "2048x1536",
    sxga: "1280x1024",
    qsxga: "2560x2048",
    hsxga: "5120x4096",
    wvga: "852x480",
    wxga: "1366x768",
    wsxga: "1600x1024",
    wuxga: "1920x1200",
    woxga: "2560x1600",
    wqsxga: "3200x2048",
    wquxga: "3840x2400",
    whsxga: "6400x4096",
    whuxga: "7680x4800",
    cga: "320x200",
    ega: "640x350",
    hd480: "852x480",
    hd720: "1280x720",
    hd1080: "1920x1080",
    "2k": "2048x1080",
    "2kflat": "1998x1080",
    "2kscope": "2048x858",
    "4k": "4096x2160",
    "4kflat": "3996x2160",
    "4kscope": "4096x1716",
    nhd: "640x360",
    hqvga: "240x160",
    wqvga: "400x240",
    fwqvga: "432x240",
    hvga: "480x320",
    qhd: "960x540",
    "2kdci": "2048x1080",
    "4kdci": "4096x2160",
    uhd2160: "3840x2160",
    uhd4320: "7680x4320",
};
const ffmpegItems = [];
for (const sym of Object.keys(ffmpegSizes)) {
    ffmpegItems.push({ value: sym, label: `${sym} (${ffmpegSizes[sym]})`, rawLabel: true });
}
export const ffmpegSizeConfig = {
    items: ffmpegItems,
    values: ffmpegItems.map((i) => i.value),
    labels: ffmpegItems.map((i) => i.label),
};
//# sourceMappingURL=properties.js.map