import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  Component } from
'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Menu,
  X,
  Users,
  Clock,
  Smartphone,
  LayoutDashboard,
  AlertTriangle,
  MapPin,
  UserPlus,
  PenSquare,
  Send,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  Moon,
  Sun } from
'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
export function LandingPage() {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden transition-colors duration-300">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white dark:bg-slate-900 shadow-md dark:shadow-slate-800/50' : 'bg-transparent'}`}>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${scrolled ? 'bg-primary dark:bg-primary-light' : 'bg-white'}`}>
                
                <Megaphone
                  size={20}
                  className={`sm:w-6 sm:h-6 ${scrolled ? 'text-accent' : 'text-primary'}`} />
                
              </div>
              <span
                className={`font-bold text-base sm:text-lg transition-colors ${scrolled ? 'text-primary dark:text-white' : 'text-white'}`}>
                
                Project Padinig
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <button
                onClick={() => scrollToSection('hero')}
                className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light' : 'text-white/90 hover:text-white'}`}>
                
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light' : 'text-white/90 hover:text-white'}`}>
                
                About
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light' : 'text-white/90 hover:text-white'}`}>
                
                Features
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light' : 'text-white/90 hover:text-white'}`}>
                
                Contact Us
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${scrolled ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800' : 'text-white/90 hover:bg-white/10'}`}
                aria-label="Toggle theme">
                
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                to="/login"
                className="px-5 py-2 bg-accent text-primary-dark rounded-lg text-sm font-semibold hover:bg-accent-light transition-colors shadow-sm">
                
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${scrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white/90'}`}
                aria-label="Toggle theme">
                
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${scrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white'}`}>
                
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
          
            <div className="px-4 py-3 space-y-1">
              <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-base">
              
                Home
              </button>
              <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-base">
              
                About
              </button>
              <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-base">
              
                Features
              </button>
              <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-base">
              
                Contact Us
              </button>
              <div className="pt-2 pb-1">
                <Link
                to="/login"
                className="block px-4 py-3 bg-primary text-white rounded-lg text-center font-medium text-base">
                
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        }
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-28 overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary">
        
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{
                opacity: 0,
                x: -50
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.8
              }}
              className="text-center lg:text-left">
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Barangay Purisima, Connected and Informed
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Project Padinig is Barangay Purisima's official announcement
                system — delivering important updates to every resident through
                SMS and web, fast and accessible to all.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-slate-700 text-primary dark:text-white rounded-xl font-semibold text-sm sm:text-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-lg hover:shadow-xl">
                  
                  Get Started{' '}
                  <ArrowRight size={18} className="ml-2 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 50
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 0.8,
                delay: 0.2
              }}
              className="relative max-w-[280px] sm:max-w-[350px] lg:max-w-none mx-auto">
              
              <svg viewBox="0 0 500 500" className="w-full h-auto">
                {/* Background circles */}
                <circle
                  cx="250"
                  cy="250"
                  r="200"
                  fill="#059669"
                  opacity="0.1" />
                
                <circle
                  cx="250"
                  cy="250"
                  r="150"
                  fill="#f59e0b"
                  opacity="0.1" />
                

                {/* Megaphone */}
                <g transform="translate(200, 200)">
                  <path d="M10 30 L10 70 L40 85 L40 15 Z" fill="#ffffff" />
                  <circle cx="45" cy="50" r="8" fill="#f59e0b" />
                  <path
                    d="M50 50 Q70 40, 90 45"
                    stroke="#ffffff"
                    strokeWidth="3"
                    fill="none" />
                  
                  <path
                    d="M50 50 Q70 50, 90 50"
                    stroke="#ffffff"
                    strokeWidth="3"
                    fill="none" />
                  
                  <path
                    d="M50 50 Q70 60, 90 55"
                    stroke="#ffffff"
                    strokeWidth="3"
                    fill="none" />
                  
                </g>

                {/* Phone icons */}
                <g transform="translate(100, 150)">
                  <rect
                    x="0"
                    y="0"
                    width="30"
                    height="50"
                    rx="5"
                    fill="#ffffff"
                    opacity="0.9" />
                  
                  <rect
                    x="5"
                    y="5"
                    width="20"
                    height="35"
                    fill="#059669"
                    opacity="0.3" />
                  
                  <circle cx="15" cy="45" r="2" fill="#1e3a5f" />
                </g>

                <g transform="translate(350, 180)">
                  <rect
                    x="0"
                    y="0"
                    width="30"
                    height="50"
                    rx="5"
                    fill="#ffffff"
                    opacity="0.9" />
                  
                  <rect
                    x="5"
                    y="5"
                    width="20"
                    height="35"
                    fill="#f59e0b"
                    opacity="0.3" />
                  
                  <circle cx="15" cy="45" r="2" fill="#1e3a5f" />
                </g>

                {/* Community silhouettes */}
                <g transform="translate(150, 350)">
                  <circle cx="0" cy="0" r="15" fill="#ffffff" opacity="0.8" />
                  <path
                    d="M-20 20 Q-20 5, 0 5 Q20 5, 20 20 L20 40 L-20 40 Z"
                    fill="#ffffff"
                    opacity="0.8" />
                  
                </g>

                <g transform="translate(250, 360)">
                  <circle cx="0" cy="0" r="15" fill="#ffffff" opacity="0.8" />
                  <path
                    d="M-20 20 Q-20 5, 0 5 Q20 5, 20 20 L20 40 L-20 40 Z"
                    fill="#ffffff"
                    opacity="0.8" />
                  
                </g>

                <g transform="translate(350, 350)">
                  <circle cx="0" cy="0" r="15" fill="#ffffff" opacity="0.8" />
                  <path
                    d="M-20 20 Q-20 5, 0 5 Q20 5, 20 20 L20 40 L-20 40 Z"
                    fill="#ffffff"
                    opacity="0.8" />
                  
                </g>
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <Section id="about" className="bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-slate-900 dark:text-white mb-8 sm:mb-12 lg:mb-16">
            
            About Project Padinig
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <motion.div
              initial={{
                opacity: 0,
                x: -30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0.2
              }}
              className="space-y-4 sm:space-y-6">
              
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Barangay Purisima is home to 9 vibrant puroks — Avocado,
                Calamansi, Citrus I & II, Evergreen, Grapes, and Mangga I & II.
                Keeping every resident informed across all these zones has
                always been a challenge.
              </p>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-primary dark:text-primary-light">
                  Project Padinig
                </strong>{' '}
                is Barangay Purisima's digital announcement system that combines
                SMS notifications with a web platform — ensuring every resident
                stays updated, whether they have a smartphone or a basic keypad
                phone.
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0.4
              }}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
              
              <StatBox
                icon={Users}
                value="9"
                label="Puroks Served"
                color="primary" />
              
              <StatBox
                icon={Megaphone}
                value="24/7"
                label="Emergency Alerts"
                color="secondary" />
              
              <StatBox
                icon={Clock}
                value="<1 min"
                label="SMS Delivery Time"
                color="accent" />
              
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section id="features" className="bg-surface-muted dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="text-center mb-8 sm:mb-12 lg:mb-16">
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Built for Barangay Purisima
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything our barangay officials need to keep Purisima residents
              informed and safe.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:gap-8">
            <FeatureCard
              icon={Smartphone}
              title="SMS Notifications"
              fullTitle="SMS Notification System"
              description="Reach everyone via SMS — no internet required, even basic phones."
              fullDescription="Send announcements directly to residents' phones via SMS. No internet required — reach everyone, even with basic phones."
              color="primary"
              delay={0.1} />
            
            <FeatureCard
              icon={LayoutDashboard}
              title="Web Dashboard"
              fullTitle="Web Announcement Dashboard"
              description="Create, schedule, and manage announcements in one place."
              fullDescription="A clean, intuitive dashboard for creating, scheduling, and managing all barangay announcements in one place."
              color="secondary"
              delay={0.2} />
            
            <FeatureCard
              icon={AlertTriangle}
              title="Emergency Alerts"
              fullTitle="Emergency Broadcast"
              description="Instantly alert residents during emergencies with priority delivery."
              fullDescription="Instantly alert all residents during typhoons, floods, fires, or health emergencies with priority SMS and web notifications."
              color="emergency"
              delay={0.3} />
            
            <FeatureCard
              icon={MapPin}
              title="Zone Grouping"
              fullTitle="Resident Grouping by Zone"
              description="Target specific Puroks or Zones instead of messaging everyone."
              fullDescription="Organize residents by Purok or Zone for targeted announcements. Send messages to specific areas instead of everyone."
              color="accent"
              delay={0.4} />
            
          </div>
        </div>
      </Section>

      {/* How It Works Section */}
      <Section id="how-it-works" className="bg-slate-100 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-slate-900 dark:text-white mb-8 sm:mb-12 lg:mb-16">
            
            Simple Steps to Keep Your Barangay Informed
          </motion.h2>

          {/* Desktop/Tablet Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            <div
              className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"
              style={{
                top: '4rem'
              }}>
            </div>
            <StepCard
              icon={UserPlus}
              step="1"
              title="Register Residents"
              description="Add residents with their contact numbers and assign them to their Purok or Zone."
              delay={0.1} />
            
            <StepCard
              icon={PenSquare}
              step="2"
              title="Create Announcement"
              description="Write your message, choose the category, and select your target audience."
              delay={0.2} />
            
            <StepCard
              icon={Send}
              step="3"
              title="Choose Delivery"
              description="Send via SMS, post on the web platform, or both. Schedule for later if needed."
              delay={0.3} />
            
            <StepCard
              icon={CheckCircle}
              step="4"
              title="Residents Receive"
              description="Residents get the announcement instantly on their phones or can view it online."
              delay={0.4} />
            
          </div>

          {/* Mobile Carousel */}
          <StepsCarousel />
        </div>
      </Section>

      {/* Contact Us Section */}
      <Section id="contact" className="bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="text-center mb-8 sm:mb-12 lg:mb-16">
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Contact Barangay Purisima
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Have questions or need assistance? Visit the Barangay Hall or
              reach out through any of our channels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{
                opacity: 0,
                x: -30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0.2
              }}
              className="space-y-4 sm:space-y-6">
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <MapPin size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">
                    Office Address
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                    Purisima Street, Barangay Purisima, Philippines
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                    Mon–Fri 8AM–5PM, Sat 8AM–12PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
                  <Phone size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">
                    Phone Numbers
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                    Hotline: (032) 123-4567
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                    Mobile: 0917-123-4567
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                    Emergency: Call 911 or 0917-123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-accent/10 text-accent-dark rounded-xl shrink-0">
                  <Mail size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">
                    Email Address
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                    barangay.purisima@gmail.com
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form (Static UI Only) */}
            <motion.div
              initial={{
                opacity: 0,
                x: 30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0.3
              }}
              className="bg-surface-muted dark:bg-slate-800 rounded-2xl p-5 sm:p-6 lg:p-8 border border-slate-100 dark:border-slate-700">
              
              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={(e) => e.preventDefault()}>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Juan Dela Cruz"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 text-base" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="juan@email.com"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 text-base" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 resize-none text-base" />
                  
                </div>
                <button
                  type="button"
                  className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors shadow-sm text-base">
                  
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <section className="bg-primary py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Stay Connected with Barangay Purisima
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Sign in to receive announcements, emergency alerts, and community
              updates directly from your barangay.
            </p>
            <div className="flex justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-slate-700 text-primary dark:text-white rounded-xl font-semibold text-sm sm:text-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-lg">
                
                Get Started Now{' '}
                <ArrowRight size={18} className="ml-2 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark dark:bg-slate-950 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          {/* Mobile Footer */}
          <div className="md:hidden space-y-6">
            {/* Brand */}
            <div className="text-center">
              <div className="flex items-center gap-2.5 justify-center mb-2">
                <div className="bg-white/10 p-1.5 rounded-lg">
                  <Megaphone size={20} className="text-accent" />
                </div>
                <span className="font-bold text-base">Project Padinig</span>
              </div>
              <p className="text-white/50 text-xs">
                A Barangay Announcement System
              </p>
            </div>

            {/* Quick Links - clean vertical list */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => scrollToSection('hero')}
                className="px-4 py-2.5 bg-white/8 rounded-full text-sm text-white/70 hover:bg-white/15 active:bg-white/20 transition-colors">
                
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="px-4 py-2.5 bg-white/8 rounded-full text-sm text-white/70 hover:bg-white/15 active:bg-white/20 transition-colors">
                
                About
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="px-4 py-2.5 bg-white/8 rounded-full text-sm text-white/70 hover:bg-white/15 active:bg-white/20 transition-colors">
                
                Features
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-4 py-2.5 bg-white/8 rounded-full text-sm text-white/70 hover:bg-white/15 active:bg-white/20 transition-colors">
                
                Contact
              </button>
              <Link
                to="/login"
                className="px-4 py-2.5 bg-accent/20 text-accent-light rounded-full text-sm font-medium hover:bg-accent/30 active:bg-accent/40 transition-colors">
                
                Login
              </Link>
            </div>
          </div>

          {/* Desktop/Tablet Footer */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Megaphone size={24} className="text-accent" />
                </div>
                <span className="font-bold text-lg">Project Padinig</span>
              </div>
              <p className="text-white/70 text-sm">
                A Barangay Announcement System
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>
                  <button
                    onClick={() => scrollToSection('hero')}
                    className="hover:text-white transition-colors">
                    
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="hover:text-white transition-colors">
                    
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="hover:text-white transition-colors">
                    
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="hover:text-white transition-colors">
                    
                    Contact Us
                  </button>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors">
                    
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="text-white/40 shrink-0" />{' '}
                  Purisima St., Barangay Purisima
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-white/40 shrink-0" /> (032)
                  123-4567 / 0917-123-4567
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-white/40 shrink-0" />{' '}
                  barangay.purisima@gmail.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 mt-8 md:mt-0 text-center text-xs sm:text-sm text-white/50">
            © 2025 Barangay Purisima — Project Padinig. All rights reserved. |
            Developed for academic purposes.
          </div>
        </div>
      </footer>
    </div>);

}
// Helper Components
function Section({
  id,
  className,
  children




}: {id: string;className?: string;children: React.ReactNode;}) {
  return (
    <section id={id} className={`py-12 sm:py-16 lg:py-24 ${className || ''}`}>
      {children}
    </section>);

}
function StatBox({
  icon: Icon,
  value,
  label,
  color





}: {icon: any;value: string;label: string;color: string;}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent-dark'
  };
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-soft border border-slate-100 dark:border-slate-700 flex items-center gap-3 sm:gap-4">
      <div
        className={`p-2.5 sm:p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
        
        <Icon size={20} className="sm:w-6 sm:h-6" />
      </div>
      <div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {label}
        </div>
      </div>
    </div>);

}
function FeatureCard({
  icon: Icon,
  title,
  fullTitle,
  description,
  fullDescription,
  color,
  delay








}: {icon: any;title: string;fullTitle?: string;description: string;fullDescription?: string;color: string;delay: number;}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent-dark',
    emergency: 'bg-emergency/10 text-emergency'
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true
      }}
      transition={{
        delay
      }}
      whileHover={{
        y: -5
      }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md aspect-square sm:aspect-auto p-3 sm:p-6 flex flex-col items-center justify-center text-center sm:items-start sm:text-left">
      
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-2 sm:mb-4 shrink-0`}>
        
        <Icon size={20} className="sm:w-6 sm:h-6" />
      </div>
      <h3 className="text-xs sm:text-xl font-semibold text-slate-900 dark:text-white mb-0.5 sm:mb-2 leading-tight">
        <span className="sm:hidden">{title}</span>
        <span className="hidden sm:inline">{fullTitle || title}</span>
      </h3>
      <p className="text-slate-500 dark:text-slate-400 leading-snug text-[10px] sm:text-base sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
        <span className="sm:hidden">{description}</span>
        <span className="hidden sm:inline">
          {fullDescription || description}
        </span>
      </p>
    </motion.div>);

}
function StepCard({
  icon: Icon,
  step,
  title,
  description,
  delay






}: {icon: any;step: string;title: string;description: string;delay: number;}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true
      }}
      transition={{
        delay
      }}
      className="relative bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 shadow-soft border border-slate-100 dark:border-slate-700 text-center">
      
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
        {step}
      </div>
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 mt-2">
        <Icon size={24} className="sm:w-7 sm:h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>);

}
function StepsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const steps = [
  {
    icon: LayoutDashboard,
    step: '1',
    title: 'Log In to the System',
    description:
    'Users log in to the platform to access the barangay announcement dashboard.'
  },
  {
    icon: PenSquare,
    step: '2',
    title: 'Write an Announcement',
    description:
    'Authorized barangay staff creates an announcement or update to share with the community.'
  },
  {
    icon: Clock,
    step: '3',
    title: 'Schedule or Send',
    description:
    'Send the announcement immediately or schedule it for a specific date and time.'
  },
  {
    icon: CheckCircle,
    step: '4',
    title: 'Residents Get Notified',
    description:
    'Residents receive the announcement through the system, keeping everyone informed and updated.'
  }];

  // Auto-slide with infinite loop
  useEffect(() => {
    if (isUserInteracting) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isUserInteracting, steps.length]);
  const goToIndex = (index: number) => {
    setActiveIndex(index);
    setIsUserInteracting(true);
    // Resume auto-slide after 5 seconds of inactivity
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsUserInteracting(false), 5000);
  };
  // Swipe handling
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsUserInteracting(true);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveIndex((prev) => (prev + 1) % steps.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
      }
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsUserInteracting(false), 5000);
  };
  const currentStep = steps[activeIndex];
  const Icon = currentStep.icon;
  return (
    <div className="sm:hidden">
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
        
        <motion.div
          key={activeIndex}
          initial={{
            opacity: 0,
            x: 60
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: -60
          }}
          transition={{
            duration: 0.35,
            ease: 'easeInOut'
          }}
          className="mx-auto w-[70vw] max-w-[260px]">
          
          <div className="relative bg-white rounded-xl shadow-soft border border-slate-100 text-center aspect-square flex flex-col items-center justify-center p-5">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs z-10">
              {currentStep.step}
            </div>
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-3">
              <Icon size={22} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
              {currentStep.title}
            </h3>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {currentStep.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-5">
        {steps.map((_, i) =>
        <button
          key={i}
          onClick={() => goToIndex(i)}
          className={`rounded-full transition-all duration-300 ${activeIndex === i ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'}`}
          aria-label={`Go to step ${i + 1}`} />

        )}
      </div>
    </div>);

}