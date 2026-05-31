import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// ── Helpers ──────────────────────────────────────────────────────

function generateVisitorId() {
  return 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

function getOrCreateVisitorId() {
  let id = localStorage.getItem('portfolio_visitor_id');
  const isReturning = !!id;
  if (!id) {
    id = generateVisitorId();
    localStorage.setItem('portfolio_visitor_id', id);
  }
  return { visitorId: id, isReturning };
}

// Known iPhone screen-to-model mapping
const IPHONE_MODELS = {
  '430x932': 'iPhone 15 Pro Max / 16 Plus',
  '393x852': 'iPhone 15 Pro / 15 / 14 Pro',
  '428x926': 'iPhone 14 Plus / 13 Pro Max / 12 Pro Max',
  '390x844': 'iPhone 14 / 13 / 13 Pro / 12 / 12 Pro',
  '375x812': 'iPhone 13 Mini / 12 Mini / X / XS / 11 Pro',
  '414x896': 'iPhone 11 / XR / XS Max',
  '414x736': 'iPhone 8 Plus / 7 Plus / 6s Plus',
  '375x667': 'iPhone SE / 8 / 7 / 6s',
  '320x568': 'iPhone SE (1st gen) / 5s',
  '402x874': 'iPhone 16 Pro',
  '440x956': 'iPhone 16 Pro Max',
};

// Known Android brand prefixes
const ANDROID_BRANDS = {
  'SM-': 'Samsung', 'GT-': 'Samsung',
  'Pixel': 'Google', 'Nexus': 'Google',
  'ONEPLUS': 'OnePlus', 'IN20': 'OnePlus', 'KB20': 'OnePlus',
  'Redmi': 'Xiaomi', 'Mi ': 'Xiaomi', 'POCO': 'Xiaomi', 'M20': 'Xiaomi',
  'RMX': 'Realme', 'RMP': 'Realme',
  'V20': 'Vivo', 'V21': 'Vivo', 'vivo': 'Vivo',
  'CPH': 'Oppo', 'OPPO': 'Oppo',
  'moto': 'Motorola', 'Moto': 'Motorola', 'XT': 'Motorola',
  'Nokia': 'Nokia',
  'LM-': 'LG',
  'ASUS': 'Asus',
  'HMA': 'Huawei', 'ELE': 'Huawei', 'VOG': 'Huawei', 'HUAWEI': 'Huawei',
};

function parseDeviceModel(ua) {
  // iPhone — identified by screen resolution
  if (/iPhone/i.test(ua)) {
    const key = `${window.screen.width}x${window.screen.height}`;
    const keyR = `${window.screen.height}x${window.screen.width}`;
    const model = IPHONE_MODELS[key] || IPHONE_MODELS[keyR];
    return { deviceBrand: 'Apple', deviceModel: model || 'iPhone (unknown model)' };
  }

  // iPad
  if (/iPad/i.test(ua)) {
    return { deviceBrand: 'Apple', deviceModel: 'iPad' };
  }

  // Android — model is in the UA: "Android 13; SM-S918B"
  const androidMatch = ua.match(/Android[^;]*;\s*([^)]+)/i);
  if (androidMatch) {
    let rawModel = androidMatch[1].replace(/Build\/.*$/i, '').trim();
    // Clean up common suffixes
    rawModel = rawModel.replace(/\s*MIUI\/.*$/i, '').replace(/\s*HarmonyOS.*$/i, '').trim();

    let brand = 'Android';
    for (const [prefix, brandName] of Object.entries(ANDROID_BRANDS)) {
      if (rawModel.toLowerCase().startsWith(prefix.toLowerCase())) {
        brand = brandName;
        break;
      }
    }
    return { deviceBrand: brand, deviceModel: rawModel || 'Unknown' };
  }

  // macOS
  if (/Macintosh|Mac OS X/i.test(ua)) {
    return { deviceBrand: 'Apple', deviceModel: 'Mac' };
  }

  // Windows
  if (/Windows/i.test(ua)) {
    return { deviceBrand: 'Windows PC', deviceModel: 'PC' };
  }

  // Chrome OS
  if (/CrOS/i.test(ua)) {
    const crosMatch = ua.match(/CrOS\s+\w+\s+([\d.]+)/i);
    return { deviceBrand: 'Chromebook', deviceModel: crosMatch ? `Chrome OS ${crosMatch[1]}` : 'Chromebook' };
  }

  // Linux
  if (/Linux/i.test(ua)) {
    return { deviceBrand: 'Linux PC', deviceModel: 'Linux Device' };
  }

  return { deviceBrand: 'Unknown', deviceModel: 'Unknown' };
}

