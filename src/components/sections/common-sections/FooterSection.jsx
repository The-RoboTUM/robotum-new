import * as assets from "@assets";

export default function FooterSection() {
  return (
    <footer className="bg-primary text-white section-container pt-16 pb-10 font-exo">
      <div className="flex flex-wrap justify-center md:justify-between gap-8 text-center md:text-left">
        {/* Logo and Description */}
        <div className="flex flex-col gap-4 items-center md:items-start min-w-40">
          <img
            src={assets.logo}
            alt="RoboTUM Logo"
            className="h-10 mx-auto md:mx-0"
          />
          <p className="text-gray-400 text-sm max-w-xs">
            RoboTUM is a student-driven robotics club exploring AI, design, and
            engineering to push the limits of autonomous systems.
          </p>
        </div>

        {/* Quick Links */}
        <div className="min-w-40">
          <h3 className="font-semibold text-lg mb-3">Explore</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-300">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white">
                About us
              </a>
            </li>
            <li>
              <a href="/projects" className="hover:text-white">
                Projects
              </a>
            </li>
            <li>
              <a href="/events" className="hover:text-white">
                Events
              </a>
            </li>
            <li>
              <a href="/partners" className="hover:text-white">
                Partners
              </a>
            </li>
            <li>
              <a href="/join" className="hover:text-white">
                Join us
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className="min-w-40">
          <h3 className="font-semibold text-lg mb-3">Legal</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-300">
            <li>
              <a href="/impressum" className="hover:text-white">
                Impressum
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/gender-and-diversity" className="hover:text-white">
                Gender and Diversity
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="min-w-40">
          <h3 className="font-semibold text-lg mb-3">Follow us</h3>
          <div className="flex justify-center md:justify-start gap-4 mt-2 bg-primary p-4 rounded-md">
            <a
              href="https://www.instagram.com/therobotum/"
              className="hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assets.instagramIcon}
                alt="Instagram"
                className="h-6 w-6"
              />
            </a>

            <a
              href="https://www.linkedin.com/company/therobotum"
              className="hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assets.linkedinIcon}
                alt="LinkedIn"
                className="h-6 w-6"
              />
            </a>

            <a
              href="https://chat.whatsapp.com/BZVTC6IfYwkFSvRfkJhn5e"
              className="hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assets.whatsappIcon}
                alt="WhatsApp"
                className="h-6 w-6 filter invert"
              />
            </a>

            <a
              href="https://t.me/theRoboTUM"
              className="hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assets.telegramIcon}
                alt="Telegram"
                className="h-6 w-6 filter invert"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8 border-gray-700" />

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 text-center gap-2">
        <span>© 2025 RoboTUM. All rights reserved.</span>
        <span>Built with ❤️ by RoboTUM Team</span>
      </div>
    </footer>
  );
}
