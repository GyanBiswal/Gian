import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const [displayText, setDisplayText] = useState("")

  // 🧠 Smart greeting
  function getGreeting() {
    const hour = new Date().getHours()

    const morning = [
      "Good morning. Ready to explore something new?",
      "Morning. What’s on your mind today?"
    ]

    const afternoon = [
      "What are we building today?",
      "Got something interesting to figure out?"
    ]

    const evening = [
      "Good evening. Let’s dive into something cool.",
      "Winding down or just getting started?"
    ]

    const night = [
      "Late night curiosity? I like it.",
      "The best ideas come at night. Let’s hear yours."
    ]

    let pool

    if (hour < 12) pool = morning
    else if (hour < 17) pool = afternoon
    else if (hour < 21) pool = evening
    else pool = night

    return pool[Math.floor(Math.random() * pool.length)]
  }

  // ⌨️ Typing effect
  useEffect(() => {
    const text = getGreeting()
    let i = 0

    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i))
      i++
      if (i > text.length) clearInterval(interval)
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black relative overflow-hidden">

      {/* 🌌 Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050816] to-black" />

      {/* ✨ Stars */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity
          }}
          className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }}
        />
      ))}

      {/* 🧠 Content */}
      <div className="z-10 text-center max-w-2xl px-6">

        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4 tracking-wide"
        >
          GIAN
        </motion.h1>

        {/* ✨ Dynamic Greeting */}
        <p className="text-gray-400 mb-8 text-lg min-h-[28px]">
          {displayText}
        </p>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 backdrop-blur-xl"
        >
          <input
            placeholder="Ask GIAN anything..."
            className="w-full bg-transparent outline-none text-white placeholder-gray-500"
          />
        </motion.div>

        {/* Fake AI response */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-left text-gray-300 bg-white/5 p-4 rounded-xl mb-6"
        >
          <p className="text-sm text-gray-500 mb-1">GIAN</p>
          <p>
            I can help you with coding, ideas, learning, or anything else.
            What would you like to explore today?
          </p>
        </motion.div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  )
}