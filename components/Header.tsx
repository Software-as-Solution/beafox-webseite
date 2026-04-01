"use client";

// STANDARD COMPONENTS
import Link from "next/link";
import Image from "next/image";
// IMPORTS
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
// ICONS
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Wrench,
  BookOpen,
  Briefcase,
  Home,
  TrendingUp,
  Infinity,
  School,
  Building2,
  Library,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import {
  BLOG_CATEGORIES,
  getNavTopicsForCategory,
  type BlogCategorySlug,
} from "@/lib/blog";
import { useCart } from "@/components/ShopCartProvider";

// CONSTANTS
const SCROLL_THRESHOLD = 20;
const PROGRESS_BAR_HEIGHT = 8;
const APP_DOWNLOAD_URL = "https://apps.apple.com/de/app/beafox/id6746110612";

type ProductNavId = "unlimited" | "schools" | "business" | "ihk" | "vhs";

const PRODUCT_NAV: { id: ProductNavId; href: string; icon: LucideIcon }[] = [
  { id: "unlimited", href: "/unlimited", icon: Infinity },
  { id: "schools", href: "/schulen", icon: School },
  { id: "business", href: "/unternehmen", icon: Briefcase },
  { id: "ihk", href: "/unternehmen#partner-ihk", icon: Building2 },
  { id: "vhs", href: "/schulen#partner-vhs", icon: Library },
];

const PRODUCT_LABEL_KEY: Record<
  ProductNavId,
  | "products.unlimited"
  | "products.schools"
  | "products.business"
  | "products.partnerIhk"
  | "products.partnerVhs"
> = {
  unlimited: "products.unlimited",
  schools: "products.schools",
  business: "products.business",
  ihk: "products.partnerIhk",
  vhs: "products.partnerVhs",
};

const PRODUCT_PANEL_DESC: Record<
  ProductNavId,
  | "products.panel.unlimited.description"
  | "products.panel.schools.description"
  | "products.panel.business.description"
  | "products.panel.ihk.description"
  | "products.panel.vhs.description"
> = {
  unlimited: "products.panel.unlimited.description",
  schools: "products.panel.schools.description",
  business: "products.panel.business.description",
  ihk: "products.panel.ihk.description",
  vhs: "products.panel.vhs.description",
};
const RATGEBER_CATEGORY_ICONS: Record<
  BlogCategorySlug,
  typeof BookOpen
> = {
  "finanzen-fuer-schueler": BookOpen,
  "finanzen-fuer-azubis": Wrench,
  "finanzen-fuer-studenten": GraduationCap,
  "finanzen-fuer-berufseinsteiger": Briefcase,
  "finanzen-bei-lebensereignissen": Home,
  "investieren-fuer-anfaenger": TrendingUp,
};

