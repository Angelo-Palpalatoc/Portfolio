import type { SectionId } from '../portfolio.types';
import { MainSection } from './MainSection';
import { AboutSection } from './AboutSection';
import { SkillsSection } from './SkillsSection';
import { ExperienceSection } from './ExperienceSection';
import { ContactSection } from './ContactSection';
import { LighthouseProject, RoomPortfolioProject, SecRenameProject } from './ProjectSections';

export function PortfolioSection({
  id,
  onOpen,
  onOpenSecRename,
}: {
  id: SectionId;
  onOpen: (id: SectionId) => void;
  onOpenSecRename?: () => void;
}) {
  switch (id) {
    case 'main':
      return <MainSection onExplore={() => onOpen('lighthouse')} />;
    case 'about':
      return <AboutSection />;
    case 'skills':
      return <SkillsSection />;
    case 'experience':
      return <ExperienceSection />;
    case 'contact':
      return <ContactSection />;
    case 'lighthouse':
      return <LighthouseProject />;
    case 'autorename':
      return <SecRenameProject onOpenDemo={onOpenSecRename} />;
    case 'portfolio':
      return <RoomPortfolioProject />;
  }
}
