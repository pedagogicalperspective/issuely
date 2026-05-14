import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  FileCode,
  Image as ImageIcon,
  Sparkle,
  Hash,
  UserCheck,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Minus,
  Check,
  GithubLogo,
} from '@phosphor-icons/react';

const WORKSPACE_HREF = '#/app';

// =====================================================================
// Navbar — sticky, condenses on scroll
// =====================================================================

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full transition-colors duration-200',
        scrolled
          ? 'bg-paper/85 backdrop-blur-md border-b border-border'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold italic tracking-tight text-gold">
            Issuely
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim sm:inline">
            Issue Workspace
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={WORKSPACE_HREF}
          className="group inline-flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
        >
          Open Workspace
          <ArrowRight
            size={14}
            weight="bold"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </header>
  );
}

// =====================================================================
// Hero — animated headline (word-by-word stagger fade-up)
// =====================================================================

function AnimatedHeadline({ children }) {
  const words = children.split(' ');
  return (
    <h1 className="font-display text-[44px] leading-[1.05] tracking-[-0.025em] text-ink sm:text-6xl md:text-7xl">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.05 + i * 0.06,
          }}
          className="inline-block whitespace-pre"
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </h1>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle radial accent in the upper-left, brings warmth without busyness */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(closest-side, rgba(164,121,41,0.10), transparent)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-paper-2 px-3 py-1 text-xs"
        >
          <span className="size-1.5 rounded-full bg-gold" />
          <span className="font-mono uppercase tracking-[0.16em] text-ink-2">
            Free during beta · v0.6
          </span>
        </motion.div>

        <AnimatedHeadline>
          From manuscripts to a finished issue — in minutes.
        </AnimatedHeadline>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.55 }}
          className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-2 md:text-lg"
        >
          Frontmatter DOCX, Crossref XML deposit, cover artwork, reviewer
          credits. One workspace that turns a folder of accepted manuscripts
          into a peer-reviewed issue ready to ship.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.75 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href={WORKSPACE_HREF}
            className="group inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Open Workspace
            <ArrowRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-paper px-5 py-3 text-sm font-medium text-ink-2 transition-colors hover:border-gold hover:text-ink"
          >
            See what it does
          </a>
        </motion.div>

        {/* Sample-cover artifact — gives the eye something to anchor on */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
          className="relative mx-auto mt-20 max-w-md"
        >
          <CoverArtifact />
        </motion.div>
      </div>
    </section>
  );
}

// =====================================================================
// Hero supporting visual — miniature of the actual cover output
// =====================================================================

