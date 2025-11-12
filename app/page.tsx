import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen text-gray-800 px-8 py-8">
      {/* --- Top Section: Photo + Info --- */}
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl mx-auto space-y-8">
        <section className="flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Left: Profile Image */}
          <Image
            src="/rhys_wiers.jpg"
            alt="Profile photo"
            width={180}
            height={180}
            className="rounded-2xl shadow-lg object-cover"
          />

          {/* Right: Info */}
          <div className="text-center md:text-left space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">Rhys Wiers</h1>
            <p className="text-lg text-gray-600">
              Mathematics & Computer Science Student
            </p>

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
              <a
                href="mailto:rhysmsu@gmail.com"
                className="px-4 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Email
              </a>
              <a
                href="https://github.com/Rhys-Wiers"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/rhys-wiers-b94859355/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* --- Bio Section --- */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">About Me</h2>
          <p className="text-gray-600 leading-relaxed">
            Hello! I’m Rhys Wiers, a passionate Mathematics and Computer Science student
            at Grand Valley State University. I’m driven by curiosity — I love exploring 
            how logic and creativity intersect in computer science and mathematics. My 
            projects range from data analysis and machine learning experiments to interactive 
            visualizations and web applications. When I’m not coding, I enjoy writing music 
            and improving my skills on the guitar.
          </p>
        </section>
      </div>

      {/* --- Projects Section --- */}
      <section className="text-center bg-white rounded-2xl shadow-md p-6 max-w-4xl mx-auto mt-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">My Projects</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/projects/automata"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Automata Visualizer
          </Link>
          <Link
            href="/projects/number-theory"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Number Theory Tools
          </Link>
          <Link
            href="/projects/ml-experiments"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ML Experiments
          </Link>
        </div>
      </section>
    </main>
  );
}
