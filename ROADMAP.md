# Issuely Roadmap

Bu belge, projenin mevcut durumunu ve yol haritasını özetler. Claude Code ile devam ederken bu dosyayı bağlam olarak verebilirsin (örn. "Roadmap'teki Faz 2'yi yap").

---

## Mevcut Durum (v0.6)

### Tamamlanmış Bölümler

- **Sayı çalışma alanı** (sol kenar gezinme, ana içerik paneli, üst başlık)
- **i. Kapak** — A4 oranlı canlı önizleme, tematik odak / sezon / yayın tarihi düzenleyicileri
- **ii. Jenerik** — 12 alanlı künye editörü (yayıncı TR/EN, adres, iletişim, web, eISSN, sıklık, diller, lisans, hakemlik modeli, APC)
- **iii. Editör Kurulu** — Hiyerarşik 5 grup: Baş Editör (Erhan Yaylak seed'lendi), Yardımcı Editörler, Bölüm Editörleri (alan/section sütunu var), Yayın Kurulu, Uluslararası Danışma Kurulu
- **iv. İndeks Bilgisi** — İki sütunlu durum yönetimi (Dizinlenenler vs Başvuru Aşamasında)
- **v. İçindekiler** — Makalelerden otomatik üretilen, krem kâğıt zeminli TOC önizlemesi
- **1. Makaleler** — Sürükle-bırak sıralama, otomatik sayfa aralığı + DOI yeniden hesaplama (`10.29329/pedper.2026.5.1.NN`), TR/EN başlık inline edit, satır genişletme ile ORCID/anahtar kelime/tür düzenleme
- **vi. Sayı Hakemleri** — Türkçe locale ile soyada göre alfabetik sıralı liste, ülke sütunu, 20 hakem seed
- **Frontmatter DOCX üretici** — Tüm bölümleri Word-uyumlu HTML formatında birleştirip indirilebilir `.doc` dosyası üretir
- **AI sayı tanıtım paragrafı** — Makale başlık + anahtar kelimelerden Claude API ile TR + EN draft üretici (Cloudflare Pages Function proxy üzerinden)
- **Crossref XML deposit üretici** — Tüm makalelerin Crossref schema 5.3.1 uyumlu `doi_batch` XML'i. Yazar/ORCID, sayfa aralığı, DOI, yayın tarihi, resource URL otomatik doldurulur. Geçersiz ORCID'ler ve boş İngilizce başlıklar zarif şekilde atlanır. İstemci taraflı üretim — server gerekmez.
- **Kapak Görseli PNG üretici** — 1200×1697 px (A4 oranı) yüksek-DPI Canvas render. Lacivert gradient arka plan, Fraunces italic başlık (auto-shrink fit), JetBrains Mono eISSN + tematik odak (uppercase, word-wrap), büyük cilt/sayı tipografisi, sezon + yıl alt satır, gold dairesel rozet, alt-sağda dev faded cilt numarası. `document.fonts.load` ile font yükleme garantili. OJS/DergiPark yüklemesi için hazır.

### Mimari

- **Frontend:** React 18 + Vite, tek dosya `src/App.jsx` (~1500 satır)
- **Stil:** Inline styles, Tailwind yok. Lacivert (#0B1220) + altın (#D4A84A) palet. Fraunces (display italik) + DM Sans (body) + JetBrains Mono (DOI/sayfa) tipografisi.
- **Backend:** Cloudflare Pages Function `functions/api/claude.js` — generic Anthropic proxy. Yeni AI özellikleri için ayrı endpoint gerekmez.
- **State:** useState, henüz kalıcılık yok (sayfa yenilenince sıfırlanır). Seed datası: PedPer Vol. 5 No. 1 (2026), 19 makale.

---

## Yol Haritası

### Faz 2 — Crossref XML Deposit Üreticisi ✅ TAMAMLANDI (v0.5)

DOI tescili için her makaleye ait Crossref schema 5.3.1 XML'i üretir. Sol kenardaki "Çıktılar" panelinde "Crossref XML" butonu aktif. Tamamen istemci tarafında üretilir (Cloudflare Function gerekmez).

**Çıktı yapısı:**
- `doi_batch` (5.3.1 schema, version="5.3.1")
- `head` → batch_id (unique timestamp+rand), timestamp (YYYYMMDDhhmmss), depositor (masthead.publisherEn + contactEmail), registrant
- `body/journal/journal_metadata` → full_title, abbrev_title, electronic ISSN
- `body/journal/journal_issue` → publication_date, journal_volume, issue
- Her `journal_article` → titles (TR primary + EN as `original_language_title`), contributors (person_name + ORCID), publication_date, pages, doi_data (DOI + resource URL)

**Edge case'ler:**
- Geçersiz ORCID format → ORCID elementi atlanır
- Boş İngilizce başlık → `original_language_title` atlanır
- Özel karakterler (`&`, `<`, `>`, `'`, `"`) doğru escape edilir
- Resource URL: `{masthead.website}/articles/{doi-tail}` — kullanıcı landing-page URL formatına göre elle güncelleyebilir

**Doğrulama önerisi:** <https://www.crossref.org/02publishers/parser.html> ile şema doğrulaması, DergiPark/Crossref Direct Deposit'e elle yükleme öncesi.

### Faz 3 — Kapak Görseli PNG ✅ TAMAMLANDI (v0.6)

1200×1697 px (A4 oranı) yüksek-DPI PNG render. HTML5 Canvas, manuel text + shape çizimi (paket bağımlılığı yok). `document.fonts.load()` ile Fraunces + JetBrains Mono font yüklemesi garantili. Tasarım önizlemeyle aynı: lacivert gradient + altın aksanlar.

**Çıktı kompozisyonu:**
- Üst: eISSN (mono, gold-dim) → italic Fraunces title (auto-shrink fit) → italic subtitle (textDim)
- Sağ üst köşe: dairesel rozet (`shortName[0]`, italic Fraunces)
- Alt: tematik odak (uppercase mono, gold, word-wrap) → `Vol. X No. Y` (paper + italic gold karışık) → `Sezon Yıl` (italic, textDim)
- Dekoratif: alt-sağda dev faded cilt numarası (Fraunces 380px, 6% opaklık), üstte gold accent şeridi, sezon altında kısa altın çizgi

**Dosya:** `{shortName}_Vol{V}_No{N}_{Year}_Cover.png`

### Faz 4 — LinkedIn Promosyon Kartları 🎯 SIRADAKİ

Her makale için ayrı 1200×1200 px sosyal medya kartı. Başlık + yazar + DOI + sayı bilgisi.

**Teknik:**
- 19 ayrı Canvas render
- JSZip ile tek `.zip` paket içinde indirilir
- Caption metinleri Claude API ile her kart için ayrı üretilir

### Faz 5 — IndexedDB Kalıcılık

Sayfayı yenilediğinde verinin kaybolmaması için. Tüm state (issue, articles, board, reviewers, indexing, cover, masthead) IndexedDB'ye yazılır. `idb-keyval` paketi yeterli.

### Faz 6 — Çoklu Dergi / Çoklu Sayı Yönetimi

BYDK koordinatörü olarak PedPer + ODÜSOBİAD + diğerlerini aynı çatı altında. Her dergi kendi DOI prefix'ini, marka rengini, kurulunu, indeks listesini taşır. Geçmiş sayılar arşivlenebilir, yan yana karşılaştırılabilir.

**Teknik:**
- Üst başlıkta dergi switcher
- Dergi profili düzenleme paneli (şu an sadece header'da stub buton var)
- Sayı listesi sidebar (taslak, yayında, arşiv durumu)
- Veri modeli: `journals[]` ve `issues[]` IndexedDB'de ayrı stores

### Faz 7 — Tam Paket ZIP

Frontmatter DOCX + Kapak PNG + LinkedIn kartları + Crossref XML → tek `.zip` indirme. "Bu sayıyı yayına almak için ihtiyacın olan her şey" paketi.

### Faz 8+ — Daha Uzak Vade

- OJS/DergiPark API entegrasyonu (mevcut sayı verisini çekme)
- Hakem teşekkür e-postası taslakları (kişiselleştirilmiş)
- Çıkar çatışması kontrolü (yazar-hakem örtüşmesi uyarısı)
- Dergindex entegrasyonu (mevcut sayıyla derginin indekslenme hazırlık skoru)
- Yayın öncesi kalite kontrol checklist'i (eksik ORCID, hatalı DOI, sayfa bütçesi)
- AI özellikleri: Makale özeti draft, hakem davet e-postası, basın bülteni

---

## Tasarım Kararları (Neden böyle yapıldı?)

- **Tek dosya `App.jsx`:** Modülerleştirilmedi çünkü artifact iterasyonundan geldi ve refactor maliyeti bu boyutta düşük. Faz 5'ten önce src/components/, src/hooks/, src/utils/ olarak parçalamak mantıklı olur.
- **Inline styles, Tailwind yok:** Artifact ortamı kısıtlaması nedeniyle başladı. Production'da CSS Modules veya Tailwind'e geçiş seçenek.
- **Generic `/api/claude` proxy:** Yeni AI özellikleri için yeni endpoint açmaya gerek olmaması için. Frontend prompt'u inşa eder, server dümdüz proxy.
- **Word HTML formatı (.doc):** Artifact ortamında `docx` paketi yoktu, OOXML manuel inşa karmaşıktı. Word ve LibreOffice doğrudan açar, "Save As .docx" mümkün. Production'da gerçek docx-js'e geçiş seçenek (Node.js Function olarak).
- **PedPer seed verisi:** Demo için sabit. Faz 5'te kullanıcı kendi verisini girer veya OJS'ten çeker.

---

## Karşılaşabileceğin Sorunlar

- **Sayfa yenilenince veriler kayboluyor:** Beklenen — Faz 5'te IndexedDB ile çözülür.
- **AI butonu yerel'de hata veriyor:** Beklenen — `npm run dev` Cloudflare runtime'ı simüle etmez. `npm run dev:cf` (wrangler ile) kullan veya production'da test et.
- **Frontmatter DOCX'i Word açınca "format uyumsuz" uyarısı:** Normal, "Yes" de ve dosya açılır. Kaynağında HTML olduğu için Word bir kez "Save As .docx" yaparsan gerçek OOXML'e döner.
- **Tipografi index.html ve App.jsx'te iki kez yükleniyor:** Marjinal performans kaybı, zararsız. App.jsx'teki useEffect'i kaldırabilirsin.
