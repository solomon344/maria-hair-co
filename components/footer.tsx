export const Footer = () => {
  return (
    <footer className="w-full bg-[#1a120b] text-[#f5f0eb]">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-header font-bold mb-4">Mariéa Hair Co.</h3>
            <p className="text-[#c4b5a0] font-body leading-relaxed max-w-md">
              Naturally rooted. Engineered for brilliance. We blend organic botanical wisdom with modern hair science to create professional-grade, sustainable hair care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4 text-[#a0896e]">Quick Links</h4>
            <ul className="space-y-3">
              {["Shop All", "New Arrivals", "Hair Care", "Our Story"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#c4b5a0] hover:text-white transition-colors duration-200 font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4 text-[#a0896e]">Support</h4>
            <ul className="space-y-3">
              {["Contact Us", "Shipping & Returns", "FAQ", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[#c4b5a0] hover:text-white transition-colors duration-200 font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2a2017] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#6a5a4a] text-sm font-light">
            © 2026 Mariéa Hair Co. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Instagram", "TikTok", "Pinterest", "YouTube"].map((social) => (
              <a key={social} href="#" className="text-[#6a5a4a] hover:text-[#c4b5a0] transition-colors duration-200 text-sm">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};