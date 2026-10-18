/**
 * Beyond X — SITE BEHAVIOUR
 * -------------------------
 * Usually you do not need to edit this file.
 * Update services, translations and contact settings in site-data.js.
 */
(() => {
  'use strict';

  const data = window.BEYONDX_DATA;
  if (!data) {
    console.error('Beyond X site data not loaded.');
    return;
  }

  const el = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const renderCards = (containerId, items, language, cardType) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const translated = item[language] || item.nl;
      const article = el('article', `info-card ${cardType}`);
      article.appendChild(el('span', 'card-number', String(index + 1).padStart(2, '0')));
      article.appendChild(el('h3', '', translated.title));
      article.appendChild(el('p', '', translated.description));
      fragment.appendChild(article);
    });

    container.replaceChildren(fragment);
  };

  const renderFoundation = (language) => {
    const container = document.getElementById('foundation-tags');
    if (!container) return;
    const tags = data.foundation[language] || data.foundation.nl;
    container.replaceChildren(...tags.map(label => el('span', 'foundation-tag', label)));
  };

  const setLanguage = (language) => {
    const lang = data.text[language] ? language : 'nl';
    const translation = data.text[lang];

    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      if (translation[key] !== undefined) element.textContent = translation[key];
    });

    renderCards('services-grid', data.services, lang, 'service-card');
    renderCards('partnership-grid', data.partnerships, lang, 'partner-card');
    renderFoundation(lang);

    document.title = translation.pageTitle;
    document.getElementById('meta-description').content = translation.pageDescription;
    document.getElementById('lang-nl').setAttribute('aria-pressed', String(lang === 'nl'));
    document.getElementById('lang-en').setAttribute('aria-pressed', String(lang === 'en'));
    document.getElementById('lang-nl').classList.toggle('is-active', lang === 'nl');
    document.getElementById('lang-en').classList.toggle('is-active', lang === 'en');

    try { window.localStorage.setItem('beyondx-language', lang); } catch (_) { /* optional */ }
  };

  const activateContact = () => {
    const { contactEmail, emailEnabled } = data.settings;
    const general = document.getElementById('contact-general-email');
    const partner = document.getElementById('contact-partner-email');
    if (general) general.textContent = contactEmail || '';
    if (partner) partner.textContent = data.settings.partnerEmail || '';
    if (!emailEnabled || !contactEmail) return;

    const link = document.getElementById('contact-link');
    const status = document.getElementById('contact-status');
    link.href = `mailto:${contactEmail}?subject=${encodeURIComponent('Beyond X — Partnership inquiry')}`;
    link.classList.remove('is-hidden');
    status.textContent = data.text[document.documentElement.lang]?.contactPending || '';
  };

  document.getElementById('lang-nl').addEventListener('click', () => setLanguage('nl'));
  document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
  document.getElementById('year').textContent = String(new Date().getFullYear());
  activateContact();

  let preferred = data.settings.defaultLanguage || 'nl';
  try { preferred = window.localStorage.getItem('beyondx-language') || preferred; } catch (_) { /* optional */ }
  setLanguage(preferred);
})();
