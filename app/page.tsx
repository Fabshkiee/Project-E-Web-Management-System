import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Why from "@/components/landing/Why";
import Trainers from "@/components/landing/Trainers";
import Membership from "@/components/landing/Membership";
import "@/styles/landing.css";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-space bg-land-bg">
      <Header />
      <main className="grow">
        <Hero />
        <Why />
        <Trainers />
        <Membership />
      </main>

      <Footer />
    </div>
  );
}