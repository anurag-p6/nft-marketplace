'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

// Inner component to access theme context
function RainbowKitWithTheme({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <RainbowKitProvider 
      theme={theme === 'dark' ? darkTheme() : lightTheme()}
      coolMode
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitWithTheme>
            {children}
          </RainbowKitWithTheme>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}