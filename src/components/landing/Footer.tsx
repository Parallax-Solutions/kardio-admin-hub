import { Heart } from 'lucide-react';

const Footer = () => {
  const links = {
    producto: [
      { label: 'Características', href: '#' },
      { label: 'Precios', href: '#' },
      { label: 'Seguridad', href: '#' },
      { label: 'Roadmap', href: '#' },
    ],
    recursos: [
      { label: 'Documentación', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Estado del servicio', href: '#' },
    ],
    legal: [
      { label: 'Términos de servicio', href: '#' },
      { label: 'Política de privacidad', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Kardio</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Tu tracker de gastos inteligente. Automatización + Privacidad, 
              diseñado para Costa Rica.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 Kardio. Todos los derechos reservados.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-8 lg:col-span-3">
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Producto</h4>
              <ul className="space-y-2">
                {links.producto.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Recursos</h4>
              <ul className="space-y-2">
                {links.recursos.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2">
                {links.legal.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
