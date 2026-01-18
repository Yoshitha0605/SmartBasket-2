import React, { createContext, useContext, useState, ReactNode } from 'react';

export type City = 'Bengaluru' | 'Chennai' | 'Hyderabad' | 'Mumbai' | 'Delhi';

interface LocationContextType {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  cities: City[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const cities: City[] = ['Bengaluru', 'Chennai', 'Hyderabad', 'Mumbai', 'Delhi'];

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<City>('Bengaluru');

  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity, cities }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
