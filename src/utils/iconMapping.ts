// Icon mapping utility for dynamic menu icons

import {
  Home,
  FolderOpen,
  Calendar,
  Newspaper,
  Stethoscope,
  Building2,
  Users,
  Network,
  Briefcase,
  BarChart3,
  FileText,
  Scale,
  HelpCircle,
  Info,
  BookOpen,
  Cpu,
  Folder,
  type LucideIcon,
} from 'lucide-react';

// Map icon names from Strapi to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  folder: Folder,
  'folder-open': FolderOpen,
  calendar: Calendar,
  news: Newspaper,
  newspaper: Newspaper,
  doctor: Stethoscope,
  stethoscope: Stethoscope,
  building: Building2,
  'building-2': Building2,
  users: Users,
  network: Network,
  briefcase: Briefcase,
  'bar-chart': BarChart3,
  'bar-chart-3': BarChart3,
  file: FileText,
  'file-text': FileText,
  scale: Scale,
  help: HelpCircle,
  'help-circle': HelpCircle,
  info: Info,
  book: BookOpen,
  'book-open': BookOpen,
  cpu: Cpu,
};

/**
 * Get Lucide icon component from icon name string
 * Returns Home icon as fallback
 */
export function getIconComponent(iconName: string): LucideIcon {
  const normalizedName = iconName?.toLowerCase().trim() || 'home';
  return iconMap[normalizedName] || Home;
}

/**
 * Get all available icon names
 */
export function getAvailableIcons(): string[] {
  return Object.keys(iconMap);
}
