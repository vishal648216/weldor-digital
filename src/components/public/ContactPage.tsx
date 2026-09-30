import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  Building2,
  Navigation
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addPublicRFQLead, showNotification } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Global Commercial Sales');
  const [message, setMessage] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const googleMapsUrl = "https://www.google.com/maps/place/Weldor+by+Earth+Metal+Industries/@22.4145771,70.059849,17z/data=!3m1!4b1!4m6!3m5!1s0x39576b0f8c29599d:0x4b5181f8c3ddc48!8m2!3d22.4145771!4d70.059849!16s%2Fg%2F11fj_75ywj?hl=en-US&entry=ttu";
  const embedMapUrl = "https://maps.google.com/maps?q=22.4145771,70.059849&hl=en&z=16&output=embed";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const leadId = addPublicRFQLead({
      title: `Contact Enquiry (${department}) - ${companyName || contactName}`,
      companyName: companyName || 'B2B Client',
      contactPerson: contactName,
      email,
      phone,
      country: 'India',
      categoryName: department,
      targetQuantity: 100,
      technicalNotes: message,
    });
    setSubmittedId(leadId);
    showNotification('Your message has been registered directly into our CRM pipeline.', 'success');
  };

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-mono font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-orange-600" />
            <span>WELDOR BY EARTH METAL INDUSTRIES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
            Get in Touch with Our Team
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Reach out for custom drawing feasibility, prototype samples, volume pricing, or plant visit scheduling in Jamnagar, Gujarat.
          </p>
        </div>

        {/* Top Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Contact Card (Matching Image 2 Aesthetic) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dark Styled Contact Card matching Image 2 */}
            <div className="bg-[#182333] text-white p-7 sm:p-8 rounded-3xl shadow-xl border border-slate-700/60 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 border-b border-slate-700/60 pb-5">
                <img 
                  src="/weldor-logo.png" 
                  alt="Weldor Logo" 
                  className="h-8 w-auto object-contain brightness-110" 
                />
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-white">EARTH METAL INDUSTRIES</h3>
                  <p className="text-[10px] font-mono text-orange-400 font-bold uppercase">Brand: WELDOR</p>
                </div>
              </div>

              {/* Exact 3 Circular Icon Rows from Image 2 */}
              <div className="space-y-6 pt-2">
                
                {/* 1. Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border border-slate-600/80 bg-slate-800/80 flex items-center justify-center text-slate-300 shrink-0 shadow-inner">
                    <MapPin className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">Address:</p>
                    <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                      588, G.I.D.C., Phase 2,<br />
                      Dared, Jamnagar (361004),<br />
                      Gujarat, India
                    </p>
                  </div>
                </div>

                {/* 2. Phone */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-slate-600/80 bg-slate-800/80 flex items-center justify-center text-slate-300 shrink-0 shadow-inner">
                    <Phone className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">Phone:</p>
                    <a 
                      href="tel:+918780098088" 
                      className="text-base font-bold text-white hover:text-orange-400 transition-colors font-mono block"
                    >
                      +91-87800 98088
                    </a>
                  </div>
                </div>

                {/* 3. Email */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-slate-600/80 bg-slate-800/80 flex items-center justify-center text-slate-300 shrink-0 shadow-inner">
                    <Mail className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">Email:</p>
                    <a 
                      href="mailto:brm@weldorindustries.com" 
                      className="text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors font-mono block break-all"
                    >
                      brm@weldorindustries.com
                    </a>
                  </div>
                </div>

              </div>

              {/* Direct Action Buttons */}
              <div className="pt-4 border-t border-slate-700/60 grid grid-cols-2 gap-3">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-600"
                >
                  <Navigation className="w-3.5 h-3.5 text-orange-400" />
                  <span>Google Maps</span>
                </a>

                <button
                  onClick={() => {
                    window.open('https://wa.me/918780098088?text=Hello%20Weldor%20Sales%20Team%2C%20I%20have%20an%20enquiry.', '_blank');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

            </div>

            {/* Quick SLA Assurance */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Rapid Response SLA Commitment</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                All B2B inquiries, CAD drawings, and prototype requests are processed with an official <strong>2-hour SLA response time</strong> by our technical sales engineering division.
              </p>
            </div>

          </div>

          {/* Right Column: Direct B2B Contact Form */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-6">
            
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-mono text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                DIRECT CRM INQUIRY
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-2">
                Send Message / Requirement
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your inquiry will generate an active trackable lead in our sales pipeline.
              </p>
            </div>

            {submittedId ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-heading">Enquiry Successfully Registered!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Lead Reference Code: <strong className="text-orange-600 font-mono text-sm">{submittedId}</strong>. Our engineering desk in Jamnagar has received your details and will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmittedId(null)}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold font-mono transition-colors shadow-sm cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Precision Engineering Works"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Work Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ramesh@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone / Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98250 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Inquiry Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Global Commercial Sales">Global Commercial Sales</option>
                    <option value="Pneumatic & Hydraulic Division">Pneumatic & Hydraulic Division</option>
                    <option value="Welding Torches & Components">Welding Torches & Components</option>
                    <option value="Custom CNC Drawing Feasibility">Custom CNC Drawing Feasibility</option>
                    <option value="Prototype & Sample Trials">Prototype & Sample Trials</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Component Details / Technical Notes *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about material specifications (Brass, SS, Aluminum), quantity requirements, or application requirements..."
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Submit Inquiry to Sales Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Full Width Interactive Google Maps Section */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg space-y-4 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 uppercase">
                <MapPin className="w-4 h-4" />
                <span>PLANT LOCATION & DIRECTIONS</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mt-1">
                Weldor by Earth Metal Industries (GIDC Jamnagar)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                588, G.I.D.C., Phase 2, Dared, Jamnagar (361004), Gujarat, India
              </p>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-md shrink-0 w-fit"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in Google Maps App</span>
            </a>
          </div>

          {/* Embedded Google Map Frame */}
          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
            <iframe
              title="Weldor by Earth Metal Industries Location Map"
              src={embedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
