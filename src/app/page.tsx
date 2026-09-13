import React from 'react';
import Hero from '@/components/Hero';
import PrizeSection from '@/components/PrizeSection';
import CriteriaSection from '@/components/CriteriaSection';
import HowToParticipate from '@/components/HowToParticipate';
import FeaturedGallery from '@/components/FeaturedGallery';
import SponsorsSection from '@/components/SponsorsSection';
import RulesSection from '@/components/RulesSection';
import FaqSection from '@/components/FaqSection';
import { dataStore } from '@/lib/db';
import { isCompetitionActive } from '@/lib/competition-config';

export const revalidate = 0; // Dynamic data for live updates

export default async function HomePage() {
  const active = isCompetitionActive();
  const entries = await dataStore.getAllEntries();

  return (
    <div className="flex flex-col">
      <Hero />
      <PrizeSection />
      <CriteriaSection />
      {active ? (
        <HowToParticipate />
      ) : (
        <FeaturedGallery initialEntries={entries} />
      )}
      <SponsorsSection />
      <RulesSection />
      <FaqSection />
    </div>
  );
}
