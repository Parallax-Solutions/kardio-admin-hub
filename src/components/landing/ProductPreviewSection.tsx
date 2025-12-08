import { TrendingUp, TrendingDown, RefreshCcw, PieChart } from 'lucide-react';

const ProductPreviewSection = () => {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Vista de la app
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Una app móvil clara y moderna para entender tus finanzas de un vistazo
          </p>
        </div>

        {/* Mobile phones preview */}
        <div className="relative flex justify-center items-end gap-4 sm:gap-8 lg:gap-12">
          
          {/* Phone 1 - Dashboard */}
          <div className="relative w-[200px] sm:w-[240px] lg:w-[280px]">
            <div className="rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[8px] border-foreground/90 bg-foreground/90 p-0.5 sm:p-1 shadow-elevated">
              <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-card overflow-hidden">
                {/* Status bar */}
                <div className="flex items-center justify-between bg-background px-4 py-1.5 sm:py-2">
                  <span className="text-[8px] sm:text-[10px] font-medium text-foreground">9:41</span>
                  <div className="absolute left-1/2 -translate-x-1/2 h-4 sm:h-5 w-16 sm:w-20 rounded-full bg-foreground/90" />
                  <div className="h-2.5 w-5 rounded-sm border border-foreground">
                    <div className="h-full w-3/4 rounded-sm bg-success" />
                  </div>
                </div>

                {/* Dashboard screen */}
                <div className="bg-background px-3 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] sm:text-[10px] text-muted-foreground">Hola, Carlos 👋</p>
                      <p className="text-[10px] sm:text-sm font-semibold text-foreground">Diciembre 2024</p>
                    </div>
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-[8px] sm:text-xs font-bold text-primary-foreground">CG</span>
                    </div>
                  </div>

                  {/* Balance card */}
                  <div className="rounded-lg sm:rounded-xl bg-gradient-primary p-3 sm:p-4">
                    <p className="text-[8px] sm:text-[10px] text-primary-foreground/80">Balance disponible</p>
                    <p className="text-lg sm:text-2xl font-bold text-primary-foreground">$1,952.50</p>
                    <div className="mt-1 sm:mt-2 flex gap-3 sm:gap-4">
                      <div>
                        <p className="text-[7px] sm:text-[9px] text-primary-foreground/70">Ingresos</p>
                        <p className="text-[10px] sm:text-xs font-medium text-primary-foreground">+$5,200</p>
                      </div>
                      <div>
                        <p className="text-[7px] sm:text-[9px] text-primary-foreground/70">Gastos</p>
                        <p className="text-[10px] sm:text-xs font-medium text-primary-foreground">-$3,247</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-muted/50 p-2 sm:p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="h-3 w-3 text-destructive" />
                        <p className="text-[8px] sm:text-[10px] text-muted-foreground">Gastos</p>
                      </div>
                      <p className="text-[11px] sm:text-sm font-bold text-foreground">$3,247</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2 sm:p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <RefreshCcw className="h-3 w-3 text-info" />
                        <p className="text-[8px] sm:text-[10px] text-muted-foreground">Suscrip.</p>
                      </div>
                      <p className="text-[11px] sm:text-sm font-bold text-foreground">$127.97</p>
                    </div>
                  </div>

                  {/* Recent transactions */}
                  <div>
                    <p className="text-[9px] sm:text-xs font-medium text-foreground mb-1.5 sm:mb-2">Transacciones</p>
                    <div className="space-y-1.5">
                      {[
                        { merchant: 'Uber', amount: '-$12.50', icon: '🚗' },
                        { merchant: 'Spotify', amount: '-$9.99', icon: '🎵' },
                        { merchant: 'La Colonia', amount: '-$67.30', icon: '🛒' },
                      ].map((tx, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5">
                          <span className="text-[10px] sm:text-sm">{tx.icon}</span>
                          <span className="flex-1 text-[9px] sm:text-[11px] font-medium text-foreground">{tx.merchant}</span>
                          <span className="text-[9px] sm:text-[11px] font-medium text-foreground">{tx.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom nav */}
                <div className="flex items-center justify-around border-t border-border bg-card px-3 py-2 sm:py-3">
                  {['Inicio', 'Gastos', 'Suscrip.', 'Perfil'].map((item, i) => (
                    <div key={item} className="flex flex-col items-center">
                      <div className={`h-3 w-3 sm:h-4 sm:w-4 rounded ${i === 0 ? 'bg-primary/20' : 'bg-muted'}`} />
                      <span className={`mt-0.5 text-[6px] sm:text-[8px] ${i === 0 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs sm:text-sm font-medium text-primary">📊 Dashboard</span>
            </div>
          </div>

          {/* Phone 2 - Categories (taller, center) */}
          <div className="relative w-[220px] sm:w-[260px] lg:w-[300px] -mb-4">
            <div className="rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[8px] border-foreground/90 bg-foreground/90 p-0.5 sm:p-1 shadow-elevated">
              <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-card overflow-hidden">
                {/* Status bar */}
                <div className="flex items-center justify-between bg-background px-4 py-1.5 sm:py-2">
                  <span className="text-[8px] sm:text-[10px] font-medium text-foreground">9:41</span>
                  <div className="absolute left-1/2 -translate-x-1/2 h-4 sm:h-5 w-16 sm:w-20 rounded-full bg-foreground/90" />
                  <div className="h-2.5 w-5 rounded-sm border border-foreground">
                    <div className="h-full w-3/4 rounded-sm bg-success" />
                  </div>
                </div>

                {/* Categories screen */}
                <div className="bg-background px-3 sm:px-4 py-2 sm:py-3 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] sm:text-sm font-semibold text-foreground">Gastos por categoría</p>
                    <span className="text-[8px] sm:text-[10px] text-muted-foreground">Dic 2024</span>
                  </div>

                  {/* Donut chart mockup */}
                  <div className="flex justify-center">
                    <div className="relative h-28 w-28 sm:h-36 sm:w-36">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-muted" strokeWidth="14" />
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-primary" strokeWidth="14" 
                          strokeDasharray="87.96 164.93" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-accent" strokeWidth="14" 
                          strokeDasharray="50.27 201.06" strokeDashoffset="-87.96" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-info" strokeWidth="14" 
                          strokeDasharray="37.70 213.63" strokeDashoffset="-138.23" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="40" fill="none" className="stroke-warning" strokeWidth="14" 
                          strokeDasharray="25.13 226.19" strokeDashoffset="-175.93" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg sm:text-xl font-bold text-foreground">$3,247</span>
                        <span className="text-[8px] sm:text-[10px] text-muted-foreground">Total</span>
                      </div>
                    </div>
                  </div>

                  {/* Category list */}
                  <div className="space-y-2">
                    {[
                      { name: 'Alimentación', pct: '35%', amount: '$1,138', color: 'bg-primary' },
                      { name: 'Transporte', pct: '22%', amount: '$714', color: 'bg-accent' },
                      { name: 'Entretenimiento', pct: '18%', amount: '$585', color: 'bg-info' },
                      { name: 'Servicios', pct: '15%', amount: '$487', color: 'bg-warning' },
                      { name: 'Otros', pct: '10%', amount: '$325', color: 'bg-muted-foreground' },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-2 rounded-lg bg-muted/30 px-2 sm:px-3 py-2">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="flex-1 text-[9px] sm:text-[11px] font-medium text-foreground">{item.name}</span>
                        <span className="text-[8px] sm:text-[10px] text-muted-foreground">{item.pct}</span>
                        <span className="text-[9px] sm:text-[11px] font-medium text-foreground">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom nav */}
                <div className="flex items-center justify-around border-t border-border bg-card px-3 py-2 sm:py-3">
                  {['Inicio', 'Gastos', 'Suscrip.', 'Perfil'].map((item, i) => (
                    <div key={item} className="flex flex-col items-center">
                      <div className={`h-3 w-3 sm:h-4 sm:w-4 rounded ${i === 1 ? 'bg-primary/20' : 'bg-muted'}`} />
                      <span className={`mt-0.5 text-[6px] sm:text-[8px] ${i === 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs sm:text-sm font-medium text-accent">📈 Categorías</span>
            </div>
          </div>

          {/* Phone 3 - Subscriptions */}
          <div className="relative w-[200px] sm:w-[240px] lg:w-[280px] hidden sm:block">
            <div className="rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[8px] border-foreground/90 bg-foreground/90 p-0.5 sm:p-1 shadow-elevated">
              <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-card overflow-hidden">
                {/* Status bar */}
                <div className="flex items-center justify-between bg-background px-4 py-1.5 sm:py-2">
                  <span className="text-[8px] sm:text-[10px] font-medium text-foreground">9:41</span>
                  <div className="absolute left-1/2 -translate-x-1/2 h-4 sm:h-5 w-16 sm:w-20 rounded-full bg-foreground/90" />
                  <div className="h-2.5 w-5 rounded-sm border border-foreground">
                    <div className="h-full w-3/4 rounded-sm bg-success" />
                  </div>
                </div>

                {/* Subscriptions screen */}
                <div className="bg-background px-3 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] sm:text-sm font-semibold text-foreground">Suscripciones</p>
                    <span className="rounded-full bg-info/10 px-2 py-0.5 text-[8px] sm:text-[10px] text-info">6 activas</span>
                  </div>

                  {/* Monthly total */}
                  <div className="rounded-lg bg-info/10 p-3">
                    <p className="text-[8px] sm:text-[10px] text-info">Total mensual</p>
                    <p className="text-lg sm:text-xl font-bold text-info">$127.97</p>
                  </div>

                  {/* Subscription list */}
                  <div className="space-y-2">
                    {[
                      { name: 'Netflix', amount: '$15.99', date: '15 Dic', icon: '🎬' },
                      { name: 'Spotify', amount: '$9.99', date: '20 Dic', icon: '🎵' },
                      { name: 'iCloud', amount: '$2.99', date: '1 Ene', icon: '☁️' },
                      { name: 'Smart Fit', amount: '$49.00', date: '5 Ene', icon: '💪' },
                      { name: 'ChatGPT Plus', amount: '$20.00', date: '10 Ene', icon: '🤖' },
                      { name: 'YouTube Premium', amount: '$30.00', date: '12 Ene', icon: '▶️' },
                    ].map((sub, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/30 px-2 sm:px-3 py-2">
                        <span className="text-sm sm:text-base">{sub.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] sm:text-[11px] font-medium text-foreground truncate">{sub.name}</p>
                          <p className="text-[7px] sm:text-[9px] text-muted-foreground">Próximo: {sub.date}</p>
                        </div>
                        <p className="text-[9px] sm:text-[11px] font-medium text-foreground">{sub.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom nav */}
                <div className="flex items-center justify-around border-t border-border bg-card px-3 py-2 sm:py-3">
                  {['Inicio', 'Gastos', 'Suscrip.', 'Perfil'].map((item, i) => (
                    <div key={item} className="flex flex-col items-center">
                      <div className={`h-3 w-3 sm:h-4 sm:w-4 rounded ${i === 2 ? 'bg-primary/20' : 'bg-muted'}`} />
                      <span className={`mt-0.5 text-[6px] sm:text-[8px] ${i === 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs sm:text-sm font-medium text-info">🔄 Suscripciones</span>
            </div>
          </div>

          {/* Floating callouts */}
          <div className="absolute -left-2 top-16 hidden animate-fade-in rounded-lg border border-success/20 bg-card px-3 py-2 shadow-elevated lg:block">
            <p className="text-xs font-medium text-success">✓ Detectado automáticamente</p>
          </div>
          <div className="absolute -right-2 top-32 hidden animate-fade-in rounded-lg border border-primary/20 bg-card px-3 py-2 shadow-elevated lg:block" style={{ animationDelay: '0.15s' }}>
            <p className="text-xs font-medium text-primary">🧠 Categorizado con IA</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreviewSection;
