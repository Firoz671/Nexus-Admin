import { AvatarsSection, BadgesSection, CardsSection } from "../components/DataDisplaySection";
import { ButtonsSection } from "../components/ButtonsSection";
import { ColorSection } from "../components/ColorSection";
import { FeedbackSection } from "../components/FeedbackSection";
import { FormsSection } from "../components/FormsSection";
import { NotificationsSection } from "../components/NotificationsSection";
import { OverviewSection } from "../components/OverviewSection";
import { DropdownSection, ModalSection } from "../components/OverlaysSection";
import { ThemesSection } from "../components/ThemesSection";
import { TypographySection } from "../components/TypographySection";

export function DesignSystemPage() {
  return (
    <div className="divide-y divide-base-300/70">
      <OverviewSection />
      <ColorSection />
      <TypographySection />
      <ButtonsSection />
      <FormsSection />
      <BadgesSection />
      <CardsSection />
      <AvatarsSection />
      <ModalSection />
      <DropdownSection />
      <FeedbackSection />
      <NotificationsSection />
      <ThemesSection />
    </div>
  );
}
