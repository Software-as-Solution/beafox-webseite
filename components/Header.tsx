"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
// IMPORTS
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  startTransition,
} from "react";
// ICONS
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import {
  BLOG_CATEGORIES,
  type BlogCategorySlug,
  getNavTopicsForCategory,
} from "@/lib/blog";
import { CALCULATORS, CALCULATOR_CATEGORIES } from "@/lib/calculators";

// TYPES
type ProductNavId =
  | "ihk"
  | "merch"
  | "schools"
  | "business"
  | "unlimited"
  | "eduplaces"
  | "bildungshaus";
// CONSTANTS
const SCROLL_THRESHOLD = 20;
const PRODUCT_NAV_SPLIT = 4;
const PROGRESS_BAR_HEIGHT = 8;
const APP_DOWNLOAD_URL = "https://apps.apple.com/de/app/beafox/id6746110612";
const PRODUCT_NAV: { id: ProductNavId; href: string }[] = [
  { id: "merch", href: "/shop" },
  { id: "unlimited", href: "/unlimited" },
  { id: "schools", href: "/schulen" },
  { id: "business", href: "/unternehmen" },
  { id: "eduplaces", href: "/eduplaces" },
  { id: "bildungshaus", href: "/bildungshaus" },
  { id: "ihk", href: "/ihk-akademie" },
];
const PRODUCT_MASCOTS: Record<ProductNavId, string> = {
  merch: "/Maskottchen/Maskottchen-Merch.png",
  ihk: "/Maskottchen/Maskottchen-Akademie.png",
  schools: "/Maskottchen/Maskottchen-School.png",
  business: "/Maskottchen/Maskottchen-Business.png",
  unlimited: "/Maskottchen/Maskottchen-Unlimited.png",
  eduplaces: "/Maskottchen/Maskottchen-Eduplaces.png",
  bildungshaus: "/Maskottchen/Maskottchen-Bildungshaus.png",
} as const;
const PRODUCT_LABEL_KEY: Record<ProductNavId, string> = {
  merch: "products.merch",
  unlimited: "products.unlimited",
  schools: "products.schools",
  business: "products.business",
  ihk: "products.partnerIhk",
  bildungshaus: "products.partnerBildungshaus",
  eduplaces: "products.partnerEduplaces",
};
const RATGEBER_MASCOTS: Record<BlogCategorySlug, string> = {
  "finanzen-fuer-schueler": "/Maskottchen/Maskottchen-Freude.png",
  "finanzen-fuer-azubis": "/Maskottchen/Maskottchen-Azubi.png",
  "finanzen-fuer-studenten": "/Maskottchen/Maskottchen-Studenten.png",
  "finanzen-fuer-berufseinsteiger":
    "/Maskottchen/Maskottchen-Berufseinsteiger.png",
  "finanzen-bei-lebensereignissen":
    "/Maskottchen/Maskottchen-Lebenssituationen.png",
  "investieren-fuer-anfaenger": "/Maskottchen/Maskottchen-Investieren.png",
} as const;
const PRODUCT_PATHS = PRODUCT_NAV.map((p) => p.href);
// HELPER FUNCTIONS
function isProductPath(pathname: string): boolean {
  return PRODUCT_PATHS.some((p) => pathname.startsWith(p));
}

