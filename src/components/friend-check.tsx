"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, RotateCcw } from "lucide-react";
import { elementStyle, typeByStem, type CharacterType } from "@/data/types";
import { COMPATIBILITY_COPY, OPEN_LEVELS } from "@/data/compatibility-copy";
import { stellaLevel } from "@/lib/diagnosis/compatibility";
import { track } from "@/lib/analytics";
import { BirthForm } from "./birth-form";
import { Character } from "./character";
import { Bx } from "./bx";

/** A friend's birth date → their type and how it sits with mine. The visitor's own saved result is never touched, and the friend's date is neither saved nor sent. */
export function FriendCheck({ me, locked }: { me: CharacterType; locked: boolean }) {
  const [friend, setFriend] = useState<CharacterType | null>(null);
  const level = friend ? stellaLevel(me.stem, friend.stem) : null;
  const open = level !== null && (!locked || OPEN_LEVELS.includes(level));
  return <div className="friend-check">
    <h3 className="friend-title">友だちとの相性を調べる</h3>
    <p className="friend-lead"><Bx>友だちの生年月日を入れると、あなたとの相性がわかります。あなたの結果はそのまま残ります。</Bx></p>
    {friend && level ? <div className="friend-result" role="status">
      <div className="friend-faces"><span className="compat-art" style={elementStyle(me.stem)}><Character type={me} /></span><span className="friend-x" aria-hidden="true">×</span><span className="compat-art" style={elementStyle(friend.stem)}><Character type={friend} /></span></div>
      <p className="friend-name">友だちは <Link href={`/types/${friend.slug}/`}><Bx>{friend.displayName}</Bx></Link></p>
      {open ? <div className={`friend-level compat-${level}`}><span className="compat-label">{COMPATIBILITY_COPY[level].label}</span><p className="compat-note"><Bx>{COMPATIBILITY_COPY[level].note}</Bx></p></div>
        : <p className="compat-lock friend-lock"><Lock size={13} strokeWidth={2.2} aria-hidden="true" />ふたりの相性は<a href="#line">LINEで見られます</a></p>}
      <div className="friend-actions">
        <Link className="text-link" href={`/types/${friend.slug}/`}>友だちのタイプを見る <ArrowRight size={15} aria-hidden="true" /></Link>
        <button type="button" className="text-link" onClick={() => setFriend(null)}><RotateCcw size={14} aria-hidden="true" />別の友だちを調べる</button>
      </div>
    </div> : <BirthForm idPrefix="friend-" submitLabel="相性を調べる" onDiagnose={result => { const type = typeByStem(result.pillar.stem); setFriend(type); track({ name: "friend_check", stella_type: me.slug, friend_type: type.slug }); }} />}
    <p className="micro friend-note">友だちの生年月日は、保存も送信もしません。</p>
  </div>;
}
