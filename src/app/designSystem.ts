// designSystem.ts
export type Mode = "light" | "dark";
export type Contrast = "standard" | "increased";
export type Platform = "ios" | "ipados" | "macos" | "web";

export type ColorToken =
  | "bg"
  | "surface"
  | "surfaceElevated"
  | "text"
  | "textSecondary"
  | "separator"
  | "tint"
  | "danger"
  | "success"
  | "warning";

export type MaterialToken =
  | "glassThin"
  | "glassRegular"
  | "glassThick"
  | "glassSidebar"
  | "glassToolbar";

export type TypographyToken =
  | "largeTitle"
  | "title"
  | "headline"
  | "body"
  | "callout"
  | "footnote"
  | "caption";

export type RadiusKind = "fixed" | "capsule" | "concentric";

export interface RadiusSpec {
  kind: RadiusKind;
  value?: number; // used for fixed
}

export interface ConcentricSpec {
  parentRadius: number;
  parentPadding: number;
  minRadius?: number; // fallback for non nested use
}

export interface DesignTokens {
  color: Record<Mode, Record<Contrast, Record<ColorToken, string>>>;
  material: Record<Platform, Record<MaterialToken, {
    blurPx: number;
    tintOpacity: number; // 0..1
    strokeOpacity: number; // subtle border highlight
  }>>;
  type: Record<TypographyToken, {
    fontFamily: string;
    fontSizePx: number;
    lineHeightPx: number;
    letterSpacingEm: number;
    fontWeight: number;
  }>;
  space: {
    // 4px grid, boring on purpose
    xs: number; sm: number; md: number; lg: number; xl: number; xxl: number;
  };
  radius: {
    // fixed radii for standalone surfaces
    sm: number; md: number; lg: number; xl: number;
  };
  motion: {
    // keep it snappy, avoid nausea
    fastMs: number; baseMs: number; slowMs: number;
  };
}

export const tokens: DesignTokens = {
  color: {
    light: {
      standard: {
        bg: "#FFFFFF",
        surface: "#FFFFFF",
        surfaceElevated: "#FFFFFF",
        text: "#0B0B0F",
        textSecondary: "#4B4B57",
        separator: "rgba(0,0,0,0.12)",
        tint: "#0A84FF",
        danger: "#FF3B30",
        success: "#34C759",
        warning: "#FF9500",
      },
      increased: {
        bg: "#FFFFFF",
        surface: "#FFFFFF",
        surfaceElevated: "#FFFFFF",
        text: "#000000",
        textSecondary: "#2B2B33",
        separator: "rgba(0,0,0,0.22)",
        tint: "#0066FF",
        danger: "#D70015",
        success: "#248A3D",
        warning: "#C93400",
      },
    },
    dark: {
      standard: {
        bg: "#000000",
        surface: "#0B0B0F",
        surfaceElevated: "#12121A",
        text: "#FFFFFF",
        textSecondary: "#B8B8C6",
        separator: "rgba(255,255,255,0.14)",
        tint: "#0A84FF",
        danger: "#FF453A",
        success: "#32D74B",
        warning: "#FF9F0A",
      },
      increased: {
        bg: "#000000",
        surface: "#0B0B0F",
        surfaceElevated: "#151522",
        text: "#FFFFFF",
        textSecondary: "#D5D5E6",
        separator: "rgba(255,255,255,0.22)",
        tint: "#409CFF",
        danger: "#FF6961",
        success: "#30DB5B",
        warning: "#FFD60A",
      },
    },
  },

  material: {
    ios: {
      glassThin:    { blurPx: 18, tintOpacity: 0.22, strokeOpacity: 0.18 },
      glassRegular: { blurPx: 28, tintOpacity: 0.28, strokeOpacity: 0.18 },
      glassThick:   { blurPx: 40, tintOpacity: 0.34, strokeOpacity: 0.18 },
      glassSidebar: { blurPx: 34, tintOpacity: 0.30, strokeOpacity: 0.18 },
      glassToolbar: { blurPx: 26, tintOpacity: 0.26, strokeOpacity: 0.18 },
    },
    ipados: {
      glassThin:    { blurPx: 18, tintOpacity: 0.22, strokeOpacity: 0.18 },
      glassRegular: { blurPx: 28, tintOpacity: 0.28, strokeOpacity: 0.18 },
      glassThick:   { blurPx: 40, tintOpacity: 0.34, strokeOpacity: 0.18 },
      glassSidebar: { blurPx: 34, tintOpacity: 0.30, strokeOpacity: 0.18 },
      glassToolbar: { blurPx: 26, tintOpacity: 0.26, strokeOpacity: 0.18 },
    },
    macos: {
      glassThin:    { blurPx: 14, tintOpacity: 0.18, strokeOpacity: 0.16 },
      glassRegular: { blurPx: 20, tintOpacity: 0.22, strokeOpacity: 0.16 },
      glassThick:   { blurPx: 28, tintOpacity: 0.26, strokeOpacity: 0.16 },
      glassSidebar: { blurPx: 22, tintOpacity: 0.24, strokeOpacity: 0.16 },
      glassToolbar: { blurPx: 18, tintOpacity: 0.20, strokeOpacity: 0.16 },
    },
    web: {
      glassThin:    { blurPx: 16, tintOpacity: 0.22, strokeOpacity: 0.16 },
      glassRegular: { blurPx: 24, tintOpacity: 0.28, strokeOpacity: 0.16 },
      glassThick:   { blurPx: 36, tintOpacity: 0.34, strokeOpacity: 0.16 },
      glassSidebar: { blurPx: 28, tintOpacity: 0.30, strokeOpacity: 0.16 },
      glassToolbar: { blurPx: 22, tintOpacity: 0.26, strokeOpacity: 0.16 },
    },
  },

  type: {
    largeTitle: { fontFamily: "system-ui", fontSizePx: 34, lineHeightPx: 41, letterSpacingEm: -0.01, fontWeight: 700 },
    title:      { fontFamily: "system-ui", fontSizePx: 28, lineHeightPx: 34, letterSpacingEm: -0.01, fontWeight: 650 },
    headline:   { fontFamily: "system-ui", fontSizePx: 17, lineHeightPx: 22, letterSpacingEm:  0.00, fontWeight: 650 },
    body:       { fontFamily: "system-ui", fontSizePx: 17, lineHeightPx: 22, letterSpacingEm:  0.00, fontWeight: 450 },
    callout:    { fontFamily: "system-ui", fontSizePx: 16, lineHeightPx: 21, letterSpacingEm:  0.00, fontWeight: 450 },
    footnote:   { fontFamily: "system-ui", fontSizePx: 13, lineHeightPx: 18, letterSpacingEm:  0.00, fontWeight: 450 },
    caption:    { fontFamily: "system-ui", fontSizePx: 12, lineHeightPx: 16, letterSpacingEm:  0.00, fontWeight: 450 },
  },

  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { sm: 10, md: 14, lg: 18, xl: 24 },
  motion: { fastMs: 140, baseMs: 220, slowMs: 360 },
};
