import { useIsMobile } from "@/lib/hooks/useIsMobile";
import ContactSection from "./ContactSection";
import MobileContactSection from "./MobileContactSection";

export default function ContactSectionWrapper() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileContactSection /> : <ContactSection />;
}
