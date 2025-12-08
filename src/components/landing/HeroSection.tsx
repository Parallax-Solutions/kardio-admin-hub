import { Button } from '@/components/ui/button';
import { Mail, Play, Shield, Lock, Eye } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <Mail className="h-4 w-4" />
              <span>Disponible en Costa Rica 🇨🇷</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Organiza tus gastos{' '}
              <span className="text-gradient-primary">automáticamente</span>{' '}
              desde tu correo
            </h1>

            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Kardio lee los correos de notificación de tu banco y valida cada transacción 
              con tus estados de cuenta. Todo categorizado automáticamente, sin ingresar datos manualmente.
            </p>

            <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                <Mail className="h-5 w-5" />
                Conectar mi correo
              </Button>
              <Button variant="outline" size="lg" className="w-full gap-2 sm:w-auto">
                <Play className="h-5 w-5" />
                Ver demo
              </Button>
            </div>

            {/* Trust notes */}
            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm lg:justify-start">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shield className="h-3.5 w-3.5 text-success sm:h-4 sm:w-4" />
                <span>No pedimos clave del banco</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Eye className="h-3.5 w-3.5 text-success sm:h-4 sm:w-4" />
                <span>Solo lectura de correos</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Lock className="h-3.5 w-3.5 text-success sm:h-4 sm:w-4" />
                <span>Datos encriptados</span>
              </div>
            </div>
          </div>

          {/* Right content - Mobile App mockup */}
          <div className="relative flex justify-center">
            {/* Phone frame */}
            <div className="relative w-[280px] sm:w-[300px]">
              {/* Phone outer frame */}
              <div className="rounded-[2.5rem] border-[8px] border-foreground/90 bg-foreground/90 p-1 shadow-elevated">
                {/* Phone inner bezel */}
                <div className="rounded-[2rem] bg-card overflow-hidden">
                  {/* Status bar */}
                  <div className="flex items-center justify-between bg-background px-5 py-2">
                    <span className="text-[10px] font-medium text-foreground">9:41</span>
                    <div className="absolute left-1/2 -translate-x-1/2 h-6 w-20 rounded-full bg-foreground/90" />
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        <div className="h-2 w-0.5 rounded-full bg-foreground" />
                        <div className="h-2.5 w-0.5 rounded-full bg-foreground" />
                        <div className="h-3 w-0.5 rounded-full bg-foreground" />
                        <div className="h-3.5 w-0.5 rounded-full bg-foreground" />
                      </div>
                      <div className="ml-1 h-3 w-6 rounded-sm border border-foreground">
                        <div className="h-full w-3/4 rounded-sm bg-success" />
                      </div>
                    </div>
                  </div>

                  {/* App content */}
                  <div className="bg-background px-4 py-3 space-y-3">
                    {/* App header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Hola, Carlos 👋</p>
                        <p className="text-sm font-semibold text-foreground">Diciembre 2024</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">CG</span>
                      </div>
                    </div>

                    {/* Balance card */}
                    <div className="rounded-xl bg-gradient-primary p-4">
                      <p className="text-[10px] text-primary-foreground/80">Balance disponible</p>
                      <p className="text-2xl font-bold text-primary-foreground">$1,952.50</p>
                      <div className="mt-2 flex gap-4">
                        <div>
                          <p className="text-[9px] text-primary-foreground/70">Ingresos</p>
                          <p className="text-xs font-medium text-primary-foreground">+$5,200</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-primary-foreground/70">Gastos</p>
                          <p className="text-xs font-medium text-primary-foreground">-$3,247</p>
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <p className="text-xs font-medium text-foreground mb-2">Gastos por categoría</p>
                      <div className="space-y-1.5">
                        {[
                          { name: 'Alimentación', value: 35, amount: '$1,138', color: 'bg-primary' },
                          { name: 'Transporte', value: 22, amount: '$714', color: 'bg-accent' },
                          { name: 'Entretenimiento', value: 18, amount: '$585', color: 'bg-info' },
                        ].map((item) => (
                          <div key={item.name} className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${item.color}`} />
                            <span className="flex-1 text-[10px] text-muted-foreground">{item.name}</span>
                            <span className="text-[10px] font-medium text-foreground">{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent transactions */}
                    <div>
                      <p className="text-xs font-medium text-foreground mb-2">Últimas transacciones</p>
                      <div className="space-y-2">
                        {[
                          { merchant: 'Uber', amount: '-$12.50', icon: '🚗' },
                          { merchant: 'Spotify', amount: '-$9.99', icon: '🎵' },
                          { merchant: 'La Colonia', amount: '-$67.30', icon: '🛒' },
                        ].map((tx, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                            <span className="text-sm">{tx.icon}</span>
                            <span className="flex-1 text-[11px] font-medium text-foreground">{tx.merchant}</span>
                            <span className="text-[11px] font-medium text-foreground">{tx.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom nav bar */}
                  <div className="flex items-center justify-around border-t border-border bg-card px-4 py-3">
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded bg-primary/20" />
                      <span className="mt-1 text-[8px] text-primary font-medium">Inicio</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded bg-muted" />
                      <span className="mt-1 text-[8px] text-muted-foreground">Gastos</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded bg-muted" />
                      <span className="mt-1 text-[8px] text-muted-foreground">Suscrip.</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded bg-muted" />
                      <span className="mt-1 text-[8px] text-muted-foreground">Perfil</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges - hidden on very small screens */}
            <div className="absolute -left-2 top-1/4 hidden animate-fade-in rounded-lg border border-border bg-card px-2 py-1.5 shadow-elevated sm:block sm:-left-4 sm:px-3 sm:py-2">
              <p className="text-[10px] font-medium text-success sm:text-xs">✓ Categorizado automáticamente</p>
            </div>
            <div className="absolute -right-2 bottom-1/3 hidden animate-fade-in rounded-lg border border-border bg-card px-2 py-1.5 shadow-elevated sm:block sm:-right-4 sm:px-3 sm:py-2" style={{ animationDelay: '0.2s' }}>
              <p className="text-[10px] font-medium text-primary sm:text-xs">📧 Importado automáticamente</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
