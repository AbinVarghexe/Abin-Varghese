import { cn } from "@/lib/design-utils";

export const homePageDesignSystem = {
  shell: {
    rootClass: "home-page-shell",
    contentClass: "home-page-content",
    containerClass: "home-page-container",
  },
  colors: {
    canvas: "#f7f4ef",
    canvasSoft: "#f0eee9",
    canvasWarm: "#ece7df",
    surface: "#ffffff",
    surfaceSoft: "#f8f5f2",
    text: {
      primary: "#0b0b0c",
      body: "#4a4a68",
      secondary: "#323232",
      muted: "#6b7280",
      inverse: "#fafcfe",
    },
    brand: {
      blue: "#0020d7",
      blueSoft: "#7da3f6",
      indigo: "#0e0e2c",
      accent: "#3b5bdb",
      accentSoft: "#5b74ff",
    },
    border: {
      card: "#d4d4d8",
      input: "#e4e4e7",
      action: "#929292",
      subtle: "#c2c2c2",
    },
  },
  gradients: {
    page: "linear-gradient(180deg, #f7f4ef 0%, #f0eee9 60%, #ece7df 100%)",
    primaryAction: "linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)",
    secondaryAction: "linear-gradient(180deg, #484848 0%, #333333 100%)",
    highlight: "linear-gradient(208.44deg, #5b74ff 5%, #001bb0 84%)",
  },
  typography: {
    families: {
      sans: "var(--font-poppins), 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      display: "var(--font-vina), 'Vina', sans-serif",
      serifAccent: "var(--font-serif), 'Lora', serif",
      script: "var(--font-script), 'Dancing Script', cursive",
    },
    pairings: {
      hero: {
        primary: "sans",
        secondary: "display",
        usage: "Hero heading and high-contrast statement lines",
      },
      sectionHeading: {
        primary: "sans",
        secondary: "serifAccent",
        usage: "Section title + italic accent keyword",
      },
      testimonial: {
        primary: "serifAccent",
        secondary: "script",
        usage: "Quote body + signature line",
      },
      interface: {
        primary: "sans",
        secondary: "sans",
        usage: "Buttons, labels, helper text, and metadata",
      },
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    scale: {
      hero: {
        mobile: "2.25rem",
        desktop: "4.5rem",
        lineHeight: 0.95,
        tracking: "-0.08em",
      },
      sectionTitle: {
        mobile: "2.25rem",
        desktop: "3rem",
        lineHeight: 1.05,
        tracking: "-0.03em",
      },
      body: {
        mobile: "1rem",
        desktop: "1.125rem",
        lineHeight: 1.65,
      },
      label: {
        mobile: "0.875rem",
        desktop: "0.9375rem",
        lineHeight: 1.3,
      },
      caption: {
        mobile: "0.75rem",
        desktop: "0.8125rem",
        lineHeight: 1.3,
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
    "3xl": 48,
    "4xl": 64,
    "5xl": 96,
    "6xl": 128,
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    card: "1.75rem",
    pill: "9999px",
  },
  shadows: {
    card: "0 10px 30px rgba(18, 18, 18, 0.08)",
    cardHover: "0 18px 42px rgba(18, 18, 18, 0.14)",
    primaryButton: "0 22px 52px rgba(0, 32, 215, 0.38)",
    subtle: "0 6px 16px rgba(18, 18, 18, 0.08)",
  },
  layout: {
    container: {
      maxWidth: "1200px",
      sidePaddingMobile: "1rem",
      sidePaddingTablet: "2rem",
      sidePaddingDesktop: "5rem",
    },
    hero: {
      minHeight: "100vh",
      topOffsetMobile: "15rem",
      topOffsetDesktop: "20rem",
      contentMaxWidth: "1400px",
    },
    sections: {
      standardY: "6rem",
      compactY: "4rem",
      headlineGap: "0.5rem",
      bodyGap: "1rem",
    },
    grid: {
      columns: 12,
      sectionGap: "1.5rem",
      cardGap: "1.5rem",
    },
  },
  alignment: {
    hero: {
      headline: "center",
      body: "center",
      ctaRow: "center",
    },
    sections: {
      titleBlock: "left",
      contentFlow: "left",
      cards: "grid-auto",
    },
    breakpoints: {
      mobile: "single-column and center-safe touch targets",
      tablet: "mixed alignment, constrained width",
      desktop: "left content columns with intentional visual offsets",
    },
  },
  components: {
    button: {
      base: {
        height: "3.875rem",
        radius: "9999px",
        border: "2.5px solid #929292",
        padding: "0.625rem 0.625rem 0.625rem 2rem",
        labelMinWidth: "5rem",
        iconSize: "2.625rem",
        fontFamily: "sans",
        fontSize: "0.9375rem",
        fontWeight: 500,
      },
      primary: {
        background: "linear-gradient(180deg, #7da3f6 0%, #0020d7 100%)",
        text: "#ffffff",
        iconBackground: "#ffffff",
        iconColor: "#0020d7",
        shadow: "0 22px 52px rgba(0, 32, 215, 0.38)",
      },
      secondary: {
        background: "#ffffff",
        text: "#0f172a",
        iconBackground: "#f1f5f9",
        iconColor: "#0f172a",
        shadow: "0 18px 44px rgba(0, 32, 215, 0.12)",
      },
      interaction: {
        hoverScale: 1.04,
        tapScale: 0.97,
        iconRotate: "45deg",
      },
    },
    card: {
      base: {
        radius: "1.75rem",
        border: "5px solid #e4e4e7",
        background: "#ffffff",
      },
      serviceBento: {
        minHeight: "18.75rem",
        gridColumns: "3",
        motionLiftY: -6,
      },
      projectPreview: {
        radius: "1.5rem",
        chromeHeight: "2.5rem",
      },
    },
    sectionHeader: {
      titleAccent: {
        family: "serifAccent",
        style: "italic",
        weight: 500,
        color: "#2563eb",
      },
      descriptionMaxWidth: "48rem",
    },
  },
  motion: {
    duration: {
      fast: 0.2,
      normal: 0.4,
      slow: 0.65,
    },
    easing: {
      emphasized: [0.22, 1, 0.36, 1],
      smooth: "easeOut",
    },
    patterns: {
      fadeUp: "opacity + translateY",
      lift: "translateY(-6px)",
      magnetic: "pointer-reactive spring translation",
      rotateIcon: "hover rotate 45deg",
    },
  },
  layers: {
    background: 0,
    decorative: 10,
    content: 20,
    foreground: 50,
    overlay: 9999,
  },
} as const;

export type HomeButtonVariant = "primary" | "secondary";

export function homeButtonTokens(variant: HomeButtonVariant) {
  const button = homePageDesignSystem.components.button;
  return {
    ...button.base,
    ...button[variant],
    interaction: button.interaction,
  };
}

export function homeSectionHeaderTokens() {
  return homePageDesignSystem.components.sectionHeader;
}

export function homePageShellClass(className?: string) {
  return cn(homePageDesignSystem.shell.rootClass, className);
}

export function homePageContentClass(className?: string) {
  return cn(homePageDesignSystem.shell.contentClass, className);
}

export function homePageContainerClass(className?: string) {
  return cn(homePageDesignSystem.shell.containerClass, className);
}
