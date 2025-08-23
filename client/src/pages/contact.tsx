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

        {/* Contact Content */}
        <section className="py-16" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div>
                <h2 
                  className="text-3xl font-light mb-8"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                >
                  Get In Touch
                </h2>
                <p 
                  className="text-lg mb-12 leading-relaxed"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Whether you're buying, selling, or just exploring your options, our experienced team is here to guide you through every step of your real estate journey.
                </p>

                <div className="space-y-8">
                  {/* Office Address */}
                  <div className="flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-2"
                        style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                      >
                        Office Address
                      </h3>
                      <p style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}>
                        123 Luxury Lane<br />
                        Austin, TX 78701<br />
                        United States
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-2"
                        style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                      >
                        Phone
                      </h3>
                      <p style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}>
                        <a 
                          href="tel:+15551234567" 
                          className="hover:opacity-80 transition-opacity"
                          style={{ color: 'var(--link-color)' }}
                        >
                          (555) 123-4567
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-2"
                        style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                      >
                        Email
                      </h3>
                      <p style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}>
                        <a 
                          href="mailto:hello@luxelead.com" 
                          className="hover:opacity-80 transition-opacity"
                          style={{ color: 'var(--link-color)' }}
                        >
                          hello@luxelead.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 
                        className="text-lg font-semibold mb-2"
                        style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                      >
                        Office Hours
                      </h3>
                      <div style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}>
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                        <p>Sunday: By appointment only</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <MessageSquare 
                        className="h-6 w-6 mr-3"
                        style={{ color: 'var(--primary-color)' }}
                      />
                      <h2 
                        className="text-2xl font-light"
                        style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                      >
                        Send us a Message
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label 
                            htmlFor="name"
                            style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                          >
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label 
                            htmlFor="email"
                            style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                          >
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>

                      <div>
                        <Label 
                          htmlFor="phone"
                          style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <Label 
                          htmlFor="subject"
                          style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                        >
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="What's this about?"
                        />
                      </div>

                      <div>
                        <Label 
                          htmlFor="message"
                          style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                        >
                          Message *
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          className="mt-1 min-h-[120px]"
                          placeholder="Tell us how we can help you..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 text-lg font-medium"
                        style={{ 
                          backgroundColor: 'var(--primary-color)',
                          fontFamily: 'var(--button-font)',
                          fontWeight: 'var(--button-font-weight)'
                        }}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
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