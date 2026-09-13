import React from 'react';
import { dataStore } from '@/lib/db';
import FeaturedGallery from '@/components/FeaturedGallery';

export const revalidate = 0;

export default async function GalleryPage() {
  const entries = await dataStore.getAllEntries();

  return (
    <div className="py-8 bg-white min-h-screen">
      <FeaturedGallery initialEntries={entries} />
    </div>
  );
}
