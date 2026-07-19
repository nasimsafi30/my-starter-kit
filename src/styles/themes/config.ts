import { type ClassValue } from "clsx";

export interface ThemeConfig {
  name: string;
  label: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    card: string;
    border: string;
  };
  fonts: {
    sans: string;
    mono: string;
    display: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const themes: Record<string, ThemeConfig> = {
  light: {
    name: "light",
    label: "Light",
    colors: {
      background: "#FFFFFF",
      foreground: "#0F172A",
      primary: "#0066FF",
      secondary: "#6C63FF",
      accent: "#FF6B6B",
      muted: "#F1F5F9",
      card: "#FFFFFF",
      border: "#E2E8F0",
    },
    fonts: {
      sans: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, monospace",
      display: "Inter, system-ui, sans-serif",
    },
    radius: {
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
    },
  },
  dark: {
    name: "dark",
    label: "Dark",
    colors: {
      background: "#0F172A",
      foreground: "#F8FAFC",
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#F472B6",
      muted: "#1E293B",
      card: "#1E293B",
      border: "#334155",
    },
    fonts: {
      sans: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, monospace",
      display: "Inter, system-ui, sans-serif",
    },
    radius: {
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
    },
  },
  system: {
    name: "system",
    label: "System",
    colors: {
      background: "#FFFFFF",
      foreground: "#0F172A",
      primary: "#0066FF",
      secondary: "#6C63FF",
      accent: "#FF6B6B",
      muted: "#F1F5F9",
      card: "#FFFFFF",
      border: "#E2E8F0",
    },
    fonts: {
      sans: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, monospace",
      display: "Inter, system-ui, sans-serif",
    },
    radius: {
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
    },
  },
};

export function getTheme(theme: string): ThemeConfig {
  return themes[theme] || themes.light;
}

export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
  
  Object.entries(theme.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--theme-font-${key}`, value);
  });
  
  Object.entries(theme.radius).forEach(([key, value]) => {
    root.style.setProperty(`--theme-radius-${key}`, value);
  });
}
