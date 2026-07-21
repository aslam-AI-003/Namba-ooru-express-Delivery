import { ShopCategory } from '@/types';

// App Constants
export const APP_NAME = 'Namma Ooru Express';
export const APP_TAGLINE = 'Neenga Sollunga... Naanga Deliver Pannuvom!';
export const APP_DESCRIPTION = 'Hyperlocal Delivery Platform - Fast, Safe, Trusted';
export const SUPPORT_PHONE = '9566700534';
export const SUPPORT_EMAIL = 'support@nammaooru.express';

// Categories with Tamil translations and icons
export const SHOP_CATEGORIES: {
  id: ShopCategory;
  name: string;
  nameTamil: string;
  icon: string;
  color: string;
}[] = [
  { id: 'groceries', name: 'Groceries', nameTamil: 'மளிகை', icon: '🛒', color: '#4CAF50' },
  { id: 'vegetables', name: 'Vegetables', nameTamil: 'காய்கறிகள்', icon: '🥬', color: '#66BB6A' },
  { id: 'fruits', name: 'Fruits', nameTamil: 'பழங்கள்', icon: '🍎', color: '#FF5722' },
  { id: 'meat', name: 'Meat', nameTamil: 'இறைச்சி', icon: '🥩', color: '#D32F2F' },
  { id: 'chicken', name: 'Chicken', nameTamil: 'கோழி', icon: '🍗', color: '#FF8A65' },
  { id: 'fish', name: 'Fish', nameTamil: 'மீன்', icon: '🐟', color: '#039BE5' },
  { id: 'medicines', name: 'Medicines', nameTamil: 'மருந்துகள்', icon: '💊', color: '#00BCD4' },
  { id: 'bakery', name: 'Bakery', nameTamil: 'பேக்கரி', icon: '🍰', color: '#8D6E63' },
  { id: 'restaurants', name: 'Restaurants', nameTamil: 'உணவகம்', icon: '🍽️', color: '#FF6F00' },
  { id: 'tea_shops', name: 'Tea Shops', nameTamil: 'டீ கடை', icon: '☕', color: '#795548' },
  { id: 'snacks', name: 'Snacks', nameTamil: 'சிற்றுண்டி', icon: '🍿', color: '#FFA726' },
  { id: 'stationery', name: 'Stationery', nameTamil: 'எழுதுபொருள்', icon: '📝', color: '#5C6BC0' },
  { id: 'pet_shop', name: 'Pet Shop', nameTamil: 'செல்லப்பிராணி', icon: '🐾', color: '#AB47BC' },
  { id: 'flower_shop', name: 'Flower Shop', nameTamil: 'பூக்கடை', icon: '💐', color: '#EC407A' },
  { id: 'electronics', name: 'Electronics', nameTamil: 'மின்னணு', icon: '📱', color: '#42A5F5' },
  { id: 'courier', name: 'Courier', nameTamil: 'கூரியர்', icon: '📦', color: '#78909C' },
  { id: 'documents', name: 'Documents', nameTamil: 'ஆவணங்கள்', icon: '📄', color: '#607D8B' },
  { id: 'water_can', name: 'Water Can', nameTamil: 'தண்ணீர் கேன்', icon: '💧', color: '#29B6F6' },
  { id: 'gas_cylinder', name: 'Gas Cylinder', nameTamil: 'சிலிண்டர்', icon: '🔥', color: '#EF5350' },
  { id: 'milk', name: 'Milk', nameTamil: 'பால்', icon: '🥛', color: '#FFFFFF' },
  { id: 'cake', name: 'Cake', nameTamil: 'கேக்', icon: '🎂', color: '#F48FB1' },
  { id: 'custom_parcel', name: 'Custom Parcel', nameTamil: 'பார்சல்', icon: '📮', color: '#FF7043' },
];

// Delivery charges
export const DEFAULT_DELIVERY_CHARGES = {
  '0-2': 30,
  '2-5': 50,
  '5-8': 80,
  '8+': 10, // per km extra
};

// Order statuses with Tamil labels
export const ORDER_STATUS_LABELS = {
  placed: { en: 'Order Placed', ta: 'ஆர்டர் வைக்கப்பட்டது' },
  confirmed: { en: 'Confirmed', ta: 'உறுதி செய்யப்பட்டது' },
  preparing: { en: 'Preparing', ta: 'தயாரிக்கப்படுகிறது' },
  ready: { en: 'Ready for Pickup', ta: 'பிக்அப் தயார்' },
  rider_assigned: { en: 'Rider Assigned', ta: 'ரைடர் நியமிக்கப்பட்டார்' },
  picked_up: { en: 'Picked Up', ta: 'எடுக்கப்பட்டது' },
  in_transit: { en: 'On the Way', ta: 'வழியில் உள்ளது' },
  delivered: { en: 'Delivered', ta: 'டெலிவரி ஆனது' },
  cancelled: { en: 'Cancelled', ta: 'ரத்து செய்யப்பட்டது' },
  refunded: { en: 'Refunded', ta: 'பணம் திரும்ப அளிக்கப்பட்டது' },
};

// Platform features
export const FEATURES = [
  { icon: '⚡', title: 'Fast Delivery', titleTamil: 'வேக டெலிவரி', description: '30 minutes or less' },
  { icon: '🛡️', title: 'Safe Handling', titleTamil: 'பாதுகாப்பான கையாளுதல்', description: 'Your items are safe with us' },
  { icon: '✅', title: 'Trusted Service', titleTamil: 'நம்பகமான சேவை', description: 'Verified shops and riders' },
  { icon: '📍', title: 'Your Area', titleTamil: 'உங்கள் பகுதி', description: 'Hyperlocal coverage' },
];

// Service areas
export const SERVICE_AREAS = [
  { city: 'Thanjavur', state: 'Tamil Nadu', isActive: true },
  { city: 'Kumbakonam', state: 'Tamil Nadu', isActive: true },
];
