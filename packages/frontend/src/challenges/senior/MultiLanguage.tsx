import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n/config';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'he', name: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
];

export default function MultiLanguage() {
  const { t, i18n } = useTranslation();
  const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    document.documentElement.dir = currentLang.dir;
    document.documentElement.lang = currentLang.code;
  }, [currentLang]);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  // Format numbers based on locale
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(i18n.language).format(num);
  };

  // Format currency based on locale
  const formatCurrency = (amount: number) => {
    const currencyMap: Record<string, string> = {
      en: 'USD',
      es: 'EUR',
      fr: 'EUR',
      ar: 'SAR',
      he: 'ILS',
      zh: 'CNY',
    };
    const currency = currencyMap[i18n.language] || 'USD';
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Format date based on locale
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Format time based on locale
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const currentDate = new Date();

  return (
    <div className="min-h-screen bg-gray-900 p-8" dir={currentLang.dir}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2" data-testid="page-title">
            {t('header.title')}
          </h1>
          <p className="text-gray-400" data-testid="page-subtitle">
            {t('header.subtitle')}
          </p>
        </div>

        {/* Language Selector */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            {t('language.label')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                data-testid={`lang-${lang.code}`}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
                  i18n.language === lang.code
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-indigo-500'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4" data-testid="welcome-message">
            {t('content.welcome')}
          </h2>
          <p className="text-gray-300 mb-4" data-testid="description">
            {t('content.description')}
          </p>

          <h3 className="text-xl font-semibold text-white mb-3">{t('content.features')}</h3>
          <ul className="space-y-2 text-gray-300" data-testid="features-list">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>{t('content.feature1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>{t('content.feature2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>{t('content.feature3')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>{t('content.feature4')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>{t('content.feature5')}</span>
            </li>
          </ul>
        </div>

        {/* Date/Number/Currency Formatting Demo */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Localization Demo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">{t('demo.dateLabel')}</p>
              <p className="text-white font-semibold" data-testid="formatted-date">
                {formatDate(currentDate)}
              </p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">{t('demo.timeLabel')}</p>
              <p className="text-white font-semibold" data-testid="formatted-time">
                {formatTime(currentDate)}
              </p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">{t('demo.numberLabel')}</p>
              <p className="text-white font-semibold" data-testid="formatted-number">
                {formatNumber(1234567.89)}
              </p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm mb-1">{t('demo.currencyLabel')}</p>
              <p className="text-white font-semibold" data-testid="formatted-currency">
                {formatCurrency(1299.99)}
              </p>
            </div>
          </div>
        </div>

        {/* Sample Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">{t('form.title')}</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('form.nameLabel')}
              </label>
              <input
                type="text"
                placeholder={t('form.namePlaceholder')}
                data-testid="name-input"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('form.emailLabel')}
              </label>
              <input
                type="email"
                placeholder={t('form.emailPlaceholder')}
                data-testid="email-input"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('form.countryLabel')}
              </label>
              <select
                data-testid="country-select"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">{t('form.countryPlaceholder')}</option>
                <option value="us">United States</option>
                <option value="es">Spain</option>
                <option value="fr">France</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('form.messageLabel')}
              </label>
              <textarea
                rows={4}
                placeholder={t('form.messagePlaceholder')}
                data-testid="message-textarea"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                data-testid="submit-button"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
              >
                {t('form.submitButton')}
              </button>
              <button
                type="button"
                data-testid="cancel-button"
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition"
              >
                {t('form.cancelButton')}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">{t('footer.direction')}: </span>
              <span className="text-white font-semibold" data-testid="text-direction">
                {currentLang.dir.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">{t('footer.locale')}: </span>
              <span className="text-white font-semibold" data-testid="current-locale">
                {i18n.language}
              </span>
            </div>
          </div>
        </div>

        {/* Testing Hints */}
        <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-600 rounded">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Switch languages using lang-[code] buttons (lang-en, lang-es, etc.)</li>
            <li>• Verify text content changes with translated values</li>
            <li>• Test RTL layout for Arabic (lang-ar) and Hebrew (lang-he)</li>
            <li>• Check date/number/currency formatting changes per locale</li>
            <li>• Verify language persistence across page reloads</li>
            <li>• Inspect document.documentElement.dir attribute for RTL</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

