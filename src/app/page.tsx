"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MainPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 md:px-8">
      <h1 className={`relative mb-10 text-center text-4xl font-bold text-gray-800 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
        About Me
      </h1>
      <div className={`flex flex-col gap-12 md:flex-row md:items-center md:space-x-8 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center justify-center md:w-2/5">
          <Image
            src="https://utfs.io/f/9p4lEQTK2OGEPcfXiRAs54VUcnKfbMWItD8GdHNET6Zxzh7l"
            alt="Artist Photo"
            width={600}
            height={800}
            className="w-3/4 rounded-lg object-cover shadow-lg md:w-full"
          />
        </div>
        <div className={`text-lg leading-relaxed text-gray-700 md:w-1/2 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <p className="mb-6">
            My name is Aurora Khokhliuk and I am an artist from Kyiv, Ukraine,
            currently living and creating in Poland. My work spans various
            techniques, with watercolor paints, charcoal, ink, and graphite
            being my most frequently used mediums. In addition to graphic arts,
            I also work with sculpture, where I strive to convey metaphysical
            concepts through physical form.
          </p>
          <p className="mb-6">
            My art is deeply connected to my belief that material art holds
            significantly greater value. I believe that the true power of a
            piece lies in its physical form, something that can be felt and
            interacted with in real space. In my creative process, I experiment
            with contrasts and material interactions, exploring the
            possibilities of artistic expression through texture and form.
          </p>
          <p className="mb-6">
            I actively participate in exhibitions throughout Poland, showcasing
            both my graphic and sculptural works. Feel free to explore my
            gallery or contact me if you&apos;d like to learn more about my art!
          </p>
        </div>
      </div>
    </section>
  );
}
