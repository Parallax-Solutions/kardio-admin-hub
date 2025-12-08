import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <Shield className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Access Denied</h1>
        <p className="mb-6 text-muted-foreground">
          This area is restricted to administrators only.
        </p>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Return to Home
        </Button>
      </div>
    </div>
  );
}
