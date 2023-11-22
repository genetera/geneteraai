"use client";
import { useState } from "react";
import Hero from "@/components/landing/Hero";
import { Features } from "@/components/landing/features";

export default function Home() {
  return (
    <div className=" bg-white">
      <Hero />
      <Features />
    </div>
  );
}
