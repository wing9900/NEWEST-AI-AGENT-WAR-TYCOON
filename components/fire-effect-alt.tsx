export default function FireEffectAlt() {
  return (
    <div className="absolute inset-0 z-[-1]">
      <div
        className="absolute inset-[-20px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500' preserveAspectRatio='none'%3E%3Cdefs%3E%3CradialGradient id='fireGrad' cx='50%25' cy='100%25' r='100%25' fx='50%25' fy='100%25'%3E%3Cstop offset='0%25' stopColor='%23ff9900' stopOpacity='0.8'/%3E%3Cstop offset='100%25' stopColor='%23ff6600' stopOpacity='0'/%3E%3C/radialGradient%3E%3Cfilter id='blur' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='10'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M50,500 L950,500 L950,450 C900,480 850,430 800,460 C750,490 700,440 650,470 C600,500 550,450 500,480 C450,510 400,460 350,490 C300,520 250,470 200,500 C150,530 100,480 50,510 Z' fill='url(%23fireGrad)' filter='url(%23blur)'/%3E%3Cpath d='M50,500 L950,500 L950,470 C900,490 850,460 800,480 C750,500 700,470 650,490 C600,510 550,480 500,500 C450,520 400,490 350,510 C300,530 250,500 200,520 C150,540 100,510 50,530 Z' fill='%23ff6600' opacity='0.6' filter='url(%23blur)'/%3E%3C/svg%3E")`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "drop-shadow(0 0 10px rgba(255, 100, 0, 0.5))",
        }}
      ></div>
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow:
            "0 0 15px 5px rgba(255, 100, 0, 0.3), 0 0 30px 10px rgba(255, 50, 0, 0.2), inset 0 0 10px 2px rgba(255, 120, 0, 0.3)",
        }}
      ></div>
    </div>
  )
}
