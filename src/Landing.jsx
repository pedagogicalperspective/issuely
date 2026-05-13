import { useEffect, useState } from 'react';
import {
  BookOpen, FileCode2, FileText, Layout, Sparkles, GripVertical,
  ArrowRight, Check, Hash, Users, ScrollText, Database, Mail,
  Github, Globe, ChevronRight
} from 'lucide-react';

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

const C = {
  bg: '#FFFFFF',
  surface: '#FAFBFC',
  surfaceAlt: '#F1F4F8',
  border: '#E2E5EB',
  borderSoft: '#EDF0F4',
  text: '#1A1F2E',
  textDim: '#475569',
  textMuted: '#94A3B8',
  gold: '#A47929',
  goldDim: '#6E531C',
  goldGlow: 'rgba(164, 121, 41, 0.08)',
  paper: '#F4EFE3',
  coverInk: '#F4EFE3',
  ink: '#0B1220',
  inkSoft: '#111827',
};

const SERIF = 'Fraunces, "Source Serif 4", Georgia, serif';
const SANS = '"DM Sans", system-ui, -apple-system, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const openApp = (e) => {
  e?.preventDefault?.();
  window.location.hash = '#/app';
};

// =====================================================
// Navbar
// =====================================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'saturate(180%) blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(12px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
      transition: 'all .2s ease',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <a href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = '#/'; window.scrollTo({ top: 0 }); }}
           style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.text }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `linear-gradient(135deg, ${C.ink} 0%, ${C.gold} 130%)`,
            display: 'grid', placeItems: 'center', color: '#fff', fontFamily: SERIF, fontWeight: 700, fontSize: 18, letterSpacing: -0.5,
          }}>I</div>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 22, letterSpacing: -0.5 }}>Issuely</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: C.gold, border: `1px solid ${C.gold}`, padding: '2px 6px', borderRadius: 4, letterSpacing: 0.5 }}>BETA</span>
        </a>

        <nav style={{ display: 'flex', gap: 28, marginLeft: 'auto', alignItems: 'center' }} className="ily-nav">
          <a href="#features" style={navLink}>Özellikler</a>
          <a href="#workflow" style={navLink}>Nasıl Çalışır</a>
          <a href="#pricing" style={navLink}>Fiyatlandırma</a>
          <a href="#faq" style={navLink}>SSS</a>
          <a href="#/app" onClick={openApp} style={ctaPrimary(0)}>
            Editöre git <ArrowRight size={14} strokeWidth={2.4} />
          </a>
        </nav>
      </div>
    </header>
  );
}
const navLink = { fontFamily: SANS, fontSize: 14, fontWeight: 500, color: C.textDim, textDecoration: 'none', transition: 'color .15s' };

