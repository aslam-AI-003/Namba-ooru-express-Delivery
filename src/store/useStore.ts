import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/lib/i18n';
import type { Order, WalletTransaction, Notification, Address as FirebaseAddress } from '@/lib/firebaseService';

// Cart Item
export interface CartItem {
  productId: string;
  shopId: string;
  name: string;
  nameTamil: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  unit: string;
  isVeg: boolean;
}

// Address (re-export for compatibility)
export interface UserAddress {
  id: string;
  label: string;
  fullAddress: string;
  landmark?: string;
  lat: number;
  lng: number;
  pincode: string;
  city: string;
  isDefault?: boolean;
}

// Demo Order (local state for full flow testing)
export interface DemoOrder {
  id: string;
  userId: string;
  shopId: string;
  shopName: string;
  shopIcon: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled';
  paymentMethod: string;
  address: UserAddress;
  notes?: string;
  riderId?: string;
  riderName?: string;
  customerName: string;
  customerPhone: string;
  createdAt: string; // ISO string
  updatedAt: string;
}

// Store State
interface StoreState {
  // Auth
  isAuthenticated: boolean;
  user: {
    uid: string;
    displayName: string;
    phone: string;
    email?: string;
    photoURL?: string;
    role: 'customer' | 'vendor' | 'rider' | 'admin';
  } | null;

  // Language
  language: Locale;
  setLanguage: (lang: Locale) => void;

  // Location
  currentLocation: { lat: number; lng: number; address: string } | null;
  setLocation: (loc: { lat: number; lng: number; address: string }) => void;

  // Cart
  cart: CartItem[];
  cartShopId: string | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Addresses
  addresses: UserAddress[];
  selectedAddressId: string | null;
  addAddress: (address: UserAddress) => void;
  setSelectedAddress: (id: string) => void;
  setAddresses: (addresses: UserAddress[]) => void;

  // Wallet
  walletBalance: number;
  setWalletBalance: (balance: number) => void;

  // Wallet Transactions (live from Firestore)
  walletTransactions: WalletTransaction[];
  setWalletTransactions: (txs: WalletTransaction[]) => void;

  // Orders (live from Firestore)
  orders: Order[];
  setOrders: (orders: Order[]) => void;

  // ── DEMO ORDERS (local, persisted, shared across roles) ──
  demoOrders: DemoOrder[];
  addDemoOrder: (order: DemoOrder) => void;
  updateDemoOrderStatus: (orderId: string, status: DemoOrder['status'], extra?: Partial<DemoOrder>) => void;
  getDemoOrdersByShop: (shopId: string) => DemoOrder[];
  getDemoOrdersByUser: (userId: string) => DemoOrder[];
  getDemoOrdersByRider: (riderId: string) => DemoOrder[];
  getPendingDemoOrders: () => DemoOrder[];

  // Favorites
  favoriteShopIds: string[];
  toggleFavorite: (shopId: string) => void;
  setFavoriteShopIds: (ids: string[]) => void;

  // Notifications (live from Firestore)
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  unreadNotificationCount: number;
  setUnreadNotificationCount: (count: number) => void;

  // Auth actions
  setUser: (user: StoreState['user']) => void;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      user: null,

      // Language
      language: 'en' as Locale,
      setLanguage: (lang) => set({ language: lang }),

      // Location
      currentLocation: null,
      setLocation: (loc) => set({ currentLocation: loc }),

