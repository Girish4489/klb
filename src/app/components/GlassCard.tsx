interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function GlassCard({ children, className = '', variant = 'primary' }: GlassCardProps) {
  const gradientMap = {
    primary: 'from-primary/10 via-transparent to-secondary/10',
    secondary: 'from-secondary/10 via-transparent to-accent/10',
    accent: 'from-accent/10 via-transparent to-primary/10',
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-primary/20 ${className}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientMap[variant]} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}