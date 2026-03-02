'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  scale?: boolean
  once?: boolean
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 700,
  direction = 'up',
  distance = 40,
  scale = false,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const getTransform = () => {
    if (!isVisible) {
      const transforms: string[] = []
      switch (direction) {
        case 'up': transforms.push(`translateY(${distance}px)`); break
        case 'down': transforms.push(`translateY(-${distance}px)`); break
        case 'left': transforms.push(`translateX(${distance}px)`); break
        case 'right': transforms.push(`translateX(-${distance}px)`); break
      }
      if (scale) transforms.push('scale(0.95)')
      return transforms.join(' ') || 'none'
    }
    return 'translateY(0) translateX(0) scale(1)'
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

// Stagger wrapper — auto-delays children
interface StaggerProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  baseDelay?: number
}

export function ScrollStagger({
  children,
  className = '',
  staggerDelay = 100,
  direction = 'up',
  duration = 700,
  baseDelay = 0,
}: StaggerProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <ScrollReveal
          key={i}
          delay={baseDelay + i * staggerDelay}
          direction={direction}
          duration={duration}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  )
}

// Animated counter
interface CounterProps {
  end: number
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ end, suffix = '', duration = 2000, className = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const steps = 60
    const stepDuration = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current++
      // Ease-out curve
      const progress = 1 - Math.pow(1 - current / steps, 3)
      setCount(Math.round(end * progress))
      if (current >= steps) {
        setCount(end)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [started, end, duration])

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  )
}
