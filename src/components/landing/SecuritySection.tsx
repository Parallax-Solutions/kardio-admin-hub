import { Shield, Eye, Lock, Server, CheckCircle2 } from 'lucide-react';

const SecuritySection = () => {
  const securityPoints = [
    {
      icon: Shield,
      title: 'No pedimos tu clave del banco',
      description: 'Nunca necesitamos tu usuario ni contraseña bancaria. Cero acceso a tus cuentas.',
    },
    {
      icon: Eye,
      title: 'Solo lectura de correos',
      description: 'Accedemos únicamente a correos de notificaciones bancarias. No leemos nada más.',
    },
    {
      icon: Lock,
      title: 'Datos encriptados',
      description: 'Tu información está protegida con encriptación de grado bancario en tránsito y en reposo.',
    },
    {
      icon: Server,
      title: 'Opción self-hosted',
      description: 'Si prefieres tener control total, puedes correr Kardio en tu propia infraestructura.',
    },
  ];

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-2 text-sm text-success">
              <Shield className="h-4 w-4" />
              <span>Tu privacidad es prioridad</span>
            </div>
            
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Seguridad y privacidad en el centro
            </h2>
            <p className="mb-8 text-muted-foreground">
              Sabemos lo delicada que es tu información financiera. Por eso diseñamos Kardio 
              desde cero pensando en tu privacidad.
            </p>

            <ul className="space-y-4">
              {securityPoints.map((point, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-success/10">
                    <point.icon className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{point.title}</h4>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right content - Security visual */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
              <div className="mb-6 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse-subtle rounded-full bg-success/20 blur-xl" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-success/20 to-success/5 border border-success/20">
                    <Shield className="h-12 w-12 text-success" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 p-4">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Acceso verificado</p>
                    <p className="text-xs text-muted-foreground">Solo correos de @bancobac.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 p-4">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Encriptación activa</p>
                    <p className="text-xs text-muted-foreground">AES-256 en reposo, TLS 1.3 en tránsito</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 p-4">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Sin acceso bancario</p>
                    <p className="text-xs text-muted-foreground">No guardamos credenciales de banco</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
