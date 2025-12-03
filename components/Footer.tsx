import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-darkerGray border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/assets/Logo-EST.jpg"
                alt="BeAFox Logo"
                width={150}
                height={50}
                className="object-contain h-12"
              />
            </Link>
            <p className="text-lightGray mb-6 text-sm leading-relaxed max-w-xs">
              Das erste unabhängige, spielerische Lern-App für Finanzbildung
              junger Menschen.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/beafox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lightGray hover:text-primaryOrange hover:bg-primaryOrange/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com/company/beafox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lightGray hover:text-primaryOrange hover:bg-primaryOrange/10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">Menü</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Startseite
                </Link>
              </li>
              <li>
                <Link
                  href="/ueber-beafox"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Über BeAFox
                </Link>
              </li>
              <li>
                <Link
                  href="/preise"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Preise
                </Link>
              </li>
              <li>
                <Link
                  href="/fuer-unternehmen"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Für Unternehmen
                </Link>
              </li>
              <li>
                <Link
                  href="/fuer-schulen"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Für Schulen
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">
              Rechtliches
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/impressum"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  AGB
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+491782723673"
                  className="text-lightGray hover:text-primaryOrange transition-colors text-sm"
                >
                  +49 178 2723 673
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:info@beafox.app"
                  className="text-lightGray hover:text-primaryOrange transition-colors text-sm"
                >
                  info@beafox.app
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primaryOrange flex-shrink-0 mt-0.5" />
                <span className="text-lightGray text-sm">
                  93073 Neutraubling
                </span>
              </li>
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="text-darkerGray font-bold mb-6 text-lg">Blog</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm block"
                >
                  Alle Artikel
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/updates"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm block"
                >
                  Updates
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/finanzbildung"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm block"
                >
                  Finanzbildung
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/news"
                  className="hover:text-primaryOrange transition-colors text-lightGray text-sm block"
                >
                  News
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-lightGray">
            <p>
              Copyright © {new Date().getFullYear()} BeAFox UG
              (haftungsbeschränkt)
            </p>
            <p>
              Designed By{" "}
              <strong className="text-darkerGray">Explainerium</strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
