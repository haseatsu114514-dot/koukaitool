export const ART_STYLE = {
  version: "stella-soft-bear-v3",
  positive: "Original animal mascot matching the supplied brown bear reference. Oversized softly rounded head taking roughly 65–70 percent of the character height, excluding long ears, tiny rounded body and feet, thick smooth dark cocoa-brown outlines with rounded joins, simple dark eyes that can vary between dots, crescents, half-lidded shapes or a wink, expressive small eyebrows and a clear simple mouth. Warm cream and clearly distinct muted pastel body colours specified in each character prompt, soft restrained matte shading with a very subtle paper-like finish. Give each character a recognisably different dominant colour at thumbnail size while keeping the species recognisable through its ears, muzzle, markings or fins. Rounded animal bodies may have distinct pointed features: hedgehog quills must taper into clearly sharp triangular tips along the head and back. The site's green, red, yellow, white and blue group colours belong to its UI; illustrations may use a distinct main colour and a small group-colour accessory. Full body, front-facing or slight three-quarter view, centered square composition, generous clear margin, no scenery, no lettering. Give every character a distinct personality through its eyes, brows, mouth, head tilt and paw or fin gesture. Follow the individual expression in the character prompt; do not repeat the bear's worried face across the cast. One or two small signature props at most, props never obscure the face. Isolated on a transparent background.",
  negative: "photorealism, 3D rendering, glossy shading, complex fur, anime eyes, glitter, neon colours, saturated purple, harsh gradients, thin outlines, realistic animal proportions, elaborate scenery, lettering, watermarks, copied character designs",
  size: { width: 1024, height: 1024 },
  palette: ["#4b281a", "#fffbf2", "#bb864f", "#fff0d1", "#9bb487", "#d99279", "#a3bdcb", "#bca98e", "#f0d784", "#ffffff", "#eef1f4", "#b8a6c7", "#f0e9f4"],
} as const;
export type CharacterAsset = {
  slug: string;
  status: "placeholder" | "provided" | "generated" | "approved";
  src: string;
  displaySrc?: string;
  alt: string;
  styleVersion: string;
  width: number;
  height: number;
  provenance: { kind: "original-svg" | "user-provided" | "generation"; provider?: string; model?: string; createdAt?: string };
};
export type ImageGenerationRequest = { slug: string; prompt: string; negativePrompt: string; styleVersion: string; width: number; height: number };
/** Implement on a trusted server when an external API is connected; never expose API keys in clients. */
export interface ImageGenerationProvider {
  generate(request: ImageGenerationRequest, signal?: AbortSignal): Promise<CharacterAsset>;
}
