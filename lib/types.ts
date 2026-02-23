export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export interface Customer {
  [x: string]: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Deal {
  description: ReactNode;
  amount: number;
  status: string;
  id: string;
  title: string;
  value: number;
  stage: string;
  customerId?: string;
}