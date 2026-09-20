import { ThemeMode } from '../types';

export interface ThemeStyles {
  appBg: string;
  cardBg: string;
  cardBorder: string;
  innerBox: string;
  headingText: string;
  bodyText: string;
  mutedText: string;
  borderClass: string;
  subNavBg: string;
  inputClass: string;
}

export const getThemeStyles = (theme: ThemeMode): ThemeStyles => {
  switch (theme) {
    case 'sepia':
      return {
        appBg: 'bg-[#FBF0D9] text-[#432C1C]',
        cardBg: 'bg-[#FFFDF5]',
        cardBorder: 'border-[#E2D5C3]',
        innerBox: 'bg-[#FAF0DC] border-[#E2D5C3] text-[#432C1C]',
        headingText: 'text-[#432C1C]',
        bodyText: 'text-[#5F4B32]',
        mutedText: 'text-[#785E48]',
        borderClass: 'border-[#E2D5C3]',
        subNavBg: 'bg-[#FAF0DC] border-[#E2D5C3]',
        inputClass: 'bg-[#FFFDF5] border-[#E2D5C3] text-[#432C1C] placeholder-[#A38A75]',
      };
    case 'dark':
      return {
        appBg: 'bg-[#121E24] text-[#F8FAFC]',
        cardBg: 'bg-[#1C2C35]',
        cardBorder: 'border-[#2D424F]',
        innerBox: 'bg-[#121E24] border-[#2D424F] text-[#F8FAFC]',
        headingText: 'text-white',
        bodyText: 'text-slate-100',
        mutedText: 'text-slate-300',
        borderClass: 'border-[#2D424F]',
        subNavBg: 'bg-[#121E24] border-[#2D424F]',
        inputClass: 'bg-[#121E24] border-[#2D424F] text-white placeholder-slate-400',
      };
    case 'light':
    default:
      return {
        appBg: 'bg-[#F8FAF9] text-[#4B4B4B]',
        cardBg: 'bg-white',
        cardBorder: 'border-[#E5E5E5]',
        innerBox: 'bg-[#FFFBEB] border-[#E5E5E5] text-[#4B4B4B]',
        headingText: 'text-[#4B4B4B]',
        bodyText: 'text-[#2D3748]',
        mutedText: 'text-[#777777]',
        borderClass: 'border-[#E5E5E5]',
        subNavBg: 'bg-[#F0F4F8] border-[#E5E5E5]',
        inputClass: 'bg-white border-[#E5E5E5] text-[#4B4B4B] placeholder-[#AFAFAF]',
      };
  }
};
