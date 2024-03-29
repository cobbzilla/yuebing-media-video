import { fileURLToPath } from "url";
import path from "path";
import { capitalize } from "zilla-util";
import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { generateTypeScriptType } from "mobiletto-orm-typedef-gen";
import { VideoTranscodeTypeDef } from "../op/transcode.js";
import { VideoDashTypeDef } from "../op/dash.js";
import { VideoThumbnailsTypeDef } from "../op/thumbnails.js";
import { VideoFirstThumbnailTypeDef } from "../op/firstThumbnail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TS_TYPE_DIR = `${__dirname}/../../../src/type`;

const genTsType = (typeDef: MobilettoOrmTypeDef, tsTypeDir?: string) =>
    generateTypeScriptType(typeDef, {
        outfile: `${tsTypeDir ? tsTypeDir : TS_TYPE_DIR}/${capitalize(typeDef.typeName)}Type.ts`,
    });

const OP_TYPES = [VideoTranscodeTypeDef, VideoDashTypeDef, VideoThumbnailsTypeDef, VideoFirstThumbnailTypeDef];

OP_TYPES.forEach((t) => genTsType(t));
