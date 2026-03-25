import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    restaurantName: 'Pizza Paradise',
    contactEmail: 'hello@pizzaparadise.com',
    contactPhone: '+92 300 1234567',
    address: '123 Pizza Street, Food City, Pakistan',
    openingHours: 'Mon-Sun: 11:00 AM - 11:00 PM'
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (d) => {
      if (d.exists()) {
        setSettings(d.data() as SiteSettings);
      }
    });
    return () => unsub();
  }, []);

  return settings;
}
