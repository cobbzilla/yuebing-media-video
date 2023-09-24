import { ALL_LANGS_ARRAY, ISO_639 } from "hokey-runtime";
import { LOCALE_LANGS } from "hokey-lang";
const LANG_MAP = {};
export const getLangMap = (logger) => {
    if (Object.keys(LANG_MAP).length > 0) {
        return LANG_MAP;
    }
    try {
        for (const langCode of ALL_LANGS_ARRAY) {
            const lang = langCode.toLowerCase();
            LANG_MAP[lang] = lang;
            const langSpecificLangs = LOCALE_LANGS[lang];
            for (const locVar in langSpecificLangs) {
                if (locVar.startsWith("locale_")) {
                    const loc = locVar.substring("locale_".length).toLowerCase();
                    const langValue = langSpecificLangs[locVar];
                    LANG_MAP[langValue] = loc;
                    LANG_MAP[langValue.toLocaleLowerCase(loc)] = loc;
                    LANG_MAP[langValue.toLowerCase()] = loc;
                }
            }
        }
        for (const langCode of Object.keys(ISO_639)) {
            LANG_MAP[langCode] = ISO_639[langCode];
        }
    }
    catch (e) {
        if (logger && logger.isErrorEnabled()) {
            logger.error(`getLangMap: error: ${JSON.stringify(e)}`);
        }
        throw e;
    }
    return LANG_MAP;
};
export const toLang = (lang, logger) => {
    const langMap = getLangMap(logger);
    if (langMap[lang]) {
        return langMap[lang];
    }
    const lcLang = lang.toLowerCase();
    if (langMap[lcLang]) {
        return langMap[lcLang];
    }
    if (logger && logger.isWarningEnabled()) {
        logger.warn(`toLang(${lang}): unrecognized, returning as-is`);
    }
    return lang;
};
//# sourceMappingURL=lang.js.map