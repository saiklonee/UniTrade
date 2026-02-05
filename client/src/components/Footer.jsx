import { footerLinks } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="mt-24 bg-primary/10">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        {/* Top */}
        <div className="py-12 border-b border-white/10 flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Brand */}
          <div className="max-w-md">
            <img
              className="w-32 md:w-36 select-none"
              src="./storetypo.svg"
              alt="TechStore"
              loading="lazy"
            />

            <p className="mt-5 text-sm leading-6 text-gray-600">
              TechStore brings premium tech, gaming gear, and desk-setup essentials —
              curated for performance and aesthetics.
            </p>

            {/* Quick meta */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-500">
                🚚 Fast Shipping
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-500">
                🔒 Secure Payments
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-500">
                ✅ Verified Products
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="w-full md:w-[52%] grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-sm tracking-wide text-gray-900 mb-4">
                  [ {section.title}]
                </h3>

                <ul className="space-y-2 text-sm">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        className="text-gray-600 hover:text-black transition"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-600">
            © {new Date().getFullYear()} TechStore. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <a
              href="/privacy"
              className="text-gray-600 hover:text-black transition"
            >
              Privacy Policy
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/terms"
              className="text-gray-600 hover:text-black transition"
            >
              Terms
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/contact"
              className="text-gray-600 hover:text-black transition"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
