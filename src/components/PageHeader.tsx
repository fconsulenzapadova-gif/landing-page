import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  backTo?: string;
  backLabel?: string;
  showDashboardButton?: boolean;
  actions?: React.ReactNode;
  stats?: Array<{
    label: string;
    value: string | number;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }>;
  className?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  backTo = '/dashboard',
  backLabel = 'Dashboard',
  showDashboardButton = true,
  actions,
  stats,
  className = '',
  children
}) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Navigation Bar */}
      {showDashboardButton && (
        <div className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <Link to={backTo}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backLabel}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="border-b bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              {icon && (
                <div className="p-3 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
                  {icon}
                </div>
              )}
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  {title}
                </h1>
                {description && (
                  <p className="text-muted-foreground text-lg">
                    {description}
                  </p>
                )}
                {stats && stats.length > 0 && (
                  <div className="flex items-center gap-3 mt-2">
                    {stats.map((stat, index) => (
                      <Badge 
                        key={index} 
                        variant={stat.variant || 'secondary'}
                        className="px-3 py-1 text-sm font-medium"
                      >
                        {stat.label}: {stat.value}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions Section */}
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Children Content */}
      {children}
    </div>
  );
};

export default PageHeader;