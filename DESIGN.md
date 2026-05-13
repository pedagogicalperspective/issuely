# Design

## Concept

**Editorial-typographic + library catalog.** Bir akademik yayıncı'nın iç kapağı, university press kataloğu, The New York Review of Books'un mizanpajı ile aynı dilden konuşur. Web sayfası değil, yayın sayfası gibi okunur. Sayı/Roman rakamı işaretleyici, italik kayıt, geniş kenar boşluğu, asimetrik tek-sütun ve iki-sütun karışımı.

Color strategy: **Committed.** Tek baskın renk (deep gold), klinik soğuk gri-mavi neutrals üzerinde %30-50 yer kaplar. Bu Restrained değil — gold sadece accent değil, görsel anchor. Aynı zamanda paper-cream (#F4EFE3) gibi sıcak surface variantları büyük bloklarda kullanılır.

Theme: **Light dominant, ama nötr beyaz değil.** Sahne cümlesi: *"Bir akademisyen sabah 9'da ofiste, doğu ışığı odaya vurmuş, masada açılmış bir dergi sayısı ve laptop yan yana — dergi sayfası ve ekran tek bir doku gibi gözükmeli."* Bu zorlar: pure white değil, paper-cream warmth. Dark mode YOK (bu surface). App tarafında ayrı tartışılır.

## Color Tokens

OKLCH'de yazılır; hex'e dönüştürülmüş referans değerler:

```
--paper      oklch(94.5% 0.018 78)    /* #F4EFE3 — primary surface, library paper */
--paper-2    oklch(96.2% 0.012 80)    /* #F8F4EA — softer surface variant */
--paper-3    oklch(91.8% 0.022 76)    /* #EAE2D0 — divider, table stripe */
--ink        oklch(22% 0.020 252)     /* #1A2030 — primary text, near-black with navy hint */
--ink-2      oklch(36% 0.018 250)     /* #3D4658 — secondary text */
--ink-3      oklch(54% 0.014 248)     /* #6B7385 — tertiary, captions */
--ink-4      oklch(72% 0.010 246)     /* #A6ABB8 — borders, placeholder */
--gold       oklch(56% 0.092 78)      /* #A47929 — accent, deep gold (existing) */
--gold-deep  oklch(42% 0.082 76)      /* #6E531C — gold variant for borders/labels */
--gold-soft  oklch(56% 0.092 78 / .08) /* gold accent surface tint */
--rule       oklch(36% 0.018 250 / .14) /* fine horizontal rules, like printed pages */
```

**Bans for this design**:
- Pure `#000000` veya `#ffffff` — neutrals daima tinted.
- Sky blue, teal, mor, pembe, neon green: yok. Tek vurgu = deep gold.
- Gradient text: hiçbir koşulda. Gradient background: yalnızca paper→paper-2 gibi 2°lik subtle radial geçişler.

## Typography

Üç font; rolleri katı:

```
Fraunces   — display, başlıklar, italik vurgu (opsz 9..144)
Source Serif 4 — body uzun metin (>40 kelime), section gövdeleri
DM Sans    — UI etiketleri, butonlar, navigation, sayısal veriler
JetBrains Mono — DOI deseni, eISSN, technical chip'ler, ASCII
```

**Mevcut Landing.jsx'te DM Sans body için kullanılıyor — KALDIR.** Body için Source Serif 4 kullan; DM Sans yalnızca etiket/buton/UI metin'inde kalır. Bu, editorial register'a sadakatin başlıca işareti.

Scale (1.25 ratio, geniş aralık):

```
display-xxl  88px / 0.95 / Fraunces 500
display-xl   64px / 1.00 / Fraunces 500
display-l    44px / 1.05 / Fraunces 500
heading-l    28px / 1.15 / Fraunces 600
heading-m    20px / 1.30 / Fraunces 600
body-l       19px / 1.55 / Source Serif 4 400
body         16px / 1.65 / Source Serif 4 400
caption      13px / 1.55 / DM Sans 500
label        11px / 1.40 / DM Sans 600 / letter-spacing 0.12em / uppercase
mono         12px / 1.45 / JetBrains Mono 500
```

Italik kullanım: cilt/sayı numaraları, kategori etiketleri, "an open-access journal of...". Sürekli italik değil — vurgu için.

## Spacing & Rhythm

Editorial sayfalama: bölümler eşit aralıklı değil. **Asimetrik dikey ritim.**

```
xxs   4px   — chip/inline gap
xs    8px   — icon-to-text
s     16px  — paragraph internal
m     24px  — between elements
l     48px  — between subsections
xl    80px  — between major sections (hero → features)
xxl   128px — section'lar arası tam dergi sayfası ayrımı
```

Major section padding (vertical) varyasyon: bir section 80px, sonraki 128px, sonraki 96px — düz değil. Bir dergi sayfasının "soluk alan" mantığı.

Container: max-width 1180px, ama içerik kolonu çoğu zaman 720-840px (akıcı okuma için). Geniş margin = lüks.

## Layout Patterns

### Hero
- Tek kolon, sol-hizalı (centered DEĞİL). Display-xxl başlık (Fraunces, italic vurgu opsiyonel) sayfanın solunda.
- Sağ tarafta tek bir gerçek artefakt: bir TOC paper mockup, FULL OPACITY, gradient/blur YOK. Gerçek bir Pedagogical Perspective sayısı sayfası gibi göründü.
- Hero alanı altında ince yatay rule (`--rule`), Roman numerali "I" işaretçisi sonraki section'a.

### Sections
- "Card grid" YERINE **alternating columns**. Bir section sol kolonda title + 2-3 paragraf prose, sağ kolonda örnek artefakt; sonraki section tersine çevrilir.
- Numaralama: Roman numeralleri (I, II, III, IV...) sol kenarda büyük italik Fraunces.
- Bölüm başlığı altında ince paragraflı kicker (caption boyu, DM Sans label).

### TOC / Lists
- Her zaman dergi içindekiler tablosu gibi: sol kolonda numara (mono), orta'da başlık + italik yazar, sağda sayfa/DOI.
- Dotted leader (Word'deki `………` gibi) yerine ince `--rule` line.

### Pricing
- 3-card grid YASAK. Alternative: tek bir **prose-style table**. Editör (free) — Yayıncı (paid) — Kurumsal (talk to us) tek bir matris satırında karşılaştırılır. "Most popular" badge yok.

### CTA
- Standalone large CTA section yerine: header'a kalıcı sticky CTA (small), bir de sayfa sonunda **footer öncesi inline paragraph CTA** — büyük başlık + paragraf prose içinde gömülü inline link.

## Components

### Buttons

Primary: `--ink` background, paper text, 1px ink border. Hover: subtle 4% opacity reduction (warm-fade). Radius **4px** — köşeli, matbaa hissi.

Secondary: paper background, 1px ink-3 border. Hover: paper-2 background.

Tertiary (text-only): underline thin, gold-deep color. Underline 1px, offset 2px.

**Tüm butonlar 14px DM Sans 600.** Gradient yok, glow yok, shadow yok. Border-radius 4px (mevcut 8-10px'i değiştir).

### Chips / Pills

`--gold-soft` background, `--gold-deep` border (1px), `--gold-deep` text. JetBrains Mono 10px uppercase. Radius 2px (ya da 999 = pill). Editorial: Roman numerali işaretçi olarak da kullanılabilir.

### Cards

**Use only when truly the best affordance.** Mevcut features section'daki kartları kaldır. Yerine: ardışık prose blokları, her biri sayı işaretçili.

Eğer card kullanılıyorsa (rare): tek border 1px `--ink-4`, no shadow, no rounded > 4px, padding 32px+, internal divider line.

### Forms (App tarafı için, ayrı task)

Stripe & Linear referans alınır ama editorial dokunuş: label'lar JetBrains Mono uppercase, input'lar borderless underline-only (`border-bottom: 1px solid --ink-4`).

## Motion

**Energy: low. Purposeful.**

- Section transition: 200ms ease-out-quart fade + 4px translateY. Hiçbir spring/bounce.
- Hover: 120ms opacity/background fade. Hiçbir scale/translate hover effect ana yüzeyde.
- Scroll-driven: hero TOC mockup hafif parallax (max 40px translateY, mouse-tracking değil scroll-tied).
- `prefers-reduced-motion: reduce` ile tüm duration 0.01s.

**Yasaklar**: bounce, elastic, spring with overshoot, infinite loops (loaderlar hariç), AOS-style "data-aos=fade-up" zincirleri.

## Anti-patterns (özet)

- Beyaz background + büyük serif headline + 3×2 feature cards = generic AI SaaS. **NE YAPMA**.
- Animated gradient background, glassmorphism, glow. **NE YAPMA**.
- "Trusted by [logos]" carousel. **NE YAPMA**.
- "Get started for free →" gradient button. **NE YAPMA**.
- Icon + Heading + 2 line description cards. **NE YAPMA**.
- Background blur'lu floating shape'ler. **NE YAPMA**.
- Em dash kullanma — virgül, iki nokta veya parantez kullan.
- Border-left 4px gold accent on cards. **NE YAPMA** (absolute ban).

## Implementation Notes

- Vite + React + inline styles (mevcut yapı korunur)
- CSS custom properties root'a inject; inline styles var(--gold) gibi referans
- framer-motion var ama overuse YASAK — yalnızca section transition + page mount fade
- Lucide-react ikonları korunur ama stroke 1.2 (mevcut 1.6 yerine, ince akademik look)
