import { Mail, Cpu, LayoutDashboard, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Mail,
      number: '01',
      title: 'Conecta tu correo',
      description: 'Vincula tu Gmail u Outlook en segundos. Solo necesitamos acceso de lectura a correos de notificaciones bancarias.',
    },
    {
      icon: Cpu,
      number: '02',
      title: 'Extraemos tus transacciones',
      description: 'Nuestro motor detecta correos de tu banco y extrae cada transacción automáticamente.',
    },
    {
      icon: LayoutDashboard,
      number: '03',
      title: 'Visualiza tus finanzas',
      description: 'Accede a un dashboard claro con gastos, ingresos, suscripciones y tendencias. Sin esfuerzo.',
    },
  ];

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            ¿Cómo funciona?
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Tres pasos simples para tomar el control de tus finanzas personales
          </p>
        </div>

        <div className="relative">
          {/* Connection line (desktop only) */}
          <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step number with icon */}
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-10" />
                  <div className="relative flex h-full w-full flex-col items-center justify-center rounded-2xl border border-primary/20 bg-card">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>

                {/* Arrow (mobile) */}
                {index < steps.length - 1 && (
                  <div className="my-6 flex justify-center lg:hidden">
                    <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
