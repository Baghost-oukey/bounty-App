import { HeroSection } from "@/app/( public )/components/hero";
import Bentogrid from "@/components/shadcn-space/blocks/bento-grid-01/bentogrid";
import Navbar from "@/components/shadcn-space/blocks/navbar-01/navbar";
import Timeline from "@/app/( public )/components/timeline";
import FeaturesSection from "./components/feature";
import FeatureSelection from "./components/choice";
import { Footer2 } from "@/components/footer2";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Bentogrid />
      <Timeline/>
      <FeatureSelection />
      <Footer2 />
    </div>
  );
}
