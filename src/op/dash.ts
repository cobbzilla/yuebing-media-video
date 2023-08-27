import { MobilettoOrmFieldDefConfigs, MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import {
    ApplyProfileResponse,
    MediaOperationFunc,
    MediaOperationType,
    MediaPluginProfileType,
    ParsedProfile,
} from "yuebing-media";
import { VideoProfileDashType } from "../type/VideoProfileDashType.js";
import { VideoProfileTranscodeType } from "../type/VideoProfileTranscodeType";

export const VideoDashTypeDefFields: MobilettoOrmFieldDefConfigs = {
    manifestAssets: {
        required: true,
        type: "string[]",
        control: "multi",
    },
    hlsProfile: {
        required: true,
        type: "string",
    },
};

export const VideoDashTypeDef: MobilettoOrmTypeDef = new MobilettoOrmTypeDef({
    typeName: "VideoProfileDash",
    fields: VideoDashTypeDefFields,
}).extend({
    fields: {
        subProfiles: {
            required: true,
            test: {
                message: "err_video_dash_noSubProfiles",
                valid: (v: Record<string, unknown>) => Array.isArray(v.subProfiles) && v.subProfiles.length > 0,
            },
        },
    },
});

export const VideoDashOperation: MediaOperationType = {
    name: "dash",
    command: "ffmpeg",
    minFileSize: 128,
};

export const dash: MediaOperationFunc = async (
    infile: string,
    profile: ParsedProfile,
    outDir: string,
): Promise<ApplyProfileResponse> => {
    if (!profile.operationConfigObject) throw new Error(`dash: profile.operationConfigObject not defined`);
    const config = profile.operationConfigObject as VideoProfileDashType;

    if (!profile.subProfileObjects || profile.subProfileObjects.length === 0) {
        throw new Error(`dash: no subProfiles specified`);
    }

    const args = [];
    args.push("-i");
    args.push(infile);

    for (let i = 0; i < profile.subProfileObjects.length; i++) {
        const subProfile = profile.subProfileObjects[i];
        if (!subProfile.operationConfigObject) {
            throw new Error(`dash: no subProfile.operationConfigObject for subProfile=${subProfile.name}`);
        }
        const subConfig: VideoProfileTranscodeType = subProfile.operationConfigObject as VideoProfileTranscodeType;

        // map audio tracks
        args.push("-map");
        args.push("0:a");
        args.push(`-c:a:${i}`);
        args.push("" + subConfig.audioCodec);
        args.push(`-b:a:${i}`);
        args.push("" + subConfig.audioBitrate);
        args.push(`-ar:${i}`);
        args.push("" + subConfig.audioRate);
        args.push(`-ac:${i}`);
        args.push("" + subConfig.audioChannels);

        // skip subtitle tracks, they're handled separately
        // The "negative mapping" is described here: https://trac.ffmpeg.org/wiki/Map
        args.push("-map");
        args.push("-0:s?");

        // map video tracks
        args.push("-map");
        args.push("0:v");
        args.push(`-c:v:${i}`);
        args.push("" + subConfig.videoCodec);
        args.push(`-b:v:${i}`);
        args.push("" + subConfig.videoBitrate);
        args.push(`-s:v:${i}`);
        args.push(subConfig.videoSize);
        args.push(`-profile:v:${i}`);
        args.push("main");
    }

    // we enable the template below, so I'm not sure if window_size is relevant
    // but given that the playlist will be statically hosted and never dynamically
    // generated we set this to a very large value, such that the playlist should
    // always contain all segments
    args.push("-window_size");
    args.push("1000000");

    // are these needed? they are the defaults
    args.push("-use_timeline");
    args.push("1");
    args.push("-use_template");
    args.push("1");

    // todo: see what these do: b-frames, minimum keyframe interval and GOP (group of picture) size
    // args.push('-bf')
    // args.push('1')
    // args.push('-keyint_min')
    // args.push('120')
    // args.push('-g')
    // args.push('120')
    // args.push('-sc_threshold')
    // args.push('0') // default is already zero?
    // args.push('-b_strategy')
    // args.push('0') // default is already zero?

    // todo: add a subtitles set if we detect that the media has subtitles
    args.push("-adaptation_sets");
    args.push("id=0,streams=v id=1,streams=a");

    // ensure output assets are named appropriately so that handleOutputFiles picks them up
    args.push("-init_seg_name");
    args.push(`${profile.name}~init-stream$RepresentationID$.$ext$`);
    args.push("-media_seg_name");
    args.push(`${profile.name}~chunk-stream$RepresentationID$-$Number%05d$.$ext$`);

    // generate HLS playlist too
    if (config.hlsProfile) {
        args.push("-hls_playlist");
        args.push("true");
        args.push("-hls_master_name");
        args.push(`${config.hlsProfile}~master.m3u8`);
    }

    // use DASH format
    args.push("-f");
    args.push("dash");

    // overwrite output file
    args.push("-y");
    args.push(`${outDir}/${profile.name}.${profile.ext}`);
    return { args };
};

export const load = (
    OPERATIONS: Record<string, MediaOperationType>,
    OP_MAP: Record<string, MediaOperationFunc>,
    DEFAULT_PROFILES: MediaPluginProfileType[],
    OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef>,
) => {
    OP_CONFIG_TYPES.dash = VideoDashTypeDef;
    OPERATIONS.dash = VideoDashOperation;
    OP_MAP.dash = dash;
    DEFAULT_PROFILES.push({
        name: "dash_mp4",
        operation: "dash",
        subProfiles: ["transcode_high_mp4", "transcode_mid_mp4", "transcode_low_mp4", "transcode_min_mp4"],
        ext: "mpd",
        contentType: "application/dash+xml",
        primary: true,
        additionalAssets: [
            "^dash_mp4~init-stream\\d+.m4s$",
            "^dash_mp4~chunk-stream\\d+-\\d+.m4s$",
            "^media_d+.m3u8$",
            "^hls_m3u8~master.m3u8$",
        ],
        operationConfig: JSON.stringify({
            manifestAssets: ["dash_mp4.mpd"],
            hlsProfile: "hls_m3u8",
        }),
    });
};
