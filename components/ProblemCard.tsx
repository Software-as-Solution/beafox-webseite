interface ProblemCardProps {
    icon: React.ReactNode;
    iconBg: string;
    number: string;
    title: string;
    text: string;
  }
  
  export default function ProblemCard({
    icon,
    iconBg,
    number,
    title,
    text,
  }: ProblemCardProps) {
    return (
      <div
        className="relative rounded-2xl p-6 md:p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        {/* Number badge — top right, large and faded */}
        <div
          className="absolute top-4 right-5 text-5xl md:text-6xl font-black leading-none pointer-events-none select-none"
          style={{
            color: "rgba(232,119,32,0.08)",
          }}
        >
          {number}
        </div>
  
        {/* Icon */}
        <div
          className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: iconBg,
          }}
        >
          {icon}
        </div>
  
        {/* Title */}
        <h3 className="relative text-lg md:text-xl font-bold text-darkerGray mb-2 leading-tight">
          {title}
        </h3>
  
        {/* Text */}
        <p className="relative text-sm md:text-base text-lightGray leading-relaxed">
          {text}
        </p>
      </div>
    );
  }