      // Cart
      cart: [],
      cartShopId: null,
      addToCart: (item) => {
        const { cart, cartShopId } = get();
        if (cartShopId && cartShopId !== item.shopId) {
          set({ cart: [{ ...item, quantity: 1 }], cartShopId: item.shopId });
          return;
        }
        const existingIndex = cart.findIndex(i => i.productId === item.productId);
        if (existingIndex >= 0) {
          const newCart = [...cart];
          newCart[existingIndex].quantity += 1;
          set({ cart: newCart });
        } else {
          set({ cart: [...cart, { ...item, quantity: 1 }], cartShopId: item.shopId });
        }
      },
      removeFromCart: (productId) => {
        const { cart } = get();
        const newCart = cart.filter(i => i.productId !== productId);
        set({ cart: newCart, cartShopId: newCart.length > 0 ? get().cartShopId : null });
      },
      updateQuantity: (productId, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        const newCart = cart.map(i => i.productId === productId ? { ...i, quantity } : i);
        set({ cart: newCart });
      },
      clearCart: () => set({ cart: [], cartShopId: null }),
      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          const price = item.discountPrice || item.price;
          return total + price * item.quantity;
        }, 0);
      },
      getCartItemCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Addresses
      addresses: [],
      selectedAddressId: null,
      addAddress: (address) => set({ addresses: [...get().addresses, address] }),
      setSelectedAddress: (id) => set({ selectedAddressId: id }),
      setAddresses: (addresses) => set({ addresses }),

      // Wallet
      walletBalance: 0,
      setWalletBalance: (balance) => set({ walletBalance: balance }),

      // Wallet Transactions
      walletTransactions: [],
      setWalletTransactions: (txs) => set({ walletTransactions: txs }),

      // Orders
      orders: [],
      setOrders: (orders) => set({ orders }),

      // ── DEMO ORDERS ──
      demoOrders: [],
      addDemoOrder: (order) => set({ demoOrders: [order, ...get().demoOrders] }),
      updateDemoOrderStatus: (orderId, status, extra) => {
        const updated = get().demoOrders.map(o =>
          o.id === orderId ? { ...o, ...extra, status, updatedAt: new Date().toISOString() } : o
        );
        set({ demoOrders: updated });
      },
      getDemoOrdersByShop: (shopId) => get().demoOrders.filter(o => o.shopId === shopId),
      getDemoOrdersByUser: (userId) => get().demoOrders.filter(o => o.userId === userId),
      getDemoOrdersByRider: (riderId) => get().demoOrders.filter(o => o.riderId === riderId),
      getPendingDemoOrders: () => get().demoOrders.filter(o => 
        ['placed', 'confirmed', 'preparing', 'ready'].includes(o.status)
      ),

      // Favorites
      favoriteShopIds: [],
      toggleFavorite: (shopId) => {
        const { favoriteShopIds } = get();
        if (favoriteShopIds.includes(shopId)) {
          set({ favoriteShopIds: favoriteShopIds.filter(id => id !== shopId) });
        } else {
          set({ favoriteShopIds: [...favoriteShopIds, shopId] });
        }
      },
      setFavoriteShopIds: (ids) => set({ favoriteShopIds: ids }),

      // Notifications
      notifications: [],
      setNotifications: (notifications) => {
        const unread = notifications.filter(n => !n.read).length;
        set({ notifications, unreadNotificationCount: unread });
      },
      unreadNotificationCount: 0,
      setUnreadNotificationCount: (count) => set({ unreadNotificationCount: count }),

      // Auth actions
      setUser: (user) => set({ isAuthenticated: !!user, user }),
      logout: () => set({
        isAuthenticated: false,
        user: null,
        cart: [],
        cartShopId: null,
        orders: [],
        walletBalance: 0,
        walletTransactions: [],
        notifications: [],
        unreadNotificationCount: 0,
        addresses: [],
        selectedAddressId: null,
        favoriteShopIds: [],
      }),
    }),
    {
      name: 'noe-store',
      partialize: (state) => ({
        language: state.language,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        cart: state.cart,
        cartShopId: state.cartShopId,
        addresses: state.addresses,
        selectedAddressId: state.selectedAddressId,
        favoriteShopIds: state.favoriteShopIds,
        currentLocation: state.currentLocation,
        demoOrders: state.demoOrders,
        walletBalance: state.walletBalance,
      }),
    }
  )
);
