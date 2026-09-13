const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LANG_DIR = path.join(ROOT_DIR, 'lang');
const EXPECTED_LANGS = ['zh-tw', 'en', 'vi', 'fil', 'pt'];

const ROOT_HTMLS = fs.readdirSync(ROOT_DIR)
  .filter(f => f.endsWith('.html') && fs.statSync(path.join(ROOT_DIR, f)).isFile());

console.log('==============================================');
console.log(`Starting Validation for ${ROOT_HTMLS.length} pages...`);
console.log('==============================================');

let totalErrors = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`❌ [FAIL] ${message}`);
    totalErrors++;
  }
}

// Check 1: Verify directories exist and contain exact file count
EXPECTED_LANGS.forEach(lang => {
  const targetDir = path.join(LANG_DIR, lang);
  assert(fs.existsSync(targetDir), `Directory exists: ${targetDir}`);
  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.html'));
    assert(files.length === ROOT_HTMLS.length, `Directory ${lang} contains ${files.length}/${ROOT_HTMLS.length} HTML files`);
  }
});

// Check 2: Verify Root HTMLs
ROOT_HTMLS.forEach(file => {
  const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf8');

  // No Google Translate
  assert(!content.includes('translate.google.com'), `[Root] ${file} has no Google Translate links`);

  // Order page is a redirect page, others must have dropdown
  if (file !== 'order.html') {
    assert(content.includes('class="nav-item dropdown lang-selector"'), `[Root] ${file} has lang-selector dropdown`);
  }

  // Must have i18n.css and i18n.js
  assert(content.includes('css/i18n.css'), `[Root] ${file} includes css/i18n.css`);
  assert(content.includes('js/i18n.js'), `[Root] ${file} includes js/i18n.js`);
});

// Check 3: Verify lang/* HTMLs and relative path assets
EXPECTED_LANGS.forEach(lang => {
  ROOT_HTMLS.forEach(file => {
    const filePath = path.join(LANG_DIR, lang, file);
    if (!fs.existsSync(filePath)) {
      assert(false, `File exists: ${filePath}`);
      return;
    }
    const content = fs.readFileSync(filePath, 'utf8');

    // No Google Translate
    assert(!content.includes('translate.google.com'), `[${lang}] ${file} has no Google Translate links`);

    // Dropdown check
    if (file !== 'order.html') {
      assert(content.includes('class="nav-item dropdown lang-selector"'), `[${lang}] ${file} has lang-selector dropdown`);
    }

    // Must reference ../../css/i18n.css and ../../js/i18n.js
    assert(content.includes('../../css/i18n.css'), `[${lang}] ${file} includes ../../css/i18n.css`);
    assert(content.includes('../../js/i18n.js'), `[${lang}] ${file} includes ../../js/i18n.js`);

    // Scan for broken local asset references: href="css/...", src="js/...", src="images/..."
    // In subdirectories, local paths must NOT start with bare "css/", "js/", "images/", "fonts/"
    const bareCss = content.match(/href=["']css\//g);
    assert(!bareCss, `[${lang}] ${file} has no unescaped bare css/ paths`);

    const bareJs = content.match(/src=["']js\//g);
    assert(!bareJs, `[${lang}] ${file} has no unescaped bare js/ paths`);

    const bareImages = content.match(/(?:src|href)=["']images\//g);
    assert(!bareImages, `[${lang}] ${file} has no unescaped bare images/ paths`);

    // Extract all relative assets starting with ../../ and verify they actually exist on disk!
    const assetRegex = /(?:href|src)=["'](\.\.\/\.\.\/[^"']+)["']/g;
    let match;
    while ((match = assetRegex.exec(content)) !== null) {
      const relativeRef = match[1].split('?')[0].split('#')[0];
      const resolvedPath = path.resolve(path.dirname(filePath), relativeRef);
      assert(fs.existsSync(resolvedPath), `Asset exists on disk: ${relativeRef} (in ${lang}/${file})`);
    }
  });
});

console.log('==============================================');
console.log(`Validation Complete: ${totalChecks} checks run.`);
if (totalErrors === 0) {
  console.log('✅ ALL CHECKS PASSED WITH ZERO ERRORS!');
} else {
  console.error(`❌ FOUND ${totalErrors} ERRORS!`);
  process.exit(1);
}
