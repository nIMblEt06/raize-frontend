"use client";
import "./styles.scss";

import BetSection from "@/components/ContBetSection";

export default function Home() {
  return (
    <main className='Home'>
      <div className='Heading-Section'>
        <span className='Heading'>Turn insights into income.</span>
        <span className='Sub-Heading'>
          Leverage your intuition to predict real-world events, take positions,
          and win big.
        </span>
      </div>
      <BetSection />
    </main>
  );
}
