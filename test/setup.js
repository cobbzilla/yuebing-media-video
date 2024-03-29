import * as fs from "fs";
import * as os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { sleep } from "zilla-util";
import { rand, repositoryFactory } from "mobiletto-orm";
import { logger, mobiletto, registerDriver, shutdownMobiletto } from "mobiletto-base";
import { storageClient as localDriver } from "mobiletto-driver-local";

import {
    DestinationTypeDef,
    LibraryScanTypeDef,
    LibraryTypeDef,
    LocalConfigTypeDef,
    MediaTypeDef,
    MediaProfileTypeDef,
    ProfileJobTypeDef,
    SourceAssetTypeDef,
    SourceScanTypeDef,
    SourceTypeDef,
    UploadJobTypeDef,
} from "yuebing-model";
import { resolveConnectionConfig } from "yuebing-server-util";
import { ASSET_SEP, registerMediaPlugin } from "yuebing-media";
import { YbScanner } from "yuebing-scan";
import { mediaPlugin as videoPlugin } from "../lib/esm/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ensureUniqueDir = (dir) => {
    dir += `_${rand(6)}`;
    const stat = fs.statSync(dir, { throwIfNoEntry: false });
    if (!stat) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
};

let storageDriverRegistered = false;
let mediaPluginRegistered = false;

export const ASSET_BASE_NAME = "moon.mp4";

export const newTest = async (adjustTest) => {
    if (!storageDriverRegistered) {
        registerDriver("local", localDriver);
        storageDriverRegistered = true;
    }
    logger.setLogLevel("info");

    const test = {
        factory: null,
        tempDir: null,
        sourceRepo: null,
        destinationRepo: null,
        libraryRepo: null,
        mediaRepo: null,
        mediaProfileRepo: null,
        localConfigRepo: null,
        libraryScanRepo: null,
        sourceScanRepo: null,
        sourceAssetRepo: null,
        profileJobRepo: null,
        uploadJobRepo: null,
        source: null,
        destination: null,
        media: null,
        library: null,
        connectionConfig: null,
        downloadDir: null,
        assetDir: null,
        localConfig: null,
        scanner: null,
    };
    const srcDir = __dirname + "/source";
    test.tempDir = `${os.tmpdir()}/ybMediaVideoTest_${rand(8)}`;
    const tmp = await mobiletto("local", test.tempDir, null, {
        createIfNotExist: true,
    });
    tmp.name = "tmp";

    test.testDir = __dirname;
    test.factory = repositoryFactory([tmp]);
    test.sourceRepo = test.factory.repository(SourceTypeDef);
    test.destinationRepo = test.factory.repository(DestinationTypeDef);
    test.mediaRepo = test.factory.repository(MediaTypeDef);
    test.mediaProfileRepo = test.factory.repository(MediaProfileTypeDef);
    test.libraryRepo = test.factory.repository(LibraryTypeDef);
    test.localConfigRepo = test.factory.repository(LocalConfigTypeDef);
    test.libraryScanRepo = test.factory.repository(LibraryScanTypeDef);
    test.sourceScanRepo = test.factory.repository(SourceScanTypeDef);
    test.sourceAssetRepo = test.factory.repository(SourceAssetTypeDef);
    test.profileJobRepo = test.factory.repository(ProfileJobTypeDef);
    test.uploadJobRepo = test.factory.repository(UploadJobTypeDef);
    test.downloadDir = ensureUniqueDir("/tmp/yb_test/download");
    test.assetDir = ensureUniqueDir("/tmp/yb_test/asset");
    test.source = {
        name: "tempSource",
        type: "local",
        local: { key: srcDir },
    };
    test.source = await test.sourceRepo.create(test.source);

    test.destination = {
        name: "tempDestination",
        type: "local",
        scope: "local",
        local: { key: test.tempDir },
    };
    test.destination = await test.destinationRepo.create(test.destination);

    if (!mediaPluginRegistered) {
        test.profiles = await registerMediaPlugin(videoPlugin, test.mediaRepo, test.mediaProfileRepo);
    }

    test.library = {
        name: "tempLibrary",
        sources: ["tempSource"],
        destinations: ["tempDestination"],
        media: "video",
        autoscanEnabled: true,
        autoscan: { interval: 10000 },
    };
    test.library = await test.libraryRepo.create(test.library);

    test.connectionConfig = resolveConnectionConfig(test.source);
    const connectSource = () =>
        mobiletto(
            test.source.type,
            test.connectionConfig.key,
            test.connectionConfig.secret,
            test.connectionConfig.opts,
            test.source.encryption,
        );

    test.localConfig = {
        systemName: "testSystem",
        autoscanEnabled: true,
        autoscan: { initialDelay: 10000 },
    };
    test.localConfig = await test.localConfigRepo.create(test.localConfig);

    test.scanConfig = {
        systemName: test.localConfig.systemName,
        localConfigRepo: () => test.localConfigRepo,
        logger,
        mediaRepo: () => test.mediaRepo,
        mediaProfileRepo: () => test.mediaProfileRepo,
        sourceRepo: () => test.sourceRepo,
        destinationRepo: () => test.destinationRepo,
        libraryRepo: () => test.libraryRepo,
        libraryScanRepo: () => test.libraryScanRepo,
        sourceScanRepo: () => test.sourceScanRepo,
        sourceAssetRepo: () => test.sourceAssetRepo,
        profileJobRepo: () => test.profileJobRepo,
        uploadJobRepo: () => test.uploadJobRepo,
        connectSource,
        downloadDir: test.downloadDir,
        assetDir: test.assetDir,
        runAnalyzer: true,
        runTransformer: true,
        runUploader: true,
        removeLocalFiles: false,
        scanPollInterval: 1000,
        analyzerPollInterval: 1000,
        transformerPollInterval: 1000,
        uploaderPollInterval: 1000,
    };
    test.assetName = test.source.name + ASSET_SEP + ASSET_BASE_NAME;

    if (adjustTest) await adjustTest(test);

    test.scanner = new YbScanner(test.scanConfig);
    return test;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const waitForNonemptyQuery = async (query, predicate = (x) => true, timeout = 10000, count = 1) => {
    let start = Date.now();
    while (Date.now() - start < timeout) {
        await sleep(3000);
        const found = await query();
        if (found && found.length >= count) {
            const matched = found.filter(predicate);
            if (matched.length > 0) return matched;
        }
    }
    return null;
};

export const cleanupTest = (test, done) => {
    if (test.scanner) test.scanner.stop();
    shutdownMobiletto().finally(done);
};
