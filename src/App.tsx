import { useEffect } from 'react';
import CharacterSheet from './components/character/CharacterSheet';
import Hero from './components/character/Hero';
import SecretFrequency from './components/easter-egg/SecretFrequency';
import TransmissionIntro from './components/intro/TransmissionIntro';
import SiteShell from './components/layout/SiteShell';
import FrequencyArchive from './components/stations/FrequencyArchive';
import NightLog from './components/story/NightLog';
import StorySection from './components/story/StorySection';
import { RadioContext, useRadioProvider } from './hooks/useRadioState';

function Experience() {
  return (
    <>
      <Hero />
      <CharacterSheet />
      <StorySection />
      <FrequencyArchive />
      <NightLog />
      <SecretFrequency />
    </>
  );
}

export default function App() {
  const radio = useRadioProvider();

  // Lock scrolling while the intro is up.
  useEffect(() => {
    document.body.classList.toggle('intro-lock', radio.introActive);
    if (!radio.introActive) window.scrollTo(0, 0);
  }, [radio.introActive]);

  return (
    <RadioContext.Provider value={radio}>
      {/* Overlays live outside the shell so the intro gets them too. */}
      <div className="fx-vignette" aria-hidden />
      <div className="fx-noise" aria-hidden />
      <div className="fx-scanlines" aria-hidden />
      {radio.tunedIn && (
        <SiteShell>
          <Experience />
        </SiteShell>
      )}
      {radio.introActive && <TransmissionIntro />}
    </RadioContext.Provider>
  );
}
