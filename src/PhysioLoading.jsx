import React, { useState, useEffect, useRef } from "react";

// --- CUSTOM HOOKS & UTILS ---

// Hook for scroll reveal animation
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // Only trigger once
      }
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
};

// Component: Animated Number Counter
const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useOnScreen({ threshold: 0.5 });

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = end / (duration / 16); // 60fps approximation

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}</span>;
};

// Component: Scroll Reveal Wrapper
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const delayStyle = { transitionDelay: `${delay}ms` };

  return (
    <div
      ref={ref}
      style={delayStyle}
      className={`transform transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Component: YouTube Facade (Smooth Loading Video Player)
const YouTubeFacade = ({ videoId, poster, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className="relative w-full h-full group cursor-pointer overflow-hidden bg-slate-900"
      onClick={() => setIsPlaying(true)}
    >
      {!isPlaying ? (
        <>
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-500"></div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition duration-300 shadow-xl">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-[#d97706]">
                <svg
                  className="w-6 h-6 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          className="w-full h-full absolute inset-0 animate-[fadeIn_0.5s_ease-out]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

// --- MAIN APPLICATION COMPONENT ---

const PhysioLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState("");

  const openLightbox = (imgSrc) => {
    setLightboxImg(imgSrc);
    setLightboxOpen(true);
  };

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "auto";
  }, [lightboxOpen]);

  return (
    <div
      className={`font-sans text-slate-600 antialiased bg-[#fcfbf9] selection:bg-[#047857] selection:text-white scroll-smooth`}
    >
      {/* 0. TOP ANNOUNCEMENT BAR */}
      {/* <div className="bg-[#0f172a] text-white text-[10px] md:text-xs font-bold tracking-widest uppercase py-2 text-center border-b border-white/10 relative z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span className="hidden md:inline">Accepting New Patients • No Waiting List</span>
          <span className="md:hidden">Same Day Appts Available</span>
          <a href="tel:+919812126760" className="flex items-center gap-1 hover:text-[#d97706] transition">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/><path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z"/></svg>
            +91 (981) 212 6760
          </a>
        </div>
      </div> */}

      {/* 1. GLASS NAV */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-white/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 md:gap-3 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#047857] text-white rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_0_25px_-5px_rgba(4,120,87,0.25)] group-hover:scale-105 transition duration-300">
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                ></path>
              </svg>
            </div>
            <div>
              <span className="block text-base md:text-lg font-serif font-bold text-slate-900 leading-none">
                Dr. Amarjeet Panghal
              </span>
              <span className="hidden md:block text-[10px] text-[#d97706] font-bold tracking-[0.2em] uppercase">
                Physiotherapist
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-slate-500">
            <a href="#about" className="hover:text-[#047857] transition-colors">
              About
            </a>
            <a
              href="#services"
              className="hover:text-[#047857] transition-colors"
            >
              Services
            </a>
            <a
              href="#stories"
              className="hover:text-[#047857] transition-colors"
            >
              Stories
            </a>
            <a
              href="#contact"
              className="bg-[#047857] text-white px-6 py-3 rounded-full shadow-[0_0_25px_-5px_rgba(4,120,87,0.25)] hover:bg-[#0f172a] hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Book Appointment
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-800 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white border-t p-4 space-y-4 shadow-xl border-b border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-slate-700 py-2"
          >
            About
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-slate-700 py-2"
          >
            Services
          </a>
          <a
            href="#stories"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-slate-700 py-2"
          >
            Success Stories
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center bg-[#047857] text-white py-3 rounded-xl font-bold"
          >
            Book Now
          </a>
        </div>
      </header>

      {/* 2. CINEMATIC HERO (REPLACED VIDEO WITH IMAGE) */}
      <section className="relative pt-6 pb-24 md:pt-12 md:pb-32 px-4 md:px-6">
        <div className="container mx-auto relative z-10">
          {/* Main Hero Card */}
          <Reveal>
            <div className="relative h-150 md:h-175 w-full rounded-4xl overflow-hidden shadow-2xl group bg-slate-900">
              {/* Background IMAGE (Replaced Video) */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <img
                  src="/hero.jpg?auto=format&fit=crop&q=80"
                  alt="Modern physiotherapy clinic"
                  className="absolute min-w-full min-h-full w-auto h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-90 transition-transform duration-[10s] hover:scale-105"
                  loading="eager"
                />

                <div className="absolute inset-0 bg-linear-to-r from-[#0f172a]/90 via-[#0f172a]/50 to-transparent/10"></div>
              </div>

              {/* Hero Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 pt-10">
                <div className="max-w-2xl">
                  {/* Badge */}
                  {/* <div className="flex items-center gap-3 mb-6 md:mb-8 animate-[float_6s_ease-in-out_infinite]">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 md:px-4 rounded-full flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse"></span>
                      <span className="text-white text-[10px] md:text-xs font-bold tracking-wider uppercase">Accepting New Patients</span>
                    </div> */}
                  {/* </div> */}

                  {/* Headline */}
                  {/* <h1 className="text-4xl md:text-7xl font-serif font-bold text-white leading-[1.1] mb-6 md:mb-8 drop-shadow-lg">
                    Movement is <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#d1fae5] to-emerald-200">Medicine.</span>
                  </h1> */}

                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-[1.1] mb-6 md:mb-8 drop-shadow-lg">
                    Helping you return to Action without Pain.
                  </h1>
                  {/*                   
                  <p className="text-base md:text-xl text-slate-200 mb-8 md:mb-10 max-w-lg font-light leading-relaxed opacity-90">
                    Expert physiotherapy specializing in neuro recovery and chronic pain management. Reclaim your active life today.
                  </p> */}

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <a
                      href="#contact"
                      className="bg-[#d97706] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-white hover:text-[#d97706] transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
                    >
                      Start Recovery
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                    <a
                      href="#gallery"
                      className="px-8 py-4 rounded-full font-bold text-white border border-white/30 hover:bg-white/10 transition backdrop-blur-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Watch Video
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Premium Floating Cards */}
          <Reveal delay={200}>
            <div className="relative -mt-16 z-20 grid grid-cols-1 md:grid-cols-3 gap-4 px-2 md:px-12">
              <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-2xl transition-all duration-300 border border-white/50 hover:-translate-y-2 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#d1fae5] text-[#047857] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
                      24h Access
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Priority slots for acute pain.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#047857]/95 backdrop-blur-xl text-white p-6 rounded-2xl shadow-[0_0_25px_-5px_rgba(4,120,87,0.25)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-1">
                      Master Class
                    </h3>
                    <p className="text-sm text-green-50 leading-relaxed">
                      8+ Years Experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-2xl transition-all duration-300 border border-white/50 hover:-translate-y-2 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#d1fae5] text-[#047857] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">
                      Private Suites
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      1-on-1 dedicated sessions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. ABOUT & STATS COUNTER */}
      <section id="about" className="py-20 md:py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <div className="w-full lg:w-1/2 relative">
              <Reveal>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#d97706]/10 rounded-full mix-blend-multiply filter blur-2xl"></div>
                <img
                  src="/sonu.jpeg"
                  loading="lazy"
                  alt="Dr. Amarjeet Panghal"
                  className="rounded-4xl shadow-xl relative z-10 w-full object-cover h-100 md:h-150 grayscale hover:grayscale-0 transition duration-700"
                />
              </Reveal>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2">
              <Reveal delay={200}>
                <h4 className="text-[#d97706] font-bold uppercase tracking-widest mb-4 text-xs">
                  Meet Dr. Amarjeet Panghal
                </h4>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 md:mb-8 leading-tight">
                  "Restoring motion <br />{" "}
                  <span className="text-[#047857] italic">
                    Uplifting spirits
                  </span>
                  ."
                </h2>

                <p className="text-lg text-slate-600 mb-5 leading-relaxed font-light">
                  Expert physiotherapist dedicated to restoring mobility and
                  dignity for the elderly. Specializing in post-surgery
                  rehabilitation, neuro-physiotherapy, and cervical care, I
                  offer a holistic approach that blends rigorous physical
                  therapy with essential psychological support. With a track
                  record of 100% treatment success, I am committed to helping
                  senior patients recover their strength and live pain-free
                  lives.
                </p>

                <p className="text-lg text-slate-600 mb-10 leading-relaxed font-light">
                  Healing the Body, Welcoming the Soul.
                </p>

                {/* ANIMATED STATS */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 border-t border-b border-slate-100 py-8">
                  <div className="text-center md:text-left">
                    <div className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a] mb-1 flex items-center justify-center md:justify-start">
                      <Counter end={8} />+
                    </div>
                    <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Years Exp.
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a] mb-1 flex items-center justify-center md:justify-start">
                      <Counter end={1500} />+
                    </div>
                    <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Recoveries
                    </div>
                  </div>
                  <div className="text-center md:text-left col-span-2 md:col-span-1">
                    <div className="text-3xl md:text-4xl font-serif font-bold text-[#0f172a] mb-1 flex items-center justify-center md:justify-start">
                      <Counter end={100} />%
                    </div>
                    <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Commitment
                    </div>
                  </div>
                </div>

                {/* Credentials */}
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 rounded-full text-[10px] md:text-xs font-bold text-slate-600 border border-slate-200">
                    M.D. (A.M.)
                  </span>
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 rounded-full text-[10px] md:text-xs font-bold text-slate-600 border border-slate-200">
                    BPT
                  </span>
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 rounded-full text-[10px] md:text-xs font-bold text-slate-600 border border-slate-200">
                    Acupressure
                  </span>
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 rounded-full text-[10px] md:text-xs font-bold text-slate-600 border border-slate-200">
                    Master in Naturopathy and Yoga
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION (Bento Grid) */}
      <section id="services" className="py-24 bg-[#fcfbf9] relative">
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>

        <div className="container mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#047857] font-bold uppercase tracking-widest text-xs bg-[#d1fae5]/50 px-3 py-1 rounded-full">
                Our Expertise
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mt-4 mb-6">
                Clinical Precision. <br />
                Holistic Care.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1 */}
            <Reveal>
              <div className="group bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#047857] to-[#d97706] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-14 h-14 bg-[#d1fae5] text-[#047857] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#047857] transition">
                  Cervical Expertise
                </h3>
                <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                  Applying advanced cervical techniques, we resolve complex
                  nerve compression and structural misalignments to restore
                  total neck mobility and neurological health.
                </p>
              </div>
            </Reveal>

            {/* Service 2 */}
            <Reveal delay={100}>
              <div className="group bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#047857] to-[#d97706] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-14 h-14 bg-orange-100 text-[#d97706] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#047857] transition">
                  Manual Therapy
                </h3>
                <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                  With skilled hands, we apply precise joint and soft-tissue
                  techniques to dissolve muscle tension and restore your body’s
                  natural range of motion.
                </p>
              </div>
            </Reveal>

            {/* Service 2 */}
            <Reveal delay={100}>
              <div className="group bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#047857] to-[#d97706] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-14 h-14 bg-orange-100 text-[#d97706] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#047857] transition">
                  Senior Mobility Support
                </h3>
                <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                  Restoring Strength. Reclaiming Confidence. With expert
                  guidance, we build physical stability and ease the fear of
                  falling, returning you to a safe and independent life.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="group bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#047857] to-[#d97706] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-14 h-14 bg-orange-100 text-[#d97706] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#047857] transition">
                  Neuro Recovery{" "}
                </h3>
                <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                  Restoring Control. Through clinical mastery, we stimulate
                  neurological pathways to improve motor function and help you
                  reclaim command over your body.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="group bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#047857] to-[#d97706] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-14 h-14 bg-orange-100 text-[#d97706] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#047857] transition">
                  Acupressure Targeted Relief
                </h3>
                <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                  Applying precise pressure, we stimulate vital points to
                  release deep-seated tension, alleviate pain, and restore your
                  body’s natural energy flow.
                </p>
              </div>
            </Reveal>

            {/* Service 3 */}
            <Reveal delay={200}>
              <div className="group bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#047857] to-[#d97706] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-14 h-14 bg-[#d1fae5] text-[#047857] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#047857] transition">
                  Post-Surgery Recovery
                </h3>
                <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                  Our expert approach bridges the gap between surgery and daily
                  life, ensuring a full and functional recovery.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE GALLERY */}
     <section id="gallery" className="py-24 bg-white relative">
  <div className="container mx-auto px-6">
    <Reveal>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
          Treatment <span className="text-[#d97706]">Gallery</span>
        </h2>
        <p className="text-slate-500">
          State-of-the-art facilities designed for your comfort.
        </p>
      </div>
    </Reveal>

    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-5 h-[900px] md:h-[700px]">

      {/* Primary (Hero) */}
      <div
        className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden
        shadow-lg hover:shadow-2xl transition-all duration-500
        group cursor-zoom-in"
        onClick={() => openLightbox("/1.jpeg?auto=format&fit=crop&q=80")}
      >
        <Reveal delay={100} className="h-full">
          <img
            src="/1.jpeg?auto=format&fit=crop&q=80"
            alt="Physiotherapy Session"
            className="w-full h-full object-cover
            transition-transform duration-700
            group-hover:scale-110"
          />
        </Reveal>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Secondary */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-md
        hover:shadow-xl transition-all duration-500
        group cursor-zoom-in"
        onClick={() => openLightbox("/2.jpeg?auto=format&fit=crop&q=80")}
      >
        <Reveal delay={200} className="h-full">
          <img
            src="/2.jpeg?auto=format&fit=crop&q=80"
            alt="Equipment"
            className="w-full h-full object-cover
            transition-transform duration-700
            group-hover:scale-110"
          />
        </Reveal>

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div
        className="relative rounded-3xl overflow-hidden shadow-md
        hover:shadow-xl transition-all duration-500
        group cursor-zoom-in"
        onClick={() => openLightbox("/3.jpeg?auto=format&fit=crop&q=80")}
      >
        <Reveal delay={250} className="h-full">
          <img
            src="/3.jpeg?auto=format&fit=crop&q=80"
            alt="Manual Therapy"
            className="w-full h-full object-cover
            transition-transform duration-700
            group-hover:scale-110"
          />
        </Reveal>

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Wide */}
      {/* <div
        className="md:col-span-2 relative rounded-3xl overflow-hidden shadow-md
        hover:shadow-xl transition-all duration-500
        group cursor-zoom-in"
        onClick={() => openLightbox("/4.jpeg?auto=format&fit=crop&q=80")}
      >
        <Reveal delay={300} className="h-full">
          <img
            src="/4.jpeg?auto=format&fit=crop&q=80"
            alt="Rehabilitation"
            className="w-full h-full object-cover
            transition-transform duration-700
            group-hover:scale-110"
          />
        </Reveal>

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div> */}

      {/* Supporting */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-md
        hover:shadow-xl transition-all duration-500
        group cursor-zoom-in"
        onClick={() => openLightbox("/5.jpeg?auto=format&fit=crop&q=80")}
      >
        <Reveal delay={350} className="h-full">
          <img
            src="/5.jpeg?auto=format&fit=crop&q=80"
            alt="Therapy"
            className="w-full h-full object-cover
            transition-transform duration-700
            group-hover:scale-110"
          />
        </Reveal>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div
        className="relative rounded-3xl overflow-hidden shadow-md
        hover:shadow-xl transition-all duration-500
        group cursor-zoom-in"
        onClick={() => openLightbox("/6.jpeg?auto=format&fit=crop&q=80")}
      >
        <Reveal delay={400} className="h-full">
          <img
            src="/6.jpeg?auto=format&fit=crop&q=80"
            alt="Exercise Therapy"
            className="w-full h-full object-cover
            transition-transform duration-700
            group-hover:scale-110"
          />
        </Reveal>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

    </div>
  </div>
</section>


      {/* 6. TESTIMONIALS */}
    
{/* 
      7. FLOATING CONTACT */}
      <section
        id="contact"
        className="py-24 bg-[#0f172a] text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-125 h-125 bg-[#047857] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-lg rounded-[2.5rem] border border-white/10 p-8 md:p-16 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <Reveal>
                <div>
                  <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                    Start your <br />
                    recovery.
                  </h2>
                  <p className="text-slate-400 text-lg mb-10">
                    We accept major insurance plans. <br />
                    Book online or call us directly.
                  </p>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#047857] flex items-center justify-center text-white shadow-[0_0_25px_-5px_rgba(4,120,87,0.25)]">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="text-2xl font-serif font-bold">
                      +91 981 212 6760
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-6 py-4 placeholder-slate-400 focus:bg-white/20 focus:outline-none transition"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-6 py-4 placeholder-slate-400 focus:bg-white/20 focus:outline-none transition"
                    />
                  </div>
                  <select className="w-full bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-slate-300 focus:bg-white/20 focus:outline-none transition">
                    <option className="bg-[#0f172a]">Pain Consultation</option>
                    <option className="bg-[#0f172a]">Sports Recovery</option>
                  </select>
                  <button className="w-full bg-white text-[#0f172a] font-bold text-lg py-4 rounded-xl hover:bg-[#d97706] hover:text-white transition shadow-lg">
                    Request Appointment
                  </button>
                </form>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/9812126760?text=Hello%20Dr.%20Amarjeet%20Panghal,%20I%20would%20like%20to%20book%20an%20appointment."
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-sm font-bold">
          Chat with Dr. Amarjeet
        </span>
      </a>

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-white/5 py-12 text-center text-slate-500 text-sm">
        <p>
          &copy; 2025 Dr. Amarjeet Panghal Physiotherapy. All rights reserved.
        </p>
      </footer>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition p-2"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <img
            src={lightboxImg}
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-white/10"
            alt="Enlarged view"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setLightboxOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default PhysioLanding;
