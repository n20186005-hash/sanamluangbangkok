/**
 * 服务端天气数据模块
 * ------------------------------------------------------------------
 * 该模块只在服务端（Astro frontmatter / Worker 运行时）执行，负责：
 *  1. 按坐标拉取实时与多日预报数据；
 *  2. 对上游请求做缓存（Cloudflare 边缘缓存 + 单实例内存缓存）；
 *  3. 把上游原始字段整理成页面可直接使用的结构。
 * 任何失败都不会抛错，而是返回 null，交由页面渲染降级内容。
 */

export interface WeatherCurrent {
  /** 气温，摄氏度 */
  temperature: number;
  /** 体感温度，摄氏度 */
  apparent: number;
  /** 相对湿度，% */
  humidity: number;
  /** 风速 km/h */
  wind: number;
  /** 阵风 km/h */
  windGust: number;
  /** WMO 天气代码 */
  code: number;
  /** 1 = 白天，0 = 夜间 */
  isDay: boolean;
  /** 当前小时降水量 mm */
  precipitation: number;
}

export interface WeatherDay {
  /** ISO 日期，如 2026-09-14 */
  date: string;
  code: number;
  temperatureMax: number;
  temperatureMin: number;
  /** 当天最高体感温度 ℃ */
  apparentMax: number;
  /** 当天最低体感温度 ℃ */
  apparentMin: number;
  /** 当天最高降水概率 % */
  precipitationProbability: number;
  /** 当天累计降水 mm */
  precipitationSum: number;
  uvIndexMax: number;
  windMax: number;
  /** 当天最大阵风 km/h */
  windGustMax: number;
  /** 当天平均相对湿度 % */
  humidityMean: number;
  /** ISO 时间字符串，如 2026-09-14T06:05 */
  sunrise: string;
  sunset: string;
}

export interface WeatherPayload {
  current: WeatherCurrent;
  days: WeatherDay[];
  /** 数据生成时间（ISO） */
  fetchedAt: string;
  /** 数据有效期（秒） */
  ttl: number;
}

const CACHE_TTL_SECONDS = 1800; // 30 分钟
const ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

let memoryCache: { payload: WeatherPayload; expiresAt: number } | null = null;
let inflight: Promise<WeatherPayload | null> | null = null;

interface FetchOptions {
  latitude: number;
  longitude: number;
  /** 预报天数，默认 7 */
  days?: number;
  /** 跳过后台缓存，强制刷新 */
  fresh?: boolean;
  timeoutMs?: number;
}

function buildUrl({ latitude, longitude, days = 7 }: FetchOptions): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_gusts_10m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,relative_humidity_2m_mean,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max',
    timezone: 'Asia/Bangkok',
    forecast_days: String(days),
    wind_speed_unit: 'kmh',
  });
  return `${ENDPOINT}?${params.toString()}`;
}

