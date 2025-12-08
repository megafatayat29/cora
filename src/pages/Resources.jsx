import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Resources() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ fullName: "", email: "", phone: "", message: "" });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600">Need a more specific recommendation? You got us!</p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch max-w-6xl mx-auto">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 h-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Fill Me Up!</h2>
            <p className="text-gray-600 text-sm mb-8">We want to know you</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:bg-white transition-all text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:bg-white transition-all text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:bg-white transition-all text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E39CB] focus:bg-white transition-all resize-none text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#6E39CB] hover:bg-[#5A2FA6] text-white font-bold py-4 rounded-xl transition-colors duration-300 text-lg mt-6"
              >
                {submitted ? "Sent!" : "Send"}
              </button>
            </form>
          </motion.div>

          {/* Right: Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-linear-to-br from-[#6E39CB] to-[#5A2FA6] rounded-3xl p-12 text-white shadow-xl h-full flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 leading-tight">
                Very good collaborations are waiting for you<br /><br />
                <span className="text-white/80 text-4xl"><i>Let's Connect!</i></span>
              </h3>
            </div>

            <div className="mt-12 space-y-8">
              {/* Email */}
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#E9DAFC]" />
                </div>
                <div>
                  <p className="text-[#E9DAFC] text-sm font-semibold">Email</p>
                  <a href="mailto:connect@cora.cloud" className="text-white hover:text-[#E9DAFC] transition-colors text-lg">
                    connect@cora.cloud
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[#E9DAFC]" />
                </div>
                <div>
                  <p className="text-[#E9DAFC] text-sm font-semibold">Phone</p>
                  <a href="tel:+622150000000" className="text-white hover:text-[#E9DAFC] transition-colors text-lg">
                    +62 (21) 5000-0000
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mt-1">
                  <MapPin className="w-6 h-6 text-[#E9DAFC]" />
                </div>
                <div>
                  <p className="text-[#E9DAFC] text-sm font-semibold">Address</p>
                  <p className="text-white text-lg leading-relaxed">
                    225 Dago Avenue<br />
                    Bandung, West Java<br />
                    Indonesia
                  </p>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-16 pt-8 border-t border-white/20">
                <p className="text-white/60 text-sm text-right">
                  ~ CORA Team
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}