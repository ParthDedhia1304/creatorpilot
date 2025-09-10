"use client"
import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      {/* Header */}
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full border-b border-gray-200 dark:border-neutral-800">
        <nav className="relative max-w-[85rem] w-full mx-auto flex items-center justify-between p-4 lg:px-8">
          {/* Logo + Tagline */}
          <div className="flex items-center gap-2">
            <Image src={'/darkmodelogo.png'} alt="CreatorPilot" width={160} height={50} />
            <span className="hidden sm:block text-xs text-gray-500 dark:text-neutral-400 ml-1">
              AI Tools for Creators
            </span>
          </div>

          {/* Auth */}
          <div className="flex items-center">
            {!user ? (
              <SignInButton mode="modal" signUpForceRedirectUrl={"/dashboard"}>
                <div className="flex items-center gap-x-2 font-medium text-gray-600 hover:text-red-500 dark:text-neutral-300 dark:hover:text-red-400 cursor-pointer">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 
                    2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 
                    1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 
                    10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 
                    1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                  Get Started
                </div>
              </SignInButton>
            ) : (
              <UserButton />
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden flex flex-col items-center text-center px-6 py-24 lg:py-32">
        {/* Background Shape */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-pink-600/5 dark:from-red-500/20 dark:to-pink-500/10 blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <h1 className="font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-tight text-gray-900 dark:text-white">
          Supercharge Your Creativity with{" "}
          <span className="bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 text-transparent">
            CreatorPilot
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-neutral-400 leading-relaxed">
          CreatorPilot is your AI-powered copilot for content creation 🚀.  
          From **smart thumbnail search** to **outlier detection**,  
          **AI content generation**, and **keyword research** —  
          everything you need to build, optimize, and scale your creative journey.
        </p>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-medium rounded-lg py-3 px-6 shadow-lg transition"
          >
            Get Started Free
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-[85rem] mx-auto px-6 lg:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard 
          title="Thumbnail Search" 
          description="Find the perfect thumbnail instantly with AI-powered face & image search."
          icon="🖼️"
        />
        <FeatureCard 
          title="Keyword Research" 
          description="Boost your reach with AI-driven keyword insights for trending topics."
          icon="🔑"
        />
        <FeatureCard 
          title="Outlier Detection" 
          description="Spot content that stands out and optimize performance like a pro."
          icon="📊"
        />
        <FeatureCard 
          title="AI Content Generator" 
          description="Generate engaging titles, descriptions, and scripts in seconds."
          icon="🤖"
        />
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-neutral-800 py-6 text-center text-sm text-gray-500 dark:text-neutral-400">
        © {new Date().getFullYear()} CreatorPilot. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 font-semibold text-lg text-gray-800 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">{description}</p>
    </div>
  );
}
