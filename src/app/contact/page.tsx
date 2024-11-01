"use client"

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delay before showing the content

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 md:px-8">
      <h1 className={`mb-16 text-center text-4xl font-bold text-gray-800 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
        Contact Me
      </h1>
      <div className={`flex flex-col gap-12 md:flex-row-reverse md:items-center md:space-x-8 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center justify-center md:w-2/5">
          <Image
            src="https://utfs.io/f/9p4lEQTK2OGElx7dyfpFh2UcKGnj0MksQ4fLZxl7TVqwp6EI"
            alt="Artist Photo"
            width={600}
            height={800} 
            quality={100}
            className="w-3/4 rounded-lg object-cover shadow-lg md:w-full transition-transform duration-500 ease-in-out transform" 
          />
        </div>
        <div className={`text-lg leading-relaxed text-gray-700 md:w-1/2 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <p className="mb-6 text-xl font-semibold text-gray-600">
            Feel free to reach out through any of the following channels:
          </p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <Link
                href="https://www.instagram.com/avecusho/"
                aria-label="Instagram"
                className="flex items-center space-x-3"
              >
                <FaInstagram className="h-8 w-8 text-pink-500 transition hover:text-pink-700" />
                <span className="text-lg text-gray-700">Instagram</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="https://t.me/avecushoz"
                aria-label="Telegram"
                className="flex items-center space-x-3"
              >
                <FaTelegramPlane className="h-8 w-8 text-blue-500 transition hover:text-blue-700" />
                <span className="text-lg text-gray-700">Telegram</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="mailto:hohliykaurora2008@gmail.com"
                aria-label="Email"
                className="flex items-center space-x-3"
              >
                <MdAlternateEmail className="h-8 w-8 text-gray-600 transition hover:text-gray-800" />
                <span className="text-lg text-gray-700">Email</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
