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
export const VideoDashTypeDefFields = {
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
export const VideoDashTypeDef = new MobilettoOrmTypeDef({
    typeName: "VideoProfileDash",
    fields: VideoDashTypeDefFields,
});
export const dash = (infile, profile, outfile) => __awaiter(void 0, void 0, void 0, function* () {
    if (!profile.operationConfig)
        throw new Error(`transcode: profile.operationConfig not defined`);
    // const config = JSON.parse(profile.operationConfig) as VideoProfileTranscodeType;
    // if (!config) throw new Error(`transcode: no operationConfig found on profile: ${profile.name}`);
    if (!profile.subProfileObjects || profile.subProfileObjects.length === 0) {
        throw new Error(`dash: no subProfiles specified`);
    }
    const args = [];
    args.push("-i");
    args.push(infile);
    for (let i = 0; i < profile.subProfileObjects.length; i++) {
        const subProfile = profile.subProfileObjects[i];
        // map audio tracks
        args.push("-map");
        args.push("0:a");
        args.push(`-c:a:${i}`);
        args.push(subProfile.audioCodec);
        args.push(`-b:a:${i}`);
        args.push(subProfile.audioBitrate);
        args.push(`-ar:${i}`);
        args.push(subProfile.audioRate);
        args.push(`-ac:${i}`);
        args.push(subProfile.audioChannels);
        // skip subtitle tracks, they're handled separately
        // The "negative mapping" is described here: https://trac.ffmpeg.org/wiki/Map
        args.push("-map");
        args.push("-0:s?");
        // map video tracks
        args.push("-map");
        args.push("0:v");
        args.push(`-c:v:${i}`);
        args.push(subProfile.videoCodec);
        args.push(`-b:v:${i}`);
        args.push(subProfile.videoBitrate);
        args.push(`-s:v:${i}`);
        args.push(subProfile.videoSize);
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
    args.push(`${profile.name}_init-stream$RepresentationID$.$ext$`);
    args.push("-media_seg_name");
    args.push(`${profile.name}_chunk-stream$RepresentationID$-$Number%05d$.$ext$`);
    // generate HLS playlist too
    if (profile.hlsProfile) {
        args.push("-hls_playlist");
        args.push("true");
        args.push("-hls_master_name");
        args.push(`${profile.hlsProfile}_master.m3u8`);
    }
    // use DASH format
    args.push("-f");
    args.push("dash");
    // overwrite output file
    args.push("-y");
    args.push(outfile);
    return { args };
});
