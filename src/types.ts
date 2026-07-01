export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface WebsiteSettings {
  businessName: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
  socialLinks: SocialLinks;
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  logoText: string;
  bannerText: string;
  logoUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  available: boolean;
  features: string[];
}

export interface HomePlan {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  features: string[];
}

export interface Appointment {
  id: string;
  name: string;
  mobile: string;
  address: string;
  date: string;
  time: string;
  service: string;
  message?: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface PublicContent {
  settings: WebsiteSettings;
  products: Product[];
  plans: HomePlan[];
  appointments?: Appointment[]; // only included for authenticated admin
}