function CoverArtifact() {
  return (
    <div
      className="aspect-[210/297] overflow-hidden rounded-md border border-navy-2 px-8 pt-9 pb-10 shadow-[0_18px_50px_-12px_rgba(15,23,42,0.35)]"
      style={{
        background: 'linear-gradient(135deg, #1A2440 0%, #0B1220 100%)',
      }}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="font-mono text-[9px] tracking-[0.22em] text-gold uppercase">
            eISSN 2822-4841
          </div>
          <div
            className="mt-3 font-display text-[26px] font-medium italic leading-[1.04] tracking-[-0.02em] text-cream"
          >
            Pedagogical Perspective
          </div>
          <div className="mt-4 font-display text-[11px] italic text-[#8FA0BF]">
            An open-access journal of educational research
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] tracking-[0.14em] text-gold uppercase">
            AI Literacy in Teacher Education
          </div>
          <div className="mt-3 flex items-baseline gap-3 font-display">
            <span className="text-2xl text-cream">Vol. 5</span>
            <span className="text-2xl italic text-gold">No. 1</span>
          </div>
          <div className="mt-1 font-display text-[12px] italic text-[#8FA0BF]">
            Bahar 2026
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Features — six icon cards, scroll-triggered fade-up
// =====================================================================

const FEATURES = [
  {
    icon: FileText,
    title: 'Frontmatter DOCX',
    body: 'Cover, masthead, board, indexing, TOC, and reviewers — combined into a Word-compatible document with the click of one button.',
  },
  {
    icon: FileCode,
    title: 'Crossref XML Deposit',
    body: 'Schema 5.3.1-compliant deposit XML for the whole issue. ORCID, page ranges, DOIs auto-filled. Drop it into DergiPark or Crossref Direct Deposit.',
  },
  {
    icon: ImageIcon,
    title: 'Cover Image PNG',
    body: '1200×1697 print-ready cover, rendered live from your issue metadata. Drop into OJS, social posts, or press releases.',
  },
  {
    icon: Sparkle,
    title: 'AI Introduction Paragraph',
    body: 'Editor-in-Chief-grade welcome paragraph in TR + EN, drafted from your article titles and keywords. Substantive, not generic.',
  },
  {
    icon: Hash,
    title: 'DOI & Pagination, Automated',
    body: 'Drag to reorder articles — page ranges and DOI suffixes recompute instantly. Nothing to track in a spreadsheet.',
  },
  {
    icon: UserCheck,
    title: 'Reviewer Acknowledgments',
    body: 'Maintain a sortable, locale-aware reviewer list. Renders into a printed thank-you page that lives inside the frontmatter.',
  },
];

function Features() {
  return (
    <section id="features" className="border-t border-border-soft bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionLabel>Capabilities</SectionLabel>
        <SectionTitle>Everything an issue needs, in one workspace.</SectionTitle>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-2">
          Tools chosen for editorial reality, not feature inflation. Each output
          lands on its target system without manual cleanup.
        </p>

        <ul className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.li
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.06,
              }}
              className="group bg-paper p-7 transition-colors hover:bg-paper-2"
            >
              <div className="inline-flex size-11 items-center justify-center rounded-lg border border-gold/30 bg-gold-glow text-gold transition-colors group-hover:border-gold/60">
                <f.icon size={20} weight="regular" />
              </div>
              <h3 className="mt-5 font-display text-[19px] font-medium text-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                {f.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// =====================================================================
// Pricing — three tiers, middle one highlighted
// =====================================================================

const PRICING = [
  {
    name: 'Editor',
    price: '$0',
    cadence: '/ month',
    blurb: 'For solo editors testing a single issue or evaluating the product.',
    features: [
      'One active issue at a time',
      'Frontmatter DOCX + Crossref XML',
      'Cover image PNG export',
      'Up to 20 articles per issue',
    ],
    cta: 'Open Workspace',
    href: WORKSPACE_HREF,
    featured: false,
  },
  {
    name: 'Journal',
    price: '$39',
    cadence: '/ month',
    blurb:
      'For a single journal running 2–4 issues a year. The default for most editors.',
    features: [
      'Unlimited issues + archive',
      'AI introduction paragraph (TR + EN)',
      'LinkedIn promotion card pack',
      'Reviewer history across issues',
      'Priority email support',
    ],
    cta: 'Start free trial',
    href: WORKSPACE_HREF,
    featured: true,
  },
  {
    name: 'Publisher',
    price: '$129',
    cadence: '/ month',
    blurb:
      'For coordinators running multiple journals or institutional publishers.',
    features: [
      'Up to 10 journals',
      'Multi-user seats with roles',
      'API + webhooks',
      'Custom DOI patterns + branding',
      'SLA-backed support',
    ],
    cta: 'Talk to us',
    href: 'mailto:editor@pedagogicalperspective.com?subject=Issuely%20Publisher%20Plan',
    featured: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="border-t border-border-soft bg-paper-2">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionLabel>Pricing</SectionLabel>
        <SectionTitle>Pick a plan when you outgrow free.</SectionTitle>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-2">
          Cancel any time. All plans include a 14-day Pro trial. Educational
          institutions can request a non-profit discount.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-5">
          {PRICING.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.08,
              }}
              className={[
                'relative rounded-2xl border p-8 flex flex-col',
                tier.featured
                  ? 'border-ink bg-paper shadow-[0_8px_30px_-10px_rgba(15,23,42,0.15)] md:-translate-y-2'
                  : 'border-border bg-paper',
              ].join(' ')}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper">
                  <Sparkle size={11} weight="fill" />
                  Most popular
                </div>
              )}

              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                {tier.name}
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-medium tracking-tight text-ink">
                  {tier.price}
                </span>
                <span className="text-sm text-ink-dim">{tier.cadence}</span>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
                {tier.blurb}
              </p>

              <ul className="mt-7 space-y-3 text-[14px] text-ink-2">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <Check
                      size={16}
                      weight="bold"
                      className="mt-0.5 shrink-0 text-gold"
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.href}
                className={[
                  'mt-auto pt-8 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
                  tier.featured
                    ? 'bg-ink text-paper hover:bg-ink/90'
                    : 'border border-border bg-paper text-ink hover:border-gold hover:text-gold',
                ].join(' ')}
                style={tier.featured ? { marginTop: 'auto' } : undefined}
              >
                {tier.cta}
                <ArrowUpRight size={14} weight="bold" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// FAQ — accordion with AnimatePresence
// =====================================================================

