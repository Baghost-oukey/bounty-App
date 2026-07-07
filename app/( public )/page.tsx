import { HeroSection } from "@/components/hero";
import Bentogrid from "@/components/shadcn-space/blocks/bento-grid-01/bentogrid";
import Navbar from "@/components/shadcn-space/blocks/navbar-01/navbar";
import Timeline from "@/app/( public )/components/timeline";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Bentogrid />
      <Timeline/>
    </div>
  );
}
