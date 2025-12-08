import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Shield, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        {/* Content */}
        <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
            
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Welcome to{' '}
              <span className="text-gradient-primary">Kardio</span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Your intelligent financial data processing platform. Automate bank email parsing,
              track transactions, and gain insights into your financial health.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link to="/admin">
                  Open Admin Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-border bg-card/50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your financial data is encrypted and protected with enterprise-grade security.
              </p>
            </div>
            
            <div className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-transform group-hover:scale-110">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Automated Parsing</h3>
              <p className="text-sm text-muted-foreground">
                Automatically extract transaction data from bank emails and statements.
              </p>
            </div>
            
            <div className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success transition-transform group-hover:scale-110">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Real-time Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get instant analytics and visualizations of your financial activity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Kardio. Built for intelligent financial management.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
