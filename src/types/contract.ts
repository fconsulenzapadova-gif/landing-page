export type ContractType = 'affitto' | 'vendita' | 'preliminare' | 'altro';

export type ContractStatus = 'da_registrare' | 'registrato' | 'scaduto';

export interface Contract {
  id: string;
  type: ContractType;
  status: ContractStatus;
  description: string;
  parties: Record<string, string>;
  registrationDate?: Date;
  registrationExpiryDate?: Date; // Scadenza registrazione (30 giorni dalla creazione)
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}