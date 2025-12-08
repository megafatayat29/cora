import { Cloud, Github, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-linear-to-br from-blue-100 to-blue-50 p-2 rounded-lg">
                <Cloud className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#6E39CB]">CORA</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your intelligent cloud service recommender. Find the perfect cloud solution 
              tailored to your specific needs and industry requirements.
            </p>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Connect With Us</h4>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="bg-white p-2 rounded-lg border border-gray-200 hover:border-[#300 hover:bg-[#F5F0FE] transition-colors group"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-gray-600 group-hover:text-[#6E39CB]" />
              </a>
              <a 
                href="#" 
                className="bg-white p-2 rounded-lg border border-gray-200 hover:border-[#300 hover:bg-[#F5F0FE] transition-colors group"
                title="Email"
              >
                <Mail className="w-5 h-5 text-gray-600 group-hover:text-[#6E39CB]" />
              </a>
            </div>
            <p className="text-gray-600 text-sm">
              Questions? Feedback? We'd love to hear from you!
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} CORA. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1" fill="currentColor" /> for cloud enthusiasts
          </div>
        </div>
      </div>
    </footer>
  );
}