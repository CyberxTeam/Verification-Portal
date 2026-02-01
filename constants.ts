
import { CountryData, DistributorInfo } from './types.ts';

export const COUNTRIES: CountryData[] = [
  { 
    name: 'Bangladesh', code: 'BD', prefix: '+880', flag: '🇧🇩',
    cities: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna']
  },
  { 
    name: 'United Kingdom', code: 'GB', prefix: '+44', flag: '🇬🇧',
    cities: ['London', 'Manchester', 'Birmingham', 'Glasgow']
  },
  { 
    name: 'United States', code: 'US', prefix: '+1', flag: '🇺🇸',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Miami']
  },
  { 
    name: 'Saudi Arabia', code: 'SA', prefix: '+966', flag: '🇸🇦',
    cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina']
  },
  { 
    name: 'United Arab Emirates', code: 'AE', prefix: '+971', flag: '🇦🇪',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah']
  },
  { 
    name: 'Canada', code: 'CA', prefix: '+1', flag: '🇨🇦',
    cities: ['Toronto', 'Vancouver', 'Montreal']
  },
  { 
    name: 'Malaysia', code: 'MY', prefix: '+60', flag: '🇲🇾',
    cities: ['Kuala Lumpur', 'Penang', 'Johor Bahru']
  },
  { 
    name: 'India', code: 'IN', prefix: '+91', flag: '🇮🇳',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata']
  },
  { 
    name: 'Singapore', code: 'SG', prefix: '+65', flag: '🇸🇬',
    cities: ['Singapore City', 'Jurong', 'Changi']
  },
  { 
    name: 'Australia', code: 'AU', prefix: '+61', flag: '🇦🇺',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth']
  },
  { 
    name: 'Germany', code: 'DE', prefix: '+49', flag: '🇩🇪',
    cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt']
  },
  { 
    name: 'France', code: 'FR', prefix: '+33', flag: '🇫🇷',
    cities: ['Paris', 'Lyon', 'Marseille']
  },
  { 
    name: 'Italy', code: 'IT', prefix: '+39', flag: '🇮🇹',
    cities: ['Rome', 'Milan', 'Venice']
  },
  { 
    name: 'Japan', code: 'JP', prefix: '+81', flag: '🇯🇵',
    cities: ['Tokyo', 'Osaka', 'Kyoto']
  },
  { 
    name: 'Brazil', code: 'BR', prefix: '+55', flag: '🇧🇷',
    cities: ['Sao Paulo', 'Rio de Janeiro']
  },
  { 
    name: 'Kuwait', code: 'KW', prefix: '+965', flag: '🇰🇼',
    cities: ['Kuwait City', 'Jahra']
  },
  { 
    name: 'Oman', code: 'OM', prefix: '+968', flag: '🇴🇲',
    cities: ['Muscat', 'Salalah']
  },
  { 
    name: 'Qatar', code: 'QA', prefix: '+974', flag: '🇶🇦',
    cities: ['Doha', 'Al Wakrah']
  }
];

export const MASK_CHAR = '*';

export const DISTRIBUTOR_REGISTRY: DistributorInfo[] = [
  {
    name: 'Tarikul Islam',
    number: '01888525124',
    location: 'Rajshahi, Natore, Laxmipur Bazar',
    license: '12345678',
    facebookUrl: 'https://www.facebook.com/tarikulv3',
    whatsappNumber: '8801888525124'
  },
  {
    name: 'Tarikul Islam',
    number: '01757293124',
    location: 'Rajshahi, Natore, Laxmipur Bazar',
    license: '12345678',
    facebookUrl: 'https://www.facebook.com/tarikulv3',
    whatsappNumber: '8801888525124'
  }, 
  {
    name: 'Premium Partner',
    number: '01888525125',
    location: 'Rajshahi, Natore',
    license: '1278',
    facebookUrl: 'https://www.facebook.com/tarikulv',
    whatsappNumber: '8801888525125'
  }
];

export const PRODUCT_IMAGE_URL = 'https://organicproductcertified.top/wp-content/uploads/2026/01/Untitled-design.png';
export const LOGO_URL = 'https://organicproductcertified.top/wp-content/uploads/2026/01/Untitled-design-2.png';
export const GOAT_MASCOT_URL = 'https://organicproductcertified.top/wp-content/uploads/2026/01/Untitled-design-2.png';
export const USA_EMBLEM_URL = 'https://img.freepik.com/premium-vector/usa-emblem-design_24908-14062.jpg?semt=ais_user_personalization&w=740&q=80';
