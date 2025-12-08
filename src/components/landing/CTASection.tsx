import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="bg-gradient-primary py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
          Empieza a organizar tus finanzas hoy
        </h2>
        <p className="mb-8 text-lg text-primary-foreground/80">
          Conecta tu correo en menos de 2 minutos y deja que Kardio haga el trabajo pesado.
          Sin tarjeta de crédito requerida.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button 
            size="lg" 
            variant="secondary"
            className="w-full gap-2 bg-background text-foreground hover:bg-background/90 sm:w-auto"
          >
            <Mail className="h-5 w-5" />
            Conectar mi correo
          </Button>
          <Button 
            size="lg" 
            variant="ghost"
            className="w-full gap-2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
          >
            Conocer más
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
