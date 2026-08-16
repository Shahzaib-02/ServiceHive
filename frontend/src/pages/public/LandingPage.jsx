




import React from 'react'
import { useState, useRef, useEffect,useCallback } from 'react'
import { Link } from 'react-router-dom'
import {useInView, motion } from 'framer-motion'
import {
  ArrowRight,
  Star,
  Shield,
  Clock,
  Zap,
  Users,
  Import
} from 'lucide-react'

import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Home from "../../images/Home.png"
import Automotive from "../../images/Automotive.png"
import Medical from "../../images/Medical.png"
import Tutoring from "../../images/Tutoring.png"
import Personal from "../../images/Personal.png"
import Emergency from "../../images/Emergency.png"
/* ---------------- DATA ---------------- */



const AnimatedCounter = ({ target, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  
  // Remove `once: true` — triggers every time section enters viewport
  const isInView = useInView(ref, { margin: "-100px" });
  const prevInView = useRef(false);
  const animationRef = useRef(null);

  const parseTarget = useCallback((target) => {
    const numMatch = target.match(/^([\d.]+)([KMB]?)(.*)/);
    if (!numMatch) return null;
    const [, numStr, multiplier, suffix] = numMatch;
    const baseNum = parseFloat(numStr);
    const multiplierVal = { K: 1000, M: 1000000, B: 1000000000 }[multiplier] || 1;
    return { baseNum, multiplier, multiplierVal, suffix, isDecimal: target.includes(".") };
  }, []);

  const formatNumber = useCallback((current, parsed) => {
    const { baseNum, multiplier, multiplierVal, suffix, isDecimal } = parsed;
    
    if (multiplier === "K" && current >= 1000) {
      return (current / 1000).toFixed(isDecimal && baseNum % 1 !== 0 ? 1 : 0) + "K" + suffix;
    }
    if (multiplier === "M" && current >= 1000000) {
      return (current / 1000000).toFixed(isDecimal && baseNum % 1 !== 0 ? 1 : 0) + "M" + suffix;
    }
    
    const val = isDecimal ? current.toFixed(1) : Math.floor(current);
    return val + suffix;
  }, []);

  useEffect(() => {
    const parsed = parseTarget(target);
    if (!parsed) {
      setDisplay(target);
      return;
    }

    // When entering view: start from 0 and animate up
    if (isInView && !prevInView.current) {
      setCount(0);
      setDisplay("0");
      
      const { multiplierVal, baseNum } = parsed;
      const targetNum = baseNum * multiplierVal;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = targetNum * easeOut;

        setDisplay(formatNumber(current, parsed));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    // When leaving view: reset to 0
    if (!isInView && prevInView.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setCount(0);
      setDisplay("0");
    }

    prevInView.current = isInView;

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isInView, target, duration, parseTarget, formatNumber]);

  return <span ref={ref}>{display}</span>;
};

const stats = [
  { number: "15K+", label: "Happy Users" },
  { number: "10K+", label: "Providers" },
  { number: "20K+", label: "Bookings" },
  { number: "4.9★", label: "Rating" },
];
const serviceGroups = [
  {
    id: "home-services",
    label: "Home Services",
    description:
      "Professional plumbing, electrical, carpentry, and home improvement services.",
    price: "From PKR 1000",
    image: Home,
  },
  {
    id: "automotive-services",
    label: "Automotive Services",
    description:
      "Expert car repair, maintenance, and detailing services by certified technicians.",
    price: "From PKR 2000",
    image: Automotive,
  },
  {
    id: "medical-services",
    label: "Medical Services",
    description:
      "Professional healthcare providers and medical consultation services.",
    price: "From PKR 5000/week",
    image: Medical,
  },
  {
    id: "tutoring-services",
    label: "Tutoring Services",
    description:
      "Qualified tutors for academics, languages, music, and skill development.",
    price: "From PKR 1000/subject",
    image: Tutoring,
  },
  {
    id: "personal-support",
    label: "Personal Support",
    description:
      "Fitness coaching, wellness services, and personal care professionals.",
    price: "From PKR 2500/Day",
    image: Personal,
  },
  {
    id: "emergency-services",
    label: "Emergency Services",
    description:
      "Quick response emergency assistance and urgent repair services available 24/7.",
    price: "From PKR 2000",
    image: Emergency,
  },
];

const LandingPage = () => {
  const services = [
    {
      icon: Shield,
      title: 'Trusted Experts',
      desc: 'All providers are verified and reviewed.'
    },
    {
      icon: Clock,
      title: 'Fast Booking',
      desc: 'Book any service within minutes.'
    },
    {
      icon: Zap,
      title: 'Instant Support',
      desc: '24/7 support for customers & providers.'
    }
  ]

  const stats = [
    { number: '15K+', label: 'Happy Users' },
    { number: '10K+', label: 'Providers' },
    { number: '20K+', label: 'Bookings' },
    { number: '4.9★', label: 'Rating' }
  ]

  return (
    <div className="min-h-screen text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/20 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 blur-[140px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto relative top-24">

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
             Local Service Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Find Trusted <span className="text-custom-yellow">Services</span>
            <br />
            Near You Instantly
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 mb-10"
          >
            ServiceHive connects customers with reliable professionals
            for home, tech, beauty, automotive and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/register">
              <Button  variant="outline" size="lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link to="/browse-services">
              <Button variant="outline" size="lg">
                Explore Services
              </Button>
            </Link>
          </motion.div>
        </div>

  {/* Service Categories Flip Cards */}
       
<div className="mt-60">
  <div className="text-center">
    <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-yellow-400 to-orange-300 bg-clip-text text-transparent mb-4">
      Featured  Categories
    </h2>
    <p className="text-gray-400 max-w-3xl mx-auto">
      Discover the most popular service categories on ServiceHive
    </p>
  </div>

  <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
    {serviceGroups.map((group) => (
      <div
        key={group.id}
        className="group relative h-80 rounded-xl overflow-hidden border border-white/10 cursor-pointer"
      >
        {/* Background Image */}
        <img
          src={group.image}
          alt={group.label}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Default label at bottom */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-6 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-2xl font-bold text-white">
            {group.label}
          </h3>
        </div>

        {/* Hover Overlay — slides in from top */}
        <div className="absolute inset-0 bg-yellow-400/70 flex flex-col justify-end p-6 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
          <h3 className="text-2xl font-bold text-black mb-1">
            {group.label}
          </h3>

          <span className="text-sm font-semibold text-black/70 mb-3">
            {group.price}
          </span>

          <p className="text-sm leading-relaxed text-black mb-4">
            {group.description}
          </p>

          <Link to="/browse-services" className="inline-flex">
            <button className="bg-black text-white px-8 py-2 rounded-lg flex items-center gap-2 hover:bg-black/80 transition-colors">
              Explore services
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    ))}
  </div>
</div>
        
        
        {/* Stats
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">
          {stats.map((item, i) => (
            <Card key={i} className="p-6 text-center bg-white/5 border border-white/10">
              <h3 className="text-3xl font-bold text-custom-yellow mb-2">
                {item.number}
              </h3>
              <p className="text-gray-400">{item.label}</p>
            </Card>
          ))}
        </div> */}
        

        {/* Features */}
        {/* <div className="mt-24 text-center">
          <h2 className="text-4xl font-bold mb-14">
            Why Choose ServiceHive?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((item, i) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                >
                  <Card className="p-8 bg-white/5 border border-white/10 hover:border-custom-yellow transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-8 h-8 text-black" />
                    </div>

                    <h3 className="text-2xl font-semibold mb-3">
                      {item.title}
                    </h3>

                    <p className="text-gray-400">
                      {item.desc}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div> */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">
  {stats.map((item, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
    >
      <Card className="p-6 text-center bg-white/5 border border-white/10">
        <h3 className="text-3xl font-bold text-custom-yellow mb-2">
          <AnimatedCounter target={item.number} duration={2} />
        </h3>
        <p className="text-gray-400">{item.label}</p>
      </Card>
    </motion.div>
  ))}
</div>

        {/* CTA */}
        <div className="mt-28">
          <Card className="p-12 text-center bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20">

            <Users className="w-16 h-16 mx-auto text-custom-yellow mb-5" />

            <h2 className="text-4xl font-bold mb-4">
              Ready to Join ServiceHive?
            </h2>

            <p className="text-gray-400 mb-8 text-lg">
              Thousands already trust us for their daily service needs.
            </p>

            <Link to="/register">
              <Button    variant="outline" size="lg">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

          </Card>
        </div>

      

      </div>
    </div>
  )
}

export default LandingPage
