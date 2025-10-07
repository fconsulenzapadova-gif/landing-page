import { useMemo } from 'react';
import type { BuyerClient, SellerClient, Property } from '@/components/Dashboard';

interface PropertyMatch {
  buyerId: string;
  propertyId: string;
  score: number;
  matchReasons: string[];
  operationType: 'vendita' | 'locazione';
}

interface UseMatchCalculatorProps {
  buyers: BuyerClient[];
  sellers: SellerClient[];
}

export const useMatchCalculator = ({ buyers, sellers }: UseMatchCalculatorProps) => {
  const { venditeMatches, locazioniMatches } = useMemo(() => {
    const venditeMatches: PropertyMatch[] = [];
    const locazioniMatches: PropertyMatch[] = [];

    buyers.forEach(buyer => {
      sellers.forEach(seller => {
        seller.properties?.forEach(property => {
          const match = calculateMatch(buyer, seller, property);
          if (match && match.score >= 30) { // Soglia minima per considerare un match
            if (match.operationType === 'vendita') {
              venditeMatches.push(match);
            } else {
              locazioniMatches.push(match);
            }
          }
        });
      });
    });

    // Ordina per punteggio decrescente
    venditeMatches.sort((a, b) => b.score - a.score);
    locazioniMatches.sort((a, b) => b.score - a.score);

    return { venditeMatches, locazioniMatches };
  }, [buyers, sellers]);

  return { venditeMatches, locazioniMatches };
};

const calculateMatch = (buyer: BuyerClient, seller: SellerClient, property: Property): PropertyMatch | null => {
  let score = 0;
  const matchReasons: string[] = [];

  // Verifica compatibilità tipo operazione
  const buyerWantsRent = buyer.type === 'Locazione';
  const propertyIsForRent = property.operationType === 'locazione';
  const buyerWantsPurchase = buyer.type === 'Acquisto';
  const propertyIsForSale = property.operationType === 'vendita';

  if ((buyerWantsRent && !propertyIsForRent) || (buyerWantsPurchase && !propertyIsForSale)) {
    return null; // Incompatibile
  }

  // Match tipo di proprietà (peso: 30 punti)
  if (buyer.propertyType.toLowerCase() === property.propertyType.toLowerCase()) {
    score += 30;
    matchReasons.push('Tipo proprietà compatibile');
  } else if (
    (buyer.propertyType.toLowerCase().includes('appartamento') && property.propertyType.toLowerCase().includes('appartamento')) ||
    (buyer.propertyType.toLowerCase().includes('casa') && property.propertyType.toLowerCase().includes('casa')) ||
    (buyer.propertyType.toLowerCase().includes('villa') && property.propertyType.toLowerCase().includes('villa'))
  ) {
    score += 20;
    matchReasons.push('Tipo proprietà simile');
  }

  // Match budget/prezzo (peso: 25 punti)
  const buyerBudget = parseFloat(buyer.budget.replace(/[€.,]/g, ''));
  const propertyPrice = parseFloat(property.price.replace(/[€.,]/g, ''));

  if (!isNaN(buyerBudget) && !isNaN(propertyPrice)) {
    const priceDifference = Math.abs(buyerBudget - propertyPrice) / buyerBudget;
    
    if (priceDifference <= 0.1) { // Entro il 10%
      score += 25;
      matchReasons.push('Budget perfettamente compatibile');
    } else if (priceDifference <= 0.2) { // Entro il 20%
      score += 20;
      matchReasons.push('Budget compatibile');
    } else if (priceDifference <= 0.3) { // Entro il 30%
      score += 10;
      matchReasons.push('Budget accettabile');
    }
  }

  // Match zona/location (peso: 20 punti)
  if (buyer.zona && property.location) {
    const buyerZona = buyer.zona.toLowerCase();
    const propertyLocation = property.location.toLowerCase();
    
    if (propertyLocation.includes(buyerZona) || buyerZona.includes(propertyLocation)) {
      score += 20;
      matchReasons.push('Zona preferita');
    } else {
      // Controllo città/provincia
      const buyerWords = buyerZona.split(/[\s,]+/);
      const propertyWords = propertyLocation.split(/[\s,]+/);
      
      const hasCommonLocation = buyerWords.some(word => 
        word.length > 2 && propertyWords.some(propWord => 
          propWord.includes(word) || word.includes(propWord)
        )
      );
      
      if (hasCommonLocation) {
        score += 10;
        matchReasons.push('Zona vicina');
      }
    }
  }

  // Match caratteristiche (peso: 15 punti)
  if (buyer.features && property.features) {
    const buyerFeatures = Array.isArray(buyer.features) ? buyer.features.join(' ').toLowerCase() : String(buyer.features).toLowerCase();
    const propertyFeatures = Array.isArray(property.features) ? property.features.join(' ').toLowerCase() : String(property.features).toLowerCase();
    
    const buyerKeywords = buyerFeatures.split(/[\s,]+/).filter(word => word.length > 2);
    const propertyKeywords = propertyFeatures.split(/[\s,]+/).filter(word => word.length > 2);
    
    const matchingFeatures = buyerKeywords.filter(keyword =>
      propertyKeywords.some(propKeyword => 
        propKeyword.includes(keyword) || keyword.includes(propKeyword)
      )
    );
    
    if (matchingFeatures.length > 0) {
      const featureScore = Math.min(15, matchingFeatures.length * 5);
      score += featureScore;
      matchReasons.push(`${matchingFeatures.length} caratteristiche compatibili`);
    }
  }

  // Bonus per status venditore (peso: 10 punti)
  if (seller.status === 'da vendere') {
    score += 10;
    matchReasons.push('Venditore pronto alla vendita');
  } else if (seller.status === 'in gestione') {
    score += 5;
    matchReasons.push('Venditore in gestione');
  }

  return {
    buyerId: buyer.id,
    propertyId: property.id,
    score: Math.min(100, score), // Cap a 100
    matchReasons,
    operationType: (property.operationType as 'vendita' | 'locazione') || 'vendita'
  };
};