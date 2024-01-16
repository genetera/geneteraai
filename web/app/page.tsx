"use client";
import { useState } from "react";
import Hero from "@/components/landing/Hero";
import { Features } from "@/components/landing/features";
import FeatureSection from "@/components/landing/features-section";
import Footer from "@/components/landing/footer";
import Pricing from "@/components/landing/pricing";

export default function Home() {
  return (
    <div className=" bg-white">
      <Hero />
      <Features />
      <FeatureSection />
      <Pricing />
      <Footer />
    </div>
  );
}
