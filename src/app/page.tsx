import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Highlights from "@/components/sections/Highlights";
import Residences from "@/components/sections/Residences";
import Amenities from "@/components/sections/Amenities";
import Gallery from "@/components/sections/Gallery";
import Location from "@/components/sections/Location";
import Developer from "@/components/sections/Developer";
import CtaBand from "@/components/sections/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Highlights />
      <Residences />
      <Amenities />
      <Gallery />
      <Location />
      <Developer />
      <CtaBand />
    </>
  );
}
