import { Bx } from "./bx";

/** Numbered editorial heading used across pages: small index + label, large serif title, optional lead. */
export function SectionHead({ num, label, title, lead, as: Tag = "h2" }: { num?: string; label: string; title: React.ReactNode; lead?: React.ReactNode; as?: "h1" | "h2" }) {
  const phrase = (node: React.ReactNode) => typeof node === "string" ? <Bx>{node}</Bx> : node;
  return <header className="sec-head">
    <p className="sec-kicker">{num && <span className="sec-num">{num}</span>}<span className="sec-label">{label}</span></p>
    <Tag className="sec-title">{phrase(title)}</Tag>
    {lead && <p className="sec-lead">{phrase(lead)}</p>}
  </header>;
}
