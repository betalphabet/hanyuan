/**
 * Hanyuan B&B Multi-language (i18n) Engine & Browser Detection
 * Supports: zh-tw (default), en, vi, fil
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'hanyuan_user_lang';
  var SESSION_KEY = 'hanyuan_lang_redirected';
  var SUPPORTED_LANGS = ['zh-tw', 'en', 'vi', 'fil'];
  var DEFAULT_LANG = 'zh-tw';

  /**
   * Determine the current page language based on URL path or html lang attribute
   */
  function getCurrentLang() {
    var pathname = window.location.pathname;
    var match = pathname.match(/\/lang\/([a-zA-Z0-9_-]+)\//);
    if (match && SUPPORTED_LANGS.indexOf(match[1].toLowerCase()) !== -1) {
      return match[1].toLowerCase();
    }
    var htmlLang = document.documentElement.lang;
    if (htmlLang) {
      var lower = htmlLang.toLowerCase();
      if (lower.indexOf('en') === 0) return 'en';
      if (lower.indexOf('vi') === 0) return 'vi';
      if (lower.indexOf('fil') === 0 || lower.indexOf('tl') === 0) return 'fil';
      if (lower.indexOf('zh') === 0) return 'zh-tw';
    }
    return DEFAULT_LANG;
  }

  /**
   * Detect visitor browser preferred language
   */
  function detectBrowserLanguage() {
    var navLanguages = window.navigator.languages || [
      window.navigator.language ||
      window.navigator.userLanguage ||
      ''
    ];

    for (var i = 0; i < navLanguages.length; i++) {
      var lang = (navLanguages[i] || '').toLowerCase();
      if (lang.indexOf('vi') === 0) return 'vi';
      if (lang.indexOf('fil') === 0 || lang.indexOf('tl') === 0) return 'fil';
      if (lang.indexOf('en') === 0) return 'en';
      if (lang.indexOf('zh') === 0) return 'zh-tw';
    }
    return DEFAULT_LANG;
  }

  /**
   * Calculate destination URL for a given target language from current location
   */
  function getTargetUrl(targetLang) {
    var pathname = window.location.pathname;
    var filename = pathname.substring(pathname.lastIndexOf('/') + 1) || 'index.html';
    var currentLang = getCurrentLang();

    if (currentLang === targetLang) {
      return null;
    }

    // From root to /lang/{targetLang}/
    if (currentLang === 'zh-tw' && pathname.indexOf('/lang/') === -1) {
      if (targetLang === 'zh-tw') return filename;
      return 'lang/' + targetLang + '/' + filename;
    }

    // Inside /lang/{currentLang}/
    if (targetLang === 'zh-tw') {
      return '../../' + filename;
    }
    return '../' + targetLang + '/' + filename;
  }

  /**
   * Check and execute auto-redirection on first visit
   */
  function checkAutoRedirect() {
    var hasRedirected = sessionStorage.getItem(SESSION_KEY);
    if (hasRedirected) {
      return;
    }

    var savedLang = localStorage.getItem(STORAGE_KEY);
    var currentLang = getCurrentLang();
    var pathname = window.location.pathname;
    var isHome = pathname.endsWith('/') || pathname.endsWith('/index.html') || pathname.indexOf('.html') === -1;

    // Only trigger auto-redirect at entry/home or root to prevent interrupting deep links
    if (!isHome && pathname.indexOf('/lang/') !== -1) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      return;
    }

    var targetLang = savedLang;
    if (!targetLang) {
      var detected = detectBrowserLanguage();
      if (detected !== DEFAULT_LANG) {
        targetLang = detected;
      }
    }

    if (targetLang && targetLang !== currentLang && SUPPORTED_LANGS.indexOf(targetLang) !== -1) {
      var nextUrl = getTargetUrl(targetLang);
      if (nextUrl) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        window.location.replace(nextUrl);
      }
    } else {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
  }

  /**
   * Bind event listeners for dropdown language selector
   */
  function setupLanguageSelector() {
    var selectorLinks = document.querySelectorAll('.lang-selector .dropdown-item[data-lang]');
    selectorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var chosenLang = this.getAttribute('data-lang');
        if (chosenLang && SUPPORTED_LANGS.indexOf(chosenLang) !== -1) {
          localStorage.setItem(STORAGE_KEY, chosenLang);
          sessionStorage.setItem(SESSION_KEY, 'true');
        }
      });
    });

    // Robust toggle for desktop click and mobile/touch devices
    var dropdownToggles = document.querySelectorAll('.lang-selector .dropdown-toggle');
    dropdownToggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var langItem = this.closest('.lang-selector');
        var menu = this.nextElementSibling;
        if (menu && menu.classList.contains('dropdown-menu')) {
          var isCurrentlyOpen = menu.classList.contains('show') || (langItem && langItem.classList.contains('show'));
          if (isCurrentlyOpen) {
            menu.classList.remove('show');
            if (langItem) langItem.classList.remove('show');
            this.setAttribute('aria-expanded', 'false');
          } else {
            menu.classList.add('show');
            if (langItem) langItem.classList.add('show');
            this.setAttribute('aria-expanded', 'true');
          }
        }
      });
    });

    // Close menu when clicked outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.lang-selector')) {
        document.querySelectorAll('.lang-selector').forEach(function (el) {
          el.classList.remove('show');
          var toggle = el.querySelector('.dropdown-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.lang-selector .dropdown-menu.show').forEach(function (menu) {
          menu.classList.remove('show');
        });
      }
    });

    // Safely clean up data-spy="scroll" on body if present to prevent Bootstrap SyntaxError on relative URLs
    var body = document.body;
    if (body && body.getAttribute('data-spy') === 'scroll') {
      body.removeAttribute('data-spy');
    }
  }

  // Run auto redirect immediately before page render if applicable
  checkAutoRedirect();

  // Setup DOM interactions after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLanguageSelector);
  } else {
    setupLanguageSelector();
  }
})();
