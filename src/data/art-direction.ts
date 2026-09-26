export const ART_STYLE = {
  version: "stella-soft-line-v2",
  positive: "Original editorial animal character for a Japanese lifestyle brand for adult women. Minimal hand-drawn rounded silhouette, soft slightly thick warm-brown monoline, restrained flat muted colors, body colour leaning toward the type's five-element colour (wood green, fire red, earth yellow, metal silver and pearl, water blue), ivory negative space, tiny dot eyes, unassuming expression. Consistent line weight, full body, centered square composition, few details, gently humorous rather than childish. No lettering. Character occupies 65 percent of canvas, props never obscure face.",
  negative: "photorealism, 3D rendering, glossy shading, complex fur, anime eyes, glitter, mystical purple, gradients, elaborate scenery, lettering, watermarks, copied character designs",
  size: { width: 1024, height: 1024 },
  palette: ["#766957", "#faf8f3", "#d4b98f", "#d4dfd2", "#e8c9bc", "#d3e0e4"],
} as const;
export type CharacterAsset = {
  slug: string;
  status: "placeholder" | "generated" | "approved";
  src: string;
  alt: string;
  styleVersion: string;
  width: number;
  height: number;
  provenance: { kind: "original-svg" | "generation"; provider?: string; model?: string; createdAt?: string };
};
export type ImageGenerationRequest = { slug: string; prompt: string; negativePrompt: string; styleVersion: string; width: number; height: number };
/** Implement on a trusted server when an external API is connected; never expose API keys in clients. */
export interface ImageGenerationProvider {
  generate(request: ImageGenerationRequest, signal?: AbortSignal): Promise<CharacterAsset>;
}
