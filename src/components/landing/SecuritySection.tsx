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
    }
  ];

  return (
    <section className="bg-background py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-3 py-1.5 text-xs text-success sm:px-4 sm:py-2 sm:text-sm">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Tu privacidad es prioridad</span>
            </div>
            
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Seguridad y privacidad en el centro
            </h2>
            <p className="mb-6 text-sm text-muted-foreground sm:mb-8 sm:text-base">
              Sabemos lo delicada que es tu información financiera. Por eso diseñamos Kardio 
              desde cero pensando en tu privacidad.
            </p>

            <ul className="space-y-3 text-left sm:space-y-4">
              {securityPoints.map((point, index) => (
                <li key={index} className="flex gap-3 sm:gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-success/10 sm:h-10 sm:w-10">
                    <point.icon className="h-4 w-4 text-success sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground sm:text-base">{point.title}</h4>
                    <p className="text-xs text-muted-foreground sm:text-sm">{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right content - Security visual */}
          <div className="relative">
            <div className="rounded-xl border border-border bg-card p-5 shadow-elevated sm:rounded-2xl sm:p-8">
              <div className="mb-4 flex items-center justify-center sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse-subtle rounded-full bg-success/20 blur-xl" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-success/20 to-success/5 border border-success/20 sm:h-24 sm:w-24">
                    <Shield className="h-8 w-8 text-success sm:h-12 sm:w-12" />
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3 sm:gap-3 sm:p-4">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success sm:h-5 sm:w-5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground sm:text-sm">Acceso verificado</p>
                    <p className="truncate text-[10px] text-muted-foreground sm:text-xs">Solo correos de @bancobac.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3 sm:gap-3 sm:p-4">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success sm:h-5 sm:w-5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground sm:text-sm">Encriptación activa</p>
                    <p className="truncate text-[10px] text-muted-foreground sm:text-xs">AES-256 en reposo, TLS 1.3 en tránsito</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3 sm:gap-3 sm:p-4">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success sm:h-5 sm:w-5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground sm:text-sm">Sin acceso bancario</p>
                    <p className="truncate text-[10px] text-muted-foreground sm:text-xs">No guardamos credenciales de banco</p>
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