export default function Header() {
  // HOOKS
  const pathname = usePathname();
  const t = useTranslations("header");
  // STATES
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isRechnerOpen, setIsRechnerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRatgeberOpen, setIsRatgeberOpen] = useState(false);
  const [mobileRechnerOpen, setMobileRechnerOpen] = useState(false);
  const [mobileRatgeberOpen, setMobileRatgeberOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeRatgeberCategory, setActiveRatgeberCategory] =
    useState<BlogCategorySlug>(BLOG_CATEGORIES[0].slug);
  const [mobileRatgeberCategoryOpen, setMobileRatgeberCategoryOpen] = useState<
    string | null
  >(null);
  const [mobileRechnerCategoryOpen, setMobileRechnerCategoryOpen] = useState<
    string | null
  >(null);
  // REFS
  const rafRef = useRef<number | null>(null);
  const rechnerRef = useRef<HTMLDivElement>(null);
  const ratgeberRef = useRef<HTMLDivElement>(null);
  const rechnerPanelRef = useRef<HTMLDivElement>(null);
  const productsPanelRef = useRef<HTMLDivElement>(null);
  const ratgeberPanelRef = useRef<HTMLDivElement>(null);
  const productsTriggerRef = useRef<HTMLDivElement>(null);
  // CONSTANTS
  const navItems = useMemo(
    () => [
      { href: "/", label: t("nav.home") },
      { href: "/ueber-uns", label: t("nav.about") },
    ],
    [t],
  );
  const productItems = useMemo(
    () =>
      PRODUCT_NAV.map((p) => ({
        id: p.id,
        href: p.href,
        label: t(PRODUCT_LABEL_KEY[p.id]),
      })),
    [t],
  );
  const ratgeberCategories = useMemo(() => {
    const cats = [...BLOG_CATEGORIES];
    const investIdx = cats.findIndex(
      (c) => c.slug === "investieren-fuer-anfaenger",
    );
    const berufIdx = cats.findIndex(
      (c) => c.slug === "finanzen-fuer-berufseinsteiger",
    );
    if (investIdx !== -1 && berufIdx !== -1 && investIdx > berufIdx) {
      const [inv] = cats.splice(investIdx, 1);
      cats.splice(berufIdx, 0, inv);
    }
    return cats.map((cat) => ({
      id: cat.slug,
      label: cat.navLabel,
      href: `/${cat.slug}`,
      topics: getNavTopicsForCategory(cat.slug),
    }));
  }, []);
  const rechnerCategories = useMemo(
    () =>
      CALCULATOR_CATEGORIES.map((cat) => ({
        id: cat.label,
        label: cat.label,
        emoji: cat.emoji,
        href: "/finanzrechner",
        calculators: CALCULATORS.filter((calc) => calc.category === cat.label).sort(
          (a, b) => {
            const preferredOrderByCategory: Record<string, string[]> = {
              "Gehalt & Arbeit": ["stundenlohn-rechner"],
              "Sparen & Budget": [
                "inflationsrechner",
                "sparplan-rechner",
                "notgroschen-rechner",
                "budget-rechner",
              ],
              "Alltag & Lifestyle": [
                "spritrechner",
                "waehrungsrechner",
                "mietkosten-rechner",
                "taschengeld-rechner",
              ],
            };
            const order = preferredOrderByCategory[cat.label];
            if (!order) return 0;

            const ai = order.indexOf(a.slug);
            const bi = order.indexOf(b.slug);
            if (ai === -1 && bi === -1) return 0;
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
          },
        ),
      })),
    [],
  );
  const [activeRechnerCategory, setActiveRechnerCategory] = useState(
    rechnerCategories[0]?.id ?? "",
  );
  const activeCategory =
    ratgeberCategories.find((c) => c.id === activeRatgeberCategory) ??
    ratgeberCategories[0];
  const activeRechnerCategoryData =
    rechnerCategories.find((c) => c.id === activeRechnerCategory) ??
    rechnerCategories[0];
  // FUNCTIONS
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(top > SCROLL_THRESHOLD);
      setScrollProgress(max > 0 ? Math.min((top / max) * 100, 100) : 0);
    });
  }, []);
  const closeAll = useCallback(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsRatgeberOpen(false);
    setIsRechnerOpen(false);
    setMobileRatgeberOpen(false);
    setMobileRechnerOpen(false);
    setMobileRatgeberCategoryOpen(null);
    setMobileRechnerCategoryOpen(null);
  }, []);
  const toggleRatgeber = useCallback(() => {
    setIsRatgeberOpen((p) => !p);
    setIsDropdownOpen(false);
    setIsRechnerOpen(false);
  }, []);
  const toggleRechner = useCallback(() => {
    setIsRechnerOpen((p) => !p);
    setIsRatgeberOpen(false);
    setIsDropdownOpen(false);
  }, []);
  const toggleProducts = useCallback(() => {
    setIsDropdownOpen((p) => !p);
    setIsRatgeberOpen(false);
    setIsRechnerOpen(false);
  }, []);
  // EFFECTS
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (!isDropdownOpen && !isRatgeberOpen && !isRechnerOpen) return;

    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        isDropdownOpen &&
        !productsTriggerRef.current?.contains(t) &&
        !productsPanelRef.current?.contains(t)
      )
        setIsDropdownOpen(false);
      if (
        isRatgeberOpen &&
        !ratgeberRef.current?.contains(t) &&
        !ratgeberPanelRef.current?.contains(t)
      )
        setIsRatgeberOpen(false);
      if (
        isRechnerOpen &&
        !rechnerRef.current?.contains(t) &&
        !rechnerPanelRef.current?.contains(t)
      )
        setIsRechnerOpen(false);
    };

    // Delay listener to avoid catching the same click that opened the dropdown
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [isDropdownOpen, isRatgeberOpen, isRechnerOpen]);
  useEffect(() => {
    if (!isDropdownOpen && !isMenuOpen && !isRatgeberOpen && !isRechnerOpen)
      return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // closeAll is stable (empty deps useCallback), safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropdownOpen, isMenuOpen, isRatgeberOpen, isRechnerOpen]);
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);
  useEffect(() => {
    startTransition(() => {
      closeAll();
    });
  }, [pathname, closeAll]);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* PROGRESS BAR */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("aria.scrollProgress")}
        aria-valuenow={Math.round(scrollProgress)}
        style={{
          zIndex: 60,
          width: "100%",
          position: "relative",
          height: PROGRESS_BAR_HEIGHT,
        }}
      >
        <div
          style={{
            top: 0,
            left: 0,
            height: "100%",
            willChange: "width",
            position: "absolute",
            backgroundColor: "#F97316",
            width: `${scrollProgress}%`,
          }}
        />
      </div>
      <div className="px-4 sm:px-6 lg:px-8 mt-2">
        <header
          className={`w-full py-2 rounded-2xl transition-all duration-500 ${isScrolled ? "bg-primaryWhite shadow-lg shadow-black/[0.08] border border-gray-200/60" : "bg-primaryWhite shadow-md shadow-black/[0.04] border border-gray-200/40"}`}
        >
          <nav className="px-5 sm:px-6 lg:px-8" aria-label="Hauptnavigation">
            <div className="relative flex items-center justify-between h-16 lg:h-[64px]">
              {/* LOGO */}
              <Link
                href="/"
                aria-label={t("aria.home")}
                className="flex-shrink-0 relative z-10"
              >
                <Image
                  priority
                  width={200}
                  height={200}
                  alt={t("images.logoAlt")}
                  src="/assets/Logos/Logo-Name.png"
                  className="object-contain h-14 w-auto relative left-[2.5%]"
                />
              </Link>
              {/* DESKTOP NAV */}
              <div
                role="menubar"
                className="hidden lg:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                {navItems.map((item) => {
                  const active = isHydrated && pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      role="menuitem"
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200 ${active ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div ref={ratgeberRef}>
                  <button
                    onClick={toggleRatgeber}
                    aria-expanded={isRatgeberOpen}
                    aria-haspopup="true"
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200 ${isRatgeberOpen ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"}`}
                  >
                    {t("nav.guide")}
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-200"
                      style={{
                        transform: isRatgeberOpen
                          ? "rotate(-180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </button>
                </div>
                <div ref={rechnerRef}>
                  <button
                    onClick={toggleRechner}
                    aria-expanded={isRechnerOpen}
                    aria-haspopup="true"
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200 ${isRechnerOpen ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"}`}
                  >
                    {t("nav.calculators")}
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-200"
                      style={{
                        transform: isRechnerOpen
                          ? "rotate(-180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </button>
                </div>
                <div className="relative" ref={productsTriggerRef}>
                  <button
                    type="button"
                    aria-haspopup="true"
                    onClick={toggleProducts}
                    aria-expanded={isDropdownOpen}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200 ${isDropdownOpen || (isHydrated && isProductPath(pathname)) ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"}`}
                  >
                    {t("products.label")}
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-200"
                      style={{
                        transform: isDropdownOpen
                          ? "rotate(-180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </button>
                </div>
              </div>
              {/* RIGHT */}
              <div className="hidden lg:flex items-center gap-3 relative z-10">
                <Link
                  href="/kontakt"
                  className="px-5 py-2 rounded-full text-sm font-semibold text-primaryWhite bg-primaryOrange hover:bg-primaryOrange/85 transition-all duration-200 shadow-sm shadow-primaryOrange/20"
                >
                  {t("actions.contact")}
                </Link>
                <a
                  target="_blank"
                  href={APP_DOWNLOAD_URL}
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-full text-sm font-semibold text-primaryOrange border-2 border-primaryOrange/30 hover:border-primaryOrange hover:bg-primaryOrange/5 transition-all duration-200"
                >
                  {t("actions.download")}
                </a>
              </div>
              {/* MOBILE TOGGLE */}
              <div className="lg:hidden flex items-center">
                <button
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={
                    isMenuOpen ? t("aria.closeMenu") : t("aria.openMenu")
                  }
                  className="p-2 rounded-xl text-darkerGray hover:bg-gray-100 transition-colors"
                >
                  {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </nav>
          {/* ─── RATGEBER PANEL ─── */}
          <AnimatePresence>
            {isRatgeberOpen && (
              <motion.div
                role="menu"
                aria-label={t("nav.guide")}
                exit={{ opacity: 0 }}
                ref={ratgeberPanelRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="hidden lg:block fixed left-0 right-0 z-50"
                style={{ top: `${PROGRESS_BAR_HEIGHT + 8 + 68 + 12}px` }}
              >
                <div
                  style={{ width: "min(850px, calc(100vw - 48px))" }}
                  className="mx-auto bg-primaryWhite rounded-2xl shadow-2xl shadow-black/[0.1] border border-gray-200/60 overflow-hidden"
                >
                  <div className="flex">
                    <div className="w-[300px] border-r border-gray-100 py-3 px-2 flex-shrink-0 bg-gray-50/50">
                      <div className="px-3 pb-2 mb-1">
                        <span className="text-xs font-bold text-lightGray uppercase tracking-widest">
                          {t("common.categories")}
                        </span>
                      </div>
                      {ratgeberCategories.map((cat) => {
                        const active = activeRatgeberCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveRatgeberCategory(cat.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${active ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"}`}
                            onMouseEnter={() =>
                              setActiveRatgeberCategory(cat.id)
                            }
                          >
                            <Image
                              width={220}
                              height={220}
                              src={RATGEBER_MASCOTS[cat.id]}
                              className="w-16 h-16 object-contain flex-shrink-0 scale-150"
                              alt={t("images.ratgeberMascotAlt", {
                                category: cat.label,
                              })}
                            />
                            <span className="text-base font-semibold">
                              {cat.label}
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className={`w-3.5 h-3.5 ml-auto transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex-1 py-8 px-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-darkerGray">
                          {activeCategory.label}
                        </h3>
                        <Link
                          onClick={closeAll}
                          href={activeCategory.href}
                          className="text-xs font-semibold text-primaryOrange hover:underline"
                        >
                          {t("common.showAll")}
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 gap-y-1">
                        {activeCategory.topics.map((topic) => (
                          <Link
                            key={topic.href}
                            href={topic.href}
                            onClick={closeAll}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5 transition-all duration-150"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primaryOrange/40 flex-shrink-0" />
                            {topic.label}
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/finanzrechner"
                        onClick={closeAll}
                        className="mt-4 flex items-center gap-2.5 rounded-xl px-3 py-4 transition-all hover:shadow-md"
                        style={{
                          background: "rgba(232,119,32,0.06)",
                          border: "1px solid rgba(232,119,32,0.15)",
                        }}
                      >
                        <div className="w-10 h-10 overflow-hidden flex-shrink-0 rounded-lg">
                          <Image
                            width={50}
                            height={50}
                            src="/Maskottchen/Maskottchen-Rechner.png"
                            className="object-contain w-full h-full scale-125"
                            alt={t("images.productNavAlt", {
                              product: t("products.calculatorHub.title"),
                            })}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-darkerGray leading-tight">
                            {t("products.calculatorHub.title")}
                          </div>
                          <div className="text-[11px] text-lightGray mt-0.5">
                            {t("products.calculatorHub.subtitle")}
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-primaryOrange flex-shrink-0">
                          →
                        </div>
                      </Link>
                      <a
                        target="_blank"
                        href={APP_DOWNLOAD_URL}
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-2.5 rounded-xl px-3 py-4 transition-all hover:shadow-md"
                        style={{
                          background: "rgba(232,119,32,0.06)",
                          border: "1px solid rgba(232,119,32,0.15)",
                        }}
                      >
                        <div className="w-10 h-10 overflow-hidden flex-shrink-0">
                          <Image
                            width={50}
                            height={50}
                            src="/assets/Logos/Logo.png"
                            alt={t("images.appIconAlt")}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-darkerGray leading-tight">
                            {t("appPromo.title")}
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                width="12"
                                height="12"
                                stroke="none"
                                fill="#F97316"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                            <span className="text-[11px] text-lightGray ml-0.5">
                              5.0
                            </span>
                          </div>
                        </div>
                        <div
                          className="text-[11px] font-bold text-white bg-primaryOrange px-3.5 py-1.5 rounded-lg flex-shrink-0"
                          style={{
                            boxShadow: "0 2px 6px rgba(232,119,32,0.25)",
                          }}
                        >
                          {t("appPromo.cta")}
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* ─── RECHNER PANEL ─── */}
          <AnimatePresence>
            {isRechnerOpen && (
              <motion.div
                role="menu"
                aria-label={t("nav.calculators")}
                exit={{ opacity: 0 }}
                ref={rechnerPanelRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="hidden lg:block fixed left-0 right-0 z-50"
                style={{ top: `${PROGRESS_BAR_HEIGHT + 8 + 68 + 12}px` }}
              >
                <div
                  style={{ width: "min(850px, calc(100vw - 48px))" }}
                  className="mx-auto bg-primaryWhite rounded-2xl shadow-2xl shadow-black/[0.1] border border-gray-200/60 overflow-hidden"
                >
                  <div className="flex">
                    {/* SIDEBAR */}
                    <div className="w-[300px] border-r border-gray-100 py-3 px-2 flex-shrink-0 bg-gray-50/50">
                      <div className="px-3 pb-2 mb-1">
                        <span className="text-xs font-bold text-lightGray uppercase tracking-widest">
                          {t("common.categories")}
                        </span>
                      </div>
                      {rechnerCategories.map((cat) => {
                        const active = activeRechnerCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveRechnerCategory(cat.id)}
                            onMouseEnter={() =>
                              setActiveRechnerCategory(cat.id)
                            }
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${active ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"}`}
                          >
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                              style={{
                                background: active
                                  ? "rgba(232,119,32,0.12)"
                                  : "rgba(232,119,32,0.06)",
                                border: "1px solid rgba(232,119,32,0.15)",
                              }}
                            >
                              <span aria-hidden="true">{cat.emoji}</span>
                            </div>
                            <span className="text-base font-semibold">
                              {cat.label}
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className={`w-3.5 h-3.5 ml-auto transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-darkerGray">
                          {activeRechnerCategoryData?.label}
                        </h3>
                        <Link
                          onClick={closeAll}
                          href="/finanzrechner"
                          className="text-xs font-semibold text-primaryOrange hover:underline"
                        >
                          {t("common.showAll")}
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 gap-y-1">
                        {(activeRechnerCategoryData?.calculators ?? []).map(
                          (calc) => (
                            <Link
                              key={calc.slug}
                              href={`/finanzrechner/${calc.slug}`}
                              onClick={closeAll}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5 transition-all duration-150"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primaryOrange/40 flex-shrink-0" />
                              {calc.title}
                            </Link>
                          ),
                        )}
                      </div>

                      {/* Ratgeber Cross-Promotion */}
                      <Link
                        href="/ratgeber"
                        onClick={closeAll}
                        className="mt-4 flex items-center gap-2.5 rounded-xl px-3 py-4 transition-all hover:shadow-md"
                        style={{
                          background: "rgba(232,119,32,0.06)",
                          border: "1px solid rgba(232,119,32,0.15)",
                        }}
                      >
                        <div className="w-10 h-10 overflow-hidden flex-shrink-0 rounded-lg">
                          <Image
                            width={50}
                            height={50}
                            src="/Maskottchen/Maskottchen-Ratgeber.png"
                            alt=""
                            className="object-contain w-full h-full scale-125"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-darkerGray leading-tight">
                            {t("rechnerPanel.guidePromo.title")}
                          </div>
                          <div className="text-[11px] text-lightGray mt-0.5">
                            {t("rechnerPanel.guidePromo.subtitle")}
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-primaryOrange flex-shrink-0">
                          →
                        </div>
                      </Link>

                      {/* App Download */}

                      <a
                        target="_blank"
                        href={APP_DOWNLOAD_URL}
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-2.5 rounded-xl px-3 py-4 transition-all hover:shadow-md"
                        style={{
                          background: "rgba(232,119,32,0.06)",
                          border: "1px solid rgba(232,119,32,0.15)",
                        }}
                      >
                        <div className="w-10 h-10 overflow-hidden flex-shrink-0">
                          <Image
                            width={50}
                            height={50}
                            src="/assets/Logos/Logo.png"
                            alt={t("images.appIconAlt")}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-darkerGray leading-tight">
                            {t("appPromo.title")}
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                width="12"
                                height="12"
                                stroke="none"
                                fill="#F97316"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                            <span className="text-[11px] text-lightGray ml-0.5">
                              5.0
                            </span>
                          </div>
                        </div>
                        <div
                          className="text-[11px] font-bold text-white bg-primaryOrange px-3.5 py-1.5 rounded-lg flex-shrink-0"
                          style={{
                            boxShadow: "0 2px 6px rgba(232,119,32,0.25)",
                          }}
                        >
                          {t("appPromo.cta")}
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* ─── PRODUKTE PANEL ─── */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                role="menu"
                ref={productsPanelRef}
                exit={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                aria-label={t("products.label")}
                className="hidden lg:block fixed left-0 right-0 z-50"
                style={{ top: `${PROGRESS_BAR_HEIGHT + 8 + 68 + 12}px` }}
              >
                <div
                  style={{ width: "min(750px, calc(100vw - 48px))" }}
                  className="mx-auto bg-primaryWhite rounded-2xl shadow-2xl shadow-black/[0.08] border border-gray-200/60 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-0">
                    <div className="p-4 border-r border-gray-100">
                      <div className="px-2 pb-2 mb-1">
                        <span className="text-xs font-bold text-lightGray uppercase tracking-widest">
                          {t("products.label")}
                        </span>
                      </div>
                      {PRODUCT_NAV.slice(0, PRODUCT_NAV_SPLIT).map((p) => {
                        const active =
                          isHydrated && pathname.startsWith(p.href);
                        return (
                          <Link
                            key={p.id}
                            href={p.href}
                            onClick={closeAll}
                            className={`flex items-center gap-3.5 rounded-xl px-3 py-3 transition-all group ${active ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"}`}
                          >
                            <Image
                              width={200}
                              height={200}
                              src={PRODUCT_MASCOTS[p.id]}
                              className="w-16 h-16 object-contain flex-shrink-0 scale-150"
                              alt={t("images.productNavAlt", {
                                product: t(PRODUCT_LABEL_KEY[p.id]),
                              })}
                            />
                            <span
                              className={`text-base font-semibold transition-colors ${active ? "text-primaryOrange" : "text-darkerGray group-hover:text-primaryOrange"}`}
                            >
                              {t(PRODUCT_LABEL_KEY[p.id])}
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className={`w-3.5 h-3.5 ml-auto transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            />
                          </Link>
                        );
                      })}
                    </div>
                    <div className="p-4">
                      <div className="px-2 pb-2 mb-1">
                        <span className="text-xs font-bold text-lightGray uppercase tracking-widest">
                          {t("products.partnerships")}
                        </span>
                      </div>
                      {PRODUCT_NAV.slice(PRODUCT_NAV_SPLIT).map((p) => {
                        const active =
                          isHydrated && pathname.startsWith(p.href);
                        return (
                          <Link
                            key={p.id}
                            href={p.href}
                            onClick={closeAll}
                            className={`flex items-center gap-3.5 rounded-xl px-3 py-3 transition-all group ${active ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"}`}
                          >
                            <Image
                              width={200}
                              height={200}
                              src={PRODUCT_MASCOTS[p.id]}
                              className="w-16 h-16 object-contain flex-shrink-0 scale-150"
                              alt={t("images.productNavAlt", {
                                product: t(PRODUCT_LABEL_KEY[p.id]),
                              })}
                            />
                            <span
                              className={`text-base font-semibold transition-colors ${active ? "text-primaryOrange" : "text-darkerGray group-hover:text-primaryOrange"}`}
                            >
                              {t(PRODUCT_LABEL_KEY[p.id])}
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className={`w-3.5 h-3.5 ml-auto transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* ─── MOBILE MENU ─── */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                role="dialog"
                id="mobile-menu"
                aria-modal="true"
                aria-label={t("aria.navigation")}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="lg:hidden border-t border-gray-200/60 overflow-hidden max-h-[calc(100vh-100px)] overflow-y-auto"
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, height: 0 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, height: "auto" }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, height: 0 }
                }
              >
                <div className="px-5 py-5 space-y-1">
                  {navItems.map((item) => {
                    const active = isHydrated && pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeAll}
                        aria-current={active ? "page" : undefined}
                        className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${active ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-gray-50"}`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  {/* Mobile Ratgeber */}
                  <div>
                    <button
                      onClick={() => setMobileRatgeberOpen(!mobileRatgeberOpen)}
                      aria-expanded={mobileRatgeberOpen}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${mobileRatgeberOpen ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-gray-50"}`}
                    >
                      {t("nav.guide")}
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-200"
                        style={{
                          transform: mobileRatgeberOpen
                            ? "rotate(-180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileRatgeberOpen && (
                        <motion.div
                          transition={{ duration: 0.2 }}
                          exit={{ opacity: 0, height: 0 }}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="ml-2 mt-1 space-y-0.5 overflow-hidden"
                        >
                          {ratgeberCategories.map((cat) => {
                            const isOpen =
                              mobileRatgeberCategoryOpen === cat.id;
                            return (
                              <div key={cat.id}>
                                <button
                                  onClick={() =>
                                    setMobileRatgeberCategoryOpen(
                                      isOpen ? null : cat.id,
                                    )
                                  }
                                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isOpen ? "text-primaryOrange bg-primaryOrange/5" : "text-darkerGray"}`}
                                >
                                  <Image
                                    width={24}
                                    height={24}
                                    src={RATGEBER_MASCOTS[cat.id]}
                                    className="w-5 h-5 object-contain flex-shrink-0"
                                    alt={t("images.ratgeberMascotAlt", {
                                      category: cat.label,
                                    })}
                                  />
                                  {cat.label}
                                  <ChevronDown
                                    size={12}
                                    aria-hidden="true"
                                    className="ml-auto transition-transform duration-200"
                                    style={{
                                      transform: isOpen
                                        ? "rotate(-180deg)"
                                        : "rotate(0deg)",
                                    }}
                                  />
                                </button>
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      transition={{ duration: 0.15 }}
                                      exit={{ opacity: 0, height: 0 }}
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      className="ml-6 space-y-0.5 overflow-hidden"
                                    >
                                      {cat.topics.map((topic) => (
                                        <Link
                                          key={topic.href}
                                          href={topic.href}
                                          onClick={closeAll}
                                          className="block px-3 py-2 rounded-lg text-xs text-darkerGray hover:text-primaryOrange transition-colors"
                                        >
                                          {topic.label}
                                        </Link>
                                      ))}
                                      <Link
                                        href={cat.href}
                                        onClick={closeAll}
                                        className="block px-3 py-2 rounded-lg text-xs font-semibold text-primaryOrange"
                                      >
                                        {t("nav.allGuidesFor", {
                                          category: cat.label,
                                        })}
                                      </Link>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Mobile Finanzrechner Link */}
                    <button
                      onClick={() => setMobileRechnerOpen(!mobileRechnerOpen)}
                      aria-expanded={mobileRechnerOpen}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${mobileRechnerOpen ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-gray-50"}`}
                    >
                      {t("nav.calculators")}
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-200"
                        style={{
                          transform: mobileRechnerOpen
                            ? "rotate(-180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileRechnerOpen && (
                        <motion.div
                          transition={{ duration: 0.2 }}
                          exit={{ opacity: 0, height: 0 }}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="ml-2 mt-1 space-y-0.5 overflow-hidden"
                        >
                          {rechnerCategories.map((cat) => {
                            const isOpen = mobileRechnerCategoryOpen === cat.id;
                            return (
                              <div key={cat.id}>
                                <button
                                  onClick={() =>
                                    setMobileRechnerCategoryOpen(
                                      isOpen ? null : cat.id,
                                    )
                                  }
                                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isOpen ? "text-primaryOrange bg-primaryOrange/5" : "text-darkerGray"}`}
                                >
                                  <span aria-hidden="true">{cat.emoji}</span>
                                  {cat.label}
                                  <ChevronDown
                                    size={12}
                                    aria-hidden="true"
                                    className="ml-auto transition-transform duration-200"
                                    style={{
                                      transform: isOpen
                                        ? "rotate(-180deg)"
                                        : "rotate(0deg)",
                                    }}
                                  />
                                </button>
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      transition={{ duration: 0.15 }}
                                      exit={{ opacity: 0, height: 0 }}
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      className="ml-6 space-y-0.5 overflow-hidden"
                                    >
                                      {cat.calculators.map((calc) => (
                                        <Link
                                          key={calc.slug}
                                          href={`/finanzrechner/${calc.slug}`}
                                          onClick={closeAll}
                                          className="block px-3 py-2 rounded-lg text-xs text-darkerGray hover:text-primaryOrange transition-colors"
                                        >
                                          {calc.title}
                                        </Link>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                          <Link
                            href="/finanzrechner"
                            onClick={closeAll}
                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-primaryOrange"
                          >
                            {t("nav.allCalculators")}
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Mobile Produkte */}
                  <div>
                    <button
                      aria-expanded={isDropdownOpen}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isDropdownOpen || (isHydrated && isProductPath(pathname)) ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-gray-50"}`}
                    >
                      {t("products.label")}
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-200"
                        style={{
                          transform: isDropdownOpen
                            ? "rotate(-180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          role="menu"
                          transition={{ duration: 0.2 }}
                          exit={{ opacity: 0, height: 0 }}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="ml-4 mt-1 space-y-0.5 overflow-hidden"
                        >
                          {productItems
                            .slice(0, PRODUCT_NAV_SPLIT)
                            .map((item) => {
                              const active =
                                isHydrated && pathname.startsWith(item.href);
                              return (
                                <Link
                                  key={item.id}
                                  role="menuitem"
                                  href={item.href}
                                  onClick={closeAll}
                                  aria-current={active ? "page" : undefined}
                                  className={`block px-4 py-2.5 rounded-lg text-sm transition-all duration-150 ${active ? "text-primaryOrange font-semibold" : "text-darkerGray hover:text-primaryOrange"}`}
                                >
                                  {item.label}
                                </Link>
                              );
                            })}
                          <div
                            aria-hidden="true"
                            className="mx-2 my-1.5 border-t border-gray-200/80"
                          />
                          {productItems.slice(PRODUCT_NAV_SPLIT).map((item) => {
                            const active =
                              isHydrated && pathname.startsWith(item.href);
                            return (
                              <Link
                                key={item.id}
                                role="menuitem"
                                href={item.href}
                                onClick={closeAll}
                                aria-current={active ? "page" : undefined}
                                className={`block px-4 py-2.5 rounded-lg text-sm transition-all duration-150 ${active ? "text-primaryOrange font-semibold" : "text-darkerGray hover:text-primaryOrange"}`}
                              >
                                {item.label}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div
                    aria-hidden="true"
                    className="border-t border-gray-200/60 !mt-3 !mb-3"
                  />
                  <div className="flex gap-3 !mt-4 px-4">
                    <Link
                      href="/kontakt"
                      onClick={closeAll}
                      className="flex-1 text-center px-5 py-2.5 rounded-full text-sm font-semibold text-primaryWhite bg-primaryOrange hover:bg-primaryOrange/85 transition-all duration-200 shadow-sm shadow-primaryOrange/20"
                    >
                      {t("actions.contact")}
                    </Link>
                    <a
                      target="_blank"
                      onClick={closeAll}
                      href={APP_DOWNLOAD_URL}
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-5 py-2.5 rounded-full text-sm font-semibold text-primaryOrange border-2 border-primaryOrange/30 hover:border-primaryOrange hover:bg-primaryOrange/5 transition-all duration-200"
                    >
                      {t("actions.download")}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </div>
    </div>
  );
}