const FAQS = [
  {
    q: 'Does Issuely replace OJS, DergiPark, or our submission system?',
    a: 'No — Issuely sits beside them. You bring accepted manuscripts from your submission platform, Issuely handles the assembly: frontmatter, DOI deposit XML, cover art, and the things OJS/DergiPark are weak at.',
  },
  {
    q: 'Can I export Crossref XML for DOI registration?',
    a: 'Yes. We generate Crossref schema 5.3.1 deposit XML for the entire issue — ORCID, page ranges, DOIs, resource URLs, depositor info all auto-filled. Upload it manually to Crossref Direct Deposit or via DergiPark.',
  },
  {
    q: 'What languages are supported?',
    a: 'The workspace UI is Turkish and English bilingual. Generated outputs (DOCX frontmatter, AI introduction, Crossref XML) handle Turkish locale-aware sorting, Turkish characters, and TR/EN parallel titles natively.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Currently entirely client-side — your issue data lives in your browser tab and never leaves it. AI generation calls go through a server-side proxy for the Anthropic key but no issue content is logged. Persistent multi-issue storage is on the roadmap (Phase 5).',
  },
  {
    q: 'Is there really a free tier?',
    a: 'Yes. The Editor plan stays free for one active issue at a time, with DOCX + Crossref XML + cover image. We keep a free tier so smaller journals are never gated out of the basics.',
  },
  {
    q: 'How long does an issue actually take?',
    a: 'For a typical 15–20 article issue, the assembly work that takes 1–2 days manually is roughly 30–45 minutes in Issuely. Most of the time goes to checking metadata, not formatting.',
  },
];

function FaqItem({ item, open, onToggle }) {
  return (
    <li className="border-b border-border-soft">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-ink"
      >
        <span className="font-display text-[18px] font-medium leading-snug text-ink">
          {item.q}
        </span>
        <span
          className={[
            'shrink-0 flex size-7 items-center justify-center rounded-full border transition-colors',
            open
              ? 'border-ink bg-ink text-paper'
              : 'border-border bg-paper text-ink-2',
          ].join(' ')}
        >
          {open ? (
            <Minus size={13} weight="bold" />
          ) : (
            <Plus size={13} weight="bold" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.22 },
            }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 text-[15px] leading-relaxed text-ink-2">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="border-t border-border-soft bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Questions editors actually ask.</SectionTitle>

        <ul className="mt-12 border-t border-border-soft">
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </ul>

        <p className="mt-12 text-[14px] text-ink-2">
          Still wondering?{' '}
          <a
            href="mailto:editor@pedagogicalperspective.com"
            className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold"
          >
            editor@pedagogicalperspective.com
          </a>
        </p>
      </div>
    </section>
  );
}

// =====================================================================
// Footer
// =====================================================================

function Footer() {
  return (
    <footer className="border-t border-border-soft bg-paper-2">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold italic tracking-tight text-gold">
                Issuely
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
                Issue Workspace
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-2">
              Built by an editor, for editors. From accepted manuscripts to a
              peer-reviewed issue ready for indexing — in one place.
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={[
              { href: '#features', label: 'Features' },
              { href: '#pricing', label: 'Pricing' },
              { href: '#faq', label: 'FAQ' },
              { href: WORKSPACE_HREF, label: 'Open Workspace' },
            ]}
          />
          <FooterColumn
            title="Resources"
            links={[
              { href: 'https://www.crossref.org/02publishers/parser.html', label: 'Crossref XML parser', external: true },
              { href: 'https://docs.claude.com', label: 'AI Documentation', external: true },
              { href: 'https://github.com/pedagogicalperspective/issuely', label: 'GitHub', external: true },
            ]}
          />
          <FooterColumn
            title="Contact"
            links={[
              { href: 'mailto:editor@pedagogicalperspective.com', label: 'Email' },
              { href: 'https://www.pedagogicalperspective.com', label: 'Pedagogical Perspective', external: true },
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border-soft pt-6 text-[12px] text-ink-dim sm:flex-row sm:items-center">
          <div>
            © {new Date().getFullYear()} Issuely · Erhan Yaylak. Educational
            research, served plainly.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/pedagogicalperspective/issuely"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
            >
              <GithubLogo size={14} weight="regular" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noreferrer' : undefined}
              className="inline-flex items-center gap-1 text-[14px] text-ink-2 transition-colors hover:text-ink"
            >
              {l.label}
              {l.external && (
                <ArrowUpRight size={11} weight="bold" className="opacity-50" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// =====================================================================
// Section primitives
// =====================================================================

function SectionLabel({ children }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-ink md:text-5xl">
      {children}
    </h2>
  );
}

// =====================================================================
// Page
// =====================================================================

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
