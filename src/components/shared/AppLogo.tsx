import { Heart } from 'lucide-react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeClasses = {
  sm: { container: 'h-8 w-8', icon: 'h-4 w-4', text: 'text-xl' },
  md: { container: 'h-10 w-10', icon: 'h-5 w-5', text: 'text-2xl' },
  lg: { container: 'h-12 w-12', icon: 'h-6 w-6', text: 'text-3xl' },
};

export function AppLogo({ size = 'md', showText = true }: AppLogoProps) {
  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-primary shadow-glow ${classes.container}`}
      >
        <Heart className={`text-primary-foreground ${classes.icon}`} fill="currentColor" />
      </div>
      {showText && (
        <span className={`font-bold text-foreground ${classes.text}`}>Kardio</span>
      )}
    </div>
  );
}
