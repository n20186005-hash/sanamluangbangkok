/**
 * 游客建议引擎
 * ------------------------------------------------------------------
 * 把气象字段翻译成「用户该干什么」，而不是复述天气数字。
 * 设计要点：
 *  1. 纯函数、无副作用，可在服务端与客户端复用；
 *  2. 只返回命中的条目 key（配合 i18n 文案渲染），不满足条件的条目不输出；
 *  3. 风险提醒优先级最高，命中后调用方应置顶展示；
 *  4. 通过 SiteSceneProfile 适配景点地理类型（城市人文 / 海边 / 山地 / 水上 / 森林 / 沙漠）。
 */
import type { WeatherDay, WeatherPayload } from './weather';
import { isFoggy, isHeavyRain, isStormy, uvLevel, windScale } from './weather';

/** 文案分组：出行穿搭 / 游玩安排 / 随身物品 */
export type AdviceGroup = 'outfit' | 'plan' | 'pack';

export interface AdviceItem {
  /** 对应 i18n 中 weather.tips.<group>.<key> 的文案键 */
  key: string;
  /** 文案中的 {value} 等占位符参数 */
  params?: Record<string, string | number>;
}

export interface WeatherAdvice {
  /** 风险提醒（最高优先级，为空时前端整块隐藏） */
  alerts: AdviceItem[];
  /** 出行穿搭 */
  outfit: AdviceItem[];
  /** 游玩安排 */
  plan: AdviceItem[];
  /** 随身物品 */
  pack: AdviceItem[];
  /** 一句话总览，用于建议区标题右侧的标签行 */
  highlights: { uvLevel: string; windScale: number };
}

/**
 * 景点场景档案：决定哪些规则生效。
 * 当前站点为城市历史广场（urban），因此不触发海边潮汐 / 山地山洪 / 森林火险等场景规则；
 * 若后续接入其他类型景点，只需新增 scenario 分支与对应数据源。
 */
export interface SiteSceneProfile {
  scenario: 'urban' | 'coastal' | 'mountain' | 'water' | 'forest' | 'desert';
  /** 场地几乎没有遮荫，正午暴晒明显 */
  noShade?: boolean;
  /** 附近有可替代的室内场馆（雨天优先推荐） */
  indoorAlternative?: boolean;
}

/** 单组建议的最大条数，避免把不重要的信息堆在页面上 */
const GROUP_LIMIT: Record<AdviceGroup, number> = { outfit: 3, plan: 4, pack: 6 };
const ALERT_LIMIT = 3;

/** 雷雨 / 强降雨 / 小雨 / 大雾的天气代码分组 */
const LIGHT_RAIN_CODES = [51, 53, 55, 61, 80, 81];
const FOG_CODES = [45, 48];

function add(list: AdviceItem[], item: AdviceItem, limit: number) {
  if (list.length >= limit) return;
  if (list.some((existing) => existing.key === item.key)) return;
  list.push(item);
}

function round(value: number): number {
  return Math.round(value);
}

