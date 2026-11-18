import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Signature from "@/components/sections/Signature";
import Residences from "@/components/sections/Residences";
import Amenities from "@/components/sections/Amenities";
import Gallery from "@/components/sections/Gallery";
import Location from "@/components/sections/Location";
import Developer from "@/components/sections/Developer";
import CtaBand from "@/components/sections/CtaBand";

/**
 * Story flow: architectural hero → concise introduction + key figures →
 * three signature features → residences → essential amenities → gallery →
 * location → developer → enquiry & brochure.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Signature />
      <Residences />
      <Amenities />
      <Gallery />
      <Location />
      <Developer />
      <CtaBand />
    </>
  );
}
