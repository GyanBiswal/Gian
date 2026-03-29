import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import axios from "../config/axios";

export default function Register() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [warp, setWarp] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth - 0.5) * 8
    const y = (clientY / window.innerHeight - 0.5) * 8

    setPos((prev) => ({
      x: prev.x + (x - prev.x) * 0.06,
      y: prev.y + (y - prev.y) * 0.06
    }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    // ✅ Password match check
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const res = await axios.post('/users/register', {
        name,
        email,
        password
      })

      console.log("REGISTER SUCCESS:", res.data)

      // ✨ animation trigger
      setWarp(true)

      // ⏳ redirect after animation
      setTimeout(() => {
        navigate('/login')
      }, 1200)

    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message)
      alert(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black"
    >
      {/* 🌌 Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#07061a] to-black" />

      {/* 🌠 Stars */}
      {[...Array(70)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: warp ? 600 : 0,
            opacity: warp ? 0 : [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: warp ? 1 : Math.random() * 4 + 3,
            repeat: warp ? 0 : Infinity,
          }}
          className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* 💫 Cursor Glow */}
      <motion.div
        animate={{
          x: pos.x * 4,
          y: pos.y * 4,
        }}
        transition={{ type: "spring", stiffness: 30 }}
        className="absolute w-80 h-80 bg-white opacity-[0.05] blur-3xl rounded-full"
      />

      {/* 🧊 Card */}
      <motion.div
        style={{
          transform: `rotateY(${pos.x * 0.3}deg) rotateX(${-pos.y * 0.3}deg)`,
        }}
        initial={{ opacity: 0, scale: 0.96, y: 40 }}
        animate={{
          opacity: warp ? 0 : 1,
          scale: warp ? 1.2 : 1,
          y: warp ? -100 : 0,
        }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl 
        bg-white/[0.04] backdrop-blur-2xl border border-white/10 
        shadow-[0_0_60px_rgba(255,255,255,0.05)]"
      >
        {/* Heading */}
        <h2
          className="text-4xl font-semibold text-center mb-6 
          bg-gradient-to-r from-gray-200 via-violet-400 to-gray-400 
          bg-clip-text text-transparent"
        >
          Create Account
        </h2>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-5">
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Name"
            className="w-full p-3 rounded-xl bg-white/[0.03] text-white border border-white/10 outline-none"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-white/[0.03] text-white border border-white/10 outline-none"
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/[0.03] text-white border border-white/10 outline-none"
          />

          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            type="password"
            required
            placeholder="Confirm Password"
            className="w-full p-3 rounded-xl bg-white/[0.03] text-white border border-white/10 outline-none"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-white text-black font-medium"
          >
            Sign Up
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}