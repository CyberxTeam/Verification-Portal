
import { COUNTRIES } from './constants.ts';
import { Activity } from './types.ts';

export const maskNumber = (fullNumber: string): string => {
  if (fullNumber.length < 5) return fullNumber;
  const firstThree = fullNumber.substring(0, 3);
  const lastTwo = fullNumber.substring(fullNumber.length - 2);
  const maskedLength = Math.max(0, fullNumber.length - 5);
  return `${firstThree}${'*'.repeat(maskedLength)}${lastTwo}`;
};

export const generateRandomActivity = (): Activity => {
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const city = country.cities[Math.floor(Math.random() * country.cities.length)];
  const randomDigits = Math.floor(Math.random() * 9000000) + 1000000;
  return {
    id: Date.now(),
    country,
    city,
    number: `${country.prefix}${randomDigits}`,
    timestamp: new Date()
  };
};

export const generateCertificateId = (): string => {
  return 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};
