import type { TenGod } from "@/lib/diagnosis/ten-gods";
import type { StellaLevel } from "@/lib/diagnosis/compatibility";

/** Copy for the love landing page (/love/), keyed by type slug. Written for women in their 30s and 40s:
 * the hook is 恋愛運, the substance is how each type is loved (what works in love, the usual missteps) and how to bring out her charm.
 * Partners are "相手" / "好きな人" throughout, never a gender. Built on the type details so both pages describe the same person. */
/** Short lines here (catch, traits, gift titles, LINE steps) are shown through Phrases: they wrap after 、。！？ or at a "｜" hint. */
export type LoveCopy = {
  /** One line under the type name. */
  catch: string;
  /** Three short words for the result card. Each adds something the catch does not already say. */
  keywords: string[];
  /** Four tendencies in love, stated with confidence (broad enough to hold for the type, not one-off habits). */
  traits: string[];
  /** What draws people to her, and how to show it. */
  charm: string;
  /** What works in love for this type (shown as うまくいく法則). */
  win: string;
  /** The usual misstep (shown as やりがちなNG). */
  lose: string;
  /** One thing to try today. */
  hint: string;
};

export const LOVE_COPY: Record<string, LoveCopy> = {
  grizzly: {
    catch: "がんばりを見てくれる人に、一途になる恋",
    keywords: ["しっかり者", "甘え下手", "ギャップが魅力"],
    traits: ["がんばっている自分を、ちゃんと見てくれる人に惹かれる", "好きな人の前ほど、しっかり者でいようとする", "本当は甘えたいのに、弱みを見せるのが苦手", "一度好きになると、一途に相手を想い続ける"],
    charm: "あなたの魅力は、裏表のないまっすぐさと、ほめられたときにふと見せる照れた顔のギャップ。いつも頼られる側だからこそ、弱いところを少し見せた瞬間に、相手は「守りたい」と感じます。しっかり者の顔は半分だけにして、素直な一面をのぞかせてください。",
    win: "仕事や趣味など、一緒に何かに取り組む場で恋が育つタイプ。がんばる姿を見てもらい、お互いを認め合える関係から始めるとうまくいきます。好きになったら、駆け引きより、まっすぐ気持ちを伝えるほうが届きます。",
    lose: "弱みを見せずに「大丈夫」を重ねること。相手は頼られていないと感じて、少しずつ距離ができてしまいます。意地を張って謝れないまま、すれ違いが長引くのもよくあるNGです。",
    hint: "がんばった日は、好きな人に「今日、ちょっとがんばったんだ」と伝えてみてください。ほめてもらえる関係をつくることが、あなたの恋愛運をいちばん引き寄せます。",
  },
  rabbit: {
    catch: "気づけば選ばれている、愛され上手の恋",
    keywords: ["人当たりがいい", "連絡マメ", "縁に強い"],
    traits: ["相手の好みに、自然と自分を合わせられる", "こまめな連絡や気づかいで、距離を縮めていく", "人の縁や紹介から、恋が始まりやすい", "合わせすぎて、本音を後回しにしがち"],
    charm: "あなたの魅力は、一緒にいる人を心地よくさせる力と、思わず守りたくなる愛嬌。人の縁にも恵まれやすい、生まれつきの愛され体質です。その魅力は、相手に合わせているときより、あなたの「好き」がにじみ出たときにいちばん輝きます。",
    win: "人の縁を味方につけるとうまくいきます。友だちの紹介や、知り合いが集まる場に顔を出すほど、いい出会いが巡ってきます。気になる人には、こまめな連絡で少しずつ距離を縮めていきましょう。",
    lose: "嫌われたくなくて、相手に合わせすぎること。気づけば相手の顔色ばかりうかがい、さみしさから寄りかかりすぎてしまいます。誰にでも優しくして、本命の相手に「特別じゃないのかも」と思わせてしまうのも要注意です。",
    hint: "行きたいお店や見たい映画など、小さなわがままをひとつだけ伝えてみてください。合わせ上手なあなたが本音を見せたとき、相手はもっとあなたを知りたくなります。",
  },
  phoenix: {
    catch: "好きがすぐ顔に出る、太陽みたいな恋",
    keywords: ["ストレート", "華がある", "盛り上げ上手"],
    traits: ["好きな気持ちが、すぐ顔や態度に出る", "好きな人の前では、いつも以上に明るくなる", "駆け引きより、ストレートに伝えたい", "盛り上がりが落ち着くと、刺激がほしくなる"],
    charm: "あなたの魅力は、そこにいるだけで場が明るくなる華やかさと、好きな気持ちを隠さないまっすぐさ。「こんなに想われている」と相手を安心させる力があります。人前に出るほど魅力が伝わるタイプなので、出会いの場では遠慮せず主役でいてください。",
    win: "人が集まる場所に出ていくほど、チャンスが増えるタイプ。好きになったら、駆け引きをせずに明るく気持ちを伝えるとうまくいきます。あなたの「楽しい」を一緒に味わえる相手となら、恋は一気に進みます。",
    lose: "盛り上がりが落ち着いたとたんに、退屈を感じてしまうこと。思ったことをすぐ口にして、悪気なく相手を傷つけてしまうのもNGです。自分ばかり話して、相手の話を聞き流していないか気をつけて。",
    hint: "デートの帰りに、相手の話でうれしかったことをひとつ伝えてみてください。あなたの明るさに「ちゃんと聞いてくれる」安心が加わると、恋は長続きします。",
  },
  fox: {
    catch: "じっくり見つめて、静かに深く愛する恋",
    keywords: ["こだわり派", "気がきく", "見極め上手"],
    traits: ["こだわりの趣味が合う人に、ぐっと惹かれる", "相手の何気ないひと言を、よく覚えている", "好きになるまで、じっくり相手を見極める", "心に決めた相手は、深く長く愛し続ける"],
    charm: "あなたの魅力は、言葉にしない気持ちまでくみ取れる観察力。「この人は、私のことをわかってくれる」と感じさせる力は、ほかのタイプにはなかなかありません。その気づきを相手を喜ばせるひと言に変えたとき、あなたは誰かの特別な人になります。",
    win: "時間をかけて信頼を積み重ねるとうまくいきます。相手をよく見て、好きなものや小さな変化に気づいてあげることで、自然と心をつかめます。こだわりの趣味を一緒に楽しめる相手とは、深い関係になれます。",
    lose: "気づきすぎて、相手の気になるところまで見えてしまうこと。口に出せば相手を窮屈にさせ、飲み込めば自分が疲れてしまいます。慎重に観察しているうちに、動くタイミングを逃してしまうのもよくあるNGです。",
    hint: "気づいたことは、ほめ言葉にして伝えてみてください。「その色、似合うね」「今日ちょっと元気ない？」のひと言で、相手はあなたを特別に感じます。",
  },
  panda: {
    catch: "包み込む安心感で、長く愛される恋",
    keywords: ["一途", "面倒見がいい", "がまん強い"],
    traits: ["好きになる人のタイプが、ずっと変わらない", "恋人のことは、つい世話を焼いてしまう", "ドキドキより、安心できる関係を選ぶ", "不満をため込み、限界で一気に爆発しやすい"],
    charm: "あなたの魅力は、相手を丸ごと受け止める包容力と、気分で心変わりしない安定感。付き合うほど良さがわかる、長く愛されるタイプです。頼りがいのある顔だけでなく、たまに甘える姿を見せると、その魅力はさらに深まります。",
    win: "時間をかけて安心感を育てるとうまくいきます。派手なアプローチより、困ったときに頼れる存在でいることで、相手の心をしっかりつかめます。価値観の近い相手となら、長く穏やかな関係を築けます。",
    lose: "世話を焼きすぎて、恋人というより保護者になってしまうこと。不満をため込んで、限界を超えたときに一気に爆発するのもNGです。慣れた場所にこもって、新しい出会いを避けてしまうのも要注意。",
    hint: "たまには、あなたが甘える側に回ってみてください。「今日は話を聞いてほしい」と頼るだけで、相手はあなたの新しい一面に惹かれます。",
  },
  alpaca: {
    catch: "家族みたいに｜大切にする、あたたかい恋",
    keywords: ["献身的", "世話好き", "先回り上手"],
    traits: ["好きな人のために、頼まれる前から動ける", "放っておけない人に、惹かれやすい", "相手のことを、自分のこと以上に気にかける", "尽くしすぎて、自分が疲れてしまいがち"],
    charm: "あなたの魅力は、相手を本気で思いやり、家族のように支えられるあたたかさ。そばにいるだけで「この人となら安心して暮らせる」と思わせる力があります。どこか独特でかわいらしい雰囲気も、あなたが愛される理由のひとつです。",
    win: "日々の小さな気づかいで、少しずつ関係を育てるとうまくいきます。手料理や体調を気づかうひと言など、あなたらしい思いやりが相手の心に残ります。お互いに支え合える、対等な相手を選ぶとうまくいきます。",
    lose: "放っておけない相手に尽くしすぎること。してあげることに慣れて、気づけば我慢ばかりの関係になってしまいます。頼まれると断れず、相手を甘やかしすぎてしまうのもNGです。",
    hint: "相手からの「ありがとう」や手助けを、遠慮せずに受け取ってみてください。尽くす恋から、支え合う恋へ。それが、あなたの恋愛運を引き寄せるいちばんの近道です。",
  },
  doberman: {
    catch: "駆け引きなしの、正直でまっすぐな恋",
    keywords: ["一途", "誠実", "白黒つけたい"],
    traits: ["恋の駆け引きは、とことん苦手", "好きならはっきり伝えたいし、はっきり言ってほしい", "一度決めた相手を、とことん大事にする", "ケンカになると、お互い引けずに長引きやすい"],
    charm: "あなたの魅力は、嘘のない言葉と、一度決めた相手を裏切らない誠実さ。駆け引きをしないぶん、相手は「この人の言葉は信じられる」と安心できます。好みが分かれやすいからこそ、あなたに惹かれた人は、とことんあなたを好きでいてくれます。",
    win: "正直に気持ちを伝えて、はっきりした関係をつくるとうまくいきます。万人に好かれようとせず、素のあなたを好きになってくれる人を選ぶほど、恋はうまくいきます。",
    lose: "白黒つけたいあまり、言い方がきつくなること。自分が正しいと思うと引けずに、ケンカが長引いてしまいます。はっきりしない相手を待ちきれず、早々に見切りをつけてしまうのもNGです。",
    hint: "ケンカになりそうなときは、正しさを伝える前に「どう思った？」と相手の気持ちを聞いてみてください。あなたのまっすぐさが、頼もしさとして伝わるようになります。",
  },
  hedgehog: {
    catch: "特別扱いに弱い、繊細な高嶺の花の恋",
    keywords: ["上品", "照れ屋", "強がり"],
    traits: ["最初は、「近寄りがたい」と思われやすい", "好きな人の前ほど、そっけなくなってしまう", "特別扱いされると、心を開きやすい", "傷つくのが怖くて、平気なふりをしがち"],
    charm: "あなたの魅力は、近寄りがたいほどの上品さと、心を許した相手にだけ見せる繊細さのギャップ。こだわりを持って自分を磨いているぶん、自然と憧れの目で見られています。ほんの少しガードをゆるめるだけで、その魅力はぐっと伝わりやすくなります。",
    win: "あなたを大切に扱ってくれる相手を選ぶのが、いちばんの近道。追いかけるより、丁寧にアプローチしてくれる人に少しずつ心を開いていくほうが、うまくいくタイプです。信頼できた相手とは、深く長い関係を築けます。",
    lose: "傷つくのが怖くて、トゲのある言い方で相手を遠ざけてしまうこと。好きな人にほど冷たくしてしまい、本当は話しかけてほしいのに誰も近づいてこない。そんな状況に陥りがちです。",
    hint: "笑顔で「ありがとう」「うれしい」を口に出してみてください。あなたに憧れていた人が、近づくきっかけをつかめるようになります。",
  },
  orca: {
    catch: "好きになったら一直線、情熱いっぱいの恋",
    keywords: ["自由が好き", "直感型", "懐が深い"],
    traits: ["好きになると、まっすぐ突き進む", "束縛されると、気持ちが離れやすい", "新しいことを、一緒に楽しめる人に惹かれる", "直感で恋に落ちやすい"],
    charm: "あなたの魅力は、好きになったら迷わず飛び込める情熱と、どんな人も受け入れる懐の深さ。一緒にいると新しい世界を見せてくれるので、相手は毎日が楽しくなります。隠しきれない存在感で、出会いのチャンスも自然と多いタイプです。",
    win: "行動力で出会いを広げるとうまくいきます。旅行や新しい趣味など、あなたがワクワクする場所に飛び込むほど、相性のいい相手に出会えます。好きになったら、情熱的なアプローチがよく効きます。",
    lose: "気持ちが先走って、相手のペースを置き去りにすること。束縛や細かい約束が苦手なため、相手を不安にさせてしまうこともあります。勢いで始めた恋を、勢いで終わらせてしまうのもNGです。",
    hint: "好きな人ができたら、一度だけ立ち止まって相手のペースを確かめてみてください。行き先を二人で決めるなど、「一緒に楽しむ」を大切にすると恋は長く続きます。",
  },
  capybara: {
    catch: "そばにいるだけで｜癒しあう、穏やかな恋",
    keywords: ["自然体", "さみしがり", "ため込みがち"],
    traits: ["一緒にいて落ち着ける人を、いちばん大切にする", "好きな人の悩みを、自分のことのように受け止める", "さみしくても、なかなか口に出せない", "平気そうに見えて、心の中にため込みやすい"],
    charm: "あなたの魅力は、そばにいるだけで相手をほっとさせる、やわらかな空気。「この人の前では素の自分でいられる」と思わせる力があります。好きなことに夢中になる姿も、一緒に楽しめる人には大きな魅力です。",
    win: "穏やかな時間を積み重ねて、心の距離を縮めるとうまくいきます。共通の趣味や「好き」を語り合える相手とは、自然と深い関係になれます。焦らず、あなたのペースを大切にしてくれる人を選んでください。",
    lose: "相手に合わせて、自分の気持ちを飲み込み続けること。さみしさや不満をため込んだ結果、ある日突然、心が疲れきってしまいます。相手の感情に引っ張られて、恋をすると気持ちが不安定になりやすいのも要注意です。",
    hint: "「さみしい」「話を聞いてほしい」を、ため込む前に言葉にしてみてください。それはわがままではなく、相手にとってもうれしい頼られ方です。",
  },
};

