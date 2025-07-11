/*
Created (name): Dom
Created (date): 2025-05-24

Description:
Used to display Language Flag in LocaleSwitcher
*/

import { addPropertyControls, ControlType } from "framer"

const CDN_URL = "https://react-circle-flags.pages.dev/"
const FILE_SUFFIX = "svg"

const UNKNOWN_FLAG = "xx"
const DEFAULT_HEIGHT = 100

/**
 * @param {string} code
 * @param {string} cdnUrl
 * @param {DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>} otherProps
 * @param {string} cdnSuffix
 */
const getSvgProps = (code, cdnUrl, otherProps, cdnSuffix = "") => ({
    ...otherProps,
    title: otherProps.title || code,
    height: otherProps.height || DEFAULT_HEIGHT,
    src: `${cdnUrl || CDN_URL}${cdnSuffix}${code}.${FILE_SUFFIX}`,
})
/**
 * @param {string} countryCode
 */
const parseLanguageCode = (languageCode) =>
    languages[languageCode] ? languageCode : UNKNOWN_FLAG

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function CircleFlagLanguage({
    languageCode,
    cdnUrl,
    ...otherProps
}) {
    return (
        <img
            data-testid="circle-language-flag"
            {...getSvgProps(
                parseLanguageCode(languageCode).toLowerCase(),
                cdnUrl,
                otherProps,
                "language/"
            )}
        />
    )
}

const languages = {
    aa: true,
    ab: true,
    af: true,
    ak: true,
    am: true,
    an: true,
    ar: true,
    as: true,
    av: true,
    ay: true,
    az: true,
    ba: true,
    be: true,
    bg: true,
    bi: true,
    bm: true,
    bn: true,
    bo: true,
    br: true,
    bs: true,
    ca: true,
    ce: true,
    ceb: true,
    ch: true,
    chm: true,
    ckb: true,
    co: true,
    cs: true,
    cv: true,
    cy: true,
    da: true,
    de: true,
    dv: true,
    dz: true,
    ee: true,
    el: true,
    "en-au": true,
    "en-ca": true,
    "en-gh": true,
    "en-hk": true,
    "en-ie": true,
    "en-in": true,
    "en-ke": true,
    "en-ng": true,
    "en-nz": true,
    "en-ph": true,
    "en-sg": true,
    "en-tz": true,
    "en-us": true,
    "en-za": true,
    en: true,
    eo: true,
    "es-mx": true,
    es: true,
    et: true,
    eu: true,
    fa: true,
    fi: true,
    filenames_without_extensions: true,
    fj: true,
    fo: true,
    fr: true,
    fy: true,
    ga: true,
    gd: true,
    gl: true,
    gn: true,
    gu: true,
    gv: true,
    ha: true,
    haw: true,
    he: true,
    hi: true,
    hmn: true,
    ho: true,
    hr: true,
    ht: true,
    hu: true,
    hy: true,
    ia: true,
    id: true,
    ie: true,
    ig: true,
    ilo: true,
    interslavic: true,
    io: true,
    is: true,
    it: true,
    ja: true,
    jv: true,
    ka: true,
    kg: true,
    ki: true,
    kk: true,
    kl: true,
    km: true,
    kn: true,
    ko: true,
    kr: true,
    kri: true,
    ks: true,
    ku: true,
    kv: true,
    kw: true,
    ky: true,
    la: true,
    lb: true,
    lg: true,
    ln: true,
    lo: true,
    lt: true,
    lu: true,
    lus: true,
    lv: true,
    mg: true,
    mh: true,
    mi: true,
    mk: true,
    ml: true,
    mn: true,
    mni: true,
    mr: true,
    mrj: true,
    ms: true,
    mt: true,
    my: true,
    na: true,
    nb: true,
    nd: true,
    ne: true,
    nl: true,
    nn: true,
    no: true,
    non: true,
    nr: true,
    ny: true,
    oc: true,
    om: true,
    or: true,
    os: true,
    oto: true,
    pa: true,
    pap: true,
    pl: true,
    ps: true,
    "pt-br": true,
    pt: true,
    qu: true,
    rm: true,
    rn: true,
    ro: true,
    ru: true,
    rw: true,
    sc: true,
    sd: true,
    se: true,
    sg: true,
    si: true,
    sk: true,
    sl: true,
    sm: true,
    sn: true,
    so: true,
    sq: true,
    sr: true,
    ss: true,
    st: true,
    su: true,
    sv: true,
    sw: true,
    ta: true,
    te: true,
    tg: true,
    th: true,
    ti: true,
    tk: true,
    tl: true,
    tn: true,
    to: true,
    tr: true,
    tt: true,
    ty: true,
    udm: true,
    ug: true,
    uk: true,
    ur: true,
    uz: true,
    vi: true,
    vo: true,
    xh: true,
    xx: true,
    yi: true,
    yo: true,
    yua: true,
    zh: true,
    zu: true,
}
