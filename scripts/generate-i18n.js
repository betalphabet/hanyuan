const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LANGS = ['zh-tw', 'en', 'vi', 'fil', 'pt'];

// Load SEO meta translations from central dictionary
const TRANSLATIONS_PATH = path.join(ROOT_DIR, 'i18n', 'translations', 'pages.json');
let META_TRANSLATIONS = {};
try {
  const dict = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));
  META_TRANSLATIONS = dict.meta || {};
  console.log(`Loaded meta translations for ${Object.keys(META_TRANSLATIONS).length} pages.`);
} catch (err) {
  console.warn(`⚠️  Could not load meta translations from ${TRANSLATIONS_PATH}: ${err.message}`);
}

// Load body content translations (shared UI strings, buttons, etc.)
const BODY_TRANSLATIONS_PATH = path.join(ROOT_DIR, 'i18n', 'translations', 'body.json');
let BODY_TRANSLATIONS = { shared: { en: {}, vi: {}, fil: {}, pt: {} } };
try {
  BODY_TRANSLATIONS = JSON.parse(fs.readFileSync(BODY_TRANSLATIONS_PATH, 'utf8'));
  const counts = Object.entries(BODY_TRANSLATIONS.shared || {}).map(([l, m]) => `${l}=${Object.keys(m).length}`).join(', ');
  console.log(`Loaded shared body translations (${counts}).`);
} catch (err) {
  console.warn(`⚠️  Could not load body translations from ${BODY_TRANSLATIONS_PATH}: ${err.message}`);
}

const NAV_TRANSLATIONS = {
  'zh-tw': {
    langName: '繁體中文',
    rooms: '房型',
    meal: '餐點',
    garden: '庭園',
    destination: '景點',
    map: '交通方式',
    oldSite: '舊版網站',
    bookOnline: '線上訂房'
  },
  'en': {
    langName: 'English',
    rooms: 'Rooms',
    meal: 'Dining',
    garden: 'Garden',
    destination: 'Attractions',
    map: 'Traffic & Location',
    oldSite: 'Legacy Site',
    bookOnline: 'Book Now'
  },
  'vi': {
    langName: 'Tiếng Việt',
    rooms: 'Phòng',
    meal: 'Ẩm thực',
    garden: 'Sân vườn',
    destination: 'Điểm tham quan',
    map: 'Giao thông & Vị trí',
    oldSite: 'Trang cũ',
    bookOnline: 'Đặt phòng'
  },
  'fil': {
    langName: 'Filipino',
    rooms: 'Mga Kuwarto',
    meal: 'Pagkain',
    garden: 'Hardin',
    destination: 'Mga Atraksyon',
    map: 'Direksyon at Lokasyon',
    oldSite: 'Lumang Site',
    bookOnline: 'Mag-book Ngayon'
  },
  'pt': {
    langName: 'Português',
    rooms: 'Quartos',
    meal: 'Refeições',
    garden: 'Jardim',
    destination: 'Atrações',
    map: 'Direções e Localização',
    oldSite: 'Site Antigo',
    bookOnline: 'Reservar Agora'
  }
};

const HTML_FILES = fs.readdirSync(ROOT_DIR)
  .filter(f => f.endsWith('.html') && fs.statSync(path.join(ROOT_DIR, f)).isFile());

console.log(`Discovered ${HTML_FILES.length} root HTML files.`);

