const en = {
  // ── Layout & Meta ──
  meta: {
    title: "Digital Menus for Restaurants",
    description:
      "Create your restaurant menu online in minutes with AI-powered photo extraction and automatic translations. Get a QR code for table placement.",
    ogAlt: "Digital Menus for Restaurants",
  },

  // ── Landing Page ──
  landing: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      blog: "Blog",
      login: "Log in",
      getStarted: "Get Started",
    },
    hero: {
      badge: "No credit card required",
      titleLine1: "Your restaurant menu,",
      titleLine2: "online in 5 minutes",
      subtitle:
        "Upload a photo of your paper menu — AI extracts items automatically. Choose a beautiful theme, get a QR code, and you're live. No technical skills required.",
      cta: "Create Your Menu — Free",
      secondaryCta: "See How It Works",
      themesLabel: "10 themes — click any to preview live",
      preview: "Preview →",
    },
    howItWorks: {
      label: "Simple setup",
      title: "Three steps to go digital",
      subtitle: "From paper menu to QR code in minutes, not weeks.",
    },
    features: {
      label: "Features",
      title: "Everything you need to go paperless",
      subtitle:
        "Powerful features, simple interface. Built for restaurant owners.",
      items: [
        {
          title: "AI Menu Extraction",
          description:
            "Snap a photo of your paper menu — our AI reads it and creates your digital menu automatically.",
        },
        {
          title: "10 Beautiful Themes",
          description:
            "Classic, Neon, Luxe, Nordic and more — pick a vibe that matches your restaurant perfectly. No design skills needed.",
        },
        {
          title: "Instant QR Codes",
          description:
            "Download print-ready QR codes in PNG or SVG. Place them on tables and your guests are one scan away.",
        },
        {
          title: "Multi-Language",
          description:
            "AI-powered translation into 16 languages. Your international guests read the menu in their own language.",
        },
        {
          title: "Real-Time Updates",
          description:
            "86 an item or change prices instantly. Your digital menu updates in real time — no reprinting.",
        },
        {
          title: "Custom Domains",
          description:
            "Use your own domain like menu.yourrestaurant.com with automatic HTTPS. Looks professional, loads fast.",
        },
      ],
    },
    steps: [
      {
        title: "Upload your menu",
        description: "Take a photo of your paper menu or enter items manually.",
      },
      {
        title: "Pick a theme",
        description:
          "Choose from 10 beautiful designs that match your restaurant.",
      },
      {
        title: "Share your QR code",
        description: "Download, print, and place on tables. You're live!",
      },
    ],
    pricing: {
      label: "Pricing",
      title: "Simple, transparent pricing",
      subtitle: "Start free. Upgrade when you need more.",
      allPlansInclude:
        "All plans include all 10 themes, QR code generation, multi-language support, and real-time updates.",
      comingSoon: "Coming Soon",
      plans: [
        {
          name: "Free",
          price: "$0",
          period: "forever",
          description: "Perfect for trying it out",
          features: [
            "1 menu",
            "20 item images",
            "1 AI upload",
            "All 10 themes",
            "QR code download",
          ],
          cta: "Get Started Free",
        },
        {
          name: "Pro",
          price: "$9",
          period: "/month",
          description: "For growing restaurants",
          features: [
            "5 menus",
            "200 item images",
            "Unlimited AI uploads",
            "Custom domain",
            "No watermark",
          ],
          cta: "Coming Soon",
        },
        {
          name: "Business",
          price: "$19",
          period: "/month",
          description: "For multi-menu establishments",
          features: [
            "Unlimited menus",
            "Unlimited images",
            "Unlimited AI uploads",
            "Custom domain",
            "Priority support",
          ],
          cta: "Coming Soon",
        },
      ],
    },
    cta: {
      title: "Ready to ditch the paper menu?",
      subtitle:
        "Join restaurants worldwide that use {appName} to create beautiful digital menus their guests love.",
      button: "Create Your Menu — Free",
    },
    footer: {
      blog: "Blog",
      privacy: "Privacy Policy",
      about: "About",
      contact: "Contact",
      terms: "Terms",
      themes: "Themes",
    },
  },

  // ── Auth ──
  auth: {
    login: {
      title: "Welcome back",
      subtitle: "Sign in to manage your restaurant menu",
      emailVerified: "Email verified! You can now sign in.",
      passwordReset:
        "Password updated successfully. Sign in with your new password.",
      invalidLink:
        "That verification link is invalid. Please request a new one.",
      linkExpired: "That verification link has expired. Please register again.",
      continueGoogle: "Continue with Google",
      or: "or",
      email: "Email",
      emailPlaceholder: "you@restaurant.com",
      password: "Password",
      forgotPassword: "Forgot password?",
      signingIn: "Signing in...",
      signIn: "Sign in",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      invalidCredentials: "Invalid email or password",
    },
    register: {
      title: "Create your account",
      subtitle: "Get your restaurant menu online in minutes",
      continueGoogle: "Continue with Google",
      or: "or",
      name: "Your name",
      namePlaceholder: "John Smith",
      email: "Email",
      emailPlaceholder: "you@restaurant.com",
      password: "Password",
      passwordPlaceholder: "Min. 8 characters",
      creating: "Creating account...",
      create: "Create account",
      privacyAgreement: "By creating an account, you agree to our",
      privacyPolicy: "Privacy Policy",
      hasAccount: "Already have an account?",
      signIn: "Sign in",
      signInFailed:
        "Account created but sign-in failed. Please sign in manually.",
      somethingWrong: "Something went wrong",
    },
    forgotPassword: {
      title: "Forgot password?",
      subtitle:
        "Enter your email address and we'll send you a link to reset your password.",
      email: "Email",
      emailPlaceholder: "you@restaurant.com",
      sending: "Sending...",
      sendLink: "Send reset link",
      rememberPassword: "Remember your password?",
      signIn: "Sign in",
      checkEmail: "Check your email",
      checkEmailDesc: "If an account exists for",
      checkEmailDesc2: "you'll receive a password reset link shortly.",
      linkExpires: "The link expires in 1 hour.",
      backToSignIn: "Back to sign in",
      tooManyAttempts: "Too many attempts. Please try again later.",
      somethingWrong: "Something went wrong. Please try again.",
    },
    resetPassword: {
      title: "Set new password",
      subtitle: "Choose a strong password for your account.",
      newPassword: "New password",
      newPasswordPlaceholder: "Min. 8 characters",
      confirmPassword: "Confirm password",
      confirmPlaceholder: "Repeat your password",
      saving: "Saving...",
      save: "Set new password",
      invalidLink: "Invalid link",
      invalidLinkDesc: "This password reset link is invalid or has expired.",
      requestNewLink: "Request a new link",
      passwordsMismatch: "Passwords do not match",
      resetFailed: "Failed to reset password",
      somethingWrong: "Something went wrong. Please try again.",
    },
    verifyEmail: {
      title: "Check your email",
      sentTo: "We sent a verification link to",
      instructions:
        "Click the link in the email to verify your account. The link expires in 24 hours.",
      didntReceive: "Didn't receive it?",
      checkSpam: "Check your spam or junk folder",
      checkEmail: "Make sure you entered the right email",
      goToSignIn: "Go to sign in",
    },
  },

  // ── Dashboard ──
  dashboard: {
    nav: {
      menu: "Menu",
      qr: "QR Codes",
      upload: "AI Upload",
      languages: "Languages",
      settings: "Settings",
      billing: "Billing",
      preview: "Preview",
      previewMenu: "Preview menu",
      signOut: "Sign out",
      toggleNav: "Toggle navigation",
    },
    emailBanner: {
      verify: "Please verify your email address.",
      sent: "Verification email sent!",
      sending: "Sending...",
      resend: "Resend verification email",
    },
  },

  // ── Menu Builder ──
  menuBuilder: {
    title: "Menu Builder",
    saving: "Saving...",
    saved: "Saved",
    menuName: "Menu name:",
    addMenu: "Add Menu",
    deleteMenu: "Delete menu",
    deleteMenuConfirm: "Delete this menu and all its categories/items?",
    categoriesItems: "Categories + Items",
    addCategory: "Add Category",
    noCategories: "No categories yet",
    noCategoriesHint:
      'Add a category like "Appetizers" or "Mains" to get started.',
    noMenus: "No menus yet",
    noMenusHint: 'Click "Add Menu" to create your first menu.',
    dragToReorder: "Drag to reorder",
  },

  // ── Category Card ──
  category: {
    items: "items",
    addItem: "+ Add Item",
    deleteCategory: "Delete category",
    noItems: 'No items yet. Click "+ Add Item" to add one.',
  },

  // ── Item Form Modal ──
  itemForm: {
    editItem: "Edit Item",
    addItem: "Add Item",
    image: "Image",
    name: "Name",
    required: "*",
    namePlaceholder: "e.g. Margherita Pizza",
    description: "Description",
    descriptionPlaceholder: "Fresh tomatoes, mozzarella, basil...",
    charLimit: "/500",
    prices: "Prices",
    price: "Price",
    optional: "Optional",
    default: "default",
    available: "Available",
    badges: "Badges",
    allergens: "Allergens",
    cancel: "Cancel",
    saving: "Saving...",
    updateItem: "Update Item",
    nameRequired: "Name is required",
    saveFailed: "Save failed",
    uploadFailed: "Upload failed",
  },

  // ── Settings ──
  settings: {
    title: "Settings",
    saved: "Saved",
    saveChanges: "Save Changes",
    saving: "Saving...",
    restaurantInfo: "Restaurant Info",
    name: "Name",
    description: "Description",
    address: "Address",
    phone: "Phone",
    images: "Images",
    logo: "Logo",
    coverImage: "Cover Image",
    upload: "+ Upload",
    theme: "Theme",
    themeDescription: "Choose how your public menu looks to guests.",
    accentColor: "Accent Color",
    accentColorDescription:
      "Used for highlights and emphasis in your menu theme.",
    defaultLanguage: "Default Language",
    defaultLanguageDescription:
      "The language your menu content is written in. Manage translations in the Languages page.",
    currencies: "Currencies",
    currenciesDescription:
      "Enable currencies you accept. The default currency is pre-selected when adding new items.",
    defaultCurrency: "Default Currency",
    publicMenuLink: "Public Menu Link",
    preview: "Preview",
    changeSlug: "Change slug",
    slugUpdated: "Slug updated",
    slugPlaceholder: "your-restaurant",
    checking: "Checking...",
    available: "Available",
    notAvailable: "Not available",
    suggestAI: "Suggest alternatives with AI",
    generating: "Generating suggestions...",
    saveSlug: "Save Slug",
    cancel: "Cancel",
    customDomain: "Custom Domain",
    customDomainUpgrade:
      "Custom domains are available on Pro and Business plans.",
    upgradePlan: "Upgrade your plan",
    domainPlaceholder: "menu.myrestaurant.com",
    save: "Save",
    verify: "Verify",
    verifying: "Verifying...",
    remove: "Remove",
    domainVerified: "Domain verified and active",
    dnsSetup: "DNS Setup Required",
    dnsInstructions: "Add a CNAME record pointing",
    dnsTo: "to",
    dnsPropagation: "DNS changes can take up to 48 hours to propagate.",
    dangerZone: "Danger Zone",
    dangerDescription:
      "Permanently delete your account, restaurant, and all menu data. This action cannot be undone.",
    deleteAccount: "Delete Account",
    deleteConfirmation:
      "This will permanently delete your account, restaurant profile, all menus, items, images, translations, and analytics data.",
    typeToConfirm: "Type",
    toConfirm: "to confirm:",
    deleteKeyword: "DELETE",
    deleting: "Deleting...",
    deleteEverything: "Delete Everything",
  },

  // ── QR Code ──
  qr: {
    title: "QR Code",
    description:
      "Print this QR code and place it on tables for guests to scan.",
    scanToView: "Scan to view menu",
    menuUrl: "Menu URL",
    copy: "Copy",
    download: "Download",
    png: "PNG (1024px)",
    svg: "SVG (Vector)",
    tips: "Tips",
    tipsList: [
      "Use PNG for printing on paper or stickers",
      "Use SVG for professional printing at any size",
      "Place QR codes on each table, at the entrance, or in the window",
      "Test by scanning with your phone before printing",
    ],
  },

  // ── Billing ──
  billing: {
    title: "Billing",
    description: "Manage your subscription and plan.",
    currentPlan: "Current plan:",
    menus: "menus,",
    images: "images",
    currentPlanBadge: "Current Plan",
    comingSoon: "Coming Soon",
    allPlansInclude: "All plans include",
    allPlansList: [
      "4 beautiful menu themes",
      "QR code generation (PNG + SVG)",
      "Multi-language support with AI translation",
      "Real-time menu updates",
      "Mobile-optimized menu pages",
      "OpenGraph meta tags for sharing",
    ],
    plans: {
      free: {
        name: "Free",
        price: "$0",
        period: "forever",
        features: [
          "1 menu",
          "20 item images",
          "1 AI upload",
          "All themes",
          "QR code download",
          '"Powered by" watermark',
        ],
      },
      pro: {
        name: "Pro",
        price: "$9",
        period: "/month",
        features: [
          "5 menus",
          "200 item images",
          "Unlimited AI uploads",
          "All themes",
          "Custom domain",
          "No watermark",
        ],
      },
      business: {
        name: "Business",
        price: "$19",
        period: "/month",
        features: [
          "Unlimited menus",
          "Unlimited images",
          "Unlimited AI uploads",
          "All themes",
          "Custom domain",
          "No watermark",
          "Priority support",
        ],
      },
    },
  },

  // ── Languages ──
  languages: {
    title: "Languages",
    description:
      "Manage translations for your menu. Enable languages and auto-translate with AI.",
    saved: "Saved",
    editTranslations: "Edit Translations —",
    noTranslations: 'No translations yet. Click "Translate" to auto-translate.',
    ai: "AI",
    defaultLanguage: "Default language",
    defaultLanguageDesc: "Your menu content is written in this language",
    activeTranslations: "Active Translations",
    translations: "translations",
    edit: "Edit",
    translate: "Translate",
    translating: "Translating...",
    remove: "Remove",
    addLanguage: "Add Language",
    howItWorks: "How it works",
    howItWorksList: [
      "Enable a language to make it available on your public menu",
      'Click "Translate" to auto-translate all menu content using AI',
      'Click "Edit" to review and manually adjust any translation',
      "Manual edits are preserved — AI won't overwrite your changes",
      "Re-translate anytime to pick up new menu items",
    ],
  },

  // ── AI Upload ──
  aiUpload: {
    title: "AI Menu Upload",
    description:
      "Upload a photo or PDF of your menu and our AI will extract all items automatically.",
    limitReached: "Free plan limit reached",
    limitReachedDesc:
      "You've used your 1 free AI upload. Upgrade to Pro for unlimited uploads.",
    clickToUpload: "Click to upload a menu photo or PDF",
    fileTypes: "JPEG, PNG, WebP, or PDF up to 10MB",
    tips: "Tips for best results",
    tipsList: [
      "Take a clear, well-lit photo of the full menu",
      "Avoid shadows and glare on the menu",
      "Include all pages if the menu spans multiple pages",
      "The AI works best with printed menus (handwritten may have lower accuracy)",
    ],
    analyzing: "Analyzing your menu...",
    analyzingTime: "This usually takes 10-20 seconds",
    currency: "Currency:",
    saveTo: "Save to",
    createNewMenu: "Create new menu",
    menuName: "Menu name",
    items: "items",
    remove: "Remove",
    addItem: "+ Add item",
    saveToMenu: "Save to Menu",
    startOver: "Start Over",
    savingToMenu: "Saving to menu...",
    savedSuccess: "Menu saved successfully!",
    viewInBuilder: "View in Menu Builder",
    uploadAnother: "Upload Another",
  },

  // ── Onboarding ──
  onboarding: {
    step1: {
      title: "Name your restaurant",
      subtitle: "This will be displayed on your menu page.",
      placeholder: "e.g. Le Petit Jardin",
      error: "Please enter your restaurant name",
      continue: "Continue",
    },
    step2: {
      title: "Choose your style",
      subtitle:
        "Pick a design theme for your menu page. You can change this later.",
      back: "Back",
      continue: "Continue",
    },
    step3: {
      title: "Got a paper menu?",
      subtitle:
        "Skip the manual work — upload a photo of your menu and our AI will extract all items automatically.",
      benefits: [
        "Snap a photo or upload a PDF of your existing menu",
        "AI reads every item, price, and description in seconds",
        "Review and edit before saving — you're always in control",
      ],
      settingUp: "Setting up...",
      uploadPhoto: "Upload Menu Photo",
      addManually: "I'll add items manually",
      back: "Back",
    },
  },

  // ── Cookie Banner ──
  cookie: {
    message:
      "We use cookies to keep you logged in and analyze site traffic with Google Analytics.",
    learnMore: "Learn more",
    accept: "Accept all",
    decline: "Essential only",
  },

  // ── Menu Footer ──
  menuFooter: {
    poweredBy: "Powered by",
  },

  // ── Blog ──
  blog: {
    title: "Blog",
    metaDescription:
      "Tips, guides, and insights on digital menus, QR codes, restaurant marketing, menu design psychology, and AI technology for restaurant owners.",
    heading: "Restaurant Digital Menu Blog",
    subtitle: "Insights for Restaurant Owners",
    description:
      "Practical guides on digital menus, menu design, AI, and everything that helps your restaurant thrive.",
    minRead: "min read",
    continueReading: "Continue Reading",
    ctaTitle: "Ready to create your digital menu?",
    ctaSubtitle:
      "Upload a photo of your menu, pick a theme, and get a QR code — all in under 5 minutes. Free to start.",
    ctaButton: "Get Started Free",
    breadcrumbHome: "Home",
  },

  // ── Themes Page ──
  themesPage: {
    metaTitle: "Restaurant Menu Themes — 10 Beautiful Designs",
    metaDescription:
      "Browse 10 professionally designed restaurant menu themes. Classic, Modern, Dark, Bistro, Nordic, Neon, Rustic, Zen, Luxe, and Vibra. Preview each theme live.",
    badge: "10 themes",
    title: "A theme for every restaurant",
    subtitle:
      "Each theme is mobile-first, fast-loading, and designed to make your menu look stunning. Pick one, customize the accent color, and you're done.",
    previewButton: "Preview live",
    bestFor: "Best for:",
    cta: {
      title: "Find your perfect theme",
      subtitle:
        "Create your menu and try every theme for free. Switch anytime — your content stays, only the design changes.",
      button: "Create Your Menu — Free",
    },
    breadcrumbHome: "Home",
    breadcrumbThemes: "Themes",
    themes: [
      { bestFor: "Traditional restaurants, steakhouses, wine bars" },
      { bestFor: "Cafes, fast-casual, brunch spots" },
      { bestFor: "Cocktail bars, upscale dining, speakeasies" },
      { bestFor: "Bistros, brasseries, French & Italian restaurants" },
      { bestFor: "Health-focused, organic, Scandinavian restaurants" },
      { bestFor: "Late-night spots, street food, gaming cafes" },
      { bestFor: "Farm-to-table, BBQ, craft breweries" },
      { bestFor: "Sushi bars, ramen shops, tea houses" },
      { bestFor: "Fine dining, luxury hotels, premium venues" },
      { bestFor: "Taquerias, food trucks, poke bowls" },
    ],
  },

  // ── Features Pages ──
  featuresPage: {
    metaTitle: "Features — Everything You Need for a Digital Menu",
    metaDescription:
      "AI menu extraction, 10 beautiful themes, QR codes, multi-language support, custom domains, and real-time updates. Everything your restaurant needs to go digital.",
    badge: "Features",
    title: "Everything you need to go paperless",
    subtitle:
      "Powerful features, simple interface. Built for restaurant owners who want to modernize without the hassle.",
    cta: {
      title: "Ready to get started?",
      subtitle:
        "Create your restaurant's digital menu in minutes. No credit card required.",
      button: "Create Your Menu — Free",
    },
    breadcrumbHome: "Home",
    breadcrumbFeatures: "Features",
    items: [
      {
        slug: "ai-menu-builder",
        name: "AI Menu Builder",
        shortDescription:
          "Snap a photo of your paper menu — our AI reads it and creates your digital menu automatically.",
        metaTitle: "AI Menu Builder — Create a Digital Menu from a Photo",
        metaDescription:
          "Upload a photo of your paper menu and let AI extract dish names, descriptions, and prices automatically. Your digital restaurant menu is ready in minutes.",
        heroTitle: "From paper menu to digital in minutes",
        heroSubtitle:
          "Take a photo of your existing menu. Our AI reads every item, description, and price — then builds your digital menu automatically. No typing required.",
        sections: [
          {
            title: "How it works",
            items: [
              "Take a clear photo of your paper menu or upload an existing image",
              "Our AI analyzes the image and extracts all menu items, descriptions, and prices",
              "Review the results, make any adjustments, and save — your digital menu is ready",
            ],
          },
          {
            title: "Why restaurants love it",
            items: [
              "Save hours of manual data entry — what used to take an afternoon now takes 5 minutes",
              "Handles multi-column layouts, different fonts, and handwritten additions",
              "Works with menus in multiple languages — the AI understands context, not just text",
              "Perfect accuracy for prices, currency symbols, and special characters",
            ],
          },
        ],
      },
      {
        slug: "qr-code-menu",
        name: "QR Code Menus",
        shortDescription:
          "Download print-ready QR codes in PNG or SVG. Place them on tables and guests are one scan away.",
        metaTitle: "QR Code Menu for Restaurants — Generate & Download Free",
        metaDescription:
          "Generate beautiful QR codes for your restaurant menu. Download in PNG or SVG, print, and place on tables. Guests scan and see your menu instantly.",
        heroTitle: "One scan, your full menu",
        heroSubtitle:
          "Generate a QR code that links directly to your digital menu. Download in PNG or SVG, print it, place it on tables — and your guests are one scan away from browsing your offerings.",
        sections: [
          {
            title: "How it works",
            items: [
              "Your QR code is generated automatically when you create a menu",
              "Download in PNG (for printing) or SVG (for designers) — any size, always sharp",
              "Place on tables, at the entrance, on receipts, or anywhere your guests can see",
            ],
          },
          {
            title: "Why restaurants love it",
            items: [
              "No app install required — works with every smartphone camera",
              "Update your menu anytime and the QR code stays the same — no reprinting needed",
              "Saves money on menu printing — especially useful for seasonal or daily specials",
              "Hygienic contactless experience that guests have come to expect",
            ],
          },
        ],
      },
      {
        slug: "multilingual-menu",
        name: "Multi-Language Menus",
        shortDescription:
          "AI-powered translation into 16 languages. International guests read the menu in their own language.",
        metaTitle:
          "Multilingual Restaurant Menu — AI Translation into 16 Languages",
        metaDescription:
          "Translate your restaurant menu into 16 languages with AI. Guests automatically see the menu in their preferred language. No manual translation needed.",
        heroTitle: "Speak every guest's language",
        heroSubtitle:
          "With one click, translate your entire menu into 16 languages using AI. International guests see your menu in their own language — automatically.",
        sections: [
          {
            title: "How it works",
            items: [
              "Select which languages you want to support from a list of 16 options",
              "AI translates your entire menu — dish names, descriptions, and category titles",
              "Guests see a language switcher on your menu and choose their preferred language",
            ],
          },
          {
            title: "Why restaurants love it",
            items: [
              "No need to hire translators or manage multiple menu versions manually",
              'AI understands culinary context — it knows the difference between "spring roll" and "bread roll"',
              "Add a new dish once, and it's automatically available in all your enabled languages",
              "Perfect for tourist areas, airports, hotels, and international neighborhoods",
            ],
          },
        ],
      },
      {
        slug: "menu-themes",
        name: "Menu Themes",
        shortDescription:
          "10 beautiful themes — Classic, Neon, Luxe, Nordic and more. Pick a vibe that matches your restaurant.",
        metaTitle:
          "Restaurant Menu Themes — 10 Beautiful Designs to Choose From",
        metaDescription:
          "Choose from 10 professionally designed menu themes: Classic, Modern, Dark, Bistro, Nordic, Neon, Rustic, Zen, Luxe, and Vibra. Match your restaurant's brand perfectly.",
        heroTitle: "A design for every restaurant",
        heroSubtitle:
          "Choose from 10 professionally designed themes that look stunning on any device. From elegant fine dining to bold street food — there's a perfect match for your brand.",
        sections: [
          {
            title: "Available themes",
            items: [
              "Classic — Editorial, warm, and sophisticated. Perfect for traditional restaurants",
              "Modern — Clean, contemporary, and minimal. Great for cafes and fast-casual",
              "Dark — Moody, bold, and premium. Ideal for cocktail bars and upscale dining",
              "Bistro — Traditional, charming, and European. Made for bistros and brasseries",
              "Nordic — Minimalist, Scandinavian, and airy. Fits health-focused and organic spots",
              "Neon — Electric, cyberpunk, and bold. Built for late-night and street food",
              "Rustic — Warm, farmhouse, and handcrafted. Perfect for farm-to-table restaurants",
              "Zen — Japanese-inspired, calm, and refined. Ideal for sushi bars and tea houses",
              "Luxe — Ultra-premium, black and gold. Made for fine dining and luxury venues",
              "Vibra — Vibrant, street food, bold and fun. Great for taquerias and food trucks",
            ],
          },
          {
            title: "Why restaurants love it",
            items: [
              "No design skills needed — just pick a theme and your menu looks professional instantly",
              "Every theme is mobile-first and optimized for smartphone screens",
              "Customize your accent color to match your brand identity",
              "Switch themes anytime — your content stays, only the look changes",
            ],
          },
        ],
      },
      {
        slug: "custom-domain",
        name: "Custom Domains",
        shortDescription:
          "Use your own domain like menu.yourrestaurant.com with automatic HTTPS.",
        metaTitle:
          "Custom Domain for Your Restaurant Menu — menu.yourrestaurant.com",
        metaDescription:
          "Use your own domain for your digital restaurant menu. Set up menu.yourrestaurant.com with automatic HTTPS. Professional branding, fast loading.",
        heroTitle: "Your menu, your domain",
        heroSubtitle:
          "Instead of a generic link, use your own domain like menu.yourrestaurant.com. We handle the HTTPS certificate automatically — it just works.",
        sections: [
          {
            title: "How it works",
            items: [
              "Add your domain in the dashboard settings (e.g. menu.yourrestaurant.com)",
              "Point a CNAME record to our servers — we provide the exact value to use",
              "We automatically provision an HTTPS certificate — your menu is live and secure",
            ],
          },
          {
            title: "Why restaurants love it",
            items: [
              "Professional branding — guests see your domain, not a third-party link",
              "Perfect for printing on business cards, flyers, and social media",
              "Automatic HTTPS means your menu loads securely and Google ranks it higher",
              "Available on Pro and Business plans",
            ],
          },
        ],
      },
      {
        slug: "real-time-updates",
        name: "Real-Time Updates",
        shortDescription:
          "86 an item or change prices instantly. Your digital menu updates in real time — no reprinting.",
        metaTitle: "Real-Time Menu Updates — Change Prices & Items Instantly",
        metaDescription:
          "Update your restaurant menu in real time. Change prices, 86 items, add daily specials — changes go live instantly. No reprinting, no waiting.",
        heroTitle: "Change anything, anytime",
        heroSubtitle:
          "Sold out of the salmon? Price change on wine? New daily special? Update your digital menu in seconds and every guest sees the change instantly.",
        sections: [
          {
            title: "What you can update instantly",
            items: [
              "Mark items as unavailable with a single toggle — guests see it immediately",
              "Change prices, descriptions, or images and save — updates are live in seconds",
              "Add new items or categories on the fly, even during service",
              "Reorder categories and items with drag-and-drop — the menu rearranges instantly",
            ],
          },
          {
            title: "Why restaurants love it",
            items: [
              "No more crossing out items with a pen or reprinting menus for small changes",
              "Run daily specials or happy hour pricing without any extra work",
              "Perfect for seasonal menus — swap items in and out without starting from scratch",
              "Manage everything from your phone or computer, even when you're away from the restaurant",
            ],
          },
        ],
      },
    ],
  },

  // ── Pricing Page ──
  pricingPage: {
    metaTitle: "Pricing — Digital Menu Plans for Restaurants",
    metaDescription:
      "Simple, transparent pricing for your restaurant's digital menu. Start free, upgrade when you need more menus, images, and features like custom domains.",
    badge: "Simple pricing",
    title: "Choose the right plan for your restaurant",
    subtitle:
      "Start free and upgrade as you grow. No hidden fees, no contracts.",
    allPlansInclude:
      "All plans include all 10 themes, QR code generation, multi-language support, and real-time menu updates.",
    comingSoon: "Coming Soon",
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question: "Can I try it for free?",
          answer:
            "Yes! The Free plan lets you create 1 menu with up to 20 item images. No credit card required — sign up and start building your digital menu in minutes.",
        },
        {
          question: "What happens when I reach my plan limits?",
          answer:
            "You'll see a notification when you're close to your limits. You can upgrade to a higher plan at any time to unlock more menus, images, and features.",
        },
        {
          question: "Can I change plans later?",
          answer:
            "Absolutely. You can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately.",
        },
        {
          question: "How does AI menu extraction work?",
          answer:
            "Simply take a photo of your paper menu and upload it. Our AI reads the text, extracts dish names, descriptions, and prices, and creates your digital menu automatically.",
        },
        {
          question: "Do I need technical skills?",
          answer:
            "Not at all. If you can take a photo and click a few buttons, you can create a beautiful digital menu. The whole process takes about 5 minutes.",
        },
        {
          question: "What is a custom domain?",
          answer:
            "Instead of using a menudan.com link, you can use your own domain like menu.yourrestaurant.com. We handle the HTTPS certificate automatically.",
        },
      ],
    },
    cta: {
      title: "Ready to get started?",
      subtitle:
        "Create your restaurant's digital menu in minutes. No credit card required.",
      button: "Create Your Menu — Free",
    },
    breadcrumbHome: "Home",
  },

  // ── How It Works Page ──
  howItWorksPage: {
    metaTitle: "How It Works — Create a Digital Menu in 3 Steps",
    metaDescription:
      "Upload a photo of your menu, pick a theme, and share your QR code. See how easy it is to create a digital restaurant menu with AI-powered extraction.",
    badge: "Simple setup",
    title: "From paper to digital in 5 minutes",
    subtitle:
      "No technical skills, no design experience, no long onboarding. Just three simple steps.",
    steps: [
      {
        title: "Upload your menu",
        description:
          "Take a photo of your paper menu or upload an existing image. Our AI reads the text and extracts every dish name, description, and price automatically. You can also enter items manually if you prefer.",
        details: [
          "Works with any paper menu — printed, handwritten, or multi-column",
          "Supports menus in multiple languages",
          "AI extracts names, descriptions, prices, and categories",
          "Review and edit results before saving",
        ],
      },
      {
        title: "Pick a theme",
        description:
          "Choose from 10 professionally designed themes that match your restaurant's brand. Customize the accent color, and your menu is ready to impress.",
        details: [
          "10 themes: Classic, Modern, Dark, Bistro, Nordic, Neon, Rustic, Zen, Luxe, Vibra",
          "Every theme is mobile-first and optimized for smartphones",
          "Customize your accent color to match your brand",
          "Switch themes anytime — your content stays",
        ],
      },
      {
        title: "Share your QR code",
        description:
          "Download your QR code in PNG or SVG, print it, and place it on tables. Your guests scan and see your menu instantly — no app needed.",
        details: [
          "Download in PNG (for printing) or SVG (for designers)",
          "Place on tables, at the entrance, on receipts, or business cards",
          "Update your menu anytime — the QR code stays the same",
          "Optional: use your own custom domain like menu.yourrestaurant.com",
        ],
      },
    ],
    cta: {
      title: "Ready to try it?",
      subtitle:
        "The whole process takes about 5 minutes. No credit card required.",
      button: "Create Your Menu — Free",
    },
    breadcrumbHome: "Home",
  },

  // ── About Page ──
  aboutPage: {
    metaTitle: "About — Digital Menus for Restaurants",
    metaDescription:
      "We build tools that help restaurants go digital. AI-powered menu creation, beautiful themes, and instant QR codes — all designed for restaurant owners.",
    title: "About",
    heading: "We help restaurants go digital",
    paragraphs: [
      "{appName} was built with one goal: make it ridiculously easy for any restaurant to create a beautiful digital menu. No agencies, no developers, no weeks of back-and-forth.",
      "We noticed that most restaurants still rely on paper menus or outdated PDFs. The tools that existed were either too complicated, too expensive, or designed for tech-savvy users — not busy restaurant owners.",
      "So we built something different. Upload a photo of your paper menu, and AI does the rest. Pick a theme, get a QR code, and you're live. The whole process takes about 5 minutes.",
      "Today, {appName} offers 10 beautiful menu themes, AI-powered translation into 16 languages, real-time updates, custom domains, and everything a modern restaurant needs to serve guests better.",
    ],
    valuesTitle: "What we believe",
    values: [
      {
        title: "Simplicity first",
        description:
          "If it takes more than 5 minutes, we're doing it wrong. Every feature we build must be usable without a tutorial.",
      },
      {
        title: "Design matters",
        description:
          "Your menu is the first thing guests interact with. It should look as good as your food tastes.",
      },
      {
        title: "Built for restaurants",
        description:
          'We don\'t build for "businesses in general." Every decision is made with restaurant owners in mind.',
      },
    ],
    breadcrumbHome: "Home",
  },

  // ── Contact Page ──
  contactPage: {
    metaTitle: "Contact Us — Get in Touch",
    metaDescription:
      "Have questions about creating your digital restaurant menu? Get in touch with our team. We're here to help.",
    title: "Contact us",
    subtitle:
      "Have a question, feedback, or need help getting started? We'd love to hear from you.",
    emailTitle: "Email us",
    emailDescription:
      "For general inquiries, support, or partnership opportunities.",
    responseTime: "We typically respond within 24 hours.",
    faqTitle: "Common questions",
    faqDescription: "Check our",
    faqLink: "pricing FAQ",
    faqSuffix:
      "for answers to the most common questions about plans, features, and billing.",
    breadcrumbHome: "Home",
  },

  // ── Terms Page ──
  termsPage: {
    metaTitle: "Terms of Service",
    metaDescription:
      "Terms of service for using our digital menu platform. Read about your rights, our responsibilities, and how we handle your data.",
    title: "Terms of Service",
    lastUpdated: "Last updated:",
    lastUpdatedDate: "March 1, 2026",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content:
          'By accessing or using {appName} ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.',
      },
      {
        title: "2. Description of Service",
        content:
          "{appName} provides a digital menu creation platform for restaurants, including AI-powered menu extraction, QR code generation, theme customization, multi-language translation, and related features. The Service is available through our website and associated domains.",
      },
      {
        title: "3. Account Registration",
        content:
          "To use certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration.",
      },
      {
        title: "4. Acceptable Use",
        content:
          "You agree to use the Service only for lawful purposes and in accordance with these Terms. You may not: (a) use the Service for any illegal activity; (b) upload content that infringes on intellectual property rights; (c) attempt to gain unauthorized access to the Service or its systems; (d) use the Service to distribute spam, malware, or harmful content; (e) interfere with the proper functioning of the Service.",
      },
      {
        title: "5. Content Ownership",
        content:
          "You retain ownership of all content you upload to the Service, including menu items, descriptions, images, and translations. By uploading content, you grant {appName} a non-exclusive, worldwide license to host, display, and process your content solely for the purpose of providing the Service.",
      },
      {
        title: "6. Subscription and Billing",
        content:
          "Certain features require a paid subscription. Prices are displayed on our pricing page and may change with prior notice. Subscriptions are billed monthly and renew automatically. You can cancel at any time from your dashboard. Refunds are handled on a case-by-case basis.",
      },
      {
        title: "7. Service Availability",
        content:
          "We strive to maintain high availability of the Service but do not guarantee uninterrupted access. We may perform scheduled maintenance or updates that temporarily affect availability. We are not liable for any downtime or data loss.",
      },
      {
        title: "8. Termination",
        content:
          "We may suspend or terminate your account if you violate these Terms. You may delete your account at any time from your dashboard settings. Upon termination, your data will be permanently deleted within 30 days.",
      },
      {
        title: "9. Limitation of Liability",
        content:
          '{appName} is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.',
      },
      {
        title: "10. Changes to Terms",
        content:
          "We may update these Terms from time to time. We will notify you of significant changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.",
      },
      {
        title: "11. Contact",
        content:
          "If you have questions about these Terms, please contact us at the email address provided on our contact page.",
      },
    ],
  },

  // ── Privacy ──
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last updated:",
  },

  // ── Common ──
  common: {
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    loading: "Loading...",
    or: "or",
  },
} as const;

// Widen literal types so other locales can use different strings
type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepStringify<U>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepStringify<T[K]> }
      : T;

export type Translations = DeepStringify<typeof en>;
export default en;
