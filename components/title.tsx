"use client"

export default function Title() {
  return (
    <div className="py-8 w-full text-center">
      <h1
        className="text-5xl md:text-6xl font-bold tracking-wider relative"
        style={{
          fontFamily: "'Cinzel Decorative', 'Trajan Pro', serif",
        }}
      >
        {/* Base shadow layer */}
        <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-b from-orange-900 to-orange-950 blur-[2px] transform scale-[1.02] translate-y-[2px]">
          WAR TYCOON AI AGENT
        </span>

        {/* Main text with color fading effect */}
        <span
          className="relative text-transparent bg-clip-text"
          style={{
            background: "linear-gradient(to bottom, #ffcc00, #ff6600, #cc3300)",
            WebkitBackgroundClip: "text",
            WebkitTextStroke: "1px rgba(255, 120, 0, 0.7)",
            textShadow: `
              0 1px 2px rgba(255, 100, 0, 0.8),
              0 2px 4px rgba(200, 50, 0, 0.6),
              0 4px 8px rgba(150, 30, 0, 0.4)
            `,
          }}
        >
          WAR TYCOON AI AGENT
        </span>
      </h1>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&display=swap');
      `}</style>
    </div>
  )
}
