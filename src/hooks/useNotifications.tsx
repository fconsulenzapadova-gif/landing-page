import { useState, useEffect } from 'react';
import { BuyerClient, SellerClient } from '@/components/Dashboard';
import { Contract } from '@/types/contract';
import { useToast } from '@/hooks/use-toast';
import { getAppStorage } from '@/utils/storage';

export interface Notification {
  id: string;
  type: 'birthday' | 'reminder' | 'info' | 'contract';
  title: string;
  description: string;
  clientId?: string;
  clientName?: string;
  clientType?: 'buyer' | 'seller';
  contractId?: string;
  contractDescription?: string;
  date: Date;
  isRead: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Check for birthday notifications
  const checkBirthdayNotifications = () => {
    const storage = getAppStorage();
    const buyers: BuyerClient[] = JSON.parse(storage.getItem('crm-buyers') || '[]');
    const sellers: SellerClient[] = JSON.parse(storage.getItem('crm-sellers') || '[]');
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const newNotifications: Notification[] = [];

    // Check buyers birthdays
    buyers.forEach(buyer => {
      if (buyer.birthday) {
        const birthday = new Date(buyer.birthday);
        const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
        
        // If birthday already passed this year, check next year
        if (thisYearBirthday < today) {
          thisYearBirthday.setFullYear(today.getFullYear() + 1);
        }

        const daysDiff = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        let notificationTitle = '';
        let notificationDescription = '';

        if (daysDiff === 0) {
          notificationTitle = '🎉 Compleanno Oggi!';
          notificationDescription = `Oggi è il compleanno di ${buyer.name}. Non dimenticare di fare gli auguri!`;
        } else if (daysDiff === 1) {
          notificationTitle = '🎂 Compleanno Domani';
          notificationDescription = `Domani è il compleanno di ${buyer.name}. Prepara gli auguri!`;
        } else if (daysDiff <= 7) {
          notificationTitle = '📅 Compleanno in Arrivo';
          notificationDescription = `Il compleanno di ${buyer.name} è tra ${daysDiff} giorni.`;
        }

        if (notificationTitle) {
          newNotifications.push({
            id: `birthday-buyer-${buyer.id}-${thisYearBirthday.getTime()}`,
            type: 'birthday',
            title: notificationTitle,
            description: notificationDescription,
            clientId: buyer.id,
            clientName: buyer.name,
            clientType: 'buyer',
            date: thisYearBirthday,
            isRead: false
          });
        }
      }
    });

    // Check sellers birthdays
    sellers.forEach(seller => {
      if (seller.birthday) {
        const birthday = new Date(seller.birthday);
        const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
        
        // If birthday already passed this year, check next year
        if (thisYearBirthday < today) {
          thisYearBirthday.setFullYear(today.getFullYear() + 1);
        }

        const daysDiff = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        let notificationTitle = '';
        let notificationDescription = '';

        if (daysDiff === 0) {
          notificationTitle = '🎉 Compleanno Oggi!';
          notificationDescription = `Oggi è il compleanno di ${seller.name}. Non dimenticare di fare gli auguri!`;
        } else if (daysDiff === 1) {
          notificationTitle = '🎂 Compleanno Domani';
          notificationDescription = `Domani è il compleanno di ${seller.name}. Prepara gli auguri!`;
        } else if (daysDiff <= 7) {
          notificationTitle = '📅 Compleanno in Arrivo';
          notificationDescription = `Il compleanno di ${seller.name} è tra ${daysDiff} giorni.`;
        }

        if (notificationTitle) {
          newNotifications.push({
            id: `birthday-seller-${seller.id}-${thisYearBirthday.getTime()}`,
            type: 'birthday',
            title: notificationTitle,
            description: notificationDescription,
            clientId: seller.id,
            clientName: seller.name,
            clientType: 'seller',
            date: thisYearBirthday,
            isRead: false
          });
        }
      }
    });

    return newNotifications;
  };

