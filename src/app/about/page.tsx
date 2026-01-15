"use client";
import {
  Atom,
  Cpu,
  Globe,
  Landmark,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155]">
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 py-16 px-6 text-center">
        <h1 className="text-4xl md:text-4xl font-extrabold text-[#1e293b] mb-4">
          About <span className="text-indigo-600">US</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
          In today&apos;s fast-moving digital marketplace, data is power, but
          only when it&apos;s accurate, timely, and actionable. We built
          CompareX to help businesses, developers, and analysts effortlessly
          collect and monitor ecommerce data at scale. Our platform is designed
          to crawl online stores and marketplaces, extract meaningful product
          insights, and rank them based on price and relevance.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Our Mission Section */}
        <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-[#1e293b]">Our Mission</h2>
          </div>
          <p className="text-gray-600 text-lg mb-8 max-w-4xl">
            Our mission is to simplify online shopping by cutting through
            information overload and bringing clarity where it matters most. We
            believe transparency empowers better decisions, so we make pricing
            clear, comparable, and easy to understand. By turning scattered data
            into meaningful insights, we help users confidently make smarter,
            faster, and more informed purchasing decisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Save Time & Money",
                desc: "We eliminate the need to visit multiple websites by showing you all available prices in one place.",
                icon: <Landmark />,
                gradient: "from-blue-50 to-indigo-50",
              },
              {
                title: "Transparency First",
                desc: "We provide unbiased price comparisons without favoring any particular retailer. Accuracy is our priority.",
                icon: <ShieldCheck />,
                gradient: "from-slate-50 to-gray-50",
              },
              {
                title: "Comprehensive Coverage",
                desc: "From electronics to household goods, we track prices across hundreds of retailers globally.",
                icon: <Atom />,
                gradient: "from-violet-50 to-purple-50",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group relative p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-600 to-blue-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-bl-full" />

                {/* Icon Container */}
                <div className="relative mb-6 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <span className="text-2xl">{card.icon}</span>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-[15px]">
                    {card.desc}
                  </p>
                </div>

                {/* Bottom Border Animation */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Hover Indicator */}
                <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                  >
                    <title>Arrow Right</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works (Tech Stack) */}
        <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-[#1e293b]">What We Do</h2>
          </div>
          <p className="text-gray-600 text-lg mb-8 max-w-4xl">
            Our platform uses advanced web crawling technology to search
            products across various ecommerce websites in real time. Once
            products are collected, we apply AI-powered ranking to organize
            results based on:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Globe />,
                title: "Price Competitiveness",
                desc: "How the product’s price compares with similar items across platforms.",
              },
              {
                icon: <Cpu />,
                title: "Overall Value",
                desc: "Balance of price, usefulness, and quality indicators.",
              },
              {
                icon: <Zap />,
                title: "Seller Credibility",
                desc: "Trustworthiness of the seller based on ratings and history.",
              },
              {
                icon: <ShieldCheck />,
                title: "Product Popularity",
                desc: "User demand reflected through reviews and engagement.",
              },
            ].map((tech) => (
              <div
                key={tech.title}
                className="group p-8 bg-[#f8fafc] rounded-xl text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex justify-center mb-4 text-indigo-600">
                  {React.cloneElement(tech.icon as React.ReactElement, {
                    size: 40,
                  })}
                </div>
                <h3 className="text-lg font-bold text-[#1e293b] mb-2">
                  {tech.title}
                </h3>
                <p className="text-gray-500 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-indigo-600 rounded-3xl p-12 text-white text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: "5M+", label: "Products Crawled" },
              { val: "200+", label: "Trending Products" },
              { val: "2.5M+", label: "Monthly Users" },
              { val: "$85M+", label: "Saved by Users" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-extrabold mb-2">{stat.val}</div>
                <div className="text-indigo-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-[#1e293b]">Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Tchuisseu Ryan",
                role: "CEO & Founder",
                bio: "Former e-commerce executive with 10+ years in the industry.",
                initials: "TR",
              },
              {
                name: "Fokou Jovien",
                role: "CTO",
                bio: "Expert in scalable web architectures and data mining.",
                initials: "FJ",
              },
              {
                name: "Noupi Duran",
                role: "Head of Data Science",
                bio: "Specializes in price prediction and trend analysis.",
                initials: "ND",
              },
              {
                name: "Njanja Herve",
                role: "Lead Developer",
                bio: "Full-stack developer focused on UX and performance.",
                initials: "NH",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                {/* Avatar Section */}
                <div className="relative pt-10 px-6">
                  <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 border-4 border-white shadow-lg flex items-center justify-center group-hover:from-indigo-200 group-hover:to-blue-200 transition-all duration-300">
                    <div className="text-2xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                      {member.initials}
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute bottom-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Section */}
                <div className="p-6 pt-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                    {member.name}
                  </h3>

                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 text-sm font-semibold mb-4 group-hover:from-indigo-100 group-hover:to-blue-100 transition-all duration-300">
                    {member.role}
                  </div>

                  <p className="text-gray-600 text-[15px] leading-relaxed mb-6 px-2">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <a
                      href="https://twitter.com"
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        role="img"
                      >
                        <title>Twitter</title>
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com"
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        role="img"
                      >
                        <title>LinkedIn</title>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Hover Effect Bottom Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
