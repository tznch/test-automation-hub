import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      header: {
        title: 'Multi-Language Support',
        subtitle: 'Internationalization (i18n) Demo',
      },
      language: {
        label: 'Select Language',
        english: 'English',
        spanish: 'Spanish',
        french: 'French',
        arabic: 'Arabic',
        hebrew: 'Hebrew',
        chinese: 'Chinese',
      },
      content: {
        welcome: 'Welcome to our platform!',
        description:
          'This page demonstrates internationalization with support for multiple languages and text directions.',
        features: 'Features',
        feature1: 'Dynamic language switching',
        feature2: 'Right-to-left (RTL) layout support',
        feature3: 'Date and number formatting',
        feature4: 'Currency localization',
        feature5: 'Persistent language preference',
      },
      demo: {
        dateLabel: 'Current Date',
        numberLabel: 'Large Number',
        currencyLabel: 'Price',
        timeLabel: 'Current Time',
      },
      form: {
        title: 'Sample Form',
        nameLabel: 'Full Name',
        namePlaceholder: 'Enter your full name',
        emailLabel: 'Email Address',
        emailPlaceholder: 'your.email@example.com',
        countryLabel: 'Country',
        countryPlaceholder: 'Select your country',
        messageLabel: 'Message',
        messagePlaceholder: 'Enter your message here...',
        submitButton: 'Submit Form',
        cancelButton: 'Cancel',
      },
      footer: {
        direction: 'Text Direction',
        locale: 'Current Locale',
      },
    },
  },
  es: {
    translation: {
      header: {
        title: 'Soporte Multi-idioma',
        subtitle: 'Demo de Internacionalización (i18n)',
      },
      language: {
        label: 'Seleccionar Idioma',
        english: 'Inglés',
        spanish: 'Español',
        french: 'Francés',
        arabic: 'Árabe',
        hebrew: 'Hebreo',
        chinese: 'Chino',
      },
      content: {
        welcome: '¡Bienvenido a nuestra plataforma!',
        description:
          'Esta página demuestra la internacionalización con soporte para múltiples idiomas y direcciones de texto.',
        features: 'Características',
        feature1: 'Cambio dinámico de idioma',
        feature2: 'Soporte de diseño de derecha a izquierda (RTL)',
        feature3: 'Formato de fecha y número',
        feature4: 'Localización de moneda',
        feature5: 'Preferencia de idioma persistente',
      },
      demo: {
        dateLabel: 'Fecha Actual',
        numberLabel: 'Número Grande',
        currencyLabel: 'Precio',
        timeLabel: 'Hora Actual',
      },
      form: {
        title: 'Formulario de Ejemplo',
        nameLabel: 'Nombre Completo',
        namePlaceholder: 'Ingrese su nombre completo',
        emailLabel: 'Correo Electrónico',
        emailPlaceholder: 'su.correo@ejemplo.com',
        countryLabel: 'País',
        countryPlaceholder: 'Seleccione su país',
        messageLabel: 'Mensaje',
        messagePlaceholder: 'Ingrese su mensaje aquí...',
        submitButton: 'Enviar Formulario',
        cancelButton: 'Cancelar',
      },
      footer: {
        direction: 'Dirección del Texto',
        locale: 'Configuración Regional Actual',
      },
    },
  },
  fr: {
    translation: {
      header: {
        title: 'Support Multi-langue',
        subtitle: 'Démo d\'Internationalisation (i18n)',
      },
      language: {
        label: 'Sélectionner la Langue',
        english: 'Anglais',
        spanish: 'Espagnol',
        french: 'Français',
        arabic: 'Arabe',
        hebrew: 'Hébreu',
        chinese: 'Chinois',
      },
      content: {
        welcome: 'Bienvenue sur notre plateforme!',
        description:
          'Cette page démontre l\'internationalisation avec prise en charge de plusieurs langues et directions de texte.',
        features: 'Caractéristiques',
        feature1: 'Changement de langue dynamique',
        feature2: 'Support de mise en page de droite à gauche (RTL)',
        feature3: 'Format de date et de nombre',
        feature4: 'Localisation de la devise',
        feature5: 'Préférence de langue persistante',
      },
      demo: {
        dateLabel: 'Date Actuelle',
        numberLabel: 'Grand Nombre',
        currencyLabel: 'Prix',
        timeLabel: 'Heure Actuelle',
      },
      form: {
        title: 'Formulaire d\'Exemple',
        nameLabel: 'Nom Complet',
        namePlaceholder: 'Entrez votre nom complet',
        emailLabel: 'Adresse E-mail',
        emailPlaceholder: 'votre.email@exemple.com',
        countryLabel: 'Pays',
        countryPlaceholder: 'Sélectionnez votre pays',
        messageLabel: 'Message',
        messagePlaceholder: 'Entrez votre message ici...',
        submitButton: 'Soumettre le Formulaire',
        cancelButton: 'Annuler',
      },
      footer: {
        direction: 'Direction du Texte',
        locale: 'Paramètres Régionaux Actuels',
      },
    },
  },
  ar: {
    translation: {
      header: {
        title: 'دعم متعدد اللغات',
        subtitle: 'عرض توضيحي للتدويل (i18n)',
      },
      language: {
        label: 'اختر اللغة',
        english: 'الإنجليزية',
        spanish: 'الإسبانية',
        french: 'الفرنسية',
        arabic: 'العربية',
        hebrew: 'العبرية',
        chinese: 'الصينية',
      },
      content: {
        welcome: 'مرحباً بك في منصتنا!',
        description:
          'توضح هذه الصفحة التدويل مع دعم لغات متعددة واتجاهات النص.',
        features: 'الميزات',
        feature1: 'تبديل اللغة الديناميكي',
        feature2: 'دعم تخطيط من اليمين إلى اليسار (RTL)',
        feature3: 'تنسيق التاريخ والأرقام',
        feature4: 'توطين العملة',
        feature5: 'تفضيل اللغة المستمر',
      },
      demo: {
        dateLabel: 'التاريخ الحالي',
        numberLabel: 'رقم كبير',
        currencyLabel: 'السعر',
        timeLabel: 'الوقت الحالي',
      },
      form: {
        title: 'نموذج مثال',
        nameLabel: 'الاسم الكامل',
        namePlaceholder: 'أدخل اسمك الكامل',
        emailLabel: 'عنوان البريد الإلكتروني',
        emailPlaceholder: 'بريدك.الالكتروني@مثال.com',
        countryLabel: 'البلد',
        countryPlaceholder: 'اختر بلدك',
        messageLabel: 'الرسالة',
        messagePlaceholder: 'أدخل رسالتك هنا...',
        submitButton: 'إرسال النموذج',
        cancelButton: 'إلغاء',
      },
      footer: {
        direction: 'اتجاه النص',
        locale: 'الإعدادات المحلية الحالية',
      },
    },
  },
  he: {
    translation: {
      header: {
        title: 'תמיכה רב-לשונית',
        subtitle: 'הדגמת בינאום (i18n)',
      },
      language: {
        label: 'בחר שפה',
        english: 'אנגלית',
        spanish: 'ספרדית',
        french: 'צרפתית',
        arabic: 'ערבית',
        hebrew: 'עברית',
        chinese: 'סינית',
      },
      content: {
        welcome: 'ברוך הבא לפלטפורמה שלנו!',
        description:
          'דף זה מדגים בינאום עם תמיכה במספר שפות וכיווני טקסט.',
        features: 'תכונות',
        feature1: 'החלפת שפה דינמית',
        feature2: 'תמיכה בפריסה מימין לשמאל (RTL)',
        feature3: 'עיצוב תאריך ומספרים',
        feature4: 'לוקליזציה של מטבע',
        feature5: 'העדפת שפה מתמשכת',
      },
      demo: {
        dateLabel: 'תאריך נוכחי',
        numberLabel: 'מספר גדול',
        currencyLabel: 'מחיר',
        timeLabel: 'שעה נוכחית',
      },
      form: {
        title: 'טופס לדוגמה',
        nameLabel: 'שם מלא',
        namePlaceholder: 'הזן את שמך המלא',
        emailLabel: 'כתובת דוא"ל',
        emailPlaceholder: 'הדוא"ל.שלך@דוגמה.com',
        countryLabel: 'מדינה',
        countryPlaceholder: 'בחר את מדינתך',
        messageLabel: 'הודעה',
        messagePlaceholder: 'הזן את הודעתך כאן...',
        submitButton: 'שלח טופס',
        cancelButton: 'ביטול',
      },
      footer: {
        direction: 'כיוון טקסט',
        locale: 'הגדרות אזוריות נוכחיות',
      },
    },
  },
  zh: {
    translation: {
      header: {
        title: '多语言支持',
        subtitle: '国际化 (i18n) 演示',
      },
      language: {
        label: '选择语言',
        english: '英语',
        spanish: '西班牙语',
        french: '法语',
        arabic: '阿拉伯语',
        hebrew: '希伯来语',
        chinese: '中文',
      },
      content: {
        welcome: '欢迎来到我们的平台！',
        description:
          '此页面演示了国际化，支持多种语言和文本方向。',
        features: '特性',
        feature1: '动态语言切换',
        feature2: '从右到左 (RTL) 布局支持',
        feature3: '日期和数字格式',
        feature4: '货币本地化',
        feature5: '持久语言偏好',
      },
      demo: {
        dateLabel: '当前日期',
        numberLabel: '大数字',
        currencyLabel: '价格',
        timeLabel: '当前时间',
      },
      form: {
        title: '示例表单',
        nameLabel: '全名',
        namePlaceholder: '输入您的全名',
        emailLabel: '电子邮件地址',
        emailPlaceholder: '您的.邮箱@示例.com',
        countryLabel: '国家',
        countryPlaceholder: '选择您的国家',
        messageLabel: '消息',
        messagePlaceholder: '在此输入您的消息...',
        submitButton: '提交表单',
        cancelButton: '取消',
      },
      footer: {
        direction: '文本方向',
        locale: '当前区域设置',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
