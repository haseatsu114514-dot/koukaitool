import { LOGO_PATH } from "@/lib/logo-path";
export { LOGO_PATH };

/** Brand mark sized by height; uses currentColor. */
export function LogoMark({ size = 22, className }: { size?: number; className?: string }) {
  return <svg className={className} width={size * 46 / 39} height={size} viewBox="9 16 46 39" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d={LOGO_PATH} /></svg>;
}
