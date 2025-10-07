import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { openWhatsAppChat } from '@/utils/whatsapp';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = React.memo(({
  phone,
  message,
  variant = 'outline',
  size = 'sm',
  className,
  children,
  showIcon = true
}) => {
  if (!phone) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openWhatsAppChat(phone, message);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50',
        className
      )}
    >
      {showIcon && <MessageCircle className="h-4 w-4 mr-1" />}
      {children || 'WhatsApp'}
    </Button>
  );
});

interface WhatsAppLinkProps {
  phone: string;
  message?: string;
  className?: string;
  children: React.ReactNode;
}

export const WhatsAppLink: React.FC<WhatsAppLinkProps> = React.memo(({
  phone,
  message,
  className,
  children
}) => {
  if (!phone) return <>{children}</>;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openWhatsAppChat(phone, message);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'text-green-600 hover:text-green-700 hover:underline transition-colors cursor-pointer',
        className
      )}
    >
      {children}
    </button>
  );
});