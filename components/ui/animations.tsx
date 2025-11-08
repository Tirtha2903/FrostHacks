"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react"

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

export const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
}

export const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 }
}

export const slideInFromTop = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 }
}

export const slideInFromBottom = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}

export const bounce = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 300
    }
  },
  exit: { opacity: 0, scale: 0.3 }
}

// Transition presets
export const smoothTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
}

export const springTransition = {
  type: "spring",
  damping: 25,
  stiffness: 500
}

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Animated components
interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({ children, className = "", delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
      transition={{ ...smoothTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedListProps {
  children: ReactNode
  className?: string
}

export function AnimatedList({ children, className = "" }: AnimatedListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedListItemProps {
  children: ReactNode
  className?: string
  index?: number
}

export function AnimatedListItem({ children, className = "", index = 0 }: AnimatedListItemProps) {
  return (
    <motion.div
      variants={slideInFromLeft}
      transition={{ ...smoothTransition, delay: index * 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
      transition={smoothTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Modal animation wrapper
interface ModalAnimationProps {
  children: ReactNode
  isOpen: boolean
  className?: string
}

export function ModalAnimation({ children, isOpen, className = "" }: ModalAnimationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={scaleIn}
          transition={springTransition}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Slide-in panel animation
interface SlideInPanelProps {
  children: ReactNode
  isOpen: boolean
  direction?: "left" | "right" | "top" | "bottom"
  className?: string
}

export function SlideInPanel({
  children,
  isOpen,
  direction = "right",
  className = ""
}: SlideInPanelProps) {
  const variants = {
    left: slideInFromLeft,
    right: slideInFromRight,
    top: slideInFromTop,
    bottom: slideInFromBottom
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants[direction]}
          transition={smoothTransition}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Loading animation
export function LoadingSpinner({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full`}
    />
  )
}

// Pulse animation for notifications
interface PulseDotProps {
  className?: string
}

export function PulseDot({ className = "" }: PulseDotProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-red-500 rounded-full"
      />
      <div className="w-2 h-2 bg-red-500 rounded-full" />
    </div>
  )
}

// Shimmer loading effect
interface ShimmerProps {
  className?: string
  height?: string
}

export function Shimmer({ className = "", height = "h-4" }: ShimmerProps) {
  return (
    <motion.div
      animate={{
        x: ["0%", "100%"]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`${height} ${className} bg-gradient-to-r from-transparent via-gray-200 to-transparent`}
    />
  )
}

// Floating animation
interface FloatingProps {
  children: ReactNode
  className?: string
  duration?: number
}

export function Floating({ children, className = "", duration = 3 }: FloatingProps) {
  return (
    <motion.div
      animate={{
        y: [-10, 10, -10]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Typing animation
interface TypingAnimationProps {
  text: string
  className?: string
  speed?: number
}

export function TypingAnimation({
  text,
  className = "",
  speed = 50
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 0.5
        }}
      >
        |
      </motion.span>
    </span>
  )
}

// Count up animation
interface CountUpProps {
  end: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function CountUp({
  end,
  duration = 2,
  className = "",
  prefix = "",
  suffix = ""
}: CountUpProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + duration * 1000

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (endTime - startTime), 1)
      const currentCount = Math.floor(progress * end)
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [end, duration])

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}