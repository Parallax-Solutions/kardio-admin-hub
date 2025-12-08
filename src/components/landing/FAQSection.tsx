import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: '¿Kardio puede mover dinero de mi cuenta?',
      answer: 'No. Kardio solo tiene acceso de lectura a tus correos de notificaciones bancarias. No tenemos acceso a tu cuenta bancaria, no podemos realizar transferencias ni ninguna operación financiera. Solo leemos correos para extraer información.',
    },
    {
      question: '¿Qué bancos soporta Kardio?',
      answer: 'Actualmente soportamos los principales bancos de Costa Rica: BAC Credomatic, BCR, Banco Nacional y Scotiabank. Si tu banco no está soportado aún, contáctanos y lo priorizaremos.',
    },
    {
      question: '¿Cómo valida Kardio las transacciones?',
      answer: 'Kardio lee tanto las notificaciones de transacción como los estados de cuenta que llegan a tu correo. Esto nos permite validar cada transacción y asegurar que tu información financiera esté siempre completa y precisa.',
    },
    {
      question: '¿Mis datos están seguros?',
      answer: 'Absolutamente. Tus datos están encriptados con AES-256 en reposo y TLS 1.3 en tránsito. Nunca pedimos credenciales bancarias. Además, ofrecemos la opción de self-hosting para quienes prefieren tener control total de su información.',
    },
    {
      question: '¿Puedo usar Kardio en mi propio servidor?',
      answer: 'Sí. Kardio ofrece una opción de self-hosting para usuarios avanzados o empresas que prefieren mantener todos sus datos en su propia infraestructura. Contáctanos para más información sobre licencias empresariales.',
    },
  ];

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="text-muted-foreground">
            Resolvemos tus dudas sobre Kardio
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
