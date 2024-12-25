'use client';
import { NavbarWithProgress } from '@components/Navbar';
import constants from '@constants/constants';
import {
  ArrowUpIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const bounce = {
  initial: { y: 0 },
  animate: { y: [0, -10, 0] },
  transition: { duration: 0.6, repeat: Infinity, repeatType: 'loop' },
};

const heroImagesData = [
  {
    title: 'Summer Collection',
    desc: 'Bright and vibrant styles for the season',
    src: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
    alt: 'Summer fashion collection display',
    credit: 'Photo by Mike Von on Unsplash',
  },
  {
    title: 'Seasonal Trends',
    desc: 'Stay ahead with the latest fashion',
    src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
    alt: 'Fashion showcase display',
    credit: 'Photo by The Creative Exchange on Unsplash',
  },
  {
    title: 'Welcome to Kalamandir',
    desc: 'Discover the latest trends in fashion',
    src: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
    alt: 'Fashion boutique display',
    credit: 'Photo by Priscilla Du Preez on Unsplash',
  },
  {
    title: 'Casual Wear',
    desc: 'Stay comfortable and stylish',
    src: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9',
    alt: 'Hanged clothes on display',
    credit: 'Photo by Alyssa Strohmann on Unsplash',
  },
  {
    title: 'Elegant Evening Gowns',
    desc: 'Find the perfect dress for any occasion',
    src: 'https://images.unsplash.com/photo-1519657337289-077653f724ed',
    alt: 'Elegant evening gowns display',
    credit: 'Photo by The Creative Exchange on Unsplash',
  },
];

export default function Home(): JSX.Element {
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [heroImages] = useState(heroImagesData);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    document.title = 'Home | Kalamandir';
  }, []);

  useEffect(() => {
    const handleScroll = (): void => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageLoad = (id: string): void => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  const handleSlideChange = (index: number): void => {
    setCurrentSlide(index);
  };

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      title: 'Inventory Management',
      desc: 'Track your stock in real-time',
      icon: ClipboardDocumentListIcon,
    },
    {
      title: 'Sales Analytics',
      desc: 'Make data-driven decisions',
      icon: ChartBarIcon,
    },
    {
      title: 'Customer Relations',
      desc: 'Build lasting relationships',
      icon: UserGroupIcon,
    },
  ];

  const stats = [
    { value: '2K+', label: 'Active Users' },
    { value: '50K+', label: 'Products Managed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Boutique Owner',
      content: 'Kalamandir transformed how we manage our boutique. The inventory system is incredible!',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Fashion Retailer',
      content: 'The analytics tools helped us increase our sales by 40% in just three months.',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
    },
    {
      name: 'Emma Davis',
      role: 'Store Manager',
      content: 'Customer management has never been easier. Our client retention has improved significantly.',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      features: ['Basic Inventory Management', 'Sales Tracking', 'Customer Database', '24/7 Support'],
      recommended: false,
    },
    {
      name: 'Professional',
      price: '$79',
      features: ['Advanced Analytics', 'Multi-store Management', 'Priority Support', 'API Access'],
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Custom Solutions', 'Dedicated Account Manager', 'Custom Integration', 'Training Sessions'],
      recommended: false,
    },
  ];

  const benefits = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations for inventory and pricing optimization',
    },
    {
      icon: RocketLaunchIcon,
      title: 'Quick Setup',
      description: 'Be up and running in minutes with our intuitive onboarding',
    },
    {
      icon: LightBulbIcon,
      title: 'Smart Automation',
      description: 'Automate routine tasks and focus on growing your business',
    },
  ];

  return (
    <div className="bg-linear-to-br from-base-100 to-base-300 min-h-screen">
      <NavbarWithProgress />

      {/* Enhanced Hero Section */}
      <div className="hero bg-linear-to-br from-primary/5 to-accent/5 min-h-screen via-transparent">
        <motion.div
          className="hero-content flex-col gap-12 lg:flex-row-reverse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="relative w-full lg:w-1/2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="carousel hover:ring-success h-[300px] w-full overflow-hidden rounded-lg shadow-2xl hover:ring-2 sm:h-[400px] md:h-[450px] lg:h-[500px]">
              {!imagesLoaded[`hero-0`] && <div className="skeleton h-full w-full"></div>}
              {heroImages.map((image, index) => (
                <div key={index} id={`slide${index}`} className="carousel-item relative h-full w-full">
                  <div className="relative h-full w-full">
                    {!imagesLoaded[`hero-${index}`] && <div className="skeleton absolute h-full w-full"></div>}
                    <Image
                      src={image.src}
                      width={1200}
                      height={700}
                      alt={image.alt}
                      className={`h-full w-full object-cover object-center ${!imagesLoaded[`hero-${index}`] ? 'invisible' : ''}`}
                      priority={index === 0}
                      quality={90}
                      referrerPolicy="no-referrer"
                      onLoad={() => handleImageLoad(`hero-${index}`)}
                      onError={() => setImagesLoaded((prev) => ({ ...prev, [`hero-${index}`]: false }))}
                    />
                  </div>
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a
                      href={`#slide${index === 0 ? heroImages.length - 1 : index - 1}`}
                      className="btn btn-circle btn-neutral bg-opacity-60"
                      onClick={() => handleSlideChange(index === 0 ? heroImages.length - 1 : index - 1)}
                    >
                      ❮
                    </a>
                    <a
                      href={`#slide${index === heroImages.length - 1 ? 0 : index + 1}`}
                      className="btn btn-circle btn-neutral bg-opacity-60"
                      onClick={() => handleSlideChange(index === heroImages.length - 1 ? 0 : index + 1)}
                    >
                      ❯
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-center text-xs opacity-70">{heroImages[currentSlide]?.credit}</div>
          </motion.div>
          <motion.div
            className="lg:w-1/2"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold">Manage Your Fashion Business Better!</h1>
            <p className="text-pretty py-6 text-xl">
              Transform your fashion retail business with our comprehensive management platform. Streamline inventory,
              boost sales, and delight customers.
            </p>
            <Link
              href={constants.AUTH_SIGNUP_PAGE}
              className="btn btn-accent btn-lg bg-linear-to-bl from-primary to-accent"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden py-20">
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mx-auto max-w-7xl px-4"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="text-primary text-4xl font-bold"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-base-content/70 group-hover:text-primary mt-2 transition-colors duration-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Features Cards */}
      <div className="relative px-4 py-24">
        <div className="bg-linear-to-b via-base-300/50 absolute inset-0 from-transparent to-transparent"></div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <h2 className="mb-16 text-center text-5xl font-bold">
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Why Choose Us?
            </span>
          </h2>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                className="card bg-base-100 shadow-xl"
              >
                <div className="card-body items-center text-center">
                  <motion.div
                    className="bg-linear-to-br from-secondary via-primary to-accent hover:ring-success mb-4 rounded-full p-6 hover:ring-2 lg:hover:ring-4"
                    variants={bounce}
                  >
                    <feature.icon className="text-primary-content h-16 w-16" />
                  </motion.div>
                  <h3 className="card-title text-2xl">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Benefits Section */}
      <div className="bg-linear-to-b from-base-200 to-base-300 px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
                className="bg-base-100 group rounded-xl p-6 shadow-xl"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4"
                >
                  <benefit.icon className="text-primary h-8 w-8" />
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
                <p className="text-base-content/70">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Testimonials */}
      <div className="bg-linear-to-tr from-primary/5 via-base-200 to-accent/5 relative px-4 py-24">
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <h2 className="bg-linear-to-r from-primary to-accent mb-16 bg-clip-text text-center text-4xl font-bold text-transparent">
            Loved by Fashion Retailers
          </h2>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="card bg-base-100 shadow-xl"
              >
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="ring-3 ring-primary ring-offset-base-100 w-16 rounded-full ring-offset-2">
                        <Image src={testimonial.avatar} alt={testimonial.name} width={64} height={64} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-base-content/70 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="text-warning h-5 w-5" />
                    ))}
                  </div>
                  <p className="text-base-content/80 mt-4">{testimonial.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Pricing Cards */}
      <div className="bg-linear-to-b from-base-300 to-base-200 px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="mb-16 text-center text-5xl font-bold">
            <span className="bg-linear-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                whileHover={{ scale: 1.03 }}
                className={`card bg-base-100 shadow-xl ${plan.recommended ? 'border-primary border-2' : ''}`}
              >
                <div className="card-body">
                  {plan.recommended && <div className="badge badge-primary absolute right-4 top-4">Recommended</div>}
                  <h3 className="card-title text-2xl">{plan.name}</h3>
                  <div className="my-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-base-content/70">/month</span>}
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg className="text-success h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="card-actions mt-6 justify-end">
                    <Link
                      href={constants.AUTH_SIGNUP_PAGE}
                      className={`btn btn-block ${plan.recommended ? 'btn-primary' : 'btn-outline'}`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-linear-to-t from-base-300 to-base-200 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="footer footer-center text-base-content relative p-10"
        >
          <div>
            {/* <p className="font-bold">Kalamandir Industries Ltd.</p> */}
            <p>Your Fashion Business Partner Since 2023</p>
          </div>
          <div>
            <div className="grid grid-flow-col gap-4">
              <Link href="#" className="link-hover link">
                About us
              </Link>
              <Link href="#" className="link-hover link">
                Contact
              </Link>
              <Link href="#" className="link-hover link">
                Privacy Policy
              </Link>
              <Link href="#" className="link-hover link">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </footer>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="bg-primary text-primary-content fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full p-3 shadow-lg transition-transform duration-300 hover:scale-110"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