  // Check for contract registration notifications
  const checkContractNotifications = () => {
    const storage = getAppStorage();
    const contracts: Contract[] = JSON.parse(storage.getItem('crm-contracts') || '[]').map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
      registrationDate: c.registrationDate ? new Date(c.registrationDate) : undefined,
      registrationExpiryDate: c.registrationExpiryDate ? new Date(c.registrationExpiryDate) : undefined,
    }));

    const today = new Date();
    const newNotifications: Notification[] = [];

    contracts.forEach(contract => {
      if (!contract.registrationExpiryDate || contract.status === 'registrato') return;

      const daysUntilExpiry = Math.ceil((contract.registrationExpiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let notificationTitle = '';
      let notificationDescription = '';

      if (daysUntilExpiry < 0) {
        const daysOverdue = Math.abs(daysUntilExpiry);
        notificationTitle = '🚨 Registrazione Scaduta';
        notificationDescription = `Il contratto "${contract.description}" è scaduto da ${daysOverdue} giorno${daysOverdue > 1 ? 'i' : ''}`;
      } else if (daysUntilExpiry === 0) {
        notificationTitle = '⏰ Registrazione Oggi!';
        notificationDescription = `Il contratto "${contract.description}" deve essere registrato OGGI`;
      } else if (daysUntilExpiry === 1) {
        notificationTitle = '📅 Registrazione Domani';
        notificationDescription = `Il contratto "${contract.description}" deve essere registrato entro domani`;
      } else if (daysUntilExpiry <= 7) {
        notificationTitle = '⚠️ Scadenza Registrazione';
        notificationDescription = `Il contratto "${contract.description}" deve essere registrato tra ${daysUntilExpiry} giorni`;
      }

      if (notificationTitle) {
        newNotifications.push({
          id: `contract-${contract.id}-${contract.registrationExpiryDate.getTime()}`,
          type: 'contract',
          title: notificationTitle,
          description: notificationDescription,
          contractId: contract.id,
          contractDescription: contract.description,
          date: contract.registrationExpiryDate,
          isRead: false
        });
      }
    });

    return newNotifications;
  };

  // Check for all notifications
  const checkAllNotifications = () => {
    const storage = getAppStorage();
    const birthdayNotifications = checkBirthdayNotifications();
    const contractNotifications = checkContractNotifications();
    const allNewNotifications = [...birthdayNotifications, ...contractNotifications];

    // Load existing notifications from localStorage
    const existingNotifications = JSON.parse(storage.getItem('crm-notifications') || '[]');
    const existingIds = existingNotifications.map((n: Notification) => n.id);

    // Only add notifications that don't already exist
    const uniqueNewNotifications = allNewNotifications.filter(n => !existingIds.includes(n.id));
    
    if (uniqueNewNotifications.length > 0) {
      const allNotifications = [...existingNotifications, ...uniqueNewNotifications];
      setNotifications(allNotifications);
      storage.setItem('crm-notifications', JSON.stringify(allNotifications));

      // Show toast for urgent notifications
      uniqueNewNotifications.forEach(notification => {
        if (notification.title.includes('Oggi') || notification.title.includes('Scaduta')) {
          toast({
            title: notification.title,
            description: notification.description,
            duration: 8000,
          });
        }
      });
    } else {
      setNotifications(existingNotifications);
    }
  };

  // Load notifications on mount and check for new ones
  useEffect(() => {
    checkAllNotifications();
    
    // Check every hour for new notifications
    const interval = setInterval(checkAllNotifications, 1000 * 60 * 60);
    
    return () => clearInterval(interval);
  }, []);

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  const markAsRead = (notificationId: string) => {
    const storage = getAppStorage();
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
    storage.setItem('crm-notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const storage = getAppStorage();
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
    storage.setItem('crm-notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (notificationId: string) => {
    const storage = getAppStorage();
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    storage.setItem('crm-notifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    const storage = getAppStorage();
    setNotifications([]);
    storage.setItem('crm-notifications', JSON.stringify([]));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    checkAllNotifications
  };
};