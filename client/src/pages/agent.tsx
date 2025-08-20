import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Star, ArrowRight, Home, Users, Award, MessageCircle, Calendar } from "lucide-react";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AgentPage() {

  // Load theme settings
  const { data: themeSettings, refetch: refetchTheme } = useQuery({
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

  // Apply theme settings
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

      // Load Google Fonts
      const fontsToLoad = new Set([settings.headingFont, settings.bodyFont, settings.buttonFont]);
      fontsToLoad.forEach(font => {
        if (font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)) {
          const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
          const link = document.createElement('link');
          link.href = fontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      });
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  return (
    <div className="agent-page min-h-screen" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      <Header currentPage="agent" />

      {/* Main Content */}
      <div className="pt-0">
        {/* Hero Section */}
        <section className="pt-24 pb-24" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=700"
                  alt="Alex Rodriguez - LuxeLead Agent"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute -bottom-8 -right-8 w-24 h-24 flex items-center justify-center text-white"
                     style={{ backgroundColor: 'var(--primary-color)' }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold">15+</div>
                    <div className="text-xs uppercase">Years</div>
                  </div>
                </div>
              </div>
              <div>
                <p 
                  className="text-sm uppercase tracking-[0.2em] mb-4"
                  style={{ color: 'var(--tertiary-color)' }}
                >
                  LuxeLead Agent
                </p>
                <h1 
                  className="text-4xl md:text-6xl font-light leading-tight mb-6"
                  style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
                >
                  Alex Rodriguez
                </h1>
                <p 
                  className="text-lg leading-relaxed mb-8"
                  style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
                >
                  With over 15 years of experience in Austin's luxury real estate market, 
                  Alex brings unparalleled expertise and a passion for exceptional service 
                  to every client relationship.
                </p>
                
                {/* Contact Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="px-8 py-3 text-white uppercase tracking-wide border-0"
                    style={{ 
                      backgroundColor: 'var(--primary-color)',
                      fontFamily: 'var(--button-font)',
                      fontWeight: 'var(--button-font-weight)'
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Alex
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-8 py-3 uppercase tracking-wide border-2"
                    style={{ 
                      borderColor: 'var(--tertiary-color)', 
                      color: 'var(--tertiary-color)',
                      fontFamily: 'var(--button-font)',
                      fontWeight: 'var(--button-font-weight)'
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div 
                  className="text-4xl md:text-5xl font-light mb-2"
                  style={{ color: 'var(--primary-color)', fontFamily: 'var(--heading-font)' }}
                >
                  500+
                </div>
                <div 
                  className="text-sm uppercase tracking-wide"
                  style={{ color: 'var(--text-color)' }}
                >
                  Properties Sold
                </div>
              </div>
              <div>
                <div 
                  className="text-4xl md:text-5xl font-light mb-2"
                  style={{ color: 'var(--primary-color)', fontFamily: 'var(--heading-font)' }}
                >
                  $2.5B
                </div>
                <div 
                  className="text-sm uppercase tracking-wide"
                  style={{ color: 'var(--text-color)' }}
                >
                  Total Sales
                </div>
              </div>
              <div>
                <div 
                  className="text-4xl md:text-5xl font-light mb-2"
                  style={{ color: 'var(--primary-color)', fontFamily: 'var(--heading-font)' }}
                >
                  98%
                </div>
                <div 
                  className="text-sm uppercase tracking-wide"
                  style={{ color: 'var(--text-color)' }}
                >
                  Client Satisfaction
                </div>
              </div>
              <div>
                <div 
                  className="text-4xl md:text-5xl font-light mb-2"
                  style={{ color: 'var(--primary-color)', fontFamily: 'var(--heading-font)' }}
                >
                  24/7
                </div>
                <div 
                  className="text-sm uppercase tracking-wide"
                  style={{ color: 'var(--text-color)' }}
                >
                  Availability
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <p 
                  className="text-sm uppercase tracking-[0.2em] mb-4"
                  style={{ color: 'var(--tertiary-color)' }}
                >
                  About Alex
                </p>
                <h2 
                  className="text-4xl md:text-5xl font-light leading-tight"
                  style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
                >
                  Excellence in Every Transaction
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div>
                  <h3 
                    className="text-2xl font-light mb-4"
                    style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
                  >
                    Professional Background
                  </h3>
                  <p 
                    className="text-lg leading-relaxed mb-6"
                    style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
                  >
                    Alex Rodriguez has been a cornerstone of Austin's luxury real estate market 
                    for over a decade and a half. With a background in business development and 
                    a keen eye for market trends, Alex has consistently delivered exceptional 
                    results for discerning clients.
                  </p>
                  <p 
                    className="leading-relaxed"
                    style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
                  >
                    Specializing in high-end residential properties, luxury condominiums, and 
                    exclusive commercial real estate, Alex brings a sophisticated approach to 
                    every transaction.
                  </p>
                </div>
                
                <div>
                  <h3 
                    className="text-2xl font-light mb-4"
                    style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
                  >
                    Client-First Philosophy
                  </h3>
                  <p 
                    className="text-lg leading-relaxed mb-6"
                    style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
                  >
                    Every client relationship begins with understanding unique needs and goals. 
                    Alex's approach combines market expertise with personalized service, ensuring 
                    each transaction exceeds expectations.
                  </p>
                  <p 
                    className="leading-relaxed"
                    style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
                  >
                    From first-time buyers to seasoned investors, Alex provides guidance 
                    tailored to individual circumstances and long-term objectives.
                  </p>
                </div>
              </div>

              {/* Specializations */}
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-6" style={{ backgroundColor: 'var(--tertiary-color)', border: 'none' }}>
                  <CardContent className="pt-6">
                    <Home className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--tertiary-color)', filter: 'invert(1)' }} />
                    <h4 
                      className="text-xl font-light mb-3"
                      style={{ color: 'var(--secondary-color)', fontFamily: 'var(--heading-font)' }}
                    >
                      Luxury Homes
                    </h4>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--secondary-color)', fontFamily: 'var(--body-font)' }}
                    >
                      Exclusive residential properties in Austin's most prestigious neighborhoods
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6" style={{ backgroundColor: 'var(--tertiary-color)', border: 'none' }}>
                  <CardContent className="pt-6">
                    <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--tertiary-color)', filter: 'invert(1)' }} />
                    <h4 
                      className="text-xl font-light mb-3"
                      style={{ color: 'var(--secondary-color)', fontFamily: 'var(--heading-font)' }}
                    >
                      Investment Properties
                    </h4>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--secondary-color)', fontFamily: 'var(--body-font)' }}
                    >
                      Strategic investment opportunities with proven ROI potential
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6" style={{ backgroundColor: 'var(--tertiary-color)', border: 'none' }}>
                  <CardContent className="pt-6">
                    <Award className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--tertiary-color)', filter: 'invert(1)' }} />
                    <h4 
                      className="text-xl font-light mb-3"
                      style={{ color: 'var(--secondary-color)', fontFamily: 'var(--heading-font)' }}
                    >
                      Commercial Real Estate
                    </h4>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--secondary-color)', fontFamily: 'var(--body-font)' }}
                    >
                      Premium commercial spaces and development opportunities
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p 
                className="text-sm uppercase tracking-[0.2em] mb-4"
                style={{ color: 'var(--text-color)' }}
              >
                Client Testimonials
              </p>
              <h2 
                className="text-4xl md:text-5xl font-light leading-tight"
                style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
              >
                What Clients Say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8" style={{ backgroundColor: 'var(--secondary-color)', border: 'none' }}>
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" style={{ color: '#FFD700' }} />
                    ))}
                  </div>
                  <p 
                    className="text-lg leading-relaxed mb-6 italic"
                    style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
                  >
                    "Alex made our dream home purchase seamless. His market knowledge and attention 
                    to detail are unmatched."
                  </p>
                  <div>
                    <div 
                      className="font-medium"
                      style={{ color: 'var(--tertiary-color)' }}
                    >
                      Sarah & Michael Chen
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: 'var(--tertiary-color)' }}
                    >
                      Westlake Hills
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8" style={{ backgroundColor: 'var(--secondary-color)', border: 'none' }}>
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" style={{ color: '#FFD700' }} />
                    ))}
                  </div>
                  <p 
                    className="text-lg leading-relaxed mb-6 italic"
                    style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
                  >
                    "Professional, responsive, and results-driven. Alex exceeded our expectations 
                    at every step of the selling process."
                  </p>
                  <div>
                    <div 
                      className="font-medium"
                      style={{ color: 'var(--tertiary-color)' }}
                    >
                      Robert Johnson
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: 'var(--tertiary-color)' }}
                    >
                      Downtown Austin
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8" style={{ backgroundColor: 'var(--secondary-color)', border: 'none' }}>
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" style={{ color: '#FFD700' }} />
                    ))}
                  </div>
                  <p 
                    className="text-lg leading-relaxed mb-6 italic"
                    style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
                  >
                    "Alex's expertise in luxury properties is evident. He found us the perfect 
                    investment opportunity with incredible ROI potential."
                  </p>
                  <div>
                    <div 
                      className="font-medium"
                      style={{ color: 'var(--tertiary-color)' }}
                    >
                      Jennifer Martinez
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: 'var(--tertiary-color)' }}
                    >
                      Tarrytown
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-24" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 
              className="text-4xl md:text-5xl font-light leading-tight mb-8"
              style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
            >
              Ready to Find Your Dream Property?
            </h2>
            <p 
              className="text-xl leading-relaxed mb-12 max-w-2xl mx-auto"
              style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
            >
              Let's discuss your real estate goals and create a personalized strategy 
              to achieve exceptional results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                className="px-12 py-4 text-white text-lg uppercase tracking-wide border-0"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  fontFamily: 'var(--button-font)',
                  fontWeight: 'var(--button-font-weight)'
                }}
              >
                <Calendar className="w-5 h-5 mr-3" />
                Schedule Consultation
              </Button>
              
              <div className="flex items-center gap-6">
                <a 
                  href="tel:+1234567890"
                  className="flex items-center text-lg hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--tertiary-color)' }}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  (512) 555-0123
                </a>
                <a 
                  href="mailto:alex@luxelead.com"
                  className="flex items-center text-lg hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--tertiary-color)' }}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  alex@luxelead.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}