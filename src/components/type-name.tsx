/** The animal at the end of each type name. Names are "modifier + animal" (ほめ待ち + グリズリー). */
export const NAME_ANIMALS = ["グリズリー", "うさぎ", "フェニックス", "妖狐", "パンダ", "アルパカ", "ドーベルマン", "ハリネズミ", "シャチ", "カピバラ"];

/** A type name that wraps only between the modifier and the animal (ほめ待ち｜グリズリー), never inside either. */
export function TypeName({ name }: { name: string }) {
  const animal = NAME_ANIMALS.find(word => name.endsWith(word) && name !== word);
  return <span className="bx">{animal ? <>{name.slice(0, -animal.length)}<wbr />{animal}</> : name}</span>;
}