/** The item (月支の本気 → 通変星), called ギフト on this page and read for love: a second, personal layer on top of the type, so two people of the same type still get different results.
 * Each gift is named as a talent (name, "〜才能"), so it reads as a strength and not as a lucky item; its object is only the motif, shown small as "モチーフ：〇〇".
 * Most motifs are the app's items (ダンベル, 王冠, スマホ, 合鍵, 本); five are swapped for an image that fits the talent better (観覧車, 鉛筆, レンガ, ロケット, 電球).
 * The motif's icon is in love-gift-icon.tsx. */
export const LOVE_GIFTS: Record<TenGod, { name: string; motif: string; title: string; text: string }> = {
  比肩: { name: "自分を磨く才能", motif: "ダンベル", title: "自分を磨くほど、恋が近づく", text: "誰かに頼るより、自分を高めることで魅力が増していく人。仕事や趣味に打ち込む姿に、人は惹かれます。恋に迷ったら、まず自分を磨く時間をとることが近道です。" },
  劫財: { name: "カリスマの才能", motif: "王冠", title: "思わずついて行きたくなる人", text: "自然と人を惹きつける、存在感の持ち主。恋でも、相手の心をぐっと引き寄せられます。ただ、自分の思いが強いぶん、押しが強くなりすぎることも。迷ったときは、信頼できる人に客観的に見てもらうと、自分を出しすぎず、ちょうどいいバランスで恋を進められます。" },
  食神: { name: "楽しむ才能", motif: "観覧車", title: "「一緒にいて楽しい」が｜最大の魅力", text: "楽しいことを見つけるのが上手で、そばにいる人を自然と笑顔にできる人。おいしいものや楽しい場所を一緒に味わう時間が、恋を育てます。デートは、あなたが心から楽しめるプランがいちばんです。" },
  傷官: { name: "表現で魅せる才能", motif: "鉛筆", title: "とがるほど、繊細に描ける", text: "思いを言葉や表現にするのが上手な人。よく削った鉛筆のように、ほかの人には描けない繊細な線で、相手の心に残ります。ただ、とがるほど芯は折れやすいもの。言いすぎたり考えすぎたりしたときは、素直なひと言を添えるだけで印象が変わります。" },
  偏財: { name: "つながる才能", motif: "スマホ", title: "人とのつながりが、出会いを運ぶ", text: "フットワークが軽く、いろいろな人とすぐに打ち解けられる人。出会いの数が多く、思わぬところから恋が始まりやすいタイプです。気になる人には、あなたから軽く声をかけてみてください。" },
  正財: { name: "積み重ねる才能", motif: "レンガ", title: "誠実さで、じわじわ心をつかむ", text: "約束を守り、相手と誠実に向き合える人。派手さより誠実さで、少しずつ相手の信頼を集めていきます。将来を一緒に考えられる、安定した恋で力を発揮するタイプです。" },
  偏官: { name: "動き出す才能", motif: "ロケット", title: "動いた分だけ、恋が動き出す", text: "思い立ったらすぐに動ける行動派。待つより自分から動くほうが、恋はうまくいきます。迷っている時間があるなら、まず一歩。その行動力が、相手には頼もしく映ります。" },
  正官: { name: "信頼される才能", motif: "合鍵", title: "まじめさが、深い信頼に変わる", text: "約束やルールを大切にする誠実さが、相手の安心につながる人。軽いノリの恋より、お互いを信頼し合える真剣な関係で輝きます。「この人なら大丈夫」と思わせる力が、あなたの強みです。" },
  偏印: { name: "ひらめく才能", motif: "電球", title: "人と違う感性が、特別な魅力に", text: "ほかの人とは違う視点を持つ、少しミステリアスな人。趣味や好きなことを通して、価値観の合う相手と深くつながれます。あなたの「好き」を語るほど、それに惹かれる人が現れます。" },
  印綬: { name: "知性で惹きつける才能", motif: "本", title: "話すほど心が通じ合う、知的な恋", text: "学ぶことが好きな、物知りの努力家。話していて刺激をもらえる、尊敬できる相手に惹かれやすい人です。見た目や勢いより、心と心で通じ合える関係を大切にします。相手のやさしさを素直に受け取れるのも、あなたの魅力。学びの場や趣味の講座など、好奇心が満たされる場所に出会いがあります。" },
};

