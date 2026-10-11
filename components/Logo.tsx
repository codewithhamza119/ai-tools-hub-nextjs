interface LogoProps {
  size?: number;
}

export default function Logo({ size = 36 }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="/logo.png"
        alt="AI Tools HuB logo"
        width={size}
        height={size}
        className="rounded-full"
        style={{ width: size, height: size }}
      />
      <span className="grad-text font-bold text-xl tracking-tight">
        AI Tools HuB
      </span>
    </span>
  );
}
