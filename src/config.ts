export const siteConfig = {
  name: 'Sanam Luang',
  baseUrl: 'https://sanamluangbangkok.com',
  slug: 'sanam-luang',
  locales: ['zh', 'en', 'th'] as const,
};

export const ogLocale: Record<string, string> = {
  zh: 'zh_CN',
  en: 'en_US',
  th: 'th_TH',
};

/* -------------------------------------------------------------------------- */
/*  单景点 SEO 实体绑定配置变量表 (Single-Attraction Entity Binding Config)      */
/*  -------------------------------------------------------------------------
 *  使用方式：仅需替换下表中的字段即可复用到其它单景点站点。
 *  | 变量占位符                  | 当前值                                              |
 *  | --------------------------- | --------------------------------------------------- |
 *  | DOMAIN_NAME                 | sanamluangbangkok.com                               |
 *  | ATTRACTION_FULL_NAME        | Sanam Luang (สนามหลวง)                              |
 *  | ATTRACTION_SHORT_NAME       | Sanam Luang                                         |
 *  | CITY_NAME                   | Bangkok                                             |
 *  | STATE_PROVINCE              | Phra Nakhon, Bangkok                                |
 *  | COUNTRY_NAME                | Thailand                                            |
 *  | COUNTRY_CODE_2LETTER        | TH                                                  |
 *  | POSTAL_CODE                 | 10200                                               |
 *  | PLUS_CODE                   | QF4V+88R                                            |
 *  | LATITUDE                    | 13.7543884                                          |
 *  | LONGITUDE                   | 100.4907973                                         |
 *  | MAPS_SHARE_URL              | https://maps.app.goo.gl/U8tk6HUgtabaEVnV8           |
 *  | MAPS_EMBED_SRC              | https://www.google.com/maps?q=Sanam%20Luang...      |
 *  | NEARBY_LANDMARK_1           | The Grand Palace & Wat Phra Kaew                    |
 *  | NEARBY_LANDMARK_2           | Bangkok National Museum                             |
 *  | GOVT_TOURISM_URL            | https://www.tourismthailand.org/                    |
 * -------------------------------------------------------------------------- */
export const entity = {
  domainName: 'sanamluangbangkok.com',
  attractionFullName: 'Sanam Luang (สนามหลวง)',
  attractionShortName: 'Sanam Luang',
  cityName: 'Bangkok',
  districtName: 'Phra Nakhon',
  stateProvince: 'Bangkok',
  countryName: 'Thailand',
  countryCode2Letter: 'TH',
  postalCode: '10200',
  latitude: 13.7543884,
  longitude: 100.4907973,
  /** 街道地址（不含 Plus Code：PostalAddress.streetAddress 只应放真实街道） */
  streetAddress: 'Ratchadamnoen Klang Rd, Phra Borom Maha Ratchawang, Phra Nakhon',
  /** 谷歌地图 Plus Code，用于导航与结构化数据对齐 */
  plusCode: 'QF4V+88R',
  mapsShareUrl: 'https://maps.app.goo.gl/U8tk6HUgtabaEVnV8',
  mapsEmbedSrc: 'https://www.google.com/maps?q=Sanam%20Luang%20Bangkok&output=embed',
  nearbyLandmark1: 'The Grand Palace & Wat Phra Kaew',
  nearbyLandmark2: 'Bangkok National Museum',
  govtTourismUrl: 'https://www.tourismthailand.org/',
  /** 谷歌地图公开评分（最新同步） */
  ratingValue: '4.6',
  reviewCount: 27260,
  /** 评分与评价数的采集来源与同步时间（页面需注明来源） */
  ratingSourceName: 'Google Maps',
  ratingSourceUrl: 'https://maps.app.goo.gl/U8tk6HUgtabaEVnV8',
  ratingSyncedAt: '2026-09',
  /** 主视觉图与图片版权说明 */
  heroImage: '/gallery/sanam-luang-bangkok-1.jpg',
  /** OG/Twitter 分享图（1200×630 由主视觉裁切而来） */
  ogImage: '/gallery/sanam-luang-bangkok-1.jpg',
  imageLicense:
    'All images displayed on this website remain the property and copyright of their original photographers. / รูปภาพทั้งหมดบนเว็บไซต์นี้เป็นทรัพย์สินและลิขสิทธิ์ของช่างภาพต้นฉบับ / 本网站所展示的所有图片产权及版权均归原摄影者所有。',
} as const;

/** 去重后的地点层级标签，如 "Bangkok, Thailand" */
export const locationLabel = Array.from(
  new Set([entity.cityName, entity.stateProvince, entity.countryName]),
).join(', ');

/** 完整地理归属层级（实体 → 区 → 城市/府 → 国家） */
export const geoHierarchy = [
  entity.attractionFullName,
  entity.districtName,
  entity.stateProvince,
  entity.countryName,
];

export type EntityConfig = typeof entity;

/* -------------------------------------------------------------------------- */
/*  景点场景档案（决定天气建议引擎启用哪些规则）                                */
/*  -------------------------------------------------------------------------
 *  场景类型：
 *    coastal  海边    —— 潮汐、浪高、海水温度（赶海时间、礁石安全）
 *    mountain 山地    —— 山顶风力、海拔温差、能见度、山洪滑坡（登山穿衣、云海）
 *    water    河湖水上 —— 水温、浪高、雷暴（玩水时机、项目关停）
 *    forest   森林草原 —— 火险等级、蚊虫指数、花粉（防火、驱蚊）
 *    cave     溶洞    —— 洞内温差、地面湿滑
 *    desert   沙漠戈壁 —— 沙尘概率、昼夜温差、地表温度
 *    urban    城市人文 —— 体感温度、城市热岛、防暑（无特殊环境风险）
 *  当前站点为城市历史广场，仅启用 urban 规则（不涉及海边 / 山地等数据源）。
 * -------------------------------------------------------------------------- */
export const sceneProfile = {
  scenario: 'urban',
  /** 场地几乎没有遮荫，正午暴晒明显 */
  noShade: true,
  /** 附近有可替代的室内场馆 */
  indoorAlternative: true,
} as const;

export default siteConfig;
