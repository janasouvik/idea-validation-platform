import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Bus,
  Utensils,
  HeartPulse,
  Wallet,
  Store,
  Zap,
  Home,
  Trees,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends Omit<LucideProps, 'name'> {
  name?: string | null;
  slug?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, slug, ...props }) => {
  const iconName = name || slug || '';

  switch (iconName.toLowerCase()) {
    case 'graduationcap':
    case 'education-campus':
      return <GraduationCap {...props} />;
    case 'briefcase':
    case 'career-jobs':
      return <Briefcase {...props} />;
    case 'bus':
    case 'transportation-mobility':
      return <Bus {...props} />;
    case 'utensils':
    case 'food-services':
      return <Utensils {...props} />;
    case 'heartpulse':
    case 'healthcare-access':
      return <HeartPulse {...props} />;
    case 'wallet':
    case 'personal-finance':
      return <Wallet {...props} />;
    case 'store':
    case 'small-businesses':
      return <Store {...props} />;
    case 'zap':
    case 'productivity-tech':
      return <Zap {...props} />;
    case 'home':
    case 'housing-accommodation':
      return <Home {...props} />;
    case 'trees':
    case 'environment-infrastructure':
      return <Trees {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