// =====================================================
// Hero
// =====================================================
function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${C.borderSoft}` }}>
      {/* Subtle background grid */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          `radial-gradient(1100px 500px at 80% -10%, ${C.goldGlow}, transparent 60%),
           linear-gradient(${C.borderSoft} 1px, transparent 1px),
           linear-gradient(90deg, ${C.borderSoft} 1px, transparent 1px)`,
        backgroundSize: 'auto, 56px 56px, 56px 56px',
        maskImage: 'radial-gradient(900px 600px at 50% 30%, #000 60%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(900px 600px at 50% 30%, #000 60%, transparent 100%)',
        opacity: 0.7,
      }} />

      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '88px 24px 96px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 56, alignItems: 'center' }} className="ily-hero">
        {/* Left — copy */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 999, fontFamily: MONO, fontSize: 11, letterSpacing: 0.5, color: C.goldDim, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold }} />
            DERGI SAYISI HAZIRLAMA · v0.5
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 1.02, fontWeight: 500, letterSpacing: -1.5, margin: 0, color: C.text }}>
            Dergi sayısı, <em style={{ fontStyle: 'italic', fontWeight: 500, color: C.gold }}>dakikalar</em><br />
            içinde derlenir.
          </h1>

          <p style={{ fontFamily: SANS, fontSize: 18, lineHeight: 1.6, color: C.textDim, marginTop: 24, maxWidth: 540 }}>
            Kapaktan jeneriğe, editör kurulundan içindekiler tablosuna — frontmatter'ı otomatikleştir,
            Crossref XML'ini tek tıkla üret, DOI ve sayfa aralıklarını <em>kendiliğinden</em> hesaplat.
            Editörler için modern dergi sayı hazırlama atölyesi.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
            <a href="#/app" onClick={openApp} style={ctaPrimary(1)}>
              Editöre git <ArrowRight size={16} strokeWidth={2.4} />
            </a>
            <a href="#workflow" style={ctaGhost}>
              Nasıl çalışır?
            </a>
          </div>

          <div style={{ marginTop: 40, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            <Stat n="6" label="Frontmatter modülü" />
            <Stat n="1-click" label="Crossref XML" />
            <Stat n="AI" label="Sayı tanıtım taslağı" />
            <Stat n="DOCX" label="Word çıktısı" />
          </div>
        </div>

        {/* Right — TOC paper mockup */}
        <TocMockup />
      </div>
    </section>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: C.text, letterSpacing: -0.5 }}>{n}</div>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 0.8, color: C.textMuted, textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function TocMockup() {
  const articles = [
    { t: 'AI Okuryazarlığı ve Öğretmen Hazırbulunuşluğu', a: 'Yılmaz, A. · Demir, B.', p: '1–18' },
    { t: 'Sosyal Bilgiler Eğitiminde Dijital Dönüşüm', a: 'Kaya, M.', p: '19–34' },
    { t: 'Ortaokul Öğrencilerinde Üst Bilişsel Strateji', a: 'Şahin, E. · Yıldız, C.', p: '35–52' },
    { t: 'Pandemi Sonrası Sınıf İklimi: Olgu Çalışması', a: 'Aksoy, F.', p: '53–68' },
    { t: 'STEM Etkinliklerinde Tutum ve Başarı İlişkisi', a: 'Öztürk, S. · Çelik, R.', p: '69–84' },
  ];
  return (
    <div style={{ position: 'relative', perspective: 1200 }}>
      {/* Floating Crossref XML chip */}
      <div style={{
        position: 'absolute', top: -16, left: -32, zIndex: 3,
        background: C.ink, color: C.paper, padding: '10px 14px', borderRadius: 10,
        fontFamily: MONO, fontSize: 11, letterSpacing: 0.4,
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 20px 40px -20px rgba(0,0,0,.3)',
      }}>
        <FileCode2 size={14} color={C.gold} />
        crossref-deposit.xml
      </div>

      {/* DOI badge floating */}
      <div style={{
        position: 'absolute', bottom: -20, right: -16, zIndex: 3,
        background: '#fff', border: `1px solid ${C.border}`, padding: '12px 16px', borderRadius: 12,
        boxShadow: '0 20px 40px -20px rgba(0,0,0,.18)',
      }}>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 0.8, color: C.textMuted, textTransform: 'uppercase' }}>DOI Pattern</div>
        <div style={{ fontFamily: MONO, fontSize: 12, color: C.text, marginTop: 4 }}>
          10.29329/<span style={{ color: C.gold }}>pedper.2026.5.1.{'{n}'}</span>
        </div>
      </div>

      {/* Paper sheet */}
      <div style={{
        background: C.paper,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        padding: '36px 40px',
        boxShadow: '0 40px 80px -30px rgba(11,18,32,0.25), 0 10px 20px -10px rgba(11,18,32,0.12)',
        transform: 'rotate(.6deg)',
        fontFamily: SERIF,
        color: '#2A2014',
      }}>
        <div style={{ textAlign: 'center', paddingBottom: 14, borderBottom: `1px solid rgba(110,83,28,.25)` }}>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.2, color: C.goldDim }}>VOLUME 5 · ISSUE 1 · 2026</div>
          <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, marginTop: 6, letterSpacing: -0.3 }}>Pedagogical Perspective</div>
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 12, color: C.goldDim, marginTop: 2 }}>İçindekiler · Table of Contents</div>
        </div>
        <ol style={{ listStyle: 'none', padding: 0, margin: '18px 0 0' }}>
          {articles.map((x, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 0', borderBottom: `1px dotted rgba(110,83,28,.22)` }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.goldDim, minWidth: 18 }}>{String(i + 1).padStart(2, '0')}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 500, color: '#2A2014', lineHeight: 1.35 }}>{x.t}</div>
                <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 11, color: C.goldDim, marginTop: 2 }}>{x.a}</div>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.goldDim }}>{x.p}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// =====================================================
// Logo strip (trust)
// =====================================================
function TrustStrip() {
  const items = ['Pedagogical Perspective', 'Ordu Üniversitesi', 'BYDK', 'Crossref Member', 'Anthropic Claude'];
  return (
    <section style={{ borderBottom: `1px solid ${C.borderSoft}`, background: C.surface }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1, color: C.textMuted, textTransform: 'uppercase' }}>Şu anda kullanılıyor</span>
        {items.map((x, i) => (
          <span key={i} style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 14, color: C.textDim, letterSpacing: -0.2 }}>{x}</span>
        ))}
      </div>
    </section>
  );
}

// =====================================================
// Features
// =====================================================
function Features() {
  const f = [
    {
      icon: <Layout size={20} />, kicker: '01',
      title: 'Frontmatter, eksiksiz',
      desc: 'Kapak, jenerik, editör kurulu, bölüm editörleri, hakemler, indeks ve içindekiler — altı modül tek panelde.',
      points: ['6 modül, tek pencere', 'Sürükle-bırak sıralama', 'Otomatik özet sayım'],
    },
    {
      icon: <FileCode2 size={20} />, kicker: '02',
      title: 'Crossref XML, tek tık',
      desc: 'Sayıdaki tüm makaleler için Crossref formatına uygun deposit XML\'i kendiliğinden derlenir. Batch ID ve timestamp otomatik.',
      points: ['Crossref 5.3.1 şeması', 'Çoklu yazar + ORCID', 'Yayın tarihi normalize'],
    },
    {
      icon: <Hash size={20} />, kicker: '03',
      title: 'DOI & sayfa, otomatik',
      desc: 'Bir DOI desen yaz, sayı sıralaması değiştikçe DOI ve sayfa aralıkları yeniden hesaplansın.',
      points: ['Şablonlu DOI deseni', 'Sıra → sayfa hesabı', 'Birden fazla sayı için yeniden kullanım'],
    },
    {
      icon: <Sparkles size={20} />, kicker: '04',
      title: 'Sayı tanıtımı için yapay zeka',
      desc: 'Claude Sonnet ile sayıya özgü iki dilli (TR/EN) açılış paragrafı taslağı. Sen onaylarsın, baskıya hazır.',
      points: ['TR + EN otomatik', 'Tematik odak tabanlı', 'Düzenlenebilir taslak'],
    },
    {
      icon: <GripVertical size={20} />, kicker: '05',
      title: 'Sürükle-bırak sıralama',
      desc: 'Makale sırasını değiştir, sayfa aralıkları ve DOI\'ler aynı anda kayar. Yanlış sıralama yok.',
      points: ['Gerçek zamanlı yeniden numaralandırma', 'Çoklu yazar desteği', 'Sayı boyu rakam tutarlılığı'],
    },
    {
      icon: <FileText size={20} />, kicker: '06',
      title: 'Word çıktısı, baskıya hazır',
      desc: 'Frontmatter\'ı Microsoft Word formatında dışa aktar. Yazıevi sürecine doğrudan girer.',
      points: ['Word HTML formatı', 'Yazıevi uyumlu', 'PDF için kaynak'],
    },
  ];

  return (
    <section id="features" style={{ padding: '96px 24px', background: C.bg, borderBottom: `1px solid ${C.borderSoft}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHead
          kicker="ÖZELLİKLER"
          title="Editöryal sürecin altı kritik adımı."
          subtitle="Makaleler hakemden geçti. Geriye sayıyı baskıya hazırlamak kaldı — Issuely tam o adımı otomatikleştirir."
        />

        <div className="ily-feat" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 56 }}>
          {f.map((it, i) => (
            <div key={i} style={{
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '28px 24px',
              transition: 'border-color .15s, transform .15s',
              cursor: 'default',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: C.goldGlow, color: C.goldDim,
                  display: 'grid', placeItems: 'center',
                }}>{it.icon}</span>
                <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1, color: C.textMuted }}>{it.kicker}</span>
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, letterSpacing: -0.5, margin: '20px 0 8px', color: C.text }}>{it.title}</h3>
              <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.6, color: C.textDim, margin: 0 }}>{it.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {it.points.map((p, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 11, color: C.textDim }}>
                    <Check size={12} color={C.gold} strokeWidth={2.4} /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// Workflow (How it works)
// =====================================================
function Workflow() {
  const steps = [
    { n: '01', title: 'Sayı bilgilerini gir', desc: 'Cilt, sayı, yıl, ISSN, DOI deseni — bir kez yaz, her sayıda yeniden kullan.' },
    { n: '02', title: 'Makaleleri yükle ve sırala', desc: 'Sürükle-bırak ile sırayı belirle. Sayfa aralıkları ve DOI\'ler eş zamanlı kayar.' },
    { n: '03', title: 'Editörler ve hakemleri ekle', desc: 'Editör kurulu, bölüm editörleri, hakem listesi — ORCID alanları dahil.' },
    { n: '04', title: 'AI ile sayı tanıtımını oluştur', desc: 'Tematik odağı yaz, Claude TR/EN paragrafı taslaklasın. Düzenle, onayla.' },
    { n: '05', title: 'Crossref XML ve DOCX dışa aktar', desc: 'Tek tıkla her ikisi de hazır. Yayın akışına ekle.' },
  ];

  return (
    <section id="workflow" style={{ padding: '96px 24px', background: C.surface, borderBottom: `1px solid ${C.borderSoft}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHead
          kicker="NASIL ÇALIŞIR"
          title="Beş adımda, yayına hazır."
          subtitle="Manuel kopyala-yapıştır işleri ve XML satır sayma günleri sona erdi."
        />

        <ol style={{ listStyle: 'none', padding: 0, margin: '56px 0 0', display: 'grid', gap: 0 }}>
          {steps.map((s, i) => (
            <li key={i} style={{
              display: 'grid', gridTemplateColumns: '120px 1fr auto', alignItems: 'center',
              padding: '28px 0', borderTop: `1px solid ${C.border}`,
              borderBottom: i === steps.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, fontWeight: 500, color: C.gold, letterSpacing: -1 }}>{s.n}</div>
              <div>
                <h4 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, margin: 0, color: C.text, letterSpacing: -0.4 }}>{s.title}</h4>
                <p style={{ fontFamily: SANS, fontSize: 15, color: C.textDim, margin: '6px 0 0', lineHeight: 1.55, maxWidth: 640 }}>{s.desc}</p>
              </div>
              <ChevronRight size={20} color={C.textMuted} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// =====================================================
// Pricing
// =====================================================
function Pricing() {
  const tiers = [
    {
      name: 'Editör',
      kicker: 'SOLO',
      price: 'Ücretsiz',
      desc: 'Tek editör için. Bir dergi, sınırsız sayı.',
      cta: 'Hemen başla',
      featured: false,
      features: [
        '1 dergi profili',
        'Tüm frontmatter modülleri',
        'DOCX dışa aktarma',
        'DOI ve sayfa otomasyonu',
        'Sürükle-bırak sıralama',
      ],
    },
    {
      name: 'Yayıncı',
      kicker: 'PUBLISHER',
      price: '299₺',
      priceSuffix: '/ay',
      desc: 'Crossref entegrasyonu, AI tanıtım, çoklu dergi.',
      cta: 'Demo iste',
      featured: true,
      features: [
        'Sınırsız dergi profili',
        'Crossref XML üretimi',
        'AI sayı tanıtımı (TR/EN)',
        'Ekip üyeleri ve roller',
        'Öncelikli destek',
        'Toplu makale içe aktarma',
      ],
    },
    {
      name: 'Kurumsal',
      kicker: 'INSTITUTION',
      price: 'Görüşelim',
      desc: 'Üniversite yayınları ve çok-dergi yayıncılar için.',
      cta: 'İletişime geç',
      featured: false,
      features: [
        'Yayıncı planındaki her şey',
        'SSO / LDAP entegrasyonu',
        'Beyaz etiket / özel domain',
        'Yıllık fatura ve sözleşme',
        'Özelleştirilmiş onboarding',
      ],
    },
  ];

  return (
    <section id="pricing" style={{ padding: '96px 24px', background: C.bg, borderBottom: `1px solid ${C.borderSoft}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHead
          kicker="FİYATLANDIRMA"
          title="Akademik bütçeye uygun, şeffaf."
          subtitle="Solo editörler için ücretsiz başlangıç. Yayıncılar için ölçeklenir."
        />

        <div className="ily-price" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 56 }}>
          {tiers.map((t, i) => (
            <div key={i} style={{
              position: 'relative',
              background: t.featured ? C.ink : C.bg,
              color: t.featured ? '#fff' : C.text,
              border: t.featured ? `1px solid ${C.ink}` : `1px solid ${C.border}`,
              borderRadius: 14,
              padding: '36px 28px',
              boxShadow: t.featured ? '0 30px 60px -30px rgba(11,18,32,0.4)' : 'none',
            }}>
              {t.featured && (
                <div style={{ position: 'absolute', top: -12, right: 20, background: C.gold, color: '#fff', padding: '4px 10px', borderRadius: 999, fontFamily: MONO, fontSize: 10, letterSpacing: 0.8 }}>
                  ÖNERILEN
                </div>
              )}
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, color: t.featured ? C.gold : C.textMuted }}>{t.kicker}</div>
              <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 500, margin: '8px 0 4px', letterSpacing: -0.5 }}>{t.name}</h3>
              <p style={{ fontFamily: SANS, fontSize: 13, color: t.featured ? 'rgba(255,255,255,.7)' : C.textDim, margin: 0, minHeight: 36 }}>{t.desc}</p>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, letterSpacing: -1.5 }}>{t.price}</span>
                {t.priceSuffix && <span style={{ fontFamily: SANS, fontSize: 14, color: t.featured ? 'rgba(255,255,255,.6)' : C.textMuted }}>{t.priceSuffix}</span>}
              </div>
              <a href="#/app" onClick={openApp} style={{
                marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                padding: '12px 16px', borderRadius: 8, textDecoration: 'none',
                background: t.featured ? C.gold : C.surfaceAlt,
                color: t.featured ? '#fff' : C.text,
                border: t.featured ? 'none' : `1px solid ${C.border}`,
                fontFamily: SANS, fontWeight: 500, fontSize: 14,
              }}>{t.cta} <ArrowRight size={14} /></a>
              <ul style={{ listStyle: 'none', padding: 0, margin: '28px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: SANS, fontSize: 14, color: t.featured ? 'rgba(255,255,255,.85)' : C.textDim, lineHeight: 1.5 }}>
                    <Check size={14} color={t.featured ? C.gold : C.gold} strokeWidth={2.4} style={{ flexShrink: 0, marginTop: 3 }} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// FAQ
// =====================================================
function FAQ() {
  const items = [
    { q: 'Issuely hangi dergi formatlarını destekliyor?', a: 'Crossref 5.3.1 deposit şeması ve Word (DOCX) çıktısı. Her ikisi de uluslararası yayıncılık standartlarıdır.' },
    { q: 'Verilerim nerede saklanıyor?', a: 'Şu anda tüm veriler tarayıcının yerel belleğinde tutulur. Yayıncı planında bulut senkronizasyonu eklenecek.' },
    { q: 'AI sayı tanıtımı için ek ücret var mı?', a: 'Yayıncı planında dahildir. Solo editörler kendi Anthropic API anahtarlarını getirebilir.' },
    { q: 'ORCID, ROR gibi standartlar destekleniyor mu?', a: 'ORCID alanları her editör ve hakem için mevcut. ROR entegrasyonu yol haritasında.' },
    { q: 'Mevcut dergim için onboarding desteği veriyor musunuz?', a: 'Kurumsal planda özel onboarding ve veri taşıma desteği sunuyoruz.' },
  ];
  return (
    <section id="faq" style={{ padding: '96px 24px', background: C.surface, borderBottom: `1px solid ${C.borderSoft}` }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <SectionHead
          kicker="SIKÇA SORULAN"
          title="Sorulardan önce yanıtlar."
        />
        <div style={{ marginTop: 48 }}>
          {items.map((x, i) => <FAQItem key={i} q={x.q} a={x.a} />)}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: `1px solid ${C.border}` }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 0', background: 'transparent', border: 0, cursor: 'pointer',
        fontFamily: SERIF, fontSize: 19, fontWeight: 500, color: C.text, textAlign: 'left', letterSpacing: -0.2,
      }}>
        {q}
        <span style={{ fontFamily: MONO, fontSize: 18, color: C.gold }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.7, color: C.textDim, padding: '0 0 24px', margin: 0, maxWidth: 720 }}>{a}</p>
      )}
    </div>
  );
}

