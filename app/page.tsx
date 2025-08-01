"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Zap, Shield, Brain, Cpu, Power } from "lucide-react"

export default function Component() {
  const [isStarted, setIsStarted] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Welcome animation delay
    const timer = setTimeout(() => setShowWelcome(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleStart = () => {
    setIsStarted(true)
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Constellation Background */}
      <div className="absolute inset-0 w-full h-full">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-blue-400 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Flowing Edge Lights */}
      <div className="absolute inset-0 pointer-events-none w-full h-full">
        {/* Top flowing light */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 animate-flow-horizontal"></div>
        </div>
        {/* Bottom flowing light */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 animate-flow-horizontal-reverse"></div>
        </div>
        {/* Left flowing light */}
        <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-60">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-cyan-300 to-blue-400 animate-flow-vertical"></div>
        </div>
        {/* Right flowing light */}
        <div className="absolute right-0 top-0 w-2 h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-60">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-cyan-300 to-blue-400 animate-flow-vertical-reverse"></div>
        </div>
      </div>

      {/* Corner Energy Nodes */}
      <div className="absolute top-6 left-6 w-8 h-8">
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse-ring"></div>
        <div className="absolute inset-2 bg-cyan-400 rounded-full animate-ping"></div>
      </div>
      <div className="absolute top-6 right-6 w-8 h-8">
        <div className="absolute inset-0 bg-purple-500 rounded-full animate-pulse-ring delay-1000"></div>
        <div className="absolute inset-2 bg-blue-400 rounded-full animate-ping delay-1000"></div>
      </div>
      <div className="absolute bottom-6 left-6 w-8 h-8">
        <div className="absolute inset-0 bg-cyan-500 rounded-full animate-pulse-ring delay-2000"></div>
        <div className="absolute inset-2 bg-purple-400 rounded-full animate-ping delay-2000"></div>
      </div>
      <div className="absolute bottom-6 right-6 w-8 h-8">
        <div className="absolute inset-0 bg-blue-600 rounded-full animate-pulse-ring delay-3000"></div>
        <div className="absolute inset-2 bg-cyan-500 rounded-full animate-ping delay-3000"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 border border-blue-400 rotate-45 animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 border border-purple-400 animate-spin-very-slow"></div>
        <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-cyan-400 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 right-1/6 w-5 h-5 border-2 border-blue-500 rounded-full animate-pulse"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4">
        {/* Welcome Text Section */}
        <div
          className={`w-full text-center space-y-6 mb-16 transition-all duration-2000 ${showWelcome ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-gradient-shift">
              WELCOME TO
            </h1>
            {/* Glitch effect overlay */}
            <div className="absolute inset-0 text-5xl md:text-7xl lg:text-8xl font-black text-cyan-400 opacity-20 animate-glitch">
              WELCOME TO
            </div>
          </div>

          <div className="relative">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-hologram">
              DE OMNI
            </h2>
            {/* Holographic scanlines */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-scan-lines"></div>
          </div>

          <p className="text-xl md:text-2xl text-blue-300 font-light tracking-wide animate-fade-in-delayed">
            Advanced AI • Infinite Possibilities • Your Digital Companion
          </p>
        </div>

        {/* Logo Section with Advanced Lighting */}
        <div className="relative mb-20">
          {/* Outer Energy Ring */}
          <div className="absolute inset-0 w-64 h-64 rounded-full border border-blue-500/20 animate-spin-slow">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-blue-400 rounded-full animate-pulse"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-128px)`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          {/* Middle Energy Ring */}
          <div className="absolute inset-4 w-56 h-56 rounded-full border border-cyan-400/30 animate-spin-medium-reverse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-112px)`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>

          {/* Inner Energy Ring */}
          <div className="absolute inset-8 w-48 h-48 rounded-full border border-purple-400/40 animate-spin-fast">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-purple-400 rounded-full animate-pulse"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-96px)`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>

          {/* Logo Container */}
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-cyan-900/40 backdrop-blur-xl border border-blue-400/30 flex items-center justify-center animate-float shadow-2xl shadow-blue-500/30">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-500 flex items-center justify-center shadow-inner animate-pulse-glow">
              <Bot className="w-20 h-20 text-white animate-breathe" />
            </div>
          </div>

          {/* Energy Waves */}
          <div className="absolute inset-0 w-64 h-64 rounded-full border-2 border-blue-400/20 animate-ping-slow"></div>
          <div className="absolute inset-2 w-60 h-60 rounded-full border border-cyan-400/20 animate-ping-slow delay-1000"></div>
          <div className="absolute inset-4 w-56 h-56 rounded-full border border-purple-400/20 animate-ping-slow delay-2000"></div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap justify-center space-x-8 mb-12">
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">SYSTEMS ONLINE</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
            <span className="text-sm font-medium">AI READY</span>
          </div>
          <div className="flex items-center space-x-2 text-cyan-400">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
            <span className="text-sm font-medium">NEURAL NETWORK ACTIVE</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-16 w-full px-4">
          <div className="group bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-4 text-center hover:scale-105 hover:border-blue-400/40 transition-all duration-300">
            <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Neural Processing</h3>
          </div>

          <div className="group bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-4 text-center hover:scale-105 hover:border-purple-400/40 transition-all duration-300">
            <Cpu className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Quantum Computing</h3>
          </div>

          <div className="group bg-gradient-to-br from-cyan-900/20 to-purple-900/20 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-4 text-center hover:scale-105 hover:border-cyan-400/40 transition-all duration-300">
            <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2 group-hover:animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Secure Protocol</h3>
          </div>

          <div className="group bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 text-center hover:scale-105 hover:border-blue-500/40 transition-all duration-300">
            <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Lightning Speed</h3>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="relative">
          {/* Button Glow Rings */}
          <div className="absolute inset-0 w-48 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl animate-pulse"></div>
          <div className="absolute inset-0 w-48 h-16 rounded-full border border-blue-400/30 animate-ping-slow"></div>

          <Button
            onClick={handleStart}
            disabled={isStarted}
            className="relative group w-48 h-16 text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 hover:from-blue-500 hover:via-cyan-400 hover:to-purple-500 text-white rounded-full shadow-2xl shadow-blue-500/50 transition-all duration-500 hover:scale-110 hover:shadow-cyan-400/60 border border-blue-400/50"
          >
            {/* Button Inner Glow */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 group-hover:from-blue-300/30 group-hover:to-purple-300/30 transition-all duration-300"></div>

            {/* Button Content */}
            <span className="relative flex items-center justify-center space-x-3">
              <Power className="w-6 h-6 animate-pulse" />
              <span className="tracking-wider">{isStarted ? "INITIALIZING..." : "ACTIVATE"}</span>
              <Sparkles className="w-6 h-6 animate-pulse delay-300" />
            </span>

            {/* Ripple Effects */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-0 group-hover:opacity-100"></div>
            <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping delay-200 opacity-0 group-hover:opacity-100"></div>
          </Button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isStarted && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-30">
          <div className="text-center space-y-8">
            {/* Loading Animation */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin-reverse"></div>
              <div className="absolute inset-4 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Bot className="w-12 h-12 text-blue-400 animate-pulse" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300 animate-pulse"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>

            <div className="space-y-2">
              <p className="text-2xl text-white font-semibold animate-pulse">Initializing DE OMNI</p>
              <p className="text-blue-400 text-sm">Neural networks coming online...</p>
              <p className="text-cyan-400 text-xs">{Math.round(loadingProgress)}% Complete</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
