"use client";

import { motion } from "framer-motion";
import Section from "@/components/Section";
import Image from "next/image";
import { PawPrint, Calendar } from "lucide-react";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Wir haben gewonnen!",
      description:
        "Wir sind stolz darauf, den Deggendorfer Gründerpreis gewonnen zu haben! Trotz Nervosität und einem in letzter Minute überarbeiteten Pitch hat sich unsere Arbeit ausgezahlt - etwa 60% des Publikums haben für uns gestimmt. Vielen Dank an das gesamte Team für die tolle Organisation und die 2.500€ Preisgeld. Wir freuen uns auf weitere Schritte mit BeAFox!",
      image: "/assets/Blogs/Blog1.jpeg",
      date: "2024",
      category: "News",
    },
    {
      id: 2,
      title: "BeAFox bei Ed.One in München!",
      description:
        "So erlebt man Finanzbildung im Klassenzimmer. Beim Ed.One Summit in München haben Schüler, Lehrer und Ausbilder BeAFox live getestet - vom Dashboard über die Lern-App bis hin zu den Arbeitsblättern. Wir haben wertvolles Feedback erhalten, spannende Kontakte geknüpft und unseren Pitch präsentiert. BeAFox zeigt, wie einfach Finanzbildung sein kann. Wir suchen dich!",
      image: "/assets/Blogs/Blog2.jpeg",
      date: "2024",
      category: "Events",
    },
    {
      id: 3,
      title: "BeAFox gewinnt Startup Summit!",
      description:
        "BeAFox hat den 2. Platz beim Startup Summit Germany erreicht - unser erster offizieller Preis! Zum ersten Mal haben wir als Duo gepitcht, mit einem neuen Pitch, Pitch Deck und einer Präsentation, die unsere Vision noch stärker vermittelt hat. Nach zwei Jahren harter Arbeit zeigt es, dass Durchhaltevermögen, Mut und Teamarbeit sich auszahlen. Vielen Dank an die Volksbank am Württemberg eG für diese großartige Veranstaltung!",
      image: "/assets/Blogs/Blog3.jpg",
      date: "2024",
      category: "News",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-primaryWhite pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 text-lightGray text-xs md:text-sm lg:text-lg xl:text-xl border-2 text-center justify-center border-primaryOrange rounded-full px-3 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 w-fit mx-auto mb-6">
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
              <span className="font-bold">Unser Blog</span>
              <PawPrint className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-8 xl:h-8 text-primaryOrange" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-darkerGray mb-6"
          >
            Entdecke, wie BeAFox{" "}
            <span className="text-primaryOrange">zum Leben erweckt</span> wird
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-lightGray max-w-2xl mx-auto"
          >
            Erfahre mehr über unsere Reise, Events, Updates und wie wir
            Finanzbildung für junge Menschen revolutionieren.
          </motion.p>
        </div>
      </Section>

      {/* Blog Posts Section */}
      <Section className="bg-white py-8 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-2 border-primaryOrange rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative h-72 md:h-80 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-primaryOrange bg-primaryOrange/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-lightGray text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-darkerGray mb-3">
                    {post.title}
                  </h3>
                  <p className="text-lightGray text-sm leading-relaxed flex-1 mb-4">
                    {post.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
