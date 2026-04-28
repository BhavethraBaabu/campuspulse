"use client"
import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"

interface LinkItem { href: string; label: string }
interface FooterProps {
  leftLinks: LinkItem[]
  rightLinks: LinkItem[]
  copyrightText: string
  barCount?: number
}

const AnimatedFooter: React.FC<FooterProps> = ({ leftLinks, rightLinks, copyrightText, barCount = 23 }) => {
  const waveRefs = useRef<(HTMLDivElement | null)[]>([])
  const footerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.2 })
    if (footerRef.current) observer.observe(footerRef.current)
    return () => { if (footerRef.current) observer.unobserve(footerRef.current) }
  }, [])

  useEffect(() => {
    let t = 0
    const animateWave = () => {
      let offset = 0
      waveRefs.current.forEach((el, i) => {
        if (el) {
          offset += Math.max(0, 20 * Math.sin((t + i) * 0.3))
          el.style.transform = `translateY(${i + offset}px)`
        }
      })
      t += 0.1
      animationFrameRef.current = requestAnimationFrame(animateWave)
    }
    if (isVisible) { animateWave() }
    else if (animationFrameRef.current) { cancelAnimationFrame(animationFrameRef.current); animationFrameRef.current = null }
    return () => { if (animationFrameRef.current) { cancelAnimationFrame(animationFrameRef.current); animationFrameRef.current = null } }
  }, [isVisible])

  return (
    <footer ref={footerRef} className="bg-black text-white relative flex flex-col w-full select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between w-full gap-4 pb-16 pt-10 px-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-black text-white text-sm">CampusPulse</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(192,0,0,0.3)", color: "#ff8080" }}>Clark</span>
            </div>
          </div>
          <ul className="flex flex-wrap gap-4">
            {leftLinks.map((link, i) => (
              <li key={i}><Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link></li>
            ))}
          </ul>
          <p className="text-xs text-gray-500">{copyrightText}</p>
        </div>
        <div className="space-y-3">
          <ul className="flex flex-wrap gap-4 justify-end">
            {rightLinks.map((link, i) => (
              <li key={i}><Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link></li>
            ))}
          </ul>
          <div className="text-right">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs text-gray-500 hover:text-white transition-colors">
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
      <div style={{ overflow: "hidden", height: 160 }}>
        <div>
          {Array.from({ length: barCount }).map((_, i) => (
            <div key={i} ref={el => { waveRefs.current[i] = el }}
              style={{ height: `${i + 1}px`, backgroundColor: "rgb(192,0,0)", transition: "transform 0.1s ease", willChange: "transform", marginTop: "-2px" }} />
          ))}
        </div>
      </div>
    </footer>
  )
}

export default AnimatedFooter