function generateDropdownHtml(currentLang, filename, isInsideLangDir) {
  const currentInfo = NAV_TRANSLATIONS[currentLang] || NAV_TRANSLATIONS['zh-tw'];
  
  function getLangHref(targetLang) {
    if (!isInsideLangDir) {
      if (targetLang === 'zh-tw') return filename;
      return `lang/${targetLang}/${filename}`;
    } else {
      if (targetLang === currentLang) return filename;
      if (targetLang === 'zh-tw') return `../../${filename}`;
      return `../${targetLang}/${filename}`;
    }
  }

  return `<li class="nav-item dropdown lang-selector">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownLang" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="globe-icon">🌐</span> <span>${currentInfo.langName}</span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownLang">
                            <a class="dropdown-item ${currentLang === 'zh-tw' ? 'active' : ''}" href="${getLangHref('zh-tw')}" data-lang="zh-tw">繁體中文</a>
                            <a class="dropdown-item ${currentLang === 'en' ? 'active' : ''}" href="${getLangHref('en')}" data-lang="en">English</a>
                            <a class="dropdown-item ${currentLang === 'vi' ? 'active' : ''}" href="${getLangHref('vi')}" data-lang="vi">Tiếng Việt</a>
                            <a class="dropdown-item ${currentLang === 'fil' ? 'active' : ''}" href="${getLangHref('fil')}" data-lang="fil">Filipino</a>
                            <a class="dropdown-item ${currentLang === 'pt' ? 'active' : ''}" href="${getLangHref('pt')}" data-lang="pt">Português</a>
                        </div>
                    </li>`;
}

function generateHreflangTags(filename, isSubdir = false) {
  const cssPrefix = isSubdir ? '../../' : '';
  const pageUrl = filename === 'index.html' ? '' : filename;
  return `    <!-- Alternate Language Hreflangs -->
    <link rel="alternate" hreflang="zh-TW" href="https://hanyuan.info/${pageUrl}" />
    <link rel="alternate" hreflang="en" href="https://hanyuan.info/lang/en/${filename}" />
    <link rel="alternate" hreflang="vi" href="https://hanyuan.info/lang/vi/${filename}" />
    <link rel="alternate" hreflang="fil" href="https://hanyuan.info/lang/fil/${filename}" />
    <link rel="alternate" hreflang="pt" href="https://hanyuan.info/lang/pt/${filename}" />
    <link rel="alternate" hreflang="x-default" href="https://hanyuan.info/${pageUrl}" />
    <link rel="stylesheet" href="${cssPrefix}css/i18n.css">`;
}

function replaceGoogleTranslateSafely(content, replacement) {
  const navStart = content.indexOf('<nav');
  const navEnd = content.indexOf('</nav>');
  if (navStart === -1 || navEnd === -1) return content;

  let navSection = content.substring(navStart, navEnd);
  const gtRegex = /<li\s+class="nav-item"[^>]*>\s*<a\s+href="https:\/\/translate\.google\.com[^"]*"[^>]*>[\s\S]*?<\/li>\s*/i;
  const existingDropdownRegex = /<li class="nav-item dropdown lang-selector"[\s\S]*?<\/li>/i;

  if (gtRegex.test(navSection)) {
    navSection = navSection.replace(gtRegex, replacement + '\n');
  } else if (existingDropdownRegex.test(navSection)) {
    navSection = navSection.replace(existingDropdownRegex, replacement);
  }

  return content.substring(0, navStart) + navSection + content.substring(navEnd);
}

// Safely remove legacy site link from navbar only
function removeLegacySiteSafely(content) {
  const navStart = content.indexOf('<nav');
  const navEnd = content.indexOf('</nav>');
  if (navStart === -1 || navEnd === -1) return content;

  let navSection = content.substring(navStart, navEnd);
  const legacyRegex = /<li\s+class="nav-item"[^>]*>\s*<a\s+href="http:\/\/www\.5658v\.com\/hanpark"[^>]*>[\s\S]*?<\/li>\s*/i;
  
  if (legacyRegex.test(navSection)) {
    navSection = navSection.replace(legacyRegex, '');
  }

  return content.substring(0, navStart) + navSection + content.substring(navEnd);
}

