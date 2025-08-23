import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb, createPropertyBreadcrumbs } from "@/components/Breadcrumb";

export default function ContactPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeApplied, setIsThemeApplied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Load theme settings
  const { data: themeSettings } = useQuery({
    queryKey: ['/api/theme-settings/1'],
    queryFn: async () => {
      const response = await fetch(`/api/theme-settings/1?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Failed to fetch theme settings');
      return response.json();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true
  });

  // Apply theme settings to CSS variables
  const applyThemeSettings = (settings: any) => {
    if (settings) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', settings.primaryColor);
      root.style.setProperty('--secondary-color', settings.secondaryColor);
      root.style.setProperty('--tertiary-color', settings.tertiaryColor);
      root.style.setProperty('--text-color', settings.textColor);
      root.style.setProperty('--link-color', settings.linkColor);
      root.style.setProperty('--link-hover-color', settings.linkHoverColor);
      root.style.setProperty('--navigation-color', settings.navigationColor || '#1a1a1a');
      root.style.setProperty('--sub-navigation-color', settings.subNavigationColor || '#2a2a2a');
      root.style.setProperty('--header-background-color', settings.headerBackgroundColor || '#ffffff');
      root.style.setProperty('--heading-font', settings.headingFont || 'Inter');
      root.style.setProperty('--body-font', settings.bodyFont || 'Inter');
      root.style.setProperty('--button-font', settings.buttonFont || 'Inter');
      root.style.setProperty('--heading-font-weight', settings.headingFontWeight || '600');
      root.style.setProperty('--body-font-weight', settings.bodyFontWeight || '400');
      root.style.setProperty('--button-font-weight', settings.buttonFontWeight || '500');
      setIsThemeApplied(true);
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create breadcrumb items for contact page
  const contactBreadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact", isCurrentPage: true }
  ];

  return (
    <div className="contact-page min-h-screen" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      {/* Header */}
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Main Content */}
      <div className="pt-0">
        {/* Page Header */}
        <section className="pt-24 pb-16" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            {/* Breadcrumb Navigation */}
            <div className="mb-8">
              <Breadcrumb 
                items={contactBreadcrumbs}
                className="dark-background"
              />
            </div>
            
            <div className="text-center">
              <p 
                className="text-sm uppercase tracking-[0.2em] mb-4"
                style={{ color: 'var(--tertiary-color)' }}
              >
                Get In Touch
              </p>
              <h1 
                className="text-4xl md:text-6xl font-light leading-tight"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                Contact Us
              </h1>
              <p 
                className="text-lg mt-6 max-w-2xl mx-auto opacity-90"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Ready to find your dream home? Get in touch with our expert team today.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information Section - Elegant Layout */}
        <section className="py-24" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <div className="max-w-6xl mx-auto px-6">
            {/* Section Title */}
            <div className="text-center mb-20">
              <h2 
                className="text-5xl font-light leading-tight mb-6"
                style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
              >
                Get In Touch
              </h2>
              <div 
                className="w-24 h-px mx-auto mb-8"
                style={{ backgroundColor: 'var(--primary-color)' }}
              />
              <p 
                className="text-xl leading-relaxed max-w-2xl mx-auto"
                style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)', opacity: 0.8 }}
              >
                Whether you're buying, selling, or just exploring your options, our experienced team is here to guide you through every step of your real estate journey.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-3 gap-12 mb-20">
              {/* Office Address */}
              <div className="text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--secondary-color)' }}
                >
                  <MapPin className="h-8 w-8" style={{ color: 'var(--tertiary-color)' }} />
                </div>
                <h3 
                  className="text-xl font-light mb-4"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                >
                  Visit Our Office
                </h3>
                <div style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)', opacity: 0.8 }}>
                  <p>123 Luxury Lane</p>
                  <p>Austin, TX 78701</p>
                  <p>United States</p>
                </div>
              </div>

              {/* Phone */}
              <div className="text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--secondary-color)' }}
                >
                  <Phone className="h-8 w-8" style={{ color: 'var(--tertiary-color)' }} />
                </div>
                <h3 
                  className="text-xl font-light mb-4"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                >
                  Call Us
                </h3>
                <a 
                  href="tel:+15551234567" 
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--link-color)', fontFamily: 'var(--body-font)' }}
                >
                  (555) 123-4567
                </a>
              </div>

              {/* Email */}
              <div className="text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--secondary-color)' }}
                >
                  <Mail className="h-8 w-8" style={{ color: 'var(--tertiary-color)' }} />
                </div>
                <h3 
                  className="text-xl font-light mb-4"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                >
                  Email Us
                </h3>
                <a 
                  href="mailto:hello@luxelead.com" 
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--link-color)', fontFamily: 'var(--body-font)' }}
                >
                  hello@luxelead.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section - Elegant Centered Design */}
        <section className="py-24" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 
                className="text-5xl font-light leading-tight mb-6"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                Send Us A Message
              </h2>
              <div 
                className="w-24 h-px mx-auto"
                style={{ backgroundColor: 'var(--primary-color)' }}
              />
            </div>

            <div 
              className="bg-white p-12 shadow-2xl"
              style={{ borderRadius: '2px' }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-4 text-lg bg-transparent focus:border-b-2 focus:ring-0"
                      style={{ 
                        borderBottomColor: 'var(--text-color)',
                        color: 'var(--text-color)',
                        fontFamily: 'var(--body-font)'
                      }}
                      placeholder="FULL NAME *"
                    />
                  </div>
                  <div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-4 text-lg bg-transparent focus:border-b-2 focus:ring-0"
                      style={{ 
                        borderBottomColor: 'var(--text-color)',
                        color: 'var(--text-color)',
                        fontFamily: 'var(--body-font)'
                      }}
                      placeholder="EMAIL ADDRESS *"
                    />
                  </div>
                </div>

                <div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-4 text-lg bg-transparent focus:border-b-2 focus:ring-0 w-full"
                    style={{ 
                      borderBottomColor: 'var(--text-color)',
                      color: 'var(--text-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                    placeholder="PHONE NUMBER"
                  />
                </div>

                <div>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-4 text-lg bg-transparent focus:border-b-2 focus:ring-0 w-full"
                    style={{ 
                      borderBottomColor: 'var(--text-color)',
                      color: 'var(--text-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                    placeholder="SUBJECT *"
                  />
                </div>

                <div>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-4 text-lg bg-transparent focus:border-b-2 focus:ring-0 w-full min-h-[120px] resize-none"
                    style={{ 
                      borderBottomColor: 'var(--text-color)',
                      color: 'var(--text-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                    placeholder="MESSAGE *"
                  />
                </div>

                <div className="text-center pt-8">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 py-4 text-sm uppercase tracking-widest font-light border-2 bg-transparent hover:bg-opacity-90 transition-all duration-300"
                    style={{ 
                      borderColor: 'var(--text-color)',
                      color: 'var(--text-color)',
                      fontFamily: 'var(--button-font)',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--text-color)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-color)';
                    }}
                  >
                    {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Office Hours Section */}
        <section className="py-20" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center mb-8">
              <Clock className="h-8 w-8 mr-4" style={{ color: 'var(--primary-color)' }} />
              <h3 
                className="text-2xl font-light"
                style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
              >
                Office Hours
              </h3>
            </div>
            <div 
              className="grid md:grid-cols-3 gap-8 text-center"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
            >
              <div>
                <p className="font-medium mb-2">Monday - Friday</p>
                <p className="opacity-80">9:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p className="font-medium mb-2">Saturday</p>
                <p className="opacity-80">10:00 AM - 4:00 PM</p>
              </div>
              <div>
                <p className="font-medium mb-2">Sunday</p>
                <p className="opacity-80">By appointment only</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}