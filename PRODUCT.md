# Product

## Register

product

## Users

Akademik dergi editörleri ve yardımcı editör kurulu üyeleri. Birincil persona: kıdemli akademisyen / yardımcı doçent / doçent, sosyal bilimler odaklı, Türkiye'deki bir üniversite yayını yönetiyor. Her sayı için kapak, jenerik, editör kurulu listesi, içindekiler, indeks, hakem listesi ve makale sıralaması üretmek zorunda. Şu anda bu işleri Word + Excel + el yapımı XML ile yapıyor. Crossref deposit, DOI desenleri, ORCID alanları, ISSN ile çalışmaya alışkın. Hız ve doğruluk birlikte önemli; bir DOI yanlış olsa Crossref tarafından reddediliyor.

Bağlam: ofiste/evde, masaüstü Windows veya Mac ekranı (24"+), tek başına çalışır, dikkat süresi uzun. Yıl içinde sayı dönemlerinde (4-12 hafta) yoğun, ara dönemlerde uyur. Genelde MS Word açık paralel.

## Product Purpose

Akademik bir dergi sayısının "baskıya hazırlama" iş akışını tamamen yazılım üzerine taşımak. Manuel kopyala-yapıştır, Excel'de sayfa hesaplama, DergiPark formuna XML doldurma gibi zaman alan ve hataya açık adımları otomatik hale getirmek. Çıktı: Word DOCX (frontmatter), Crossref deposit XML, PNG kapak görseli, AI destekli sayı tanıtım paragrafı.

Başarı = bir editörün bir sayıyı 4 saatte değil 40 dakikada baskıya hazırlaması; sayı yayımlandıktan sonra Crossref red oranının sıfıra inmesi; LinkedIn paylaşımları için içerik üretmek gibi yan akışların aynı veriden çıkması.

Şu an Pedagogical Perspective (Vol. 5) için aktif kullanımda. Yol haritası: çoklu dergi profili, ekip rolleri, beyaz etiket.

## Brand Personality

Klinik. Editoryal. Güvenilir.

- **Klinik**: kararlı boşluk, tek vurgu rengi (deep gold), serif başlıklar mat ve düz. Hiçbir efekt boş yere yer kaplamaz.
- **Editoryal**: bir matbaa/dizgi atölyesi gibi konuşur — "sayı", "jenerik", "yer-baskı", "yayın sıklığı". Marketing dili değil yayıncılık dili kullanır.
- **Güvenilir**: Crossref/ORCID/ISSN standartlarına net referans verir, açık kaynak kabuğu (open access) işaret eder, akademik versiyonlama (v0.5, v0.6) görünür. Stock fotoğraf, gülümseyen pose, "AI magic" üslubu yok.

Sesi tek bir kelime ile: **dingin otorite**. Açıklama yapar, mazeret aramaz, satmaz.

## Anti-references

Bilinçli olarak kaçınılması gereken estetikler:

- **Animasyonlu/parıltılı startup look**: gradient text, glassmorphism, glow halkaları, neon kenarlar, hover'da yer değiştiren ışık efektleri, infinite scrolling carousel. ISSUELY 5 saniyede dikkat çekmek için varolmayan, yıllardır yayında olan dergiler için bir araç.
- **Generic AI SaaS (Notion/Linear klonu)**: beyaz arka plan + büyük serif başlık + 3×2 özellik kart grid'i + "Trusted by" logo bar + gradient CTA. Bu kalıp Türkiye dahil dünyaya yayıldı; ISSUELY bir tane daha olmamalı.
- **DergiPark estetiği**: tablo bazlı layout, Times New Roman, renkli badge'ler, kırmızı zorunlu işaretler, ortalanmış formlar. Akademik camianın gördüğü "akademik" görünüm, ama saygısız ve eski.
- **Web 1.0 akademik personal page**: koyu mavi link rengi, sol sidebar nav, alt sağda "© Üniversite 2026", justify text. ISSUELY'nin sahibi bir akademisyen ama ürün öyle değil.
- **"AI magic" görsel dili**: yıldız parıltısı, mor-pembe gradient, glowing particle, sparkle ikon spam'i. AI özellikleri ISSUELY'de var ama vurgu sessiz olmalı.

Doğru lane (ilham): **editorial-typographic + library catalog**. Müze yayını + üniversite press estetiği + The New York Review of Books. Boşluk lüks, italik vurgu, yazılı dergi mizanpajı kuralları.

## Design Principles

1. **Type carries weight, not effects.** Hiyerarşi tipografi ve boşlukla kurulur. Animasyon, gradient, neon ile değil. Bir başlık ne büyüklükte olursa olsun mat bir gri-koyu indigo olmalı, italik aksesuar opsiyoneldir.

2. **Bibliographic specificity over marketing claims.** "10x daha hızlı" yerine "Crossref 5.3.1 deposit şeması · ORCID v3 alan desteği". Sayı, isim, standart referansı — pazarlama sloganı değil.

3. **The product is the demo.** Hero alanında stock illustration veya soyut shape yerine gerçek bir TOC sayfası, gerçek bir DOI deseni, gerçek bir Crossref XML snippet. Ürün ne yapıyor görünüyor.

4. **Quiet authority over loud claims.** v0.5 BETA chip'i göster, başarı oranı abartma, müşteri logosu sıralamasını performansa çevirme. Bir kütüphane veya bir matbaa nasıl konuşursa öyle konuş.

5. **Editorial rhythm, not screen rhythm.** Section'lar bir gazete/derginin sütunları gibi düşünülsün — geniş margin, asimetrik düzen, sayı/Roman rakamı işaretçileri, sayfa-sonu izlenimi. Web sayfası değil yayın sayfası gibi.

## Accessibility & Inclusion

- **WCAG AA** zorunlu (Türkiye kamu üniversite kullanımı; akademik camianın yaşlı kullanıcıları için kontrast kritik).
- Renk körlüğü için: deep gold (#A47929) tek vurgu rengi olduğu için yalnızca renkle bilgi taşıma yasak — her zaman ikon + text + renk üçlüsü.
- `prefers-reduced-motion: reduce` desteklenmeli. Mevcut framer-motion animasyonları reduce ile %0 duration'a inmeli.
- Body line-height 1.6+, font-size en az 15px (akademik kullanıcı yaşı yüksek).
- TR/EN bilingual; metin alanları sözcük taşmalarına dayanıklı (Türkçe sözcükler İngilizce eşdeğerinden ortalama %20 uzun).
- Klavye navigasyonu: tüm interaktif öğeler tab-erişilebilir, focus ring deep gold ile.
