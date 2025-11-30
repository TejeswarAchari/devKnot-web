// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-[11px] text-slate-300 sm:flex-row">
        
        {/* Brand + text */}
        <aside className="flex items-center gap-2 text-[11px]">
          <img className="h-5" src="logo.png"/>
          <span className="text-amber-400 font-bold"> DevKnot</span>
          <span>© {new Date().getFullYear()} — All rights reserved.</span>
        </aside>

        {/* Social Media */}
        <nav className="flex items-center gap-5 text-[12px]">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/tejeswarachari-vadla/"
            target="_blank"
            rel="noreferrer"
            className="opacity-80 hover:opacity-100 hover:text-amber-400 transition"
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 
                2.239 5 5 5h14c2.762 0 5-2.239 
                5-5v-14c0-2.761-2.238-5-5-5zm-11 
                19h-3v-10h3v10zm-1.5-11.268c-.966 
                0-1.75-.79-1.75-1.764 0-.973.784-1.764 
                1.75-1.764s1.75.791 
                1.75 1.764c0 .974-.784 1.764-1.75 
                1.764zm13.5 11.268h-3v-5.356c0-1.276
                -.025-2.918-1.775-2.918-1.777 
                0-2.049 1.387-2.049 2.824v5.45h-3v-10h2.881v1.367h.041c.401-.76
                1.379-1.563 2.84-1.563 3.039 
                0 3.613 2.002 3.613 4.604v5.592z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/being_tejeswar?igsh=OG5qcHViam5xbHhm"
            target="_blank"
            rel="noreferrer"
            className="opacity-80 hover:opacity-100 hover:text-amber-400 transition"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 
                4.85.07 1.366.062 2.633.35 
                3.608 1.326.975.975 1.264 
                2.242 1.326 3.608.058 1.266.07 
                1.646.07 4.85s-.012 3.584-.07 
                4.85c-.062 1.366-.35 2.633-1.326 
                3.608-.975.975-2.242 1.264-3.608 
                1.326-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.35
                -3.608-1.326-.975-.975-1.264-2.242
                -1.326-3.608-.058-1.266-.07-1.646
                -.07-4.85s.012-3.584.07-4.85c.062
                -1.366.35-2.633 1.326-3.608.975
                -.975 2.242-1.264 3.608-1.326 
                1.266-.058 1.646-.07 4.85-.07zm0 
                5.838a4 4 0 100 8 4 4 0 000-8zm6.406
                -2.196a1.044 1.044 0 11-2.088 
                0 1.044 1.044 0 012.088 0z"/>
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com/@tejuschaos?si=8SEcsbYR8vcT9_Tj"
            target="_blank"
            rel="noreferrer"
            className="opacity-80 hover:opacity-100 hover:text-amber-400 transition"
            aria-label="YouTube"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a2.974 2.974 
                0 00-2.09-2.103c-1.846-.5-9.268-.5
                -9.268-.5s-7.421 0-9.267.5a2.975 
                2.975 0 00-2.091 2.103c-.502 
                1.853-.502 5.73-.502 5.73s0 
                3.877.502 5.73a2.974 2.974 0 002.09 
                2.103c1.846.5 9.268.5 9.268.5s7.422 
                0 9.268-.5a2.973 2.973 0 002.09
                -2.103c.503-1.853.503-5.73.503
                -5.73s-.001-3.877-.503-5.73zM9.75 
                15.568v-6.764l6.5 3.382-6.5 3.382z"/>
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
