import { useState, useEffect } from 'react';
import { Contract } from '@/types/contract';

export const useContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    const loadContracts = () => {
      const savedContracts = localStorage.getItem('crm-contracts');
      if (savedContracts) {
        const parsedContracts = JSON.parse(savedContracts).map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          registrationDate: c.registrationDate ? new Date(c.registrationDate) : undefined,
          registrationExpiryDate: c.registrationExpiryDate ? new Date(c.registrationExpiryDate) : undefined,
        }));
        setContracts(parsedContracts);
      }
    };

    // Initial load
    loadContracts();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'crm-contracts') {
        loadContracts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    const handleContractsUpdate = () => {
      loadContracts();
    };
    
    window.addEventListener('contracts-updated', handleContractsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contracts-updated', handleContractsUpdate);
    };
  }, []);

  // Helper functions for contract analysis
  const getContractsToRegister = () => {
    return contracts.filter(c => c.status === 'da_registrare');
  };

  const getUpcomingDeadlines = (days: number = 14) => {
    return contracts.filter(c => {
      if (!c.registrationExpiryDate) return false;
      const daysUntilExpiry = Math.ceil((c.registrationExpiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= days && daysUntilExpiry >= 0;
    });
  };

  const getCriticalDeadlines = (days: number = 7) => {
    return contracts.filter(c => {
      if (!c.registrationExpiryDate) return false;
      const daysUntilExpiry = Math.ceil((c.registrationExpiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= days && daysUntilExpiry >= 0;
    });
  };

  return {
    contracts,
    getContractsToRegister,
    getUpcomingDeadlines,
    getCriticalDeadlines,
  };
};