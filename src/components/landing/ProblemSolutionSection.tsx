import { X, Check } from 'lucide-react';

const ProblemSolutionSection = () => {
  const problems = [
    'Apps de finanzas con entrada manual tediosa',
    'Integraciones bancarias tipo Plaid que no funcionan en LATAM',
    'Categorizaciones manuales que terminas abandonando',
    'Múltiples bancos = múltiples apps = caos',
  ];

  const solutions = [
    'Lee automáticamente los correos de notificación de tu banco',
    'Categoriza gastos con IA (GPT-4o-mini)',
    'Funciona con múltiples bancos y monedas',
    'Diseñado específicamente para Costa Rica',
  ];

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            ¿Por qué Kardio es diferente?
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Sabemos que las soluciones tradicionales no funcionan bien en nuestra región. 
            Por eso creamos algo nuevo.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Before - Problems */}
          <div className="rounded-2xl border border-destructive/20 bg-card p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <X className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Antes</h3>
            </div>
            <ul className="space-y-4">
              {problems.map((problem, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10">
                    <X className="h-3 w-3 text-destructive" />
                  </div>
                  <span className="text-muted-foreground">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After - Solutions */}
          <div className="rounded-2xl border border-success/20 bg-card p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <Check className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Con Kardio</h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((solution, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success/10">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span className="text-foreground">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