// Safely remove Facebook link from navbar only (keep in footer)
function removeFacebookFromNavbarSafely(content) {
  const navStart = content.indexOf('<nav');
  const navEnd = content.indexOf('</nav>');
  if (navStart === -1 || navEnd === -1) return content;

  let navSection = content.substring(navStart, navEnd);
  const fbRegex = /<li\s+class="nav-item"[^>]*>\s*<a\s+href="https:\/\/www\.facebook\.com\/MeiNongVilla"[^>]*>[\s\S]*?<\/li>\s*/i;

  if (fbRegex.test(navSection)) {
    navSection = navSection.replace(fbRegex, '');
  }

  return content.substring(0, navStart) + navSection + content.substring(navEnd);
}

// Add legacy site link to footer
function addLegacySiteToFooter(content, lang = 'zh-tw') {
  const t = NAV_TRANSLATIONS[lang] || NAV_TRANSLATIONS['zh-tw'];
  const legacyLink = ` ｜ <a href="http://www.5658v.com/hanpark" target="_blank">${t.oldSite}</a>`;

  // First remove any previously added duplicate legacy link in footer
  content = content.replace(/\s*｜\s*<a href="http:\/\/www\.5658v\.com\/hanpark"[^>]*>.*?<\/a>/gi, '');

  // Locate the website credit in footer: <a href="https://dev.hanyuan.info"...>...</a>
  const devCreditRegex = /(<a\s+href="https:\/\/dev\.hanyuan\.info"[^>]*>.*?<\/a>)/i;
  if (devCreditRegex.test(content)) {
    content = content.replace(devCreditRegex, `$1${legacyLink}`);
  }
  return content;
}

