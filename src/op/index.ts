import { load as loadMediaInfo } from "./mediainfo.js";
import { load as loadTranscode } from "./transcode.js";
import { load as loadDash } from "./dash.js";
import { load as loadThumbnails } from "./thumbnails.js";
import { load as loadFirstThumbnail } from "./firstThumbnail.js";
import { load as loadCopyTextTracks } from "./copyTextTracks.js";
import { load as loadExtractTextTracks } from "./extractTextTracks.js";
import { load as loadSrt2vvtTracks } from "./srt2vttTracks.js";
import { MediaOperationFunc, MediaOperationType } from "yuebing-media";
import { MediaProfileType } from "yuebing-model";
import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";

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

export const load = (
    OPERATIONS: Record<string, MediaOperationType>,
    OP_MAP: Record<string, MediaOperationFunc>,
    DEFAULT_PROFILES: MediaProfileType[],
    OP_CONFIG_TYPES: Record<string, MobilettoOrmTypeDef>,
) => {
    if (loaded) return;
    loaded = true;
    for (const loader of loaders) {
        loader(OPERATIONS, OP_MAP, DEFAULT_PROFILES, OP_CONFIG_TYPES);
    }
};
