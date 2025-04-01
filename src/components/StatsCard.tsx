
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";

interface StatsCardProps extends VariantProps<typeof statsCardVariants> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const statsCardVariants = cva(
  "relative overflow-hidden data-card-hover",
  {
    variants: {
      variant: {
        default: "bg-card",
        colored: "bg-gradient-card text-white",
        purple: "bg-gradient-purple-pink text-white",
        blue: "bg-gradient-blue-purple text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  variant,
  className 
}: StatsCardProps) => {
  return (
    <Card className={cn(statsCardVariants({ variant }), className)}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className={cn(
              "text-sm font-medium",
              variant ? "text-white/80" : "text-muted-foreground"
            )}>
              {title}
            </p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            
            {trend && (
              <div className="flex items-center mt-2">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-emerald-500" : "text-red-500",
                  variant && "mix-blend-soft-light"
                )}>
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span className={cn(
                  "text-xs ml-1",
                  variant ? "text-white/60" : "text-muted-foreground"
                )}>vs last period</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              "p-2 rounded-lg",
              variant ? "bg-white/10" : "bg-muted"
            )}>
              {icon}
            </div>
          )}
        </div>
        
        {description && (
          <p className={cn(
            "text-sm mt-4",
            variant ? "text-white/70" : "text-muted-foreground"
          )}>
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
