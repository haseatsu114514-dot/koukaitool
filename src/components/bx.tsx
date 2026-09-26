import { Fragment } from "react";
import { Parser, jaModel } from "@/lib/budoux-ja";

const parser = new Parser(jaModel);

/** Japanese text that only wraps between natural phrases (BudouX), so lines never break mid-word. */
export function Bx({ children }: { children: string }) {
  return <span className="bx">{parser.parse(children).map((phrase, i) => <Fragment key={i}>{i > 0 && <wbr />}{phrase}</Fragment>)}</span>;
}
