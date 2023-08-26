import { load as loadMediaInfo } from "./mediainfo.js";
import { load as loadTranscode } from "./transcode.js";
import { load as loadDash } from "./dash.js";
import { load as loadThumbnails } from "./thumbnails.js";
import { load as loadFirstThumbnail } from "./firstThumbnail.js";
import { load as loadCopyTextTracks } from "./copyTextTracks.js";
import { load as loadExtractTextTracks } from "./extractTextTracks.js";
import { load as loadSrt2vvtTracks } from "./srt2vttTracks.js";
let loaded = false;
const loaders = [
    loadMediaInfo,
    loadTranscode,
    loadDash,
    loadThumbnails,
    loadFirstThumbnail,
    loadCopyTextTracks,
    loadExtractTextTracks,
    loadSrt2vvtTracks,
];
export const load = (OPERATIONS, OP_MAP, DEFAULT_PROFILES, OP_CONFIG_TYPES) => {
    if (loaded)
        return;
    loaded = true;
    for (const loader of loaders) {
        loader(OPERATIONS, OP_MAP, DEFAULT_PROFILES, OP_CONFIG_TYPES);
    }
};