/** The three levels the love page shows, all named positively ("〜相性"). "そこそこ" is left out to keep the result short.
 * The caution partner (foe) is shown openly as the one who takes a little effort and deepens with it, never as a bad match. */
export const LOVE_COMPAT: Record<Exclude<StellaLevel, "mid">, { label: string; note: string }> = {
  best: { label: "最高の相性", note: "自然と惹かれ合う組み合わせ。お互いの足りないところを補い合えます。" },
  good: { label: "心地いい相性", note: "あなたを後ろから支えてくれる相手。そばにいると、自然体でいられます。" },
  foe: { label: "ひと工夫で深まる相性", note: "ペースや考え方が違うからこそ、刺激をくれる相手。少し歩み寄るだけで、ぐっと深い関係になれます。" },
};

/** What the official LINE adds. After the friend add, a form (name, birth date, optional birth time, theme, situation and worry,
 * the ideal, what she is doing toward it, the one thing she most wants to know) leads to a free reading written for her alone.
 * The site reads only the birth day and month, so everything here is type-level; the reading looks at the whole birth date and her situation.
 * The first benefit (恋のブレーキ) is the hook: the form does not ask about it and the site never shows it, so the reading must always cover it
 * (it is also teased in the result: LOVE_TEASERS). The others come from the form and the compatibility shown on the site. It does not promise timing. */
