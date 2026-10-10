import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CurrencyCode,
  LanguageCode,
  GarmentProduct,
  CartItem,
  Order,
  Review,
  GarmentVariant,
  Customer,
  CustomerTier,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS } from '../data/mockData';
import { TRANSLATIONS, TranslationDictionary, formatCurrency } from '../data/localization';

interface NotificationToast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface StoreContextType {
  products: GarmentProduct[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  customers: Customer[];
  activeCustomerId: string;
  activeCustomer: Customer;
  currency: CurrencyCode;
  language: LanguageCode;
  t: (key: keyof TranslationDictionary, params?: Record<string, string>) => string;
  formatPrice: (amountUSD: number) => string;
  activeView: 'store' | 'customers' | 'admin';
  setActiveView: (view: 'store' | 'customers' | 'admin') => void;
  adminTab: 'orders' | 'customers' | 'inventory' | 'analytics' | 'settings';
  setAdminTab: (tab: 'orders' | 'customers' | 'inventory' | 'analytics' | 'settings') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  isMobileSimulatorOpen: boolean;
  setIsMobileSimulatorOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  notification: NotificationToast | null;
  dismissNotification: () => void;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;
  syncTimestamp: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchCategory: string;
  setSearchCategory: (category: string) => void;
  customerSection: 'hub' | 'orders' | 'measurements' | 'addresses' | 'payments' | 'concierge' | 'prime';
  setCustomerSection: (sec: 'hub' | 'orders' | 'measurements' | 'addresses' | 'payments' | 'concierge' | 'prime') => void;
  // Actions
  setCurrency: (currency: CurrencyCode) => void;
  setLanguage: (lang: LanguageCode) => void;
  setActiveCustomerId: (id: string) => void;
  addCustomerNote: (customerId: string, note: string) => void;
  updateCustomerTier: (customerId: string, tier: CustomerTier) => void;
  updateCustomerMeasurements: (customerId: string, measurements: Customer['measurements']) => void;
  updateOrderStatus: (orderId: string, status: Order['shippingStatus']) => void;
  addToCart: (product: GarmentProduct, variant: GarmentVariant, quantity?: number) => void;
  updateCartQuantity: (itemId: string, newQty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (orderData: Partial<Order>) => Order;
  submitReview: (productId: string, review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  voteReviewHelpful: (productId: string, reviewId: string) => void;
  updateStock: (productId: string, variantId: string, newStock: number) => void;
  addNewGarment: (garment: Omit<GarmentProduct, 'id' | 'reviews'>) => void;
  lookupTracking: (trackingCode: string) => Order | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'atelier_lumen_cart_v1',
  CURRENCY: 'atelier_lumen_curr_v1',
  LANGUAGE: 'atelier_lumen_lang_v1',
  ORDERS: 'atelier_lumen_orders_v1',
  PRODUCTS: 'atelier_lumen_products_v1',
  WISHLIST: 'atelier_lumen_wish_v1',
  CUSTOMERS: 'atelier_lumen_cust_v1',
  ACTIVE_CUST: 'atelier_lumen_act_cust_v1',
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<GarmentProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      return (saved as CurrencyCode) || 'USD';
    } catch {
      return 'USD';
    }
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return (saved as LanguageCode) || 'en';
    } catch {
      return 'en';
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [activeCustomerId, setActiveCustomerIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_CUST);
      return saved || 'cust-01';
    } catch {
      return 'cust-01';
    }
  });

  const [activeView, setActiveView] = useState<'store' | 'customers' | 'admin'>('store');
  const [adminTab, setAdminTab] = useState<'orders' | 'customers' | 'inventory' | 'analytics' | 'settings'>('orders');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(INITIAL_ORDERS[0]);
  const [notification, setNotification] = useState<NotificationToast | null>(null);
  const [syncTimestamp, setSyncTimestamp] = useState<string>(() => new Date().toLocaleTimeString());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('All');
  const [customerSection, setCustomerSection] = useState<'hub' | 'orders' | 'measurements' | 'addresses' | 'payments' | 'concierge' | 'prime'>('orders');

  // Cross-device / tab synchronization event handler
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.CART && e.newValue) {
        setCart(JSON.parse(e.newValue));
        setSyncTimestamp(new Date().toLocaleTimeString());
      }
      if (e.key === STORAGE_KEYS.ORDERS && e.newValue) {
        setOrders(JSON.parse(e.newValue));
        setSyncTimestamp(new Date().toLocaleTimeString());
      }
      if (e.key === STORAGE_KEYS.PRODUCTS && e.newValue) {
        setProducts(JSON.parse(e.newValue));
        setSyncTimestamp(new Date().toLocaleTimeString());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Could not save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      setSyncTimestamp(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn('Could not save cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders', e);
    }
  }, [orders]);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setNotification({
      id: Math.random().toString(36).substring(7),
      message,
      type,
    });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const dismissNotification = () => setNotification(null);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
    showNotification(`Currency changed to ${c}`, 'info');
  };

  const setLanguage = (l: LanguageCode) => {
    setLanguageState(l);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, l);
    showNotification(`Language switched to ${l.toUpperCase()}`, 'info');
  };

  const t = (key: keyof TranslationDictionary, params?: Record<string, string>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || String(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return text;
  };

  const formatPrice = (amountUSD: number): string => {
    return formatCurrency(amountUSD, currency);
  };

  const addToCart = (product: GarmentProduct, variant: GarmentVariant, quantity = 1) => {
    if (variant.stock <= 0) {
      showNotification(`${product.title} in size ${variant.size} is currently sold out.`, 'warning');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > variant.stock) {
          showNotification(`Maximum available stock reached for this size.`, 'warning');
          return prevCart;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: product.id,
          variantId: variant.id,
          title: product.title,
          priceUSD: product.priceUSD,
          size: variant.size,
          color: variant.color,
          colorHex: variant.colorHex,
          image: product.image,
          quantity: Math.min(quantity, variant.stock),
        };
        return [...prevCart, newItem];
      }
    });

    showNotification(`Added ${product.title} (${variant.size}) to your bag`, 'success');
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showNotification(`Item removed from shopping bag`, 'info');
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(next));
      showNotification(exists ? 'Removed from wishlist' : 'Saved to wishlist', 'info');
      return next;
    });
  };

  const placeOrder = (orderData: Partial<Order>): Order => {
    const trackingNum = `DHL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      trackingNumber: trackingNum,
      carrier: orderData.carrier || 'DHL Express',
      createdAt: new Date().toISOString(),
      customerName: orderData.customerName || 'Valued Client',
      customerEmail: orderData.customerEmail || 'client@luxury.com',
      shippingAddress: orderData.shippingAddress || {
        street: '740 Park Avenue',
        city: 'New York',
        country: 'United States',
        postalCode: '10021',
      },
      items: [...cart],
      subtotalUSD: orderData.subtotalUSD || 0,
      shippingUSD: orderData.shippingUSD || 0,
      taxUSD: orderData.taxUSD || 0,
      totalUSD: orderData.totalUSD || 0,
      currency: currency,
      paymentMethod: orderData.paymentMethod || 'credit_card',
      paymentStatus: 'paid',
      shippingStatus: 'label_created',
      estimatedDelivery: '3 business days via Express Priority',
      milestones: [
        {
          id: 'm-new-1',
          title: 'Order Confirmed & Secure Payment Verified',
          location: 'Atelier Central Fulfillment Hub',
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          id: 'm-new-2',
          title: 'White-Glove Garment Inspection & Boxing',
          location: 'Logistics Facility',
          timestamp: 'Scheduled today',
          completed: false,
          current: false,
        },
        {
          id: 'm-new-3',
          title: 'Carrier Handover to DHL Air Express',
          location: 'Airport Cargo Hub',
          timestamp: 'Scheduled tomorrow',
          completed: false,
          current: false,
        },
        {
          id: 'm-new-4',
          title: 'Global Customs Clearance & In-Transit',
          location: 'Destination Border Control',
          timestamp: 'In 2 days',
          completed: false,
          current: false,
        },
        {
          id: 'm-new-5',
          title: 'Out for Courier Delivery',
          location: 'Local Delivery Station',
          timestamp: 'In 3 days',
          completed: false,
          current: false,
        },
      ],
    };

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItemForProd = cart.find((ci) => ci.productId === prod.id);
        if (!cartItemForProd) return prod;
        return {
          ...prod,
          variants: prod.variants.map((v) =>
            v.id === cartItemForProd.variantId
              ? { ...v, stock: Math.max(0, v.stock - cartItemForProd.quantity) }
              : v
          ),
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrder(newOrder);
    showNotification(`Order #${newOrder.id} confirmed! Tracking: ${newOrder.trackingNumber}`, 'success');
    return newOrder;
  };

  const submitReview = (productId: string, reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      userVotedHelpful: false,
    };

    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === productId ? { ...prod, reviews: [newRev, ...prod.reviews] } : prod
      )
    );
    showNotification(`Thank you! Your verified review has been published.`, 'success');
  };

  const voteReviewHelpful = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          reviews: prod.reviews.map((r) => {
            if (r.id !== reviewId) return r;
            const alreadyVoted = r.userVotedHelpful;
            return {
              ...r,
              helpfulCount: alreadyVoted ? r.helpfulCount - 1 : r.helpfulCount + 1,
              userVotedHelpful: !alreadyVoted,
            };
          }),
        };
      })
    );
  };

  const updateStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) =>
            v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v
          ),
        };
      })
    );
    showNotification(`Stock inventory updated for variant`, 'info');
  };

  const addNewGarment = (garmentData: Omit<GarmentProduct, 'id' | 'reviews'>) => {
    const newProd: GarmentProduct = {
      ...garmentData,
      id: `garment-${Date.now()}`,
      reviews: [],
    };
    setProducts((prev) => [newProd, ...prev]);
    showNotification(`New garment collection item published`, 'success');
  };

  const lookupTracking = (trackingCode: string): Order | null => {
    const clean = trackingCode.trim().toUpperCase();
    const found = orders.find(
      (o) => o.trackingNumber.toUpperCase() === clean || o.id.toUpperCase() === clean
    );
    if (found) {
      setActiveTrackingOrder(found);
      return found;
    }
    return null;
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.warn('Could not save customers', e);
    }
  }, [customers]);

  const activeCustomer = customers.find((c) => c.id === activeCustomerId) || customers[0];

  const setActiveCustomerId = (id: string) => {
    setActiveCustomerIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CUST, id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      showNotification(`Switched active profile to ${found.name}`, 'info');
    }
  };

  const addCustomerNote = (customerId: string, note: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, notes: [note, ...c.notes] } : c))
    );
    showNotification(`Internal CRM note recorded for client`, 'success');
  };

  const updateCustomerTier = (customerId: string, tier: CustomerTier) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, tier } : c))
    );
    showNotification(`Client VIP tier updated to ${tier.replace('_', ' ').toUpperCase()}`, 'success');
  };

  const updateCustomerMeasurements = (
    customerId: string,
    measurements: Customer['measurements']
  ) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, measurements } : c))
    );
    showNotification(`Tailoring measurements updated successfully`, 'success');
  };

  const updateOrderStatus = (orderId: string, status: Order['shippingStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, shippingStatus: status } : o))
    );
    showNotification(`Order #${orderId} status updated to ${status.replace(/_/g, ' ')}`, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        customers,
        activeCustomerId,
        activeCustomer,
        currency,
        language,
        t,
        formatPrice,
        activeView,
        setActiveView,
        adminTab,
        setAdminTab,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isMobileSimulatorOpen,
        setIsMobileSimulatorOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
        selectedProductId,
        setSelectedProductId,
        activeTrackingOrder,
        setActiveTrackingOrder,
        notification,
        dismissNotification,
        showNotification,
        syncTimestamp,
        searchQuery,
        setSearchQuery,
        searchCategory,
        setSearchCategory,
        customerSection,
        setCustomerSection,
        setCurrency,
        setLanguage,
        setActiveCustomerId,
        addCustomerNote,
        updateCustomerTier,
        updateCustomerMeasurements,
        updateOrderStatus,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        placeOrder,
        submitReview,
        voteReviewHelpful,
        updateStock,
        addNewGarment,
        lookupTracking,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
