import { fileURLToPath } from "url";
import path from "path";
import { MobilettoOrmTypeDef } from "mobiletto-orm-typedef";
import { generateTypeScriptType } from "mobiletto-orm-typedef-gen";
import { capitalize } from "yuebing-util";
import { VideoTranscodeTypeDef } from "../op/transcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TS_TYPE_DIR = `${__dirname}/../../../src/type`;

const genTsType = (typeDef: MobilettoOrmTypeDef, tsTypeDir?: string) =>
    generateTypeScriptType(typeDef, {
        outfile: `${tsTypeDir ? tsTypeDir : TS_TYPE_DIR}/${capitalize(typeDef.typeName)}Type.ts`,
    });

genTsType(VideoTranscodeTypeDef);
