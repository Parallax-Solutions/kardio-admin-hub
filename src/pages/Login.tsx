import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AppLogo, BackgroundDecoration } from '@/components/shared';
import { LoginForm } from '@/components/auth';

const Login = () => {
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast.success('Sesión iniciada correctamente');
      navigate(from, { replace: true });
    } catch {
      // Error ya manejado por el store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <BackgroundDecoration />

      <Card className="relative w-full max-w-md border-border/50 shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <AppLogo size="md" />
          </div>
          <div>
            <CardTitle className="text-xl">Panel Administrativo</CardTitle>
            <CardDescription className="mt-2">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Olvidaste tu contraseña?{' '}
            <a href="#" className="text-primary hover:underline">
              Contacta al administrador
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
