import { logInfo } from '@/utils/logger';
import type { BuyerClient, SellerClient } from '@/components/Dashboard';

export const sampleBuyers: BuyerClient[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    phone: '+39 339 123 4567',
    email: 'marco.rossi@email.com',
    birthday: '1985-03-15',
    type: 'Acquisto',
    propertyType: 'Appartamento',
    features: 'Arredamento: Arredato, Spazi esterni: Balcone, Riscaldamento: Autonomo',
    budget: '250.000 - 300.000',
    zona: 'Centro Storico',
    notes: 'Preferisce appartamenti con vista, disponibile per visite nei weekend',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Sofia Bianchi',
    phone: '+39 347 987 6543',
    email: 'sofia.bianchi@email.com',
    birthday: '1992-07-22',
    type: 'Locazione',
    propertyType: 'Monolocale',
    features: 'Arredamento: Non arredato, Spazi esterni: Terrazzo, Bagno: 1 bagno',
    budget: '600 - 800/mese',
    zona: 'Zona universitaria',
    notes: 'Studentessa, cerca qualcosa vicino all\'università',
    createdAt: new Date('2024-02-10')
  },
  {
    id: '3',
    name: 'Alessandro Verde',
    phone: '+39 320 456 7890',
    email: 'alessandro.verde@email.com',
    birthday: '1978-11-08',
    type: 'Acquisto',
    propertyType: 'Villa',
    features: 'Spazi esterni: Giardino, Garage: Box auto, Riscaldamento: Centralizzato',
    budget: '400.000 - 500.000',
    zona: 'Periferia residenziale',
    notes: 'Famiglia con bambini, cerca casa con giardino',
    createdAt: new Date('2024-01-28')
  }
];

export const sampleSellers: SellerClient[] = [
  {
    id: '1',
    name: 'Laura Neri',
    phone: '+39 335 111 2233',
    email: 'laura.neri@email.com',
    birthday: '1970-05-12',
    status: 'in gestione',
    properties: [
      {
        id: 'prop1',
        codiceIdentificativo: 'AP001',
        propertyType: 'Appartamento',
        location: 'Via Roma 15, Milano',
        price: '280.000',
        operationType: 'vendita',
        features: 'Arredamento: Semi-arredato, Spazi esterni: Balcone, Bagno: 2 bagni, Riscaldamento: Autonomo, Piano: 3°',
        notes: 'Completamente ristrutturato nel 2022'
      },
      {
        id: 'prop2',
        codiceIdentificativo: 'AP002',
        propertyType: 'Trilocale',
        location: 'Corso Venezia 8, Milano',
        price: '1.200',
        operationType: 'locazione',
        features: 'Arredamento: Arredato, Spazi esterni: Terrazzo, Bagno: 1 bagno, Riscaldamento: Centralizzato, Piano: 5°',
        notes: 'Disponibile da marzo 2024'
      }
    ],
    notes: 'Cliente storico, molto collaborativo nelle trattative',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Giuseppe Blu',
    phone: '+39 329 444 5566',
    email: 'giuseppe.blu@email.com',
    birthday: '1955-09-30',
    status: 'da vendere',
    properties: [
      {
        id: 'prop3',
        codiceIdentificativo: 'VIL001',
        propertyType: 'Villa',
        location: 'Via dei Giardini 22, Monza',
        price: '450.000',
        operationType: 'vendita',
        features: 'Spazi esterni: Giardino, Garage: Box doppio, Bagno: 3 bagni, Riscaldamento: Centralizzato, Piano: Piano terra + primo piano',
        notes: 'Villa bifamiliare con ampio giardino'
      }
    ],
    notes: 'Urgente vendita per trasferimento all\'estero',
    createdAt: new Date('2024-02-05')
  },
  {
    id: '3',
    name: 'Francesca Gialli',
    phone: '+39 348 777 8899',
    email: 'francesca.gialli@email.com',
    birthday: '1988-12-03',
    status: 'da contattare',
    properties: [
      {
        id: 'prop4',
        codiceIdentificativo: 'LOC001',
        propertyType: 'Locale commerciale',
        location: 'Piazza Centrale 5, Milano',
        price: '2.500',
        operationType: 'locazione',
        features: 'Spazi esterni: Vetrina, Bagno: 1 bagno, Piano: Piano terra',
        notes: 'Ottima posizione per attività commerciale'
      }
    ],
    notes: 'Nuovo contatto, da chiamare per appuntamento',
    createdAt: new Date('2024-02-15')
  }
];

// Function to restore data to localStorage
export const restoreDataToLocalStorage = () => {
  localStorage.setItem('crm-buyers', JSON.stringify(sampleBuyers));
  localStorage.setItem('crm-sellers', JSON.stringify(sampleSellers));
  logInfo('Sample data restored to localStorage');
};