import { Check, X, ArrowRight, Receipt, Tag, Percent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { DuplicateSuggestion, MerchantInfo } from '@/stores/merchantDuplicatesStore';

interface DuplicateCardProps {
  suggestion: DuplicateSuggestion;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isAccepting: boolean;
  isRejecting: boolean;
}

function MerchantSide({ 
  merchant, 
  label, 
  variant,
}: { 
  merchant: MerchantInfo; 
  label: string; 
  variant: 'keep' | 'delete';
}) {
  const isKeep = variant === 'keep';
  
  return (
    <div
      className={cn(
        'flex-1 rounded-lg border p-4 transition-colors',
        isKeep
          ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
          : 'border-destructive/30 bg-destructive/5 dark:bg-destructive/10'
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            'text-[10px] font-medium',
            isKeep
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-destructive/40 bg-destructive/10 text-destructive'
          )}
        >
          {label}
        </Badge>
      </div>
      
      <h4 className="mb-1 text-base font-semibold leading-tight text-foreground">
        {merchant.originalName}
      </h4>
      
      <p className="mb-3 font-mono text-xs text-muted-foreground">
        {merchant.normalizedName}
      </p>
      
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{merchant.transactionCount}</span>
              <span>txns</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Transactions linked to this merchant</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{merchant.ruleCount}</span>
              <span>rules</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Category rules for this merchant</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export function DuplicateCard({
  suggestion,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}: DuplicateCardProps) {
  const similarityPercent = Math.round(suggestion.similarityScore * 100);
  const isProcessing = isAccepting || isRejecting;
  
  return (
    <Card className={cn(
      'transition-all duration-200',
      isProcessing && 'opacity-60 pointer-events-none'
    )}>
      <CardContent className="p-4 sm:p-5">
        {/* Header with similarity score */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {similarityPercent}% match
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(suggestion.id)}
              disabled={isProcessing}
              className="gap-1.5 text-xs hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
              Dismiss
            </Button>
            <Button
              size="sm"
              onClick={() => onAccept(suggestion.id)}
              disabled={isProcessing}
              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="h-3.5 w-3.5" />
              Merge
            </Button>
          </div>
        </div>
        
        {/* Side-by-side comparison */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <MerchantSide
            merchant={suggestion.canonicalMerchant}
            label="KEEP"
            variant="keep"
          />
          
          <div className="flex items-center justify-center sm:px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-muted">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <MerchantSide
            merchant={suggestion.candidateMerchant}
            label="DELETE"
            variant="delete"
          />
        </div>
      </CardContent>
    </Card>
  );
}
