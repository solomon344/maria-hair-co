"use client";
import { EdgeStoreProvider } from '@/lib/edgestore';

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextThemesProvider {...themeProps}>
      <SessionProvider>
       <EdgeStoreProvider>
         {children}
       </EdgeStoreProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}