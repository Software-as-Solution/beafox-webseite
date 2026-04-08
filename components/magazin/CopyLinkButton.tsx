"use client";

import React from "react";
import { Link2 } from "lucide-react";

interface CopyLinkButtonProps {
  cluster: string;
  slug: string;
  copyTitle: string;
}

export default function CopyLinkButton({ cluster, slug, copyTitle }: CopyLinkButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const url = `https://beafox.app/magazin/${cluster}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={copyTitle}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-primaryOrange hover:text-white transition-all duration-200"
    >
      {copied ? <span className="text-sm font-semibold">✓</span> : <Link2 size={18} />}
    </button>
  );
}