export default function Header() {
  // HOOKS
  const pathname = usePathname();
  const t = useTranslations("header");
  const { itemCount, toggleCart } = useCart();
  // STATES
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRatgeberOpen, setIsRatgeberOpen] = useState(false);
  const [activeRatgeberCategory, setActiveRatgeberCategory] =
    useState<BlogCategorySlug>(BLOG_CATEGORIES[0].slug);
  const [activeProductId, setActiveProductId] = useState<ProductNavId>("unlimited");
  // MOBILE STATES
  const [mobileRatgeberOpen, setMobileRatgeberOpen] = useState(false);
  const [mobileRatgeberCategoryOpen, setMobileRatgeberCategoryOpen] = useState<string | null>(null);
  // REFS
  const rafRef = useRef<number | null>(null);
  const productsTriggerRef = useRef<HTMLDivElement>(null);
  const productsPanelRef = useRef<HTMLDivElement>(null);
  const ratgeberRef = useRef<HTMLDivElement>(null);
  const ratgeberPanelRef = useRef<HTMLDivElement>(null);
  // MEMOIZED DATA
  const navItems = useMemo(
    () => [
      { href: "/", label: t("nav.home") },
      { href: "/ueber-uns", label: t("nav.about") },
    ],
    [t]
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
  const ratgeberCategories = useMemo(
    () => {
      // Ensure "Investieren" appears before "Berufseinsteiger" in navigation.
      const orderedCategories = [...BLOG_CATEGORIES];
      const investSlug = "investieren-fuer-anfaenger";
      const berufSlug = "finanzen-fuer-berufseinsteiger";
      const investIdx = orderedCategories.findIndex((c) => c.slug === investSlug);
      const berufIdx = orderedCategories.findIndex((c) => c.slug === berufSlug);

      if (investIdx !== -1 && berufIdx !== -1 && investIdx > berufIdx) {
        const [investCat] = orderedCategories.splice(investIdx, 1);
        orderedCategories.splice(berufIdx, 0, investCat);
      }

      return orderedCategories.map((cat) => ({
        id: cat.slug,
        label: cat.navLabel,
        icon: RATGEBER_CATEGORY_ICONS[cat.slug],
        href: `/ratgeber/${cat.slug}`,
        topics: getNavTopicsForCategory(cat.slug),
      }));
    },
    [],
  );
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // FUNCTIONS
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setIsScrolled(scrollTop > SCROLL_THRESHOLD);
      setScrollProgress(Math.min(progress, 100));
      rafRef.current = null;
    });
  }, []);
  const closeAll = useCallback(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsRatgeberOpen(false);
    setMobileRatgeberOpen(false);
    setMobileRatgeberCategoryOpen(null);
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
    if (!isDropdownOpen && !isRatgeberOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isDropdownOpen) {
        const inProductsTrigger = productsTriggerRef.current?.contains(target);
        const inProductsPanel = productsPanelRef.current?.contains(target);
        if (!inProductsTrigger && !inProductsPanel) setIsDropdownOpen(false);
      }
      if (isRatgeberOpen) {
        const inRatgeberTrigger = ratgeberRef.current?.contains(target);
        const inRatgeberPanel = ratgeberPanelRef.current?.contains(target);
        if (!inRatgeberTrigger && !inRatgeberPanel) setIsRatgeberOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isDropdownOpen, isRatgeberOpen]);

  useEffect(() => {
    if (!isDropdownOpen || !isHydrated) return;
    if (pathname.startsWith("/unlimited")) setActiveProductId("unlimited");
    else if (pathname.startsWith("/schulen")) setActiveProductId("schools");
    else if (pathname.startsWith("/unternehmen")) setActiveProductId("business");
  }, [isDropdownOpen, pathname, isHydrated]);

  useEffect(() => {
    if (!isDropdownOpen && !isMenuOpen && !isRatgeberOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isDropdownOpen, isMenuOpen, isRatgeberOpen, closeAll]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  // ACTIVE CATEGORY
  const activeCategory =
    ratgeberCategories.find((c) => c.id === activeRatgeberCategory) ??
    ratgeberCategories[0];

  const activeProduct =
    PRODUCT_NAV.find((p) => p.id === activeProductId) ?? PRODUCT_NAV[0];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* PROGRESS BAR */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Scroll-Fortschritt"
        style={{ height: PROGRESS_BAR_HEIGHT, zIndex: 60, width: "100%", position: "relative" }}
      >
        <div
          style={{
            top: 0, left: 0, height: "100%", position: "absolute",
            backgroundColor: "#F97316", width: `${scrollProgress}%`, willChange: "width",
          }}
        />
      </div>

      {/* NAVBAR */}
      <div className="px-4 sm:px-6 lg:px-8 mt-2">
        <header
          className={`w-full py-2 rounded-2xl transition-all duration-500 ${
            isScrolled
              ? "bg-primaryWhite shadow-lg shadow-black/[0.08] border border-gray-200/60"
              : "bg-primaryWhite shadow-md shadow-black/[0.04] border border-gray-200/40"
          }`}
        >
          <nav className="px-5 sm:px-6 lg:px-8" aria-label="Hauptnavigation">
            <div className="relative flex items-center justify-between h-16 lg:h-[64px]">
              {/* LOGO */}
              <Link href="/" aria-label="BeAFox Startseite" className="flex-shrink-0 relative z-10">
                <Image priority width={150} height={150} alt="BeAFox Logo" src="/assets/Logo-EST.jpg" className="object-contain" />
              </Link>

              {/* DESKTOP NAV (centered) */}
              <div className="hidden lg:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" role="menubar">
                {navItems.map((item) => {
                  const isActive = isHydrated && pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      aria-current={isActive ? "page" : undefined}
                      className={`relative px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200 ${
                        isActive ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* RATGEBER MEGA-MENU TRIGGER */}
                <div ref={ratgeberRef}>
                  <button
                    onClick={() => { setIsRatgeberOpen(!isRatgeberOpen); setIsDropdownOpen(false); }}
                    aria-expanded={isRatgeberOpen}
                    aria-haspopup="true"
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200 ${
                      isRatgeberOpen ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"
                    }`}
                  >
                    Ratgeber
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-200"
                      style={{ transform: isRatgeberOpen ? "rotate(-180deg)" : "rotate(0deg)", transformOrigin: "center" }}
                    />
                  </button>
                </div>

                {/* PRODUKTE — Mega-Menü Trigger */}
                <div className="relative" ref={productsTriggerRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(!isDropdownOpen);
                      setIsRatgeberOpen(false);
                    }}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-base font-semibold transition-all duration-200 ${
                      isDropdownOpen ||
                      (isHydrated &&
                        (pathname.startsWith("/unlimited") ||
                          pathname.startsWith("/schulen") ||
                          pathname.startsWith("/unternehmen")))
                        ? "text-primaryOrange bg-primaryOrange/10"
                        : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"
                    }`}
                  >
                    {t("products.label")}
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-200"
                      style={{
                        transform: isDropdownOpen ? "rotate(-180deg)" : "rotate(0deg)",
                        transformOrigin: "center",
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="hidden lg:flex items-center gap-3 relative z-10">
                <button
                  onClick={toggleCart}
                  aria-label={`Warenkorb${itemCount > 0 ? ` (${itemCount})` : ""}`}
                  className="relative p-2 rounded-xl text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5 transition-all duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primaryOrange text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </button>
                <Link href="/kontakt" className="px-5 py-2 rounded-full text-sm font-semibold text-primaryWhite bg-primaryOrange hover:bg-primaryOrange/85 transition-all duration-200 shadow-sm shadow-primaryOrange/20">{t("actions.contact")}</Link>
                <a href={APP_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full text-sm font-semibold text-primaryOrange border-2 border-primaryOrange/30 hover:border-primaryOrange hover:bg-primaryOrange/5 transition-all duration-200">{t("actions.download")}</a>
              </div>

              {/* MOBILE TOGGLE */}
              <div className="lg:hidden flex items-center gap-1">
                <button
                  onClick={toggleCart}
                  aria-label={`Warenkorb${itemCount > 0 ? ` (${itemCount})` : ""}`}
                  className="relative p-2 rounded-xl text-darkerGray hover:text-primaryOrange hover:bg-gray-100 transition-colors"
                >
                  <ShoppingCart size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-primaryOrange text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-controls="mobile-menu" aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"} className="p-2 rounded-xl text-darkerGray hover:bg-gray-100 transition-colors">
                  {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </nav>

          {/* RATGEBER MEGA-MENU PANEL */}
          <AnimatePresence>
            {isRatgeberOpen && (
              <motion.div
                ref={ratgeberPanelRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="hidden lg:block fixed left-0 right-0 z-50"
                style={{ top: `${PROGRESS_BAR_HEIGHT + 8 + 68 + 12}px` }}
                role="menu"
                aria-label="Ratgeber"
              >
                <div
                  className="mx-auto bg-primaryWhite rounded-2xl shadow-2xl shadow-black/[0.1] border border-gray-200/60 overflow-hidden"
                  style={{ width: "min(820px, calc(100vw - 48px))" }}
                >
                <div className="flex">
                  {/* LEFT SIDEBAR */}
                  <div className="w-[220px] border-r border-gray-100 py-3 px-2 flex-shrink-0 bg-gray-50/50">
                    <div className="px-3 pb-2 mb-1">
                      <span className="text-[10px] font-bold text-lightGray uppercase tracking-widest">Kategorien</span>
                    </div>
                    {ratgeberCategories.map((cat) => {
                      const isCatActive = activeRatgeberCategory === cat.id;
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onMouseEnter={() => setActiveRatgeberCategory(cat.id)}
                          onClick={() => setActiveRatgeberCategory(cat.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                            isCatActive
                              ? "text-primaryOrange bg-primaryOrange/10"
                              : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          {cat.label}
                          <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-opacity duration-150 ${isCatActive ? "opacity-100" : "opacity-0"}`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* RIGHT SIDE - TOPICS GRID */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-darkerGray">
                        {activeCategory.label}
                      </h3>
                      <Link href={activeCategory.href} onClick={closeAll} className="text-xs font-semibold text-primaryOrange hover:underline">
                        Alle anzeigen →
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
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

                    {/* APP DOWNLOAD CTA */}
                    <a
                      href="https://apps.apple.com/de/app/beafox/id6746110612"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all hover:shadow-md"
                      style={{
                        background: "rgba(232,119,32,0.06)",
                        border: "1px solid rgba(232,119,32,0.15)",
                      }}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 border border-primaryOrange/20">
                        <Image
                          src="/Logo.png"
                          alt="BeAFox"
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-darkerGray leading-tight">BeAFox — Kostenlos</div>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#F97316" stroke="none">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                          <span className="text-[9px] text-lightGray ml-0.5">5.0</span>
                        </div>
                      </div>
                      <div
                        className="text-[11px] font-bold text-white bg-primaryOrange px-3.5 py-1.5 rounded-lg flex-shrink-0"
                        style={{ boxShadow: "0 2px 6px rgba(232,119,32,0.25)" }}
                      >
                        Laden
                      </div>
                    </a>
                  </div>
                </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PRODUKTE — Mega-Menü Panel */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                ref={productsPanelRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="hidden lg:block fixed left-0 right-0 z-50"
                style={{ top: `${PROGRESS_BAR_HEIGHT + 8 + 68 + 12}px` }}
                role="menu"
                aria-label={t("products.label")}
              >
                <div
                  className="mx-auto bg-primaryWhite rounded-2xl shadow-2xl shadow-black/[0.1] border border-gray-200/60 overflow-hidden"
                  style={{ width: "min(820px, calc(100vw - 48px))" }}
                >
                  <div className="flex">
                    <div className="w-[220px] border-r border-gray-100 py-3 px-2 flex-shrink-0 bg-gray-50/50">
                      <div className="px-3 pb-2 mb-1">
                        <span className="text-[10px] font-bold text-lightGray uppercase tracking-widest">
                          {t("products.sidebarTitle")}
                        </span>
                      </div>
                      {PRODUCT_NAV.slice(0, 3).map((p) => {
                        const isCatActive = activeProductId === p.id;
                        const Icon = p.icon;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onMouseEnter={() => setActiveProductId(p.id)}
                            onClick={() => setActiveProductId(p.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                              isCatActive
                                ? "text-primaryOrange bg-primaryOrange/10"
                                : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            {t(PRODUCT_LABEL_KEY[p.id])}
                            <ChevronRight
                              className={`w-3.5 h-3.5 ml-auto transition-opacity duration-150 ${isCatActive ? "opacity-100" : "opacity-0"}`}
                              aria-hidden="true"
                            />
                          </button>
                        );
                      })}
                      <div
                        className="mx-2 my-2 border-t border-gray-200/90"
                        aria-hidden="true"
                      />
                      {PRODUCT_NAV.slice(3).map((p) => {
                        const isCatActive = activeProductId === p.id;
                        const Icon = p.icon;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onMouseEnter={() => setActiveProductId(p.id)}
                            onClick={() => setActiveProductId(p.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                              isCatActive
                                ? "text-primaryOrange bg-primaryOrange/10"
                                : "text-darkerGray hover:text-primaryOrange hover:bg-primaryOrange/5"
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            {t(PRODUCT_LABEL_KEY[p.id])}
                            <ChevronRight
                              className={`w-3.5 h-3.5 ml-auto transition-opacity duration-150 ${isCatActive ? "opacity-100" : "opacity-0"}`}
                              aria-hidden="true"
                            />
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex-1 p-6">
                      <h3 className="text-lg font-bold text-darkerGray mb-3">
                        {t(PRODUCT_LABEL_KEY[activeProduct.id])}
                      </h3>
                      <p className="text-sm text-lightGray leading-relaxed mb-6">
                        {t(PRODUCT_PANEL_DESC[activeProduct.id])}
                      </p>
                      <Link
                        href={activeProduct.href}
                        onClick={closeAll}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primaryOrange hover:gap-3 transition-all"
                      >
                        {t("products.cta")}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="lg:hidden border-t border-gray-200/60 overflow-hidden max-h-[calc(100vh-100px)] overflow-y-auto"
              >
                <div className="px-5 py-5 space-y-1">
                  {navItems.map((item) => {
                    const isActive = isHydrated && pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined} className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-gray-50"}`} onClick={closeAll}>
                        {item.label}
                      </Link>
                    );
                  })}

                  {/* MOBILE RATGEBER ACCORDION */}
                  <div>
                    <button
                      onClick={() => setMobileRatgeberOpen(!mobileRatgeberOpen)}
                      aria-expanded={mobileRatgeberOpen}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${mobileRatgeberOpen ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-gray-50"}`}
                    >
                      Ratgeber
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-200"
                        style={{ transform: mobileRatgeberOpen ? "rotate(-180deg)" : "rotate(0deg)" }}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileRatgeberOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-2 mt-1 space-y-0.5 overflow-hidden"
                        >
                          {ratgeberCategories.map((cat) => {
                            const isOpen = mobileRatgeberCategoryOpen === cat.id;
                            const Icon = cat.icon;
                            return (
                              <div key={cat.id}>
                                <button
                                  onClick={() => setMobileRatgeberCategoryOpen(isOpen ? null : cat.id)}
                                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isOpen ? "text-primaryOrange bg-primaryOrange/5" : "text-darkerGray"}`}
                                >
                                  <Icon className="w-4 h-4" />
                                  {cat.label}
                                  <ChevronDown
                                    size={12}
                                    className="ml-auto transition-transform duration-200"
                                    style={{ transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)" }}
                                  />
                                </button>
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.15 }}
                                      className="ml-6 space-y-0.5 overflow-hidden"
                                    >
                                      {cat.topics.map((topic) => (
                                        <Link key={topic.href} href={topic.href} onClick={closeAll} className="block px-3 py-2 rounded-lg text-xs text-darkerGray hover:text-primaryOrange transition-colors">
                                          {topic.label}
                                        </Link>
                                      ))}
                                      <Link href={cat.href} onClick={closeAll} className="block px-3 py-2 rounded-lg text-xs font-semibold text-primaryOrange">
                                        Alle {cat.label}-Ratgeber →
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
                  </div>

                  {/* MOBILE PRODUKTE */}
                  <div>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-expanded={isDropdownOpen} className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isDropdownOpen || (isHydrated && (pathname.startsWith("/unlimited") || pathname.startsWith("/schulen") || pathname.startsWith("/unternehmen"))) ? "text-primaryOrange bg-primaryOrange/10" : "text-darkerGray hover:text-primaryOrange hover:bg-gray-50"}`}>
                      {t("products.label")}
                      <ChevronDown size={14} aria-hidden="true" className="transition-transform duration-200" style={{ transform: isDropdownOpen ? "rotate(-180deg)" : "rotate(0deg)" }} />
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="ml-4 mt-1 space-y-0.5 overflow-hidden" role="menu">
                          {productItems.slice(0, 3).map((item) => {
                            const isActive =
                              isHydrated &&
                              pathname === item.href.split("#")[0];
                            return (
                              <Link key={item.id} href={item.href} role="menuitem" aria-current={isActive ? "page" : undefined} className={`block px-4 py-2.5 rounded-lg text-sm transition-all duration-150 ${isActive ? "text-primaryOrange font-semibold" : "text-darkerGray hover:text-primaryOrange"}`} onClick={closeAll}>
                                {item.label}
                              </Link>
                            );
                          })}
                          <div className="mx-2 my-1.5 border-t border-gray-200/80" aria-hidden="true" />
                          {productItems.slice(3).map((item) => {
                            const isActive =
                              isHydrated &&
                              pathname === item.href.split("#")[0];
                            return (
                              <Link key={item.id} href={item.href} role="menuitem" aria-current={isActive ? "page" : undefined} className={`block px-4 py-2.5 rounded-lg text-sm transition-all duration-150 ${isActive ? "text-primaryOrange font-semibold" : "text-darkerGray hover:text-primaryOrange"}`} onClick={closeAll}>
                                {item.label}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div aria-hidden="true" className="border-t border-gray-200/60 !mt-3 !mb-3" />

                  {/* CTAS */}
                  <div className="flex gap-3 !mt-4 px-4">
                    <Link href="/kontakt" onClick={closeAll} className="flex-1 text-center px-5 py-2.5 rounded-full text-sm font-semibold text-primaryWhite bg-primaryOrange hover:bg-primaryOrange/85 transition-all duration-200 shadow-sm shadow-primaryOrange/20">{t("actions.contact")}</Link>
                    <a href={APP_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" onClick={closeAll} className="flex-1 text-center px-5 py-2.5 rounded-full text-sm font-semibold text-primaryOrange border-2 border-primaryOrange/30 hover:border-primaryOrange hover:bg-primaryOrange/5 transition-all duration-200">{t("actions.download")}</a>
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