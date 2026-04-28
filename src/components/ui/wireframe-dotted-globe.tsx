"use client"
import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

interface Props { width?: number; height?: number; className?: string }

export default function RotatingEarth({ width = 500, height = 500, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = Math.min(width, height)
    const radius = size / 2.2
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const projection = d3.geoOrthographic().scale(radius).translate([size / 2, size / 2]).clipAngle(90)
    const path = d3.geoPath().projection(projection).context(ctx)

    let landData: any = null
    const allDots: [number, number][] = []

    const pointInPolygon = (pt: [number, number], poly: number[][]): boolean => {
      let inside = false
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i], [xj, yj] = poly[j]
        if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside
      }
      return inside
    }

    const render = () => {
      ctx.clearRect(0, 0, size, size)
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, radius, 0, 2 * Math.PI)
      ctx.fillStyle = "#0d0d0d"
      ctx.fill()
      ctx.strokeStyle = "#C00000"
      ctx.lineWidth = 1.5
      ctx.stroke()

      if (landData) {
        const graticule = d3.geoGraticule()
        ctx.beginPath()
        path(graticule())
        ctx.strokeStyle = "rgba(192,0,0,0.15)"
        ctx.lineWidth = 0.5
        ctx.stroke()

        ctx.beginPath()
        landData.features.forEach((f: any) => path(f))
        ctx.strokeStyle = "rgba(192,0,0,0.5)"
        ctx.lineWidth = 0.8
        ctx.stroke()

        allDots.forEach(([lng, lat]) => {
          const p = projection([lng, lat])
          if (p && p[0] >= 0 && p[0] <= size && p[1] >= 0 && p[1] <= size) {
            ctx.beginPath()
            ctx.arc(p[0], p[1], 1, 0, 2 * Math.PI)
            ctx.fillStyle = "#C00000"
            ctx.fill()
          }
        })
      }
    }

    fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json")
      .then(r => r.json())
      .then(data => {
        landData = data
        data.features.forEach((feature: any) => {
          const bounds = d3.geoBounds(feature)
          const [[minLng, minLat], [maxLng, maxLat]] = bounds
          for (let lng = minLng; lng <= maxLng; lng += 1.5) {
            for (let lat = minLat; lat <= maxLat; lat += 1.5) {
              const pt: [number, number] = [lng, lat]
              const geo = feature.geometry
              if (geo.type === "Polygon" && pointInPolygon(pt, geo.coordinates[0])) allDots.push(pt)
              else if (geo.type === "MultiPolygon") {
                for (const poly of geo.coordinates) {
                  if (pointInPolygon(pt, poly[0])) { allDots.push(pt); break }
                }
              }
            }
          }
        })
        setLoaded(true)
        render()
      }).catch(() => {})

    const rotation: [number, number, number] = [0, 0, 0]
    const timer = d3.timer(() => {
      rotation[0] += 0.4
      projection.rotate(rotation)
      render()
    })

    return () => timer.stop()
  }, [])

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas ref={canvasRef} className="rounded-full" />
    </div>
  )
}