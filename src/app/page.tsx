"use client";

import { useState } from "react";
import ParticlesBackground from "@/components/ParticlesBackground";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import OrderPanel from "@/components/OrderPanel";
import SeedingBanner from "@/components/SeedingBanner";
import BenefitsSection from "@/components/BenefitsSection";
import ReviewsSection from "@/components/ReviewsSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Facebook");

  return (
    <>
      <ParticlesBackground />
      <Header />
      <main className="pt-24 overflow-hidden">
        <HeroSection />
        <ServicesSection onSelectCategory={setSelectedCategory} />
        <OrderPanel selectedCategoryName={selectedCategory} />
        <SeedingBanner />
        <BenefitsSection />
        <ReviewsSection />
        <StatsSection />
      </main>
      <Footer />
    </>
  );
}
