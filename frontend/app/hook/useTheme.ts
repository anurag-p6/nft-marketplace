// 'use client';

// import { useThemeContext } from '../contexts/ThemeContext';

// export function useTheme() {
//   const context = useThemeContext();
  
//   const isDark = context.theme === 'dark';
//   const isLight = context.theme === 'light';

//   // Helper for conditional CSS classes
//   const applyTheme = (lightClass: string, darkClass: string): string => 
//     isLight ? lightClass : darkClass;

//   // Helper for conditional values
//   const getThemeValue = <T,>(lightValue: T, darkValue: T): T =>
//     isLight ? lightValue : darkValue;

//   return {
//     // Core theme properties
//     theme: context.theme,
//     isDark,
//     isLight,
    
//     // Theme actions
//     toggleTheme: context.toggleTheme,
//     setTheme: context.setTheme,
    
//     // Utility functions
//     applyTheme,
//     getThemeValue,
//   };
// }