function processRootHtml(filename) {
  const filePath = path.join(ROOT_DIR, filename);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace Google translate navbar item with dropdown
  const dropdownHtml = generateDropdownHtml('zh-tw', filename, false);
  content = replaceGoogleTranslateSafely(content, dropdownHtml);

  // 2. Safely remove legacy site from navbar
  content = removeLegacySiteSafely(content);

  // 3. Safely remove Facebook from navbar
  content = removeFacebookFromNavbarSafely(content);

  // 4. Add legacy site to footer
  content = addLegacySiteToFooter(content, 'zh-tw');

  // 5. Add css/i18n.css and hreflangs
  content = content.replace(/<!-- Alternate Language Hreflangs -->[\s\S]*?<link rel="stylesheet" href="[^"]*css\/i18n\.css">\n?/gi, '');
  if (content.includes('</head>')) {
    content = content.replace('</head>', `${generateHreflangTags(filename, false)}\n</head>`);
  }

  // 6. Add js/i18n.js before </body>
  content = content.replace(/<script src="[^"]*js\/i18n\.js"><\/script>\n?/gi, '');
  if (content.includes('</body>')) {
    content = content.replace('</body>', `    <script src="js/i18n.js"></script>\n</body>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return content;
}

// Apply per-language meta tag translations from the central dictionary.
// Rewrites <title>, <meta name="description|keywords">, <meta property="og:*">,
// <meta name="twitter:*"> when a translation entry exists for (filename, lang).
// Apply per-language body content translations from the shared dictionary.
// Performs exact-match replacement of Chinese strings (longest-first to avoid
// prefix collisions). Only replaces inside the rendered text nodes of the HTML
// — does not touch JSON-LD <script type="application/ld+json"> blocks, regular
// <script> or <style> blocks, or HTML comments. The replacement is wrapped in
// a tag boundary check so we only touch text between > and < (visible body copy).
function applyBodyTranslations(content, lang) {
  if (lang === 'zh-tw') return content;
  const dict = (BODY_TRANSLATIONS.shared && BODY_TRANSLATIONS.shared[lang]) || {};
  const entries = Object.entries(dict);
  if (entries.length === 0) return content;

  // Sort longest-first so longer phrases are matched before their substrings.
  entries.sort((a, b) => b[0].length - a[0].length);

  // Build a single regex that matches any Chinese key, but only when it sits
  // between > and < (i.e. inside a text node, not inside an attribute value or tag).
  // We do this in two passes: first mask out the protected regions (JSON-LD,
  // <script>, <style>, comments, attribute values), then run replacement, then
  // restore the masked regions.
  const placeholders = [];

  function mask(regex, label) {
    content = content.replace(regex, (m) => {
      const idx = placeholders.length;
      placeholders.push({ label, original: m });
      return `\x00MASK_${idx}\x00`;
    });
  }

  // Protect JSON-LD blocks first
  mask(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, 'jsonld');
  // Protect regular <script>
  mask(/<script\b[^>]*>[\s\S]*?<\/script>/gi, 'script');
  // Protect <style>
  mask(/<style\b[^>]*>[\s\S]*?<\/style>/gi, 'style');
  // Protect HTML comments
  mask(/<!--[\s\S]*?-->/g, 'comment');
  // Protect attribute values (anything between =" and ")
  mask(/=["'][^"']*["']/g, 'attr');

  // Now perform longest-first replacements within the (now protected) content.
  for (const [zh, translated] of entries) {
    if (!translated) continue;
    // Escape regex special chars in the Chinese key
    const escaped = zh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Replace globally. The pattern is the literal Chinese string.
    content = content.split(zh).join(translated);
  }

  // Restore masked regions
  placeholders.forEach((p, idx) => {
    content = content.replace(`\x00MASK_${idx}\x00`, p.original);
  });

  return content;
}

function applyMetaTranslations(content, lang, filename) {
  if (lang === 'zh-tw') return content;
  const entry = META_TRANSLATIONS[filename] && META_TRANSLATIONS[filename][lang];
  if (!entry) return content;

  // <title>
  if (entry.title) {
    content = content.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${entry.title}</title>`
    );
  }

  // <meta name="description" ...>
  if (entry.description) {
    content = content.replace(
      /<meta\s+name=["']description["'][^>]*content=["'][^"']*["'][^>]*>/i,
      (m) => m.replace(/content=["'][^"']*["']/i, `content="${entry.description}"`)
    );
  }

  // <meta name="keywords" ...>
  if (entry.keywords) {
    content = content.replace(
      /<meta\s+name=["']keywords["'][^>]*content=["'][^"']*["'][^>]*>/i,
      (m) => m.replace(/content=["'][^"']*["']/i, `content="${entry.keywords}"`)
    );
  }

  // <meta property="og:title">
  if (entry.ogTitle) {
    content = content.replace(
      /<meta\s+property=["']og:title["'][^>]*content=["'][^"']*["'][^>]*>/i,
      (m) => m.replace(/content=["'][^"']*["']/i, `content="${entry.ogTitle}"`)
    );
  }

  // <meta property="og:description">
  if (entry.ogDescription) {
    content = content.replace(
      /<meta\s+property=["']og:description["'][^>]*content=["'][^"']*["'][^>]*>/i,
      (m) => m.replace(/content=["'][^"']*["']/i, `content="${entry.ogDescription}"`)
    );
  }

  // <meta property="og:image:alt">
  if (entry.ogImageAlt) {
    content = content.replace(
      /<meta\s+property=["']og:image:alt["'][^>]*content=["'][^"']*["'][^>]*>/i,
      (m) => m.replace(/content=["'][^"']*["']/i, `content="${entry.ogImageAlt}"`)
    );
  }

  // <meta name="twitter:title">
  if (entry.twitterTitle) {
    content = content.replace(
      /<meta\s+name=["']twitter:title["'][^>]*content=["'][^"']*["'][^>]*>/i,
      (m) => m.replace(/content=["'][^"']*["']/i, `content="${entry.twitterTitle}"`)
    );
  }

  // <meta name="twitter:description">
  if (entry.twitterDescription) {
    content = content.replace(
      /<meta\s+name=["']twitter:description["'][^>]*content=["'][^"']*["'][^>]*>/i,
      (m) => m.replace(/content=["'][^"']*["']/i, `content="${entry.twitterDescription}"`)
    );
  }

  // <meta name="twitter:image:alt">
  if (entry.twitterImageAlt) {
    content = content.replace(
      /<meta\s+name=["']twitter:image:alt["'][^>]*content=["'][^"']*["'][^>]*>/i,
      (m) => m.replace(/content=["'][^"']*["']/i, `content="${entry.twitterImageAlt}"`)
    );
  }

  return content;
}

function convertToLangHtml(rootContent, lang, filename) {
  let content = rootContent;

  // 0. Apply SEO meta tag translations first so subsequent rewrites (canonical, hreflang) operate on the translated content
  content = applyMetaTranslations(content, lang, filename);

  // 0b. Apply body content translations (shared UI strings, buttons, etc.)
  // Done early so the rest of the pipeline operates on already-translated text.
  content = applyBodyTranslations(content, lang);

  // 1. Update <html lang="...">
  const langAttrMap = {
    'zh-tw': 'zh-TW',
    'en': 'en',
    'vi': 'vi',
    'fil': 'fil',
    'pt': 'pt'
  };
  content = content.replace(/<html(?:\s+lang="[^"]*")?/i, `<html lang="${langAttrMap[lang]}"`);

  // 2. Adjust Canonical URL
  content = content.replace(/<link rel="canonical" href="https:\/\/hanyuan\.info\/[^"]*"/g, () => {
    return `<link rel="canonical" href="https://hanyuan.info/lang/${lang}/${filename}"`;
  });

  // 3. Update Dropdown in navbar
  const dropdownHtml = generateDropdownHtml(lang, filename, true);
  const dropdownStart = content.indexOf('<li class="nav-item dropdown lang-selector"');
  if (dropdownStart !== -1) {
    const dropdownEnd = content.indexOf('</li>', dropdownStart);
    if (dropdownEnd !== -1) {
      content = content.substring(0, dropdownStart) + dropdownHtml + content.substring(dropdownEnd + '</li>'.length);
    }
  }

  // 4. Update Navbar Labels if non-Chinese
  if (lang !== 'zh-tw') {
    const t = NAV_TRANSLATIONS[lang];
    content = content.replace(/(<a href="room_all\.html"[^>]*><span>)[^<]*(<\/span><\/a>)/g, `$1${t.rooms}$2`);
    content = content.replace(/(<a href="meal\.html"[^>]*><span>)[^<]*(<\/span><\/a>)/g, `$1${t.meal}$2`);
    content = content.replace(/(<a href="garden\.html"[^>]*><span>)[^<]*(<\/span><\/a>)/g, `$1${t.garden}$2`);
    content = content.replace(/(<a href="destination\.html"[^>]*><span>)[^<]*(<\/span><\/a>)/g, `$1${t.destination}$2`);
    content = content.replace(/(<a href="map\.html"[^>]*><span>)[^<]*(<\/span><\/a>)/g, `$1${t.map}$2`);
    content = content.replace(/(<a href="order\.html"[^>]*><span[^>]*>)[^<]*(<\/span><\/a>)/g, `$1${t.bookOnline}$2`);
  }

  // 5. Update footer legacy link translation for the language
  content = addLegacySiteToFooter(content, lang);

  // 6. Convert Asset paths to relative paths (../../)
  content = content.replace(/(href=["'])(?!\.\.\/|https?:\/\/|\/\/)(css\/)/g, '$1../../$2');
  content = content.replace(/(src=["'])(?!\.\.\/|https?:\/\/|\/\/)(js\/)/g, '$1../../$2');
  content = content.replace(/(src=["'])(?!\.\.\/|https?:\/\/|\/\/)(images\/)/g, '$1../../$2');
  content = content.replace(/(href=["'])(?!\.\.\/|https?:\/\/|\/\/)(images\/)/g, '$1../../$2');
  content = content.replace(/(href=["'])(?!\.\.\/|https?:\/\/|\/\/)(fonts\/)/g, '$1../../$2');

  // Replace background-image inline styles
  content = content.replace(/url\(\s*(['"]?)(?!https?:\/\/|\/\/|\.\.\/)(images\/[^)'"]+)\1\s*\)/g, 'url($1../../$2$1)');

  // Fix hreflang i18n.css and js/i18n.js
  content = content.replace(/(href=["'])(?!\.\.\/|https?:\/\/|\/\/)(css\/i18n\.css["'])/g, '$1../../$2');
  content = content.replace(/(src=["'])(?!\.\.\/|https?:\/\/|\/\/)(js\/i18n\.js["'])/g, '$1../../$2');

  // 7. Handle special order.html content
  if (filename === 'order.html' && lang !== 'zh-tw') {
    if (lang === 'en') {
      content = content.replace('<h1>線上訂房</h1>', '<h1>Online Booking</h1>');
      content = content.replace('正在前往美濃涵園民宿的 Owlting 奧丁丁安心訂房平台。', 'Redirecting to Owlting Booking Platform for Hanyuan B&B...');
      content = content.replace('若未自動跳轉，請點此繼續訂房', 'Click here if not redirected automatically');
    } else if (lang === 'vi') {
      content = content.replace('<h1>線上訂房</h1>', '<h1>Đặt phòng trực tuyến</h1>');
      content = content.replace('正在前往美濃涵園民宿的 Owlting 奧丁丁安心訂房平台。', 'Đang chuyển tiếp tới nền tảng đặt phòng Owlting cho Hanyuan B&B...');
      content = content.replace('若未自動跳轉，請點此繼續訂房', 'Nhấp vào đây nếu không tự動 chuyển hướng');
    } else if (lang === 'fil') {
      content = content.replace('<h1>線上訂房</h1>', '<h1>Online Booking</h1>');
      content = content.replace('正在前往美濃涵園民宿的 Owlting 奧丁丁安心訂房平台。', 'Pumupunta sa Owlting Booking Platform para sa Hanyuan B&B...');
      content = content.replace('若未自動跳轉，請點此繼續訂房', 'Mag-click dito kung hindi awtomatikong mag-redirect');
    } else if (lang === 'pt') {
      content = content.replace('<h1>線上訂房</h1>', '<h1>Reservar Online</h1>');
      content = content.replace('正在前往美濃涵園民宿的 Owlting 奧丁丁安心訂房平台。', 'Redirecionando para a plataforma de reservas Owlting da Hanyuan B&B...');
      content = content.replace('若未自動跳轉，請點此繼續訂房', 'Clique aqui se não for redirecionado automaticamente');
    }
  }

  return content;
}

function run() {
  console.log('=== Starting Full i18n Site Build (Navbar & Footer Clean) ===');

  const langBaseDir = path.join(ROOT_DIR, 'lang');
  if (!fs.existsSync(langBaseDir)) {
    fs.mkdirSync(langBaseDir);
  }

  const allTargetLangs = ['zh-tw', 'en', 'vi', 'fil', 'pt'];
  allTargetLangs.forEach(lang => {
    const dir = path.join(langBaseDir, lang);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  let processedCount = 0;

  HTML_FILES.forEach(filename => {
    // 1. Process root HTML file
    const rootProcessed = processRootHtml(filename);

    // 2. Generate for all target langs (zh-tw, en, vi, fil, pt)
    LANGS.forEach(lang => {
      const targetFilePath = path.join(langBaseDir, lang, filename);
      const langContent = convertToLangHtml(rootProcessed, lang, filename);
      fs.writeFileSync(targetFilePath, langContent, 'utf8');
    });

    processedCount++;
  });

  console.log(`=== Successfully processed ${processedCount} root HTML files ===`);
  console.log(`=== Created ${processedCount * allTargetLangs.length} localized HTML files across ${allTargetLangs.join(', ')} ===`);
}

run();
