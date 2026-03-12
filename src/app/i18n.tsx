import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "ar";

const STORAGE_KEY = "nass-language";

const COPY = {
  en: {
    shell: {
      language: "Language",
      nav: {
        home: "Homepage",
        project1: "Project One",
        project2: "Project Two",
        project3: "Project Three",
        project4: "Project Four",
        about: "About",
        gallery: "Gallery",
        contact: "Contact Us",
      },
    },
    hero: {
      eyebrow: "Nour Land Development",
      title: ["Ground Up.", "Future", "Forward."],
      explore: "Explore Projects",
      story: "Our Story",
      stats: [
        { num: "340+", label: "Hectares Developed" },
        { num: "82", label: "Projects Completed" },
        { num: "15", label: "Years Active" },
        { num: "200+", label: "Clients Served" },
      ],
    },
    projects: {
      label: "Projects",
      heading: "Selected Projects.",
      viewAll: "View All Projects",
      statuses: {
        active: "Active",
        completed: "Completed",
      },
      types: {
        residential: "Residential",
        mixedUse: "Mixed-Use",
        luxuryResidential: "Luxury Residential",
        commercial: "Commercial",
      },
    },
    about: {
      label: "About",
      heading: "Who We Are.",
      body1:
        "Founded in 2009, Nour Land Development operates at the intersection of bold vision and precise execution. From greenfield sites to complex urban infill, we plan, develop, and deliver land projects that outlast trends and transform communities.",
      body2:
        "Our multidisciplinary team brings together environmental engineers, urban planners, architects, and community strategists under one roof, working toward one goal: land that works harder.",
      stats: [
        { num: "340+", desc: "Hectares Developed" },
        { num: "82", desc: "Projects Completed" },
        { num: "JD 4.2B", desc: "Total Value Unlocked" },
        { num: "97%", desc: "Client Retention" },
      ],
    },
    gallery: {
      label: "Gallery",
      heading: "Site Gallery.",
      images: "Images",
    },
    reviews: {
      label: "Testimonials",
      heading: "Client Testimonials.",
      items: [
        {
          quote:
            "Nour transformed a difficult greenfield site into a landmark mixed-use precinct. Their attention to environmental constraints and community integration was exceptional.",
          author: "James Oberholzer",
          role: "Director — Apex Property Group",
        },
        {
          quote:
            "From site acquisition to final handover, the process was seamless. The team's technical expertise and transparency gave us complete confidence throughout the entire development.",
          author: "Naledi Mokoena",
          role: "CEO — Horizon Capital Fund",
        },
        {
          quote:
            "We've worked with many developers over the years. Nour stands apart — their urban planning insight and delivery track record is second to none in the region.",
          author: "Stefan Van Der Berg",
          role: "Mayor — Stellenbosch Municipality",
        },
      ],
    },
    pricing: {
      label: "Pricing",
      heading: "Pricing & Packages.",
      blurb: "Flexible structures built around your investment timeline.",
      plans: [
        {
          featured: false,
          name: "Standard Plot",
          price: "JD 850K",
          sub: "Starting from / plot",
          badge: null,
          features: [
            "Surveyed & titled plot",
            "Municipal services connected",
            "Basic access road",
            "12-month payment plan",
            "Legal conveyancing support",
          ],
          cta: "Enquire Now",
        },
        {
          featured: true,
          name: "Development Package",
          price: "JD 2.4M",
          sub: "Starting from / unit",
          badge: "Most Popular",
          features: [
            "All Standard Plot inclusions",
            "Design & planning approval",
            "Construction management",
            "24-month flexible financing",
            "Dedicated project liaison",
          ],
          cta: "Get Started",
        },
        {
          featured: false,
          name: "Enterprise Scheme",
          price: "CUSTOM",
          sub: "Tailored to your scale",
          badge: null,
          features: [
            "Full precinct master planning",
            "Environmental impact studies",
            "Infrastructure roll-out",
            "Investor reporting portal",
            "Priority support & SLA",
          ],
          cta: "Contact Us",
        },
      ],
    },
    contact: {
      label: "Contact",
      heading: "Contact Us.",
      info: [
        { label: "Head Office", value: ["14 Buitenkant Street", "Cape Town, 8001", "South Africa"] },
        { label: "General Enquiries", value: ["info@nour.sa"] },
        { label: "Sales & Partnerships", value: ["sales@nour.sa"] },
        { label: "Telephone", value: ["+966 11 000 1234"] },
      ],
      officeHoursLabel: "Office Hours",
      officeHours: ["Monday – Friday: 08:00 – 17:00", "Saturday: 09:00 – 13:00", "Sunday: Closed"],
      form: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone",
        interest: "Area of Interest",
        message: "Message",
        placeholders: {
          firstName: "James",
          lastName: "Oberholzer",
          email: "james@example.com",
          phone: "+966 50 000 0000",
          message: "Tell us about your project or enquiry…",
        },
        options: [
          "Select one…",
          "Standard Plot Purchase",
          "Development Package",
          "Enterprise / Large-Scale Scheme",
          "Partnership / Joint Venture",
          "General Enquiry",
        ],
        submit: "Send Message",
      },
    },
    newsletter: {
      label: "Stay Informed",
      heading: ["Land Insights,", "Delivered."],
      sub: "Project launches, market analysis, and development updates — direct to your inbox. No noise, just signal.",
      confirmed: "Confirmed",
      success: "You're subscribed. We'll be in touch with the latest from the field.",
      placeholder: "Your email address",
      subscribe: "Subscribe",
      finePrint: "No spam. Unsubscribe at any time.",
    },
    footer: {
      tagline: "Land development built on precision, integrity, and long-term thinking.",
      columns: [
        {
          title: "Company",
          links: ["About Us", "Our Projects", "Our Team", "Careers", "Press"],
        },
        {
          title: "Services",
          links: ["Land Acquisition", "Master Planning", "Site Development", "Environmental", "Commercial"],
        },
        {
          title: "Contact",
          links: ["14 Buitenkant Street", "Cape Town, 8001", "info@nour.sa", "+966 11 000 1234"],
        },
      ],
      copy: "© 2026 Nour Land Development — All Rights Reserved",
    },
    statuses: {
      available: "Available",
      reserved: "Reserved",
      sold: "Sold",
    },
    projectPage: {
      notFound: "Project Not Found.",
      back: "All Projects",
      availability: "Availability",
      siteArea: "Site Area",
      lots: "Lots",
      gla: "GLA",
      lotsInPhase: "Lots in Phase",
      projectValue: "Project Value",
      completion: "Completion",
      overview: "Overview",
      aboutTheProject: "About The Project.",
      keyHighlights: "Key Highlights",
      opportunities: "Opportunities",
      featuredLots: "Featured Lots.",
      featuredBlurb: "Hand-picked plots offering the best value, position and build potential.",
      process: "Process",
      howItWorks: "How It Works.",
      contactBtn: "Contact",
      statusLabel: "Status",
      sizeLabel: "Size",
      priceLabel: "Price",
      previous: "Previous",
      next: "Next",
      labels: {
        project1: "Project One",
        project2: "Project Two",
        project3: "Project Three",
        project4: "Project Four",
      },
      processSteps: [
        {
          num: "01",
          title: "Enquire",
          desc: "Register your interest in a specific lot. We'll send you the full schedule, pricing guide, and development specification within 24 hours.",
        },
        {
          num: "02",
          title: "Reserve",
          desc: "Secure your lot with a reservation deposit. Your plot comes off-market the moment your deposit clears.",
        },
        {
          num: "03",
          title: "Transfer",
          desc: "Our legal team manages the full transfer process from sale agreement to title registration.",
        },
        {
          num: "04",
          title: "Handover",
          desc: "Receive your deed package and continue with design or construction with our team available for support.",
        },
      ],
    },
    lotPanel: {
      sitePhotos: "Site Photos",
      developmentOverview: "Development Overview",
      lotAvailability: "Lot Availability",
      totalLots: "Total lots",
      overviewHint: "Select any lot on the map to view size, price and full details.",
      overview: "Overview",
      size: "Size",
      price: "Price",
      enquire: "Enquire About This Lot",
      featuredLots: "Featured Lots",
      lotPrefix: "Lot",
      priceOnRequest: "Price on request",
    },
    googleMap: {
      loadingLabel: "Google Maps",
      loadingTitle: "Loading mapped lots...",
      unavailableLabel: "Map Unavailable",
      unavailableTitle: "Google Maps could not load for this project page.",
      sitePlan: "Site Plan",
      draft: "Draft",
      lotStatus: "Lot Status",
    },
  },
  ar: {
    shell: {
      language: "اللغة",
      nav: {
        home: "الرئيسية",
        project1: "المشروع الأول",
        project2: "المشروع الثاني",
        project3: "المشروع الثالث",
        project4: "المشروع الرابع",
        about: "من نحن",
        gallery: "المعرض",
        contact: "تواصل معنا",
      },
    },
    hero: {
      eyebrow: "نــور لتطوير الأراضي",
      title: ["نطوّر الأرض.", "ونصنع", "المستقبل."],
      explore: "استكشف المشاريع",
      story: "قصتنا",
      stats: [
        { num: "340+", label: "كم مربع تم تطويره" },
        { num: "82", label: "مشروعًا منجزًا" },
        { num: "15", label: "سنة من الخبرة" },
        { num: "200+", label: "عميل تم خدمته" },
      ],
    },
    projects: {
      label: "المشاريع",
      heading: "مشاريع مختارة.",
      viewAll: "عرض جميع المشاريع",
      statuses: {
        active: "نشط",
        completed: "مكتمل",
      },
      types: {
        residential: "سكني",
        mixedUse: "متعدد الاستخدامات",
        luxuryResidential: "سكني فاخر",
        commercial: "تجاري",
      },
    },
    about: {
      label: "من نحن",
      heading: "من نحن.",
      body1:
        "تأسست نور لتطوير الأراضي في عام 2009، وتعمل عند تقاطع الرؤية الجريئة والتنفيذ الدقيق. من المواقع الخام إلى مشاريع النسيج الحضري المعقدة، نقوم بالتخطيط والتطوير وتسليم مشاريع الأراضي التي تتجاوز الصيحات وتعيد تشكيل المجتمعات.",
      body2:
        "يجمع فريقنا متعدد التخصصات بين المهندسين البيئيين والمخططين الحضريين والمعماريين واستراتيجيي المجتمع تحت سقف واحد بهدف واضح: أرض تعمل بكفاءة أعلى.",
      stats: [
        { num: "340+", desc: "كم مربع تم تطويره" },
        { num: "82", desc: "مشروعًا منجزًا" },
        { num: "4.2B د.ا", desc: "قيمة إجمالية محققة" },
        { num: "97%", desc: "نسبة الاحتفاظ بالعملاء" },
      ],
    },
    gallery: {
      label: "المعرض",
      heading: "معرض المواقع.",
      images: "صور",
    },
    reviews: {
      label: "آراء العملاء",
      heading: "شهادات العملاء.",
      items: [
        {
          quote:
            "حوّلت نور موقعًا معقدًا إلى وجهة متعددة الاستخدامات بارزة. كان اهتمامهم بالاشتراطات البيئية واندماج المجتمع استثنائيًا.",
          author: "جيمس أوبرهولزر",
          role: "المدير — مجموعة أبيكس العقارية",
        },
        {
          quote:
            "من شراء الأرض حتى التسليم النهائي كانت الرحلة سلسة. خبرة الفريق الفنية وشفافيته منحتنا ثقة كاملة طوال التطوير.",
          author: "ناليـدي موكوينا",
          role: "الرئيس التنفيذي — صندوق هورايزن كابيتال",
        },
        {
          quote:
            "عملنا مع مطورين كثيرين خلال السنوات الماضية، لكن نور تتفوق بوضوح في الرؤية التخطيطية وسجل التنفيذ.",
          author: "ستيفان فان دير بيرغ",
          role: "رئيس البلدية — بلدية ستيلينبوش",
        },
      ],
    },
    pricing: {
      label: "الأسعار",
      heading: "الأسعار والباقات.",
      blurb: "هياكل مرنة مصممة بما يتوافق مع جدولك الاستثماري.",
      plans: [
        {
          featured: false,
          name: "قطعة قياسية",
          price: "850 ألف د.ا",
          sub: "ابتداءً من / قطعة",
          badge: null,
          features: [
            "قطعة مرفوعة ومفرزة",
            "توصيل الخدمات البلدية",
            "طريق وصول أساسي",
            "خطة سداد 12 شهرًا",
            "دعم قانوني لنقل الملكية",
          ],
          cta: "استفسر الآن",
        },
        {
          featured: true,
          name: "باقة التطوير",
          price: "2.4 مليون د.ا",
          sub: "ابتداءً من / وحدة",
          badge: "الأكثر طلبًا",
          features: [
            "جميع مزايا القطعة القياسية",
            "التصميم واعتماد المخططات",
            "إدارة التنفيذ",
            "تمويل مرن لمدة 24 شهرًا",
            "مسؤول مشروع مخصص",
          ],
          cta: "ابدأ الآن",
        },
        {
          featured: false,
          name: "خطة المؤسسات",
          price: "حسب الطلب",
          sub: "مصممة وفق نطاقك",
          badge: null,
          features: [
            "تخطيط متكامل للمخطط العام",
            "دراسات الأثر البيئي",
            "طرح البنية التحتية",
            "بوابة تقارير للمستثمرين",
            "دعم أولوية واتفاقية مستوى خدمة",
          ],
          cta: "تواصل معنا",
        },
      ],
    },
    contact: {
      label: "التواصل",
      heading: "تواصل معنا.",
      info: [
        { label: "المكتب الرئيسي", value: ["شارع الملك فهد 14", "الرياض 12345", "المملكة العربية السعودية"] },
        { label: "الاستفسارات العامة", value: ["info@nour.sa"] },
        { label: "المبيعات والشراكات", value: ["sales@nour.sa"] },
        { label: "الهاتف", value: ["+966 11 000 1234"] },
      ],
      officeHoursLabel: "ساعات العمل",
      officeHours: ["الاثنين - الجمعة: 08:00 - 17:00", "السبت: 09:00 - 13:00", "الأحد: مغلق"],
      form: {
        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        interest: "مجال الاهتمام",
        message: "الرسالة",
        placeholders: {
          firstName: "محمد",
          lastName: "الشمري",
          email: "name@example.com",
          phone: "+966 50 000 0000",
          message: "أخبرنا عن مشروعك أو استفسارك…",
        },
        options: [
          "اختر خيارًا…",
          "شراء قطعة قياسية",
          "باقة التطوير",
          "خطة مؤسسية / مشروع كبير",
          "شراكة / مشروع مشترك",
          "استفسار عام",
        ],
        submit: "إرسال الرسالة",
      },
    },
    newsletter: {
      label: "ابقَ على اطلاع",
      heading: ["رؤى الأراضي،", "إلى بريدك."],
      sub: "إطلاقات المشاريع وتحليلات السوق وتحديثات التطوير تصلك مباشرة إلى بريدك. بلا ضوضاء، فقط ما يهم.",
      confirmed: "تم التأكيد",
      success: "تم اشتراكك. سنوافيك بآخر المستجدات من الميدان.",
      placeholder: "بريدك الإلكتروني",
      subscribe: "اشترك",
      finePrint: "لا رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.",
    },
    footer: {
      tagline: "تطوير الأراضي قائم على الدقة والنزاهة والتفكير طويل المدى.",
      columns: [
        {
          title: "الشركة",
          links: ["من نحن", "مشاريعنا", "فريقنا", "الوظائف", "الأخبار"],
        },
        {
          title: "الخدمات",
          links: ["استحواذ الأراضي", "التخطيط العام", "تطوير المواقع", "البيئة", "التجاري"],
        },
        {
          title: "التواصل",
          links: ["شارع الملك فهد 14", "الرياض 12345", "info@nour.sa", "+966 11 000 1234"],
        },
      ],
      copy: "© 2026 نــور لتطوير الأراضي — جميع الحقوق محفوظة",
    },
    statuses: {
      available: "متاح",
      reserved: "محجوز",
      sold: "مباع",
    },
    projectPage: {
      notFound: "المشروع غير موجود.",
      back: "جميع المشاريع",
      availability: "التوفر",
      siteArea: "مساحة الموقع",
      lots: "القطع",
      gla: "المساحة التأجيرية",
      lotsInPhase: "قطع هذه المرحلة",
      projectValue: "قيمة المشروع",
      completion: "موعد الإنجاز",
      overview: "نظرة عامة",
      aboutTheProject: "عن المشروع.",
      keyHighlights: "أبرز المزايا",
      opportunities: "الفرص",
      featuredLots: "قطع مختارة.",
      featuredBlurb: "قطع مختارة بعناية تجمع بين القيمة والموقع وقابلية التطوير.",
      process: "الخطوات",
      howItWorks: "كيف تتم العملية.",
      contactBtn: "تواصل",
      statusLabel: "الحالة",
      sizeLabel: "المساحة",
      priceLabel: "السعر",
      previous: "السابق",
      next: "التالي",
      labels: {
        project1: "المشروع الأول",
        project2: "المشروع الثاني",
        project3: "المشروع الثالث",
        project4: "المشروع الرابع",
      },
      processSteps: [
        {
          num: "01",
          title: "استفسار",
          desc: "سجل اهتمامك بالقطعة المناسبة لك وسنرسل لك جدول الأسعار والمواصفات كاملة خلال 24 ساعة.",
        },
        {
          num: "02",
          title: "حجز",
          desc: "أمّن قطعتك بدفعة حجز، وتخرج القطعة من السوق بمجرد تأكيد السداد.",
        },
        {
          num: "03",
          title: "نقل",
          desc: "يتولى فريقنا القانوني إجراءات نقل الملكية بالكامل من العقد حتى التسجيل النهائي.",
        },
        {
          num: "04",
          title: "تسليم",
          desc: "استلم مستندات الملكية وابدأ في التصميم أو البناء مع استمرار دعم فريقنا.",
        },
      ],
    },
    lotPanel: {
      sitePhotos: "صور الموقع",
      developmentOverview: "نظرة عامة على المشروع",
      lotAvailability: "توفر القطع",
      totalLots: "إجمالي القطع",
      overviewHint: "اختر أي قطعة على الخريطة لعرض المساحة والسعر والتفاصيل.",
      overview: "الرجوع",
      size: "المساحة",
      price: "السعر",
      enquire: "استفسر عن هذه القطعة",
      featuredLots: "قطع مختارة",
      lotPrefix: "قطعة",
      priceOnRequest: "السعر عند الطلب",
    },
    googleMap: {
      loadingLabel: "خرائط جوجل",
      loadingTitle: "جارٍ تحميل القطع المرسومة...",
      unavailableLabel: "الخريطة غير متاحة",
      unavailableTitle: "تعذر تحميل خرائط جوجل لهذه الصفحة.",
      sitePlan: "مخطط الموقع",
      draft: "مسودة",
      lotStatus: "حالة القطع",
    },
  },
} as const;

type Copy = (typeof COPY)[Language];

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  isArabic: boolean;
  dir: "ltr";
  copy: Copy;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    return stored === "en" ? "en" : "ar";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.language = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    isArabic: language === "ar",
    dir: language === "ar" ? "rtl" : "ltr",
    copy: COPY[language],
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }
  return context;
}
