import { 
  Mail, 
  Brain, 
  Building2, 
  RefreshCcw, 
  Globe, 
  Server,
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Mail,
      title: 'Importación automática',
      description: 'Conecta tu correo y Kardio detecta automáticamente los emails de notificación de tu banco.',
    },
    {
      icon: Brain,
      title: 'Categorización con IA',
      description: 'GPT-4o-mini clasifica tus gastos en categorías inteligentes sin que muevas un dedo.',
    },
    {
      icon: Building2,
      title: 'Multi-banco',
      description: 'Compatible con múltiples bancos de la región. Un solo lugar para todas tus cuentas.',
    },
    {
      icon: RefreshCcw,
      title: 'Detección de suscripciones',
      description: 'Identifica automáticamente tus pagos recurrentes como Netflix, Spotify o el gimnasio.',
    },
    {
      icon: Globe,
      title: 'Hecho para LATAM',
      description: 'Bancos locales, monedas locales, patrones de correo locales. Diseñado para ti.',
    },
    {
      icon: Server,
      title: 'Self-hosting disponible',
      description: 'Si prefieres tener control total, puedes correr Kardio en tu propia infraestructura.',
    },
  ];

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Características principales
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Todo lo que necesitas para entender tus finanzas, sin complicaciones
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:border-primary/20"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
