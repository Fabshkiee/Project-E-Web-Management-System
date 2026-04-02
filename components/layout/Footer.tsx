import Link from "next/link";
import Image from "next/image";

// ============================================================
// QUICK LINKS — Edit labels and hrefs here
// ============================================================
const quickLinks = [
  { label: "Features", href: "#features" },
  { label: "Trainers", href: "#trainers" },
  { label: "Pricing", href: "#pricing" },
  { label: "Member Portal", href: "/login" },
];

// ============================================================
// CONTACT INFO — Edit address, email, and phone here
// ============================================================
const contactInfo: { icon: React.ReactNode; text: React.ReactNode; href?: string }[] = [
  {
  icon: (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  ),
  text: (
    <>
      240 Jalandoni St,<br />
      Iloilo City Proper, <br />
      Iloilo City, Iloilo
    </>
  ),
  href: "https://share.google/PBrrxAxJiRzYxg0LN",
},
  {
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    text: "dioneseric50@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&to=dioneseric50@gmail.com", // Gmail compose link
  },
  {
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    text: "+63 9967420667", // No href — plain text, not clickable
  },
];

// ============================================================
// SOCIAL LINKS — Edit hrefs here to update social media links
// ============================================================
const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/project.efitness",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1FQ5yW8hRf/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#", // Replace with YouTube link when available
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    // ============================================================
    // FOOTER WRAPPER — Background color and font set here
    // ============================================================
    <footer className="w-full bg-[#120C0D]" style={{ fontFamily: "var(--font-space), sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* ── BRAND COLUMN — Logo, name, tagline ── */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5 select-none w-fit">
              <Image src="/proje_logo.svg" alt="Project-E Gym Logo" width={24} height={22} />
              <span className="text-white font-bold text-sm tracking-wide">Project-E Gym</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Redefining fitness with technology and community. Train harder, train smarter.
            </p>
          </div>

          {/* ── QUICK LINKS COLUMN ── */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-500 hover:text-white text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── CONTACT COLUMN — Address, email, phone ── */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase">Contact</h4>
            <ul className="flex flex-col gap-3">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-gray-500 text-sm">
                  <span className="mt-0.5">{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ── FOLLOW US COLUMN — Social media icons ── */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase">Follow Us</h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors duration-200"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ── DIVIDER LINE ── */}
        <div className="mt-10 border-t border-white/10" />

        {/* ── COPYRIGHT BAR ── */}
        <div className="mt-6">
          <p className="text-gray-600 text-xs">© 2026 Project-E Fitness Gym. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
