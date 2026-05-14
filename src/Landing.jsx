import { useEffect, useState } from 'react';
import { ArrowUpRight, Plus, Minus } from '@phosphor-icons/react';

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,500&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

// Display: EB Garamond, a Robert Slimbach revival of Claude Garamont's 16c
// types. University-press credible, not on the "tasteful SaaS Fraunces" lane.
const SERIF_D = '"EB Garamond", "Adobe Garamond Pro", "Garamond", Georgia, serif';
const SERIF_B = '"Source Serif 4", "Source Serif Pro", Georgia, serif';
const SANS = '"DM Sans", system-ui, -apple-system, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const ROOT_STYLES = `
  :root {
    --paper:    oklch(94.5% 0.018 78);
    --paper-2:  oklch(96.2% 0.012 80);
    --paper-3:  oklch(91.8% 0.022 76);
    --ink:      oklch(22% 0.020 252);
    --ink-2:    oklch(36% 0.018 250);
    --ink-3:    oklch(54% 0.014 248);
    --ink-4:    oklch(72% 0.010 246);
    --gold:     oklch(56% 0.092 78);
    --gold-deep: oklch(42% 0.082 76);
    --gold-soft: oklch(56% 0.092 78 / .10);
    --rule:     oklch(36% 0.018 250 / .14);
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
  .ily-link { transition: color 120ms ease-out; }
  .ily-link:hover { color: var(--ink); }
  .ily-btn { transition: opacity 120ms ease-out, background 120ms ease-out; }
  .ily-btn:hover { opacity: .92; }
  .ily-faq-q { transition: color 120ms ease-out; }
  .ily-faq-q:hover { color: var(--gold-deep); }
  .ily-mod-row { border-top: 1px solid var(--rule); }
  .ily-mod-row:last-child { border-bottom: 1px solid var(--rule); }
`;

const openApp = (e) => {
  e?.preventDefault?.();
  window.location.hash = '#/app';
};

// =====================================================
// Navbar — editorial masthead
// =====================================================
function Masthead() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--paper)',
      borderBottom: '1px solid var(--rule)',
    }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 28px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <a href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = '#/'; window.scrollTo({ top: 0 }); }}
           style={{ textDecoration: 'none', color: 'var(--ink)', display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: SERIF_D, fontWeight: 600, fontSize: 28, letterSpacing: -0.8, lineHeight: 1 }}>Issuely</span>
          <span style={{ fontFamily: SERIF_D, fontStyle: 'italic', fontWeight: 400, fontSize: 13, color: 'var(--ink-3)' }}>journal issue workshop</span>
        </a>

        <nav style={{ display: 'flex', alignItems: 'baseline', gap: 28 }} className="ily-nav">
          <a href="#modules" className="ily-link" style={navLink}>Modules</a>
          <a href="#workflow" className="ily-link" style={navLink}>Workflow</a>
          <a href="#pricing" className="ily-link" style={navLink}>Pricing</a>
          <a href="#questions" className="ily-link" style={navLink}>Questions</a>
          <a href="#/app" onClick={openApp} className="ily-btn" style={{
            fontFamily: SANS, fontSize: 13, fontWeight: 600, color: 'var(--paper)',
            background: 'var(--ink)', padding: '9px 16px', borderRadius: 4,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>Open the editor</a>
        </nav>
      </div>
    </header>
  );
}
const navLink = { fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'var(--ink-3)', textDecoration: 'none' };

// =====================================================
// Hero — left-aligned editorial opening
// =====================================================
function Hero() {
  return (
    <section style={{ borderBottom: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '96px 28px 88px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 72, alignItems: 'start' }} className="ily-hero">
        {/* Left: editorial title */}
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 28 }}>
            Volume 0 · Issue 5 · Beta
          </div>

          <h1 style={{ fontFamily: SERIF_D, fontSize: 84, lineHeight: 0.96, fontWeight: 500, letterSpacing: -2.2, margin: 0, color: 'var(--ink)' }}>
            A workshop for<br />
            assembling the<br />
            <em style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--gold-deep)' }}>journal issue</em>.
          </h1>

          <p style={{ fontFamily: SERIF_B, fontSize: 19, lineHeight: 1.6, color: 'var(--ink-2)', marginTop: 36, maxWidth: 520 }}>
            Issuely takes the editor through the seven frontmatter modules of an academic issue,
            calculates DOIs and page ranges as articles are reordered, and exports the Crossref
            5.3.1 deposit and the print-ready DOCX. Built for editors who would rather not own a
            spreadsheet.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 40 }}>
            <a href="#/app" onClick={openApp} className="ily-btn" style={{
              fontFamily: SANS, fontSize: 14, fontWeight: 600,
              color: 'var(--paper)', background: 'var(--ink)',
              padding: '14px 22px', borderRadius: 4,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid var(--ink)',
            }}>
              Open the editor <ArrowUpRight size={15} strokeWidth={1.6} />
            </a>
            <a href="#workflow" className="ily-link" style={{
              fontFamily: SANS, fontSize: 14, fontWeight: 500, color: 'var(--ink-2)',
              textDecoration: 'underline', textUnderlineOffset: 4, textDecorationThickness: 1,
            }}>
              See the five steps
            </a>
          </div>
        </div>

        {/* Right: TOC artifact, full opacity, no shadow */}
        <TocArtifact />
      </div>

      {/* Editorial credit line under hero */}
      <div style={{ borderTop: '1px solid var(--rule)', background: 'var(--paper-2)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: SERIF_B, fontStyle: 'italic', fontSize: 13, color: 'var(--ink-3)' }}>
            In active use by <span style={{ color: 'var(--ink-2)' }}>Pedagogical Perspective</span>, an open-access journal of educational research.
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-4)', textTransform: 'uppercase' }}>
            eISSN 2822-4841 · DOI prefix 10.29329
          </span>
        </div>
      </div>
    </section>
  );
}

function TocArtifact() {
  const articles = [
    { n: 1, t: 'AI literacy and teacher readiness', a: 'Yılmaz, A.; Demir, B.', p: '1–18' },
    { n: 2, t: 'Digital transformation in social studies', a: 'Kaya, M.', p: '19–34' },
    { n: 3, t: 'Metacognitive strategies in middle school', a: 'Şahin, E.; Yıldız, C.', p: '35–52' },
    { n: 4, t: 'Post-pandemic classroom climate', a: 'Aksoy, F.', p: '53–68' },
    { n: 5, t: 'Attitude and achievement in STEM', a: 'Öztürk, S.; Çelik, R.', p: '69–84' },
    { n: 6, t: 'Pre-service teachers and AI ethics', a: 'Tan, H.', p: '85–98' },
  ];
  return (
    <figure style={{ margin: 0 }}>
      <div style={{
        background: 'var(--paper-2)',
        border: '1px solid var(--rule)',
        padding: '36px 36px 28px',
      }}>
        <div style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.18em', color: 'var(--gold-deep)', textTransform: 'uppercase' }}>
            Volume 5 · Issue 1 · Spring 2026
          </div>
          <div style={{ fontFamily: SERIF_D, fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginTop: 8, letterSpacing: -0.4 }}>
            Pedagogical Perspective
          </div>
          <div style={{ fontFamily: SERIF_B, fontStyle: 'italic', fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
            Table of contents
          </div>
        </div>
        <ol style={{ listStyle: 'none', margin: '4px 0 0', padding: 0 }}>
          {articles.map(x => (
            <li key={x.n} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 56px', gap: 14, padding: '11px 0', borderBottom: '1px solid var(--rule)', alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--ink-4)' }}>{String(x.n).padStart(2, '0')}</span>
              <div>
                <div style={{ fontFamily: SERIF_B, fontSize: 14, color: 'var(--ink)', lineHeight: 1.3 }}>{x.t}</div>
                <div style={{ fontFamily: SERIF_B, fontStyle: 'italic', fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{x.a}</div>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--ink-3)', textAlign: 'right' }}>{x.p}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption style={{ fontFamily: SERIF_B, fontStyle: 'italic', fontSize: 12, color: 'var(--ink-3)', marginTop: 14, paddingLeft: 4 }}>
        Fig. I — A live issue rendered from Issuely's editor. DOI and page ranges recompute on reorder.
      </figcaption>
    </figure>
  );
}

// =====================================================
// Editorial note — replaces "trust by" strip
// =====================================================
function EditorialNote() {
  return (
    <section style={{ background: 'var(--paper-2)', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '64px 28px' }}>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-deep)', textTransform: 'uppercase' }}>
          Editor's note
        </div>
        <p style={{ fontFamily: SERIF_B, fontSize: 22, lineHeight: 1.5, color: 'var(--ink)', marginTop: 16, fontWeight: 400 }}>
          Most journal-issue tools are spreadsheets in disguise: rows of authors, columns of pages,
          a panic on the last day before deposit. Issuely is the opposite. It treats an issue the way
          a print compositor would: <em style={{ fontStyle: 'italic', color: 'var(--ink-2)' }}>frontmatter first</em>, articles next,
          standards always.
        </p>
      </div>
    </section>
  );
}

// =====================================================
// Modules — replaces 6-card grid with editorial prose blocks
// =====================================================
function Modules() {
  const items = [
    {
      r: '1',
      title: 'Frontmatter, all of it.',
      lede: 'Cover, masthead, editorial board, section editors, indexing, reviewers, table of contents.',
      body: 'Six modules in one workspace. Each carries its own format conventions — ORCID under board members, ROR under publisher, season-name under volume. Nothing is left to be assembled by hand on the morning of the deposit.',
      tag: 'Standards: ORCID v3 · ROR · ISSN',
    },
    {
      r: '2',
      title: 'Crossref deposit, one click.',
      lede: 'A complete Crossref 5.3.1 XML for every article in the issue, with batch identifier and timestamp.',
      body: 'Multiple authors with affiliations, ORCID identifiers, normalized publish dates, DOI segments — assembled into one deposit ready to upload. No more hand-editing XML in a text editor at midnight.',
      tag: 'Schema: Crossref 5.3.1 deposit',
    },
    {
      r: '3',
      title: 'DOI and pagination, automatic.',
      lede: 'Write the DOI pattern once. Pages and identifiers recompute every time the issue is reordered.',
      body: 'A pattern like 10.29329/pedper.{year}.{volume}.{issue}.{number} resolves automatically. Drag an article up or down: page-start, page-end, and DOI segment update for every article that moves with it.',
      tag: 'Sequenced: Pages, DOI, both',
    },
    {
      r: '4',
      title: 'Issue introduction, drafted.',
      lede: 'Claude Sonnet drafts the editor\'s opening paragraph, in Turkish and in English, in parallel.',
      body: 'Provide the thematic focus. Issuely composes two short paragraphs in the voice of an editor-in-chief — substantive framing, not "we are excited to present." Editable, attributable, optional.',
      tag: 'Engine: Anthropic Claude Sonnet 4.6',
    },
    {
      r: '5',
      title: 'Reorder by hand.',
      lede: 'Drag-and-drop sequencing, keyboard-accessible, with live recalculation.',
      body: 'No drag-handle to chase across the screen. Pick up any article with the keyboard or pointer; the sequence and its derived numbers reflect immediately. ⌘K opens a palette to jump to any module without lifting hands.',
      tag: 'Built on @dnd-kit · WCAG AA',
    },
    {
      r: '6',
      title: 'Word, on demand.',
      lede: 'Print-ready DOCX of the frontmatter, formatted in the typesetting house\'s vocabulary.',
      body: 'Cover, masthead table, editorial board with grouped sections, indexing keywords, reviewer roll, table of contents. The file opens in Word as a finished document, not a draft to clean up.',
      tag: 'Output: Word HTML (DOCX-compatible)',
    },
  ];

  return (
    <section id="modules" style={{ borderBottom: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '112px 28px 96px' }}>
        <SectionHead
          romanIdx="I"
          title={<>What an issue <em style={{ fontStyle: 'italic', color: 'var(--gold-deep)' }}>actually</em> needs.</>}
          subtitle="Each one earns its place in the sidebar, and each one writes back to the deposit."
        />
        <div style={{ marginTop: 64 }}>
          {items.map((it, i) => (
            <article key={it.r} className="ily-mod-row" style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 1fr',
              gap: 56,
              padding: '40px 0',
              alignItems: 'start',
            }}>
              <div style={{ fontFamily: SERIF_D, fontStyle: 'italic', fontSize: 56, fontWeight: 500, color: 'var(--gold-deep)', letterSpacing: -1, lineHeight: 0.9 }}>
                {it.r}
              </div>
              <div>
                <h3 style={{ fontFamily: SERIF_D, fontSize: 30, fontWeight: 500, letterSpacing: -0.7, margin: 0, color: 'var(--ink)', lineHeight: 1.15 }}>
                  {it.title}
                </h3>
                <p style={{ fontFamily: SERIF_B, fontSize: 16, fontStyle: 'italic', color: 'var(--ink-2)', marginTop: 12, lineHeight: 1.55, maxWidth: 480 }}>
                  {it.lede}
                </p>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginTop: 18 }}>
                  {it.tag}
                </div>
              </div>
              <p style={{ fontFamily: SERIF_B, fontSize: 16, color: 'var(--ink-2)', margin: 0, lineHeight: 1.7 }}>
                {it.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// Workflow — five steps, editorial column
// =====================================================
function Workflow() {
  const steps = [
    { r: '1', t: 'Set the journal',         d: 'Title, eISSN, DOI prefix, frequency, license, peer-review model. Written once, reused on every issue.' },
    { r: '2', t: 'Upload the articles',     d: 'Drop or paste the list. Authors, ORCID, page counts, type. Drag to sequence. Page ranges and DOI segments follow.' },
    { r: '3', t: 'Compose the masthead',    d: 'Editor-in-chief, associate editors, section editors, board, international advisory, reviewers. ORCID and affiliations included.' },
    { r: '4', t: 'Draft the editor\'s note',d: 'Provide a thematic focus. Issuely drafts the bilingual opening paragraph in the editor-in-chief voice. Read, revise, approve.' },
    { r: '5', t: 'Export and deposit',      d: 'Frontmatter DOCX into the typesetter\'s workflow. Crossref XML into the deposit form. Done in one afternoon, not one weekend.' },
  ];
  return (
    <section id="workflow" style={{ background: 'var(--paper-2)', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '128px 28px 112px' }}>
        <SectionHead
          romanIdx="II"
          title="From rough roster to deposited issue, in five passes."
          subtitle="The order of operations of a typesetting house, rendered to a single workspace."
        />
        <ol style={{ listStyle: 'none', padding: 0, margin: '64px 0 0', display: 'flex', flexDirection: 'column' }}>
          {steps.map((s, i) => (
            <li key={s.r} className="ily-mod-row" style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: 24, padding: '28px 0', alignItems: 'baseline' }}>
              <span style={{ fontFamily: SERIF_D, fontStyle: 'italic', fontSize: 40, fontWeight: 500, color: 'var(--gold-deep)', letterSpacing: -0.8, lineHeight: 1 }}>
                {s.r}
              </span>
              <div>
                <h4 style={{ fontFamily: SERIF_D, fontSize: 24, fontWeight: 500, letterSpacing: -0.5, margin: 0, color: 'var(--ink)', lineHeight: 1.2 }}>
                  {s.t}
                </h4>
                <p style={{ fontFamily: SERIF_B, fontSize: 16, color: 'var(--ink-2)', margin: '6px 0 0', lineHeight: 1.6, maxWidth: 640 }}>
                  {s.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// =====================================================
// Pricing — prose-style comparison table (no card grid)
// =====================================================
function Pricing() {
  const rows = [
    { feat: 'Journal profiles',                editor: 'One',                   publisher: 'Unlimited',         institution: 'Unlimited' },
    { feat: 'Frontmatter modules',             editor: 'All six',               publisher: 'All six',           institution: 'All six' },
    { feat: 'Word (DOCX) export',              editor: '✓',                     publisher: '✓',                 institution: '✓' },
    { feat: 'DOI and pagination automation',   editor: '✓',                     publisher: '✓',                 institution: '✓' },
    { feat: 'Crossref deposit XML',            editor: '—',                     publisher: '✓',                 institution: '✓' },
    { feat: 'AI editor\'s note (TR + EN)',     editor: 'Bring own key',         publisher: 'Included',          institution: 'Included' },
    { feat: 'Team members and roles',          editor: '—',                     publisher: 'Up to 5',           institution: 'Unlimited' },
    { feat: 'Cover image generator',           editor: '✓',                     publisher: '✓',                 institution: '✓' },
    { feat: 'SSO / LDAP',                      editor: '—',                     publisher: '—',                 institution: '✓' },
    { feat: 'Custom domain',                   editor: '—',                     publisher: '—',                 institution: '✓' },
    { feat: 'Priority support',                editor: 'Community',             publisher: 'Email',             institution: 'Dedicated' },
  ];

  const headerCellBase = { fontFamily: SERIF_D, fontWeight: 500, letterSpacing: -0.4, color: 'var(--ink)', padding: '16px 18px', verticalAlign: 'baseline', borderBottom: '1px solid var(--ink-3)' };
  const cell = { fontFamily: SERIF_B, fontSize: 15, color: 'var(--ink-2)', padding: '16px 18px', verticalAlign: 'baseline', borderBottom: '1px solid var(--rule)' };
  const goldCell = { fontFamily: SERIF_B, fontSize: 15, color: 'var(--ink)', padding: '16px 18px', verticalAlign: 'baseline', borderBottom: '1px solid var(--rule)', background: 'var(--gold-soft)' };

  return (
    <section id="pricing" style={{ borderBottom: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '112px 28px 112px' }}>
        <SectionHead
          romanIdx="III"
          title="Three tiers, one published rate sheet."
          subtitle="No quote forms for the editor tier, no promotional pricing that becomes another rate next quarter."
        />
        <div style={{ marginTop: 56, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr>
                <th style={{ ...headerCellBase, fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: 0.16 + 'em', color: 'var(--ink-3)', textTransform: 'uppercase', textAlign: 'left' }}>
                  Compare
                </th>
                <th style={{ ...headerCellBase, fontSize: 22, textAlign: 'left' }}>
                  Editor
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', marginTop: 4 }}>Free · forever</div>
                </th>
                <th style={{ ...headerCellBase, fontSize: 22, textAlign: 'left', background: 'var(--gold-soft)', borderBottom: '1px solid var(--gold-deep)' }}>
                  Publisher
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: 'var(--gold-deep)', marginTop: 4 }}>₺299 / month</div>
                </th>
                <th style={{ ...headerCellBase, fontSize: 22, textAlign: 'left' }}>
                  Institution
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', marginTop: 4 }}>By arrangement</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...cell, fontFamily: SANS, fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', width: '28%' }}>{r.feat}</td>
                  <td style={cell}>{r.editor}</td>
                  <td style={goldCell}>{r.publisher}</td>
                  <td style={cell}>{r.institution}</td>
                </tr>
              ))}
              <tr>
                <td style={{ ...cell, borderBottom: 0 }}></td>
                <td style={{ ...cell, borderBottom: 0 }}>
                  <a href="#/app" onClick={openApp} className="ily-btn" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: SANS, fontWeight: 600, fontSize: 13,
                    color: 'var(--ink)', textDecoration: 'underline',
                    textUnderlineOffset: 4, textDecorationThickness: 1,
                  }}>Start <ArrowUpRight size={13} strokeWidth={1.6} /></a>
                </td>
                <td style={{ ...goldCell, borderBottom: 0 }}>
                  <a href="#/app" onClick={openApp} className="ily-btn" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: SANS, fontWeight: 600, fontSize: 13,
                    color: 'var(--paper)', background: 'var(--ink)',
                    padding: '9px 14px', borderRadius: 4,
                    textDecoration: 'none',
                  }}>Open editor <ArrowUpRight size={13} strokeWidth={1.6} /></a>
                </td>
                <td style={{ ...cell, borderBottom: 0 }}>
                  <a href="mailto:hello@issuely.com" className="ily-link" style={{
                    fontFamily: SANS, fontWeight: 500, fontSize: 13, color: 'var(--ink-2)',
                    textDecoration: 'underline', textUnderlineOffset: 4, textDecorationThickness: 1,
                  }}>Write to us</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// Questions (FAQ) — editorial
// =====================================================
function Questions() {
  const items = [
    {
      q: 'Where is the issue data stored?',
      a: 'In the browser, on the editor\'s machine, by default. Nothing is sent to a server until the editor exports a deposit or triggers the AI editor\'s-note generator. Publisher and Institution plans add encrypted cloud sync for teams.',
    },
    {
      q: 'What schemas and identifier standards does Issuely speak?',
      a: 'Crossref 5.3.1 for deposit, ORCID v3 fields on every person, ISSN for the publication, DOI patterns for the issue. ROR support for affiliations is on the roadmap.',
    },
    {
      q: 'Is the AI editor\'s note billed separately?',
      a: 'Publisher and Institution include it. The free Editor tier asks for an Anthropic API key (so the editor pays Anthropic directly for that one feature). Everything else on the free tier is free.',
    },
    {
      q: 'Can two editors work on the same issue?',
      a: 'Today, no — the workspace is single-editor. Multi-editor collaboration with role-based permissions ships with Publisher in the next minor.',
    },
    {
      q: 'How is Issuely different from DergiPark or OJS?',
      a: 'DergiPark and OJS run the whole journal. Issuely runs only the issue-assembly step at the end. Editors continue to receive and review articles wherever they are received and reviewed; Issuely takes the accepted articles and turns them into a deposit-ready issue.',
    },
    {
      q: 'Is the editor accessible without a Crossref membership?',
      a: 'Yes. The Crossref deposit export remains optional — DOCX, cover image, table of contents, and the editor\'s note all work without Crossref. The deposit XML is there for journals that have membership.',
    },
  ];
  return (
    <section id="questions" style={{ background: 'var(--paper-2)', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '96px 28px' }}>
        <SectionHead
          romanIdx="IV"
          title="Read before you write."
        />
        <div style={{ marginTop: 56 }}>
          {items.map((x, i) => <QItem key={i} q={x.q} a={x.a} />)}
        </div>
      </div>
    </section>
  );
}

function QItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: '1px solid var(--rule)' }}>
      <button onClick={() => setOpen(!open)} className="ily-faq-q" style={{
        width: '100%', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        padding: '24px 0', background: 'transparent', border: 0, cursor: 'pointer',
        fontFamily: SERIF_D, fontSize: 22, fontWeight: 500, color: 'var(--ink)',
        textAlign: 'left', letterSpacing: -0.4, lineHeight: 1.3,
      }}>
        <span>{q}</span>
        <span style={{ marginLeft: 16, color: 'var(--gold-deep)', display: 'inline-flex', alignItems: 'center' }}>
          {open ? <Minus size={18} strokeWidth={1.4} /> : <Plus size={18} strokeWidth={1.4} />}
        </span>
      </button>
      {open && (
        <p style={{ fontFamily: SERIF_B, fontSize: 17, lineHeight: 1.7, color: 'var(--ink-2)', padding: '0 0 28px', margin: 0, maxWidth: 720 }}>
          {a}
        </p>
      )}
    </div>
  );
}

// =====================================================
// Inline closing paragraph CTA (replaces big CTA block)
// =====================================================
function ClosingNote() {
  return (
    <section style={{ borderBottom: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '96px 28px' }}>
        <p style={{ fontFamily: SERIF_B, fontSize: 22, lineHeight: 1.65, color: 'var(--ink-2)', margin: 0 }}>
          The frontmatter waits for no one, but Issuely is patient with the editor. The editor opens
          a new issue, populates the modules, exports the deposit. <a href="#/app" onClick={openApp} className="ily-link" style={{ color: 'var(--gold-deep)', textDecoration: 'underline', textUnderlineOffset: 4, textDecorationThickness: 1 }}>Begin a workspace</a>, no card required.
        </p>
      </div>
    </section>
  );
}

// =====================================================
// Footer — colophon
// =====================================================
function Colophon() {
  return (
    <footer style={{ background: 'var(--paper)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 28px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }} className="ily-foot">
        <div>
          <div style={{ fontFamily: SERIF_D, fontWeight: 600, fontSize: 28, color: 'var(--ink)', letterSpacing: -0.7 }}>Issuely</div>
          <p style={{ fontFamily: SERIF_B, fontStyle: 'italic', fontSize: 14, color: 'var(--ink-3)', marginTop: 12, lineHeight: 1.6, maxWidth: 320 }}>
            A workshop for academic journal editors. Developed by Doç. Dr. Erhan Yaylak at Ordu Üniversitesi BYDK.
          </p>
        </div>
        <FootCol title="Product" links={[
          ['Modules', '#modules'],
          ['Workflow', '#workflow'],
          ['Pricing', '#pricing'],
          ['Editor', '#/app'],
        ]} />
        <FootCol title="References" links={[
          ['Crossref schema', 'https://www.crossref.org/documentation/schema-library/'],
          ['ORCID v3', 'https://info.orcid.org/'],
          ['Open access policy', '#'],
          ['Roadmap', '#'],
        ]} />
        <FootCol title="Correspondence" links={[
          ['hello@issuely.com', 'mailto:hello@issuely.com'],
          ['Help', '#'],
          ['Privacy', '#'],
          ['Imprint', '#'],
        ]} />
      </div>
      <div style={{ maxWidth: 1180, margin: '40px auto 0', padding: '0 28px 32px' }}>
        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-4)', textTransform: 'uppercase' }}>
            © 2026 Issuely · Crossref deposit & DOCX export, in active use since Vol. 5
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-4)', textTransform: 'uppercase' }}>
            v0.5 · Build {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
    </footer>
  );
}
function FootCol({ title, links }) {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 16 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(([l, h], i) => (
          <li key={i}>
            <a href={h} onClick={h === '#/app' ? openApp : undefined} className="ily-link" style={{
              fontFamily: SERIF_B, fontSize: 14, color: 'var(--ink-2)', textDecoration: 'none',
            }}>{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// =====================================================
// Section head — reused across sections
// =====================================================
function SectionHead({ kicker, romanIdx, title, subtitle }) {
  return (
    <header style={{ display: 'grid', gridTemplateColumns: romanIdx ? '120px 1fr' : '1fr', gap: 32, alignItems: 'baseline' }}>
      {romanIdx && (
        <div style={{
          fontFamily: SERIF_D, fontStyle: 'italic', fontSize: 88, fontWeight: 500,
          color: 'var(--gold-deep)', letterSpacing: -2, lineHeight: 0.9,
        }}>{romanIdx}</div>
      )}
      <div>
        {kicker && (
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 14 }}>
            {kicker}
          </div>
        )}
        <h2 style={{ fontFamily: SERIF_D, fontSize: 56, fontWeight: 500, letterSpacing: -1.4, margin: 0, color: 'var(--ink)', lineHeight: 1.02, maxWidth: 880 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontFamily: SERIF_B, fontStyle: 'italic', fontSize: 19, color: 'var(--ink-2)', marginTop: 18, lineHeight: 1.55, maxWidth: 680 }}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}

// =====================================================
// Responsive CSS
// =====================================================
const ResponsiveCSS = () => (
  <style>{`
    @media (max-width: 960px) {
      .ily-hero { grid-template-columns: 1fr !important; gap: 56px !important; padding: 64px 24px !important; }
      .ily-hero h1 { font-size: 56px !important; }
      .ily-mod-row { grid-template-columns: 64px 1fr !important; gap: 20px !important; }
      .ily-mod-row > :last-child { grid-column: 1 / -1; padding-left: 64px; }
      .ily-foot { grid-template-columns: 1fr 1fr !important; }
      .ily-nav a:not(:last-child) { display: none; }
    }
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
    document.title = 'Issuely — A workshop for the journal issue';
  }, []);

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh', fontFamily: SERIF_B }}>
      <style>{ROOT_STYLES}</style>
      <ResponsiveCSS />
      <Masthead />
      <Hero />
      <EditorialNote />
      <Modules />
      <Workflow />
      <Pricing />
      <Questions />
      <ClosingNote />
      <Colophon />
    </div>
  );
}
