
export interface CountryData {
  name: string;
  code: string;
  prefix: string;
  flag: string;
  cities: string[];
}

export interface Activity {
  id: number;
  country: CountryData;
  city: string;
  number: string;
  timestamp: Date;
}

export interface DistributorInfo {
  name: string;
  number: string;
  location: string;
  license: string;
  facebookUrl: string;
  whatsappNumber: string; // Added for WhatsApp integration
}

export interface VerificationResult {
  isOriginal: boolean;
  distributor?: DistributorInfo;
  inputNumber: string;
  timestamp: Date;
  certificateId: string;
}