async function getHighEntropyDeviceInfo() {
  // Modern Chromium browsers support high-entropy UA hints with richer device info
  try {
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
      const data = await navigator.userAgentData.getHighEntropyValues([
        'model', 'platform', 'platformVersion', 'fullVersionList', 'architecture'
      ]);
      return {
        uaModel: data.model || '',
        uaPlatform: data.platform || '',
        uaPlatformVersion: data.platformVersion || '',
        uaArchitecture: data.architecture || '',
        uaBrands: data.fullVersionList?.map(b => `${b.brand} ${b.version}`).join(', ') || ''
      };
    }
  } catch { /* not supported */ }
  return null;
}

function parseUserAgent() {
  const ua = navigator.userAgent;

  // Device type
  let deviceType = 'Desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/mobile|iphone|ipod|android.*mobile|windows phone|bb10|blackberry/i.test(ua)) {
    deviceType = 'Mobile';
  }

  // Operating System
  let os = 'Unknown';
  if (/Windows NT 10/i.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/CrOS/i.test(ua)) os = 'Chrome OS';

  // Browser
  let browser = 'Unknown';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = 'Opera';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/UCBrowser/i.test(ua)) browser = 'UC Browser';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua)) browser = 'Safari';

  // Device brand & model
  const { deviceBrand, deviceModel } = parseDeviceModel(ua);

  return { deviceType, os, browser, deviceBrand, deviceModel, rawUserAgent: ua };
}

function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const utms = {};
  utmKeys.forEach(key => {
    const val = params.get(key);
    if (val) utms[key] = val;
  });
  return Object.keys(utms).length > 0 ? utms : null;
}

function getReferrerSource() {
  const ref = document.referrer;
  if (!ref) return { referrer: 'Direct', referrerUrl: '' };

  try {
    const url = new URL(ref);
    const host = url.hostname.toLowerCase();

    if (host.includes('google')) return { referrer: 'Google', referrerUrl: ref };
    if (host.includes('linkedin')) return { referrer: 'LinkedIn', referrerUrl: ref };
    if (host.includes('twitter') || host.includes('t.co') || host.includes('x.com')) return { referrer: 'Twitter/X', referrerUrl: ref };
    if (host.includes('facebook') || host.includes('fb.com')) return { referrer: 'Facebook', referrerUrl: ref };
    if (host.includes('instagram')) return { referrer: 'Instagram', referrerUrl: ref };
    if (host.includes('github')) return { referrer: 'GitHub', referrerUrl: ref };
    if (host.includes('reddit')) return { referrer: 'Reddit', referrerUrl: ref };
    if (host.includes('youtube')) return { referrer: 'YouTube', referrerUrl: ref };
    if (host.includes('bing')) return { referrer: 'Bing', referrerUrl: ref };
    if (host.includes('yahoo')) return { referrer: 'Yahoo', referrerUrl: ref };

    return { referrer: host, referrerUrl: ref };
  } catch {
    return { referrer: ref, referrerUrl: ref };
  }
}

// ── IP & Geolocation ─────────────────────────────────────────────

async function fetchGeoData() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('Geo fetch failed');
    const data = await res.json();
    return {
      ip: data.ip || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || '',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      isp: data.org || 'Unknown',
      asn: data.asn || '',
      postalCode: data.postal || ''
    };
  } catch (err) {
    console.warn('[Tracker] Geo fetch failed:', err.message);
    return {
      ip: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      countryCode: '',
      latitude: null,
      longitude: null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isp: 'Unknown',
      asn: '',
      postalCode: ''
    };
  }
}

// ── Hardware & Battery ───────────────────────────────────────────

function getHardwareInfo() {
  return {
    deviceMemory: navigator.deviceMemory || null,         // e.g. 4, 8, 16 (GB)
    cpuCores: navigator.hardwareConcurrency || null,      // e.g. 4, 8, 12, 16
  };
}

function getNetworkInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return { networkType: 'Unknown', downlink: null, rtt: null, saveData: false };
  return {
    networkType: conn.effectiveType || 'Unknown',         // 4g, 3g, 2g, slow-2g
    networkActualType: conn.type || null,                 // wifi, cellular, ethernet, etc.
    downlink: conn.downlink || null,                      // Mbps
    rtt: conn.rtt || null,                                // ms round-trip
    saveData: conn.saveData || false                      // data saver on/off
  };
}

