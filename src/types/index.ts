export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // multiplier from USD
  locale: string;
}

export type LanguageCode = 'en' | 'fr' | 'de' | 'es' | 'ja' | 'it';

export interface GarmentVariant {
  id: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  color: string;
  colorHex: string;
  sku: string;
  stock: number;
  reservedStock: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  date: string;
  title: string;
  comment: string;
  fitFeedback: 'runs_small' | 'true_to_size' | 'runs_large';
  verifiedBuyer: boolean;
  sizePurchased: string;
  helpfulCount: number;
  userVotedHelpful?: boolean;
}

export interface GarmentProduct {
  id: string;
  title: string;
  subtitle: string;
  category: 'outerwear' | 'knitwear' | 'trousers' | 'overshirts' | 'essentials';
  season: 'SS26' | 'FW25' | 'Core';
  gender: 'unisex' | 'mens' | 'womens';
  priceUSD: number;
  costUSD: number; // For merchant margin calculation
  image: string;
  additionalImages?: string[];
  description: string;
  composition: string;
  careInstructions: string[];
  fitDetails: string;
  modelMeasurements: string;
  variants: GarmentVariant[];
  reviews: Review[];
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  variantId: string;
  title: string;
  priceUSD: number;
  size: string;
  color: string;
  colorHex: string;
  image: string;
  quantity: number;
}

export type ShippingCarrier = 'DHL Express' | 'FedEx International' | 'UPS Worldwide';

export interface TrackingMilestone {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  trackingNumber: string;
  carrier: ShippingCarrier;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  items: CartItem[];
  subtotalUSD: number;
  shippingUSD: number;
  taxUSD: number;
  totalUSD: number;
  currency: CurrencyCode;
  paymentMethod: 'credit_card' | 'apple_pay' | 'paypal' | 'klarna';
  paymentStatus: 'paid' | 'authorized' | 'processing';
  shippingStatus: 'label_created' | 'picked' | 'in_transit' | 'customs_cleared' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: string;
  milestones: TrackingMilestone[];
}

export interface SeasonalMetric {
  season: 'SS26' | 'FW25';
  totalRevenueUSD: number;
  unitsSold: number;
  averageOrderValueUSD: number;
  returnRatePct: number;
  sellThroughPct: number;
  topCategories: { category: string; sharePct: number; revenueUSD: number }[];
  monthlyTrends: { month: string; revenueUSD: number; orders: number }[];
}

export type CustomerTier = 'private_client' | 'vip_gold' | 'regular';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: CustomerTier;
  country: string;
  city: string;
  totalSpendUSD: number;
  ordersCount: number;
  joinedDate: string;
  preferredSize: string;
  notes: string[];
  measurements: {
    chestCm: number;
    waistCm: number;
    hipsCm: number;
    inseamCm: number;
  };
}