export const LOVE_LINE_BENEFITS = ["あなたが気づいていない、恋のブレーキ", "相性を味方につける、付き合い方のコツ", "今の状況と悩みに合わせた、恋の進め方", "いちばん知りたいことへの、あなただけの答え"];
/** The form asks for the situation in her own words and the reading is written in full, so no step promises a few minutes. */
export const LOVE_LINE_STEPS = ["LINEで｜友だち追加", "今の状況を｜詳しく伝える", "本格鑑定を｜無料でお届け"];

/** Where the result points to what only the reading can tell: after the usual misstep (the call in the middle of the result)
 * It names the first LINE benefit at the moment she wants it most. */
export const LOVE_TEASERS = {
  brake: { label: "公式LINEの無料鑑定で", title: "あなたが気づいていない、｜恋のブレーキ", text: "やりがちなNGは、同じキャラの人に共通する傾向です。あなた自身が無意識にかけている恋のブレーキは、生まれた年・月・日のすべてと、今の状況まで読み解いて、はじめて見えてきます。" },
};

/** The fortune teller who devised Stella File and writes the LINE reading: ホシヨミ, with their icon (public/hoshiyomi.webp, 320px, from the approved artwork).
 * Called the creator (考案者) of Stella File, never a supervisor (監修). Shown as a signature on the result card, in the LINE invitation,
 * in reason 2 and in the footer (not in the hero). The facts are as the fortune teller gave them: no calendar years, and the 占い館 itself is not named.
 * Worded as on ホシヨミ's Threads profile (hoshiyomi.stella), except the count, which ホシヨミ gives as 鑑定数3,000件以上: 政財界・芸能人・インフルエンサーの診断歴, 原理原則に基づく由緒正しき方法.
 * Update them here and in the reasons on the page if they change. */
export const LOVE_READER = {
  name: "ホシヨミ",
  icon: "/hoshiyomi.webp",
  role: "ステラファイル考案者",
  stats: [["10年", "東洋の占術"], ["3,000件以上", "鑑定数"], ["月間1位", "占い館の売上"]] as [value: string, label: string][],
  note: "政財界・芸能人・インフルエンサーの診断歴あり。｜原理原則に基づく由緒正しき方法で、｜あなたに良縁を引き寄せます。",
};
