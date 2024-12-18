'use client';
import { Variants, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  shape: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
  top: string;
  left: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const NotFound: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  const maskShapes = [
    'mask-squircle',
    'mask-heart',
    'mask-hexagon',
    'mask-star',
    'mask-circle',
    'mask-parallelogram',
    'mask-diamond',
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-info'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      shape: maskShapes[Math.floor(Math.random() * maskShapes.length)],
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-bl from-base-300 via-neutral to-base-100"
    >
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="pointer-events-none absolute inset-0 bg-opacity-50"
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              y: [0, -20, 0],
              x: mousePosition.x * 0.02,
            }}
            transition={{
              scale: { duration: 0.5, delay: particle.delay },
              y: {
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              x: {
                duration: 0.3,
                ease: 'linear',
              },
            }}
            className={`mask ${particle.shape} absolute ${particle.color} mix-blend-screen`}
            style={{
              top: particle.top,
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.6,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="absolute inset-0 bg-gradient-to-t from-transparent to-base-300/20 backdrop-blur-[2px]"
      />

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="z-10 flex flex-col items-center justify-center gap-8 rounded-box border-2 border-primary/30 bg-base-300/40 p-12 backdrop-blur-md"
      >
        <motion.div
          variants={itemVariants}
          className="relative"
          whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 animate-ping opacity-30"
          >
            <Image className="mask mask-squircle" src="/klm.webp" alt="KLM" width={100} height={100} />
          </motion.div>
          <Image
            className="mask mask-squircle select-none transition-transform hover:scale-110"
            src="/klm.webp"
            alt="KLM"
            width={100}
            height={100}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 text-center">
          <motion.h1
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="bg-gradient-to-r from-primary via-secondary to-accent bg-[length:500%] bg-clip-text text-8xl font-black text-transparent drop-shadow-lg"
          >
            404
          </motion.h1>
          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-3xl font-bold text-warning">Oops! Page Not Found</p>
            <p className="text-info-content/80">Looks like you've ventured into uncharted territory...</p>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/"
            className="group btn btn-wide relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-accent text-primary-content"
          >
            <motion.span
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-base-100 mix-blend-overlay"
            />
            <span className="relative">Return to Safety</span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
