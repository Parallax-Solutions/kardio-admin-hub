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
              <span>Diseñado para Latinoamérica</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Organiza tus gastos{' '}
              <span className="text-gradient-primary">automáticamente</span>{' '}
              desde tu correo
            </h1>

            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Kardio lee los correos de notificación de tu banco, extrae tus transacciones 
              y las categoriza con IA. Sin ingresar datos manualmente, sin compartir tu clave bancaria.
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
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground lg:justify-start">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <span>No pedimos clave del banco</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-success" />
                <span>Solo lectura de correos</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-success" />
                <span>Datos encriptados</span>
              </div>
            </div>
          </div>

          {/* Right content - Dashboard mockup */}
          <div className="relative">
            <div className="relative rounded-2xl border border-border bg-card p-4 shadow-elevated">
              {/* Browser bar */}
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-warning/60" />
                  <div className="h-3 w-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 rounded-md bg-muted px-3 py-1 text-center text-xs text-muted-foreground">
                  app.kardio.io
                </div>
              </div>

              {/* Dashboard content */}
              <div className="space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Gastos del mes</p>
                    <p className="text-lg font-bold text-foreground">$2,847.50</p>
                    <p className="text-xs text-destructive">+12% vs mes anterior</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Ingresos</p>
                    <p className="text-lg font-bold text-foreground">$4,500.00</p>
                    <p className="text-xs text-success">+5% vs mes anterior</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Suscripciones</p>
                    <p className="text-lg font-bold text-foreground">$89.99</p>
                    <p className="text-xs text-muted-foreground">5 activas</p>
                  </div>
                </div>

                {/* Chart mockup */}
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="mb-3 text-sm font-medium text-foreground">Gastos por categoría</p>
                  <div className="space-y-2">
                    {[
                      { name: 'Alimentación', value: 35, color: 'bg-primary' },
                      { name: 'Transporte', value: 22, color: 'bg-accent' },
                      { name: 'Entretenimiento', value: 18, color: 'bg-info' },
                      { name: 'Servicios', value: 15, color: 'bg-warning' },
                      { name: 'Otros', value: 10, color: 'bg-muted-foreground' },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <span className="w-28 text-xs text-muted-foreground">{item.name}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.color}`} 
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-medium text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent transactions */}
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="mb-3 text-sm font-medium text-foreground">Últimas transacciones</p>
                  <div className="space-y-2">
                    {[
                      { merchant: 'Uber', amount: '-$12.50', category: 'Transporte', time: 'Hace 2h' },
                      { merchant: 'Spotify', amount: '-$9.99', category: 'Suscripción', time: 'Ayer' },
                      { merchant: 'Supermercado La Colonia', amount: '-$67.30', category: 'Alimentación', time: 'Ayer' },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between py-1">
                        <div>
                          <p className="text-sm font-medium text-foreground">{tx.merchant}</p>
                          <p className="text-xs text-muted-foreground">{tx.category} · {tx.time}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">{tx.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-4 top-1/4 animate-fade-in rounded-lg border border-border bg-card px-3 py-2 shadow-elevated">
              <p className="text-xs font-medium text-success">✓ Categorizado con IA</p>
            </div>
            <div className="absolute -right-4 bottom-1/4 animate-fade-in rounded-lg border border-border bg-card px-3 py-2 shadow-elevated" style={{ animationDelay: '0.2s' }}>
              <p className="text-xs font-medium text-primary">📧 Importado automáticamente</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