export function buildAdvice(data: WeatherPayload, profile: SiteSceneProfile): WeatherAdvice {
  const current = data.current;
  const today: WeatherDay | undefined = data.days[0];

  const alerts: AdviceItem[] = [];
  const outfit: AdviceItem[] = [];
  const plan: AdviceItem[] = [];
  const pack: AdviceItem[] = [];

  if (!today) {
    return { alerts, outfit, plan, pack, highlights: { uvLevel: 'low', windScale: 0 } };
  }

  // —— 基础指标 ——
  const tMax = today.temperatureMax;
  const tMin = today.temperatureMin;
  // 体感温度：用于风险判断时取真实数值（不人为加码）
  const apparent = Math.max(today.apparentMax, current.apparent);
  // 城市热岛：城区广场体感普遍高于开阔郊区，仅在「舒适度分级」上做 +1℃ 补偿
  const urbanBias = profile.scenario === 'urban' ? 1 : 0;
  const feelsMax = apparent + urbanBias;
  const range = tMax - tMin;
  const prob = today.precipitationProbability;
  const precipSum = today.precipitationSum;
  const uv = today.uvIndexMax;
  const scale = Math.max(windScale(today.windMax), windScale(current.wind));
  const gustScale = windScale(Math.max(today.windGustMax, current.windGust));
  const humidity = Math.max(today.humidityMean, current.humidity);

  const thunder = isStormy(today);
  const heavyRain = isHeavyRain(today);
  const lightRain = LIGHT_RAIN_CODES.includes(today.code) || (prob >= 40 && precipSum >= 1);
  const anyRain = thunder || heavyRain || lightRain || prob >= 60;
  const fog = isFoggy(today) || FOG_CODES.includes(today.code);

  const extremeHeat = apparent >= 40 || tMax >= 38;
  const veryHot = feelsMax >= 36 || tMax >= 34;
  const hot = feelsMax >= 33 || tMax >= 32;
  const humid = humidity >= 75;
  const cold = tMax <= 10;
  const clear = today.code === 0 || today.code === 1;
  const cloudy = today.code === 2 || today.code === 3;
  const windy = scale >= 5;
  const gale = scale >= 7 || gustScale >= 7;

  /* ---------------- 风险提醒（最高优先级） ---------------- */
  if (thunder) add(alerts, { key: 'thunder' }, ALERT_LIMIT);
  if (heavyRain) add(alerts, { key: 'heavyRain', params: { value: round(precipSum) } }, ALERT_LIMIT);
  if (gale) add(alerts, { key: 'gale', params: { value: scale } }, ALERT_LIMIT);
  if (extremeHeat) add(alerts, { key: 'extremeHeat', params: { value: round(feelsMax) } }, ALERT_LIMIT);
  if (fog) add(alerts, { key: 'fog' }, ALERT_LIMIT);
  if (cold) add(alerts, { key: 'cold' }, ALERT_LIMIT);

  /* ---------------- 出行穿搭 ---------------- */
  if (cold) {
    add(outfit, { key: 'cold' }, GROUP_LIMIT.outfit);
  } else {
    if (extremeHeat) add(outfit, { key: 'extremeHeat' }, GROUP_LIMIT.outfit);
    else if (veryHot || hot) add(outfit, { key: 'hot' }, GROUP_LIMIT.outfit);
    if (humid && (hot || veryHot || extremeHeat)) add(outfit, { key: 'humid' }, GROUP_LIMIT.outfit);
    if (range > 8) add(outfit, { key: 'layers', params: { value: round(range) } }, GROUP_LIMIT.outfit);
  }
  if (anyRain) add(outfit, { key: 'waterproof' }, GROUP_LIMIT.outfit);
  if (windy) add(outfit, { key: 'windy' }, GROUP_LIMIT.outfit);
  if (!outfit.length) add(outfit, { key: 'default' }, GROUP_LIMIT.outfit);

  /* ---------------- 游玩安排 ---------------- */
  if (thunder) add(plan, { key: 'storm' }, GROUP_LIMIT.plan);
  if (heavyRain) add(plan, { key: 'noOutdoor' }, GROUP_LIMIT.plan);
  else if (prob >= 60) add(plan, { key: 'indoorFirst', params: { value: round(prob) } }, GROUP_LIMIT.plan);
  else if (lightRain) add(plan, { key: 'lightRain' }, GROUP_LIMIT.plan);
  if (fog) add(plan, { key: 'lowVisibility' }, GROUP_LIMIT.plan);
  if (extremeHeat || veryHot || hot) {
    add(plan, { key: 'middayBreak', params: { value: round(tMax) } }, GROUP_LIMIT.plan);
  }
  if (uv >= 6) add(plan, { key: 'uvPlan', params: { value: round(uv) } }, GROUP_LIMIT.plan);
  if (clear) add(plan, { key: 'clear' }, GROUP_LIMIT.plan);
  else if (cloudy) add(plan, { key: 'cloudy' }, GROUP_LIMIT.plan);
  if (profile.noShade && (clear || cloudy) && (hot || uv >= 6)) {
    add(plan, { key: 'noShade' }, GROUP_LIMIT.plan);
  }
  if (windy && !gale) add(plan, { key: 'windyPlan' }, GROUP_LIMIT.plan);
  if (!plan.length) add(plan, { key: 'default' }, GROUP_LIMIT.plan);

  /* ---------------- 随身物品 ---------------- */
  if (anyRain) {
    add(pack, { key: windy || gustScale >= 6 ? 'poncho' : 'umbrella' }, GROUP_LIMIT.pack);
  }
  if (hot || veryHot || extremeHeat) add(pack, { key: 'water' }, GROUP_LIMIT.pack);
  if (uvLevel(uv) !== 'low') add(pack, { key: 'sunscreen' }, GROUP_LIMIT.pack);
  if (uv >= 6) add(pack, { key: 'sunglasses' }, GROUP_LIMIT.pack);
  if (veryHot || extremeHeat) add(pack, { key: 'heatKit' }, GROUP_LIMIT.pack);
  if (cold) add(pack, { key: 'coat' }, GROUP_LIMIT.pack);
  if (fog) add(pack, { key: 'mask' }, GROUP_LIMIT.pack);
  if (windy) add(pack, { key: 'hatCare' }, GROUP_LIMIT.pack);
  if (humid && !cold) add(pack, { key: 'quickDry' }, GROUP_LIMIT.pack);
  if (humid && (hot || veryHot) ) add(pack, { key: 'repellent' }, GROUP_LIMIT.pack);
  if (!pack.length) add(pack, { key: 'sneakers' }, GROUP_LIMIT.pack);

  return {
    alerts,
    outfit,
    plan,
    pack,
    highlights: { uvLevel: uvLevel(uv), windScale: scale },
  };
}

/** 把文案里的 {value} 等占位符替换为实际数值 */
export function fillAdvice(text: string | undefined, params?: Record<string, string | number>): string {
  if (!text) return '';
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (_, name: string) => (params[name] === undefined ? '' : String(params[name])));
}