function num(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parse(raw: any): WeatherPayload | null {
  const current = raw?.current;
  const daily = raw?.daily;
  if (!current || !daily || !Array.isArray(daily.time)) return null;

  const days: WeatherDay[] = daily.time.map((date: string, i: number) => ({
    date,
    code: num(daily.weather_code?.[i]),
    temperatureMax: num(daily.temperature_2m_max?.[i]),
    temperatureMin: num(daily.temperature_2m_min?.[i]),
    apparentMax: num(daily.apparent_temperature_max?.[i], num(daily.temperature_2m_max?.[i])),
    apparentMin: num(daily.apparent_temperature_min?.[i], num(daily.temperature_2m_min?.[i])),
    precipitationProbability: num(daily.precipitation_probability_max?.[i]),
    precipitationSum: num(daily.precipitation_sum?.[i]),
    uvIndexMax: num(daily.uv_index_max?.[i]),
    windMax: num(daily.wind_speed_10m_max?.[i]),
    windGustMax: num(daily.wind_gusts_10m_max?.[i]),
    humidityMean: num(daily.relative_humidity_2m_mean?.[i]),
    sunrise: String(daily.sunrise?.[i] ?? ''),
    sunset: String(daily.sunset?.[i] ?? ''),
  }));

  if (!days.length) return null;

  return {
    current: {
      temperature: num(current.temperature_2m),
      apparent: num(current.apparent_temperature),
      humidity: num(current.relative_humidity_2m),
      wind: num(current.wind_speed_10m),
      windGust: num(current.wind_gusts_10m),
      code: num(current.weather_code),
      isDay: num(current.is_day, 1) === 1,
      precipitation: num(current.precipitation),
    },
    days,
    fetchedAt: new Date().toISOString(),
    ttl: CACHE_TTL_SECONDS,
  };
}

/**
 * 获取天气数据。始终返回 Promise，永不对调用方抛出异常。
 */
export async function getWeather(options: FetchOptions): Promise<WeatherPayload | null> {
  const now = Date.now();
  if (!options.fresh && memoryCache && memoryCache.expiresAt > now) {
    return memoryCache.payload;
  }
  if (!options.fresh && inflight) {
    return inflight;
  }

  const task = (async (): Promise<WeatherPayload | null> => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 6000);
      const response = await fetch(buildUrl(options), {
        headers: { accept: 'application/json' },
        signal: controller.signal,
        // Cloudflare Workers：让边缘节点缓存上游响应，避免每次请求都回源
        cf: { cacheTtl: CACHE_TTL_SECONDS, cacheEverything: true },
      } as RequestInit);
      clearTimeout(timer);

      if (!response.ok) return null;
      const payload = parse(await response.json());
      if (!payload) return null;

      memoryCache = { payload, expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000 };
      return payload;
    } catch {
      return null;
    } finally {
      inflight = null;
    }
  })();

  inflight = task;
  return task;
}

/** 把 WMO 天气代码归一为文案字典中的键 */
export function weatherCodeKey(code: number): string {
  const known = [
    0, 1, 2, 3, 45, 48, 51, 53, 55, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
  ];
  return known.includes(code) ? String(code) : 'other';
}

/** 依据天气代码给出图标（不依赖任何第三方图标库） */
export function weatherIcon(code: number, isDay = true): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code === 1) return isDay ? '🌤️' : '🌙';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if ([51, 53, 55, 56, 57].includes(code)) return '🌦️';
  if ([61, 63, 65, 80, 81].includes(code)) return '🌧️';
  if ([66, 67].includes(code)) return '🌧️';
  if (code === 82) return '⛈️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '🌨️';
  if ([95, 96, 99].includes(code)) return '⛈️';
  return '🌤️';
}

/** 从 ISO 时间字符串中取出 HH:mm */
export function clockTime(iso: string): string {
  if (!iso || !iso.includes('T')) return '--:--';
  return iso.split('T')[1]?.slice(0, 5) ?? '--:--';
}

/** 判断当天是否属于「可能下雨」 */
export function isRainy(day: WeatherDay): boolean {
  if (day.precipitationProbability >= 50) return true;
  if (day.precipitationSum >= 1) return true;
  const rainyCodes = [51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  return rainyCodes.includes(day.code);
}

/** 判断当天是否存在雷雨风险 */
export function isStormy(day: WeatherDay): boolean {
  return [95, 96, 99].includes(day.code);
}

/** 判断当天是否可能出现强降雨 */
export function isHeavyRain(day: WeatherDay): boolean {
  if ([65, 82].includes(day.code)) return true;
  return day.precipitationSum >= 25;
}

/** 判断当天是否可能有雾 / 低能见度 */
export function isFoggy(day: WeatherDay): boolean {
  return [45, 48].includes(day.code);
}

/** 由 km/h 换算蒲福风力等级（0—12 级），供页面直接展示「几级风」 */
export function windScale(kmh: number): number {
  const thresholds = [1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];
  let scale = 0;
  while (scale < thresholds.length && kmh >= thresholds[scale]) scale += 1;
  return scale;
}

/** 紫外线等级：low / moderate / high / veryHigh / extreme */
export function uvLevel(uv: number): 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme' {
  if (uv >= 11) return 'extreme';
  if (uv >= 8) return 'veryHigh';
  if (uv >= 6) return 'high';
  if (uv >= 3) return 'moderate';
  return 'low';
}
