// Simulated price history data for products
// In a real app, this would come from the database

interface PriceHistoryEntry {
  productId: number;
  platformName: string;
  yesterdayPrice: number;
  weekAgoPrice: number;
}

// Generate simulated price history based on current prices
export const generatePriceHistory = (
  productId: number,
  currentPrice: number,
  platformName: string
): PriceHistoryEntry => {
  // Simulate price variations - some items got cheaper, some more expensive
  const seed = productId + platformName.length;
  const variation = ((seed % 10) - 5) / 100; // -5% to +5%
  const weekVariation = ((seed % 15) - 7) / 100; // -7% to +8%
  
  return {
    productId,
    platformName,
    yesterdayPrice: Math.round(currentPrice * (1 + variation)),
    weekAgoPrice: Math.round(currentPrice * (1 + weekVariation)),
  };
};

export interface PriceInsight {
  changeFromYesterday: number;
  changeFromWeekAgo: number;
  isCheaperThanYesterday: boolean;
  isMoreExpensiveThanYesterday: boolean;
  cheapestToday: boolean;
}

export const getPriceInsight = (
  productId: number,
  currentPrice: number,
  platformName: string,
  allPlatformPrices: { name: string; price: number }[]
): PriceInsight => {
  const history = generatePriceHistory(productId, currentPrice, platformName);
  const lowestCurrentPrice = Math.min(...allPlatformPrices.map(p => p.price));
  
  const changeFromYesterday = history.yesterdayPrice - currentPrice;
  const changeFromWeekAgo = history.weekAgoPrice - currentPrice;
  
  return {
    changeFromYesterday,
    changeFromWeekAgo,
    isCheaperThanYesterday: changeFromYesterday > 0,
    isMoreExpensiveThanYesterday: changeFromYesterday < 0,
    cheapestToday: currentPrice === lowestCurrentPrice,
  };
};
