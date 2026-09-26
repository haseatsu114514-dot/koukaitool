import { Bx } from "./bx";

/** Page and section heading: a mincho title with an optional one-line lead. */
export function SectionHead({ title, lead, as: Tag = "h2" }: { title: React.ReactNode; lead?: React.ReactNode; as?: "h1" | "h2" }) {
  const phrase = (node: React.ReactNode) => typeof node === "string" ? <Bx>{node}</Bx> : node;
  return <header className="sec-head">
    <Tag className="sec-title">{phrase(title)}</Tag>
    {lead && <p className="sec-lead">{phrase(lead)}</p>}
  </header>;
}