// =====================================================
// CTA
// =====================================================
function CTA() {
  return (
    <section style={{ padding: '96px 24px', background: C.ink, color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(700px 400px at 20% 20%, ${C.goldGlow}, transparent 60%), radial-gradient(700px 400px at 80% 80%, rgba(99,102,241,0.08), transparent 60%)`,
      }} />
      <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, color: C.gold }}>BAŞLAMAYA HAZIR MISIN?</div>
        <h2 style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 500, letterSpacing: -1.2, margin: '12px 0 16px', lineHeight: 1.05 }}>
          Bir sonraki sayını <em style={{ color: C.gold, fontStyle: 'italic' }}>Issuely ile</em> hazırla.
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 18, color: 'rgba(255,255,255,.7)', maxWidth: 580, margin: '0 auto', lineHeight: 1.6 }}>
          Editör hesabı ücretsiz. Kart bilgisi gerekmez. Tarayıcıda çalışır.
        </p>
        <div style={{ marginTop: 36, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#/app" onClick={openApp} style={{
            padding: '14px 24px', borderRadius: 10,
            background: C.gold, color: '#fff', textDecoration: 'none',
            fontFamily: SANS, fontWeight: 600, fontSize: 15,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>Editöre git <ArrowRight size={16} /></a>
          <a href="mailto:hello@issuely.com" style={{
            padding: '14px 24px', borderRadius: 10,
            background: 'transparent', color: '#fff', textDecoration: 'none',
            border: '1px solid rgba(255,255,255,.2)',
            fontFamily: SANS, fontWeight: 500, fontSize: 15,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}><Mail size={16} /> İletişime geç</a>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// Footer
// =====================================================
function Footer() {
  return (
    <footer style={{ padding: '64px 24px 32px', background: C.bg, color: C.textDim }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }} className="ily-foot">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${C.ink} 0%, ${C.gold} 130%)`,
              display: 'grid', placeItems: 'center', color: '#fff', fontFamily: SERIF, fontWeight: 700, fontSize: 18,
            }}>I</div>
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 22, color: C.text }}>Issuely</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, marginTop: 16, maxWidth: 320, lineHeight: 1.6 }}>
            Akademik editörler için dergi sayısı hazırlama atölyesi. Ordu Üniversitesi BYDK tarafından geliştirildi.
          </p>
        </div>
        <FooterCol title="Ürün" links={[
          ['Özellikler', '#features'],
          ['Nasıl çalışır', '#workflow'],
          ['Fiyatlandırma', '#pricing'],
          ['Editör', '#/app'],
        ]} />
        <FooterCol title="Kaynaklar" links={[
          ['Dokümanlar', '#'],
          ['Yol haritası', '#'],
          ['Sürüm notları', '#'],
          ['Crossref şeması', '#'],
        ]} />
        <FooterCol title="İletişim" links={[
          ['E-posta', 'mailto:hello@issuely.com'],
          ['GitHub', '#'],
          ['Yardım merkezi', '#'],
          ['Gizlilik', '#'],
        ]} />
      </div>
      <div style={{ maxWidth: 1200, margin: '40px auto 0', paddingTop: 24, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.textMuted }}>© 2026 Issuely · Doç. Dr. Erhan Yaylak</span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.textMuted, letterSpacing: 0.5 }}>v0.5 · Crossref XML ready</span>
      </div>
    </footer>
  );
}
function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.2, color: C.textMuted, textTransform: 'uppercase', marginBottom: 14 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(([l, h], i) => (
          <li key={i}>
            <a href={h} onClick={h === '#/app' ? openApp : undefined} style={{ fontFamily: SANS, fontSize: 14, color: C.textDim, textDecoration: 'none' }}>{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// =====================================================
// Shared
// =====================================================
function SectionHead({ kicker, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.4, color: C.gold }}>{kicker}</div>
      <h2 style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 500, letterSpacing: -1, margin: '12px 0 0', color: C.text, lineHeight: 1.1 }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: SANS, fontSize: 17, color: C.textDim, marginTop: 16, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

const ctaPrimary = (size) => ({
  display: 'inline-flex', alignItems: 'center', gap: size ? 8 : 6,
  padding: size ? '13px 22px' : '9px 14px',
  background: C.ink, color: '#fff', borderRadius: 10, textDecoration: 'none',
  fontFamily: SANS, fontWeight: 600, fontSize: size ? 15 : 13,
  border: `1px solid ${C.ink}`,
  transition: 'transform .15s, background .15s',
});

const ctaGhost = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '13px 22px', borderRadius: 10, textDecoration: 'none',
  background: '#fff', color: C.text,
  border: `1px solid ${C.border}`,
  fontFamily: SANS, fontWeight: 500, fontSize: 15,
};

// =====================================================
// Responsive CSS injection
// =====================================================
const ResponsiveCSS = () => (
  <style>{`
    @media (max-width: 960px) {
      .ily-hero { grid-template-columns: 1fr !important; gap: 48px !important; }
      .ily-feat { grid-template-columns: 1fr !important; }
      .ily-price { grid-template-columns: 1fr !important; }
      .ily-foot { grid-template-columns: 1fr 1fr !important; }
      .ily-nav a:not(:last-child) { display: none; }
    }
    .ily-nav a:hover { color: #1A1F2E !important; }
  `}</style>
);

// =====================================================
// Root
// =====================================================
export default function Landing() {
  useEffect(() => {
    if (!document.querySelector(`link[href="${FONTS_HREF}"]`)) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = FONTS_HREF;
      document.head.appendChild(l);
    }
    document.title = 'Issuely — Dergi sayısı hazırlama atölyesi';
  }, []);

  return (
    <div style={{ fontFamily: SANS, color: C.text, background: C.bg, minHeight: '100vh' }}>
      <ResponsiveCSS />
      <Navbar />
      <Hero />
      <TrustStrip />
      <Features />
      <Workflow />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
