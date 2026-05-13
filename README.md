# Issuely

Dergi sayısı oluşturma çalışma alanı — editörler için frontmatter (kapak, jenerik, editör kurulu, indeks, içindekiler, hakemler) ve makale yönetimi (sürükle-bırak sıralama, otomatik sayfa/DOI hesaplama).

**Stack:** React 18 + Vite · Cloudflare Pages (statik hosting + serverless functions)
**AI:** Anthropic Claude (sayı tanıtım paragrafı taslağı için)
**Çıktılar:** Frontmatter DOCX (Word HTML formatı), AI destekli intro paragrafları

---

## Yerel Geliştirme

```bash
npm install
npm run dev
```

Vite dev sunucusunu başlatır (`http://localhost:5173`). **Frontmatter DOCX** üretimi yerel olarak çalışır. **AI sayı tanıtım** üretimi yerel olarak çalışmaz çünkü Cloudflare Pages Function gerektirir (aşağıya bakın).

### Yerel olarak AI özelliğini de test etmek için

```bash
npm install -g wrangler
cp .dev.vars.example .dev.vars
# .dev.vars dosyasını aç ve ANTHROPIC_API_KEY değerini gerçek anahtarla değiştir
npm run dev:cf
```

Bu, Cloudflare Workers runtime'ını yerel olarak çalıştırır ve `/api/claude` endpoint'i çalışır hale gelir. `.dev.vars` dosyası `.gitignore`'da olduğu için GitHub'a yüklenmez.

---

## Cloudflare Pages'e Deploy

Presubly ve MisanpAIge ile aynı süreç:

1. **GitHub repo oluştur** ve bu projeyi push et:
   ```bash
   git init
   git add .
   git commit -m "Initial Issuely setup"
   git branch -M main
   git remote add origin git@github.com:<kullanici>/issuely.git
   git push -u origin main
   ```

2. **Cloudflare Pages dashboard** → Create application → Pages → Connect to Git → GitHub repo'yu seç

3. **Build settings:**
   - Framework preset: `None` (veya `Vite` varsa)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (boş bırak)

4. **Environment variables** (Settings → Environment variables):
   - Variable name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-...` (Anthropic Console'dan al)
   - **Encrypted/Secret olarak işaretle** (önemli — production + preview için)

5. **Deploy.** Build tamamlanınca `https://issuely-xyz.pages.dev` adresinde yayında.

### Özel Domain

Cloudflare Pages → Custom domains → Set up a custom domain. Örnek:
- `issuely.com` (kök domain)
- `issuely.pedagogicalperspective.com` (subdomain — DNS'de CNAME kaydı eklersin)

---

## Proje Yapısı

```
issuely/
├── index.html              # Vite giriş HTML'i, Google Fonts yüklemesi
├── package.json
├── vite.config.js
├── .gitignore
├── .dev.vars.example       # Yerel API anahtarı şablonu
├── src/
│   ├── main.jsx            # React giriş noktası
│   └── App.jsx             # Ana Issuely bileşeni (~1500 satır, tek dosya)
└── functions/
    └── api/
        └── claude.js       # Cloudflare Pages Function — Anthropic proxy
```

---

## AI Endpoint API

```
POST /api/claude
```

**Request:**
```json
{
  "prompt": "...",
  "model": "claude-sonnet-4-6",
  "max_tokens": 1500
}
```

`model` ve `max_tokens` opsiyoneldir. Varsayılan: `claude-sonnet-4-6` modeli, 1500 token.

**Response (başarılı):**
```json
{
  "text": "AI tarafından üretilen metin...",
  "usage": { "input_tokens": 245, "output_tokens": 187 }
}
```

**Response (hata):**
```json
{ "error": "Açıklama", "status": 401, "details": "..." }
```

### Yeni AI Özellikleri Eklemek

Endpoint generic olarak tasarlandı; yeni AI özellikleri için ayrı endpoint gerekmez. Frontend'de yeni bir prompt hazırlayıp aynı `/api/claude` adresine POST atarsın. LinkedIn caption üretimi, makale özet draft'ı, hakem teşekkür e-postası vb. hepsi aynı proxy üzerinden çalışır.

---

## Model Sürümü Güncellemesi

Anthropic yeni model sürümleri yayınladıkça `App.jsx` içindeki `model: "claude-sonnet-4-6"` ve `functions/api/claude.js` içindeki `DEFAULT_MODEL` değerini güncelle. Güncel model isimleri için [docs.claude.com](https://docs.claude.com).

---

## Sorun Giderme

**AI butonu "API yanıt vermedi (500)" hatası veriyor:**
Cloudflare Pages → Environment variables'da `ANTHROPIC_API_KEY` tanımlı mı? Encrypted/Secret olarak işaretli olmalı, production VE preview ortamlarına da eklenmiş olmalı.

**AI butonu "API yanıt vermedi (401)" hatası veriyor:**
API anahtarı geçersiz. Anthropic Console'dan yeni anahtar oluştur ve env var'ı güncelle.

**Yerel `npm run dev` çalışıyor ama AI butonu hata veriyor:**
Beklenen davranış — `npm run dev` Cloudflare runtime'ı simüle etmez. AI'yı yerel test için `npm run dev:cf` kullan veya production'da test et.

**Build başarısız oluyor:**
Node sürümünü kontrol et (`node -v`). Vite 5 için Node 18+ gerekir. Cloudflare Pages → Settings → Environment variables → `NODE_VERSION=20` ekleyebilirsin.

---

## Lisans

İç kullanım — Doç. Dr. Erhan Yaylak / Ordu Üniversitesi BYDK.
