import { footerLinks } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="mt-24 bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          {/* Brand */}
          <div className="max-w-xs">
            <img
              className="h-8 w-auto mb-6 opacity-90"
              src="/storetypo.svg"
              alt="UniTrade"
            />
            <p className="text-sm text-gray-500 leading-relaxed">
              UniTrade is the premier marketplace for university students. Buy, sell, and trade essentials within your campus community securely.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-sm text-gray-900 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        className="text-sm text-gray-500 hover:text-black transition-colors"
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
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} UniTrade. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-xs text-gray-400 hover:text-gray-900 transition">Privacy</a>
            <a href="/terms" className="text-xs text-gray-400 hover:text-gray-900 transition">Terms</a>
            <a href="/cookies" className="text-xs text-gray-400 hover:text-gray-900 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
