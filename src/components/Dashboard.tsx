import React from 'react';

// Types that are imported by other files
export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  propertyType?: string;
  operationType?: string;
  size?: string;
  rooms?: number;
  bathrooms?: number;
  features?: string[];
  description?: string;
  images?: string[];
  status?: 'available' | 'sold' | 'rented';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BuyerClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  type?: string;
  propertyType?: string;
  features?: string;
  budget?: string;
  zona?: string;
  budget_min?: string;
  budget_max?: string;
  preferred_locations?: string[];
  property_type?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date;
}

export interface SellerClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  status?: string;
  properties?: any[];
  property_id?: string;
  asking_price?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date;
}

// Dashboard component (placeholder)
const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">This is a placeholder dashboard component.</p>
    </div>
  );
};

export default Dashboard;