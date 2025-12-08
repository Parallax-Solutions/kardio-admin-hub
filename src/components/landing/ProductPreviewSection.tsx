import { TrendingUp, TrendingDown, RefreshCcw, PieChart } from 'lucide-react';

const ProductPreviewSection = () => {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Vista del producto
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Un dashboard claro y moderno para entender tus finanzas de un vistazo
          </p>
        </div>

        {/* Main dashboard preview */}
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="rounded-md bg-background px-4 py-1 text-sm text-muted-foreground">
                  app.kardio.io/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6 lg:p-8">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Resumen de Diciembre</h3>
                  <p className="text-sm text-muted-foreground">01 - 08 Dic, 2024</p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Este mes
                  </span>
                </div>
              </div>

              {/* Stats cards */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Gastos totales</p>
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">$3,247.50</p>
                  <p className="text-xs text-destructive">+8.2% vs Nov</p>
                </div>
                
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Ingresos</p>
                    <TrendingDown className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">$5,200.00</p>
                  <p className="text-xs text-success">+2.1% vs Nov</p>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Suscripciones</p>
                    <RefreshCcw className="h-4 w-4 text-info" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">$127.97</p>
                  <p className="text-xs text-muted-foreground">6 activas</p>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <PieChart className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-success">+$1,952.50</p>
                  <p className="text-xs text-muted-foreground">Disponible</p>
                </div>
              </div>

              {/* Two columns */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Categories chart */}
                <div className="rounded-xl border border-border bg-background p-5">
                  <h4 className="mb-4 font-medium text-foreground">Gastos por categoría</h4>
                  <div className="flex items-center gap-6">
                    {/* Donut chart mockup */}
                    <div className="relative h-32 w-32 flex-shrink-0">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-muted" strokeWidth="12" />
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-primary" strokeWidth="12" 
                          strokeDasharray="87.96 164.93" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-accent" strokeWidth="12" 
                          strokeDasharray="50.27 201.06" strokeDashoffset="-87.96" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-info" strokeWidth="12" 
                          strokeDasharray="37.70 213.63" strokeDashoffset="-138.23" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-warning" strokeWidth="12" 
                          strokeDasharray="25.13 226.19" strokeDashoffset="-175.93" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-foreground">100%</span>
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="space-y-2 flex-1">
                      {[
                        { name: 'Alimentación', value: '$1,138', pct: '35%', color: 'bg-primary' },
                        { name: 'Transporte', value: '$714', pct: '22%', color: 'bg-accent' },
                        { name: 'Entretenimiento', value: '$585', pct: '18%', color: 'bg-info' },
                        { name: 'Servicios', value: '$487', pct: '15%', color: 'bg-warning' },
                        { name: 'Otros', value: '$325', pct: '10%', color: 'bg-muted-foreground' },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center gap-2 text-sm">
                          <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                          <span className="flex-1 text-muted-foreground">{item.name}</span>
                          <span className="font-medium text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subscriptions */}
                <div className="rounded-xl border border-border bg-background p-5">
                  <h4 className="mb-4 font-medium text-foreground">Suscripciones detectadas</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Netflix', amount: '$15.99', date: 'Próximo: 15 Dic' },
                      { name: 'Spotify', amount: '$9.99', date: 'Próximo: 20 Dic' },
                      { name: 'iCloud', amount: '$2.99', date: 'Próximo: 1 Ene' },
                      { name: 'Smart Fit', amount: '$49.00', date: 'Próximo: 5 Ene' },
                      { name: 'ChatGPT Plus', amount: '$20.00', date: 'Próximo: 10 Ene' },
                    ].map((sub, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                            {sub.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{sub.name}</p>
                            <p className="text-xs text-muted-foreground">{sub.date}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-foreground">{sub.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating callouts */}
          <div className="absolute -left-4 top-32 hidden animate-fade-in rounded-lg border border-primary/20 bg-card px-4 py-2 shadow-elevated lg:block">
            <p className="text-xs font-medium text-primary">📊 Gastos por categoría</p>
          </div>
          <div className="absolute -right-4 top-64 hidden animate-fade-in rounded-lg border border-info/20 bg-card px-4 py-2 shadow-elevated lg:block" style={{ animationDelay: '0.15s' }}>
            <p className="text-xs font-medium text-info">🔄 Suscripciones detectadas</p>
          </div>
          <div className="absolute -left-4 bottom-24 hidden animate-fade-in rounded-lg border border-success/20 bg-card px-4 py-2 shadow-elevated lg:block" style={{ animationDelay: '0.3s' }}>
            <p className="text-xs font-medium text-success">💰 Resumen mensual</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreviewSection;