async function getBatteryInfo() {
  try {
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      return {
        batteryLevel: Math.round(battery.level * 100),    // 0-100%
        batteryCharging: battery.charging
      };
    }
  } catch { /* not supported */ }
  return { batteryLevel: null, batteryCharging: null };
}

// ── Engagement Tracking ──────────────────────────────────────────

let maxScrollDepth = 0;
let totalClicks = 0;
let clickedElements = [];
let startTime = Date.now();
let currentDocId = null;

function trackScroll() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return;
  const scrolled = Math.round((window.scrollY / scrollHeight) * 100);
  if (scrolled > maxScrollDepth) {
    maxScrollDepth = scrolled;
  }
}

function trackClick(e) {
  totalClicks++;
  const target = e.target;
  const info = {
    tag: target.tagName,
    id: target.id || undefined,
    class: target.className && typeof target.className === 'string' ? target.className.substring(0, 80) : undefined,
    text: target.textContent ? target.textContent.substring(0, 50).trim() : undefined,
    href: target.href || target.closest('a')?.href || undefined
  };
  // Keep only last 20 clicks to avoid bloat
  if (clickedElements.length >= 20) clickedElements.shift();
  clickedElements.push(info);
}

// ── Save Engagement Data ─────────────────────────────────────────

async function saveEngagementData() {
  if (!currentDocId) return;
  const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
  try {
    const visitRef = doc(db, 'visits', currentDocId);
    await updateDoc(visitRef, {
      timeSpentSeconds,
      maxScrollDepth,
      totalClicks,
      clickedElements,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('[Tracker] Failed to update engagement:', err.message);
  }
}

// ── Main Init ────────────────────────────────────────────────────

export async function initTracker() {
  // Don't track the analytics dashboard itself
  if (window.location.pathname === '/analytics') return;

  try {
    const { visitorId, isReturning } = getOrCreateVisitorId();
    const { deviceType, os, browser, deviceBrand, deviceModel, rawUserAgent } = parseUserAgent();
    const { referrer, referrerUrl } = getReferrerSource();
    const utmParams = getUTMParams();
    const geoData = await fetchGeoData();
    const highEntropy = await getHighEntropyDeviceInfo();

    const hardwareInfo = getHardwareInfo();
    const networkInfo = getNetworkInfo();
    const batteryInfo = await getBatteryInfo();

    // Count total visits for this visitor
    const visitCount = parseInt(localStorage.getItem('portfolio_visit_count') || '0') + 1;
    localStorage.setItem('portfolio_visit_count', visitCount.toString());

    const visitData = {
      // Visitor identity
      visitorId,
      isReturning,
      visitNumber: visitCount,

      // Timing
      visitedAt: serverTimestamp(),
      visitedAtLocal: new Date().toISOString(),
      localTime: new Date().toLocaleTimeString(),
      localDate: new Date().toLocaleDateString(),

      // Location & Network
      ...geoData,

      // Device & Browser
      deviceType,
      deviceBrand,
      deviceModel,
      os,
      browser,
      rawUserAgent,
      highEntropyData: highEntropy || null,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio || 1,

      // Hardware
      ...hardwareInfo,

      // Network (detailed)
      ...networkInfo,

      // Battery
      ...batteryInfo,

      // Page info
      pageUrl: window.location.href,
      pagePath: window.location.pathname + window.location.hash,

      // Traffic source
      referrer,
      referrerUrl,
      utmParams,

      // Language & Platform
      language: navigator.language || 'Unknown',
      languages: navigator.languages ? [...navigator.languages] : [],
      platform: navigator.platform || 'Unknown',
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === '1',
      online: navigator.onLine,

      // Engagement (will be updated on page leave)
      timeSpentSeconds: 0,
      maxScrollDepth: 0,
      totalClicks: 0,
      clickedElements: []
    };

    const docRef = await addDoc(collection(db, 'visits'), visitData);
    currentDocId = docRef.id;

    // Set up engagement listeners
    window.addEventListener('scroll', trackScroll, { passive: true });
    window.addEventListener('click', trackClick, { passive: true });

    // Save engagement data on page leave
    const handleLeave = () => saveEngagementData();
    window.addEventListener('beforeunload', handleLeave);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleLeave();
      }
    });

    // Periodically save engagement data every 30 seconds
    setInterval(() => saveEngagementData(), 30000);

    console.log('[Tracker] Visit recorded:', docRef.id);
  } catch (err) {
    console.warn('[Tracker] Failed to record visit:', err.message);
  }
}
