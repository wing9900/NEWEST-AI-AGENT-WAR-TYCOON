"use client"

export default function FireEffect() {
  return (
    <div className="fire-container absolute inset-0 pointer-events-none">
      <div className="fire-border">
        <style jsx>{`
          .fire-container {
            position: absolute;
            inset: -20px;
            pointer-events: none;
            z-index: -1;
          }
          
          .fire-border {
            position: absolute;
            inset: 0;
            background-image: url('/fire-border.png');
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            filter: drop-shadow(0 0 10px rgba(255, 100, 0, 0.5));
          }
        `}</style>
      </div>
    </div>
  )
}
