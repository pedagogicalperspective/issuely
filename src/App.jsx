import { useState, useMemo, useEffect, useRef } from 'react';
import {
  DotsSixVertical as GripVertical,
  Plus,
  Gear as Settings,
  CaretDown as ChevronDown,
  CaretRight as ChevronRight,
  Trash as Trash2,
  BookOpen,
  FileText,
  FileCode as FileCode2,
  Image as ImageIcon,
  PaperPlaneTilt as Send,
  Hash,
  Users,
  Tag,
  Archive,
  Trophy as Award,
  Database,
  SquaresFour as Layout,
  Scroll as ScrollText,
  UserCircle as UserCheck,
  Globe,
  Envelope as Mail,
  MapPin,
  Calendar,
  Sparkle as Sparkles,
  MagnifyingGlass as Search,
  Command as CommandIcon,
  CircleNotch as Loader2,
  X,
  Check,
  Download
} from '@phosphor-icons/react';
import { Toaster, toast } from 'sonner';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';

// =====================================================
// Issuely — Issue Workspace (v0.2)
// Frontmatter sections: Cover · Masthead · Board · TOC · Reviewers · Indexing
// =====================================================

// Light theme — Pedapub-inspired clinical academic surface.
// Neutrals subtly tinted toward navy (per DESIGN.md: never pure white/black).
// Cover preview + TOC kâğıt önizlemeleri kendi koyu/krem palette'lerini
// hardcoded taşır (gerçek çıktı objesini simüle ettikleri için).
const PALETTE = {
  bg: '#FCFCFD',          // page background — tinted near-white
  surface: '#F7F8FA',     // cards, sidebar
  surfaceAlt: '#EEF0F4',  // hover, active cells
  border: '#DDE1E8',      // separators, input borders
  borderSoft: '#E8EBF0',  // subtler dividers, row separators

  text: '#1A1F2E',        // primary ink — near-black with navy undertone
  ink: '#1A1F2E',         // alias of text — for explicit "press"/"button bg" usage
  textDim: '#475569',     // secondary — slate-600
  textMuted: '#8893A6',   // captions, placeholders

  gold: '#A47929',        // deep gold — readable on white
  goldDim: '#6E531C',     // even deeper for borders/labels
  goldGlow: 'rgba(164, 121, 41, 0.07)',  // accent surface tint

  paper: '#F4EFE3',       // CREAM — used ONLY for TOC preview bg and cover-preview
  coverInk: '#F4EFE3',    // text color INSIDE the dark cover preview

  success: '#15803D',
  danger: '#B91C1C',
};

// Global CSS injected at App root — focus rings, reduced motion, shimmer keyframes
const GLOBAL_CSS = `
  :focus { outline: none; }
  :focus-visible {
    outline: 2px solid ${'#A47929'};
    outline-offset: 2px;
    border-radius: 3px;
  }
  button:focus-visible, a:focus-visible, [role="button"]:focus-visible,
  input:focus-visible, textarea:focus-visible, select:focus-visible {
    outline: 2px solid ${'#A47929'};
    outline-offset: 1px;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
  @keyframes ily-shimmer {
    0%   { background-position: -480px 0; }
    100% { background-position: 480px 0; }
  }
  @keyframes ily-spin {
    to { transform: rotate(360deg); }
  }
  .ily-skel {
    background: linear-gradient(90deg,
      #EEF0F4 0%,
      #F7F8FA 50%,
      #EEF0F4 100%);
    background-size: 960px 100%;
    animation: ily-shimmer 1.6s ease-in-out infinite;
    border-radius: 4px;
  }
  [cmdk-item][data-selected="true"] {
    background: rgba(164, 121, 41, 0.10);
    color: ${'#A47929'};
  }
  [cmdk-item] { transition: background .08s ease-out; }
`;

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

// ============== Seed data ==============

const SEED_JOURNAL = {
  name: 'Pedagogical Perspective',
  shortName: 'PedPer',
  eissn: '2822-4841',
  doiPrefix: '10.29329',
  doiPattern: 'pedper.{year}.{volume}.{issue}.{number}',
};

const SEED_ISSUE = {
  volume: 5, number: 1, year: 2026,
  pageStart: 1,
  publishDate: '2026-04-15',
  season: 'Bahar',
};

const SEED_COVER = {
  thematicFocus: 'AI Literacy in Teacher Education',
  introTr: 'Pedagogical Perspective dergisinin 2026 Bahar sayısında, yapay zekâ okuryazarlığından sosyal bilgiler eğitiminin geleceğine uzanan 19 araştırma, derleme ve olgu çalışmasını bir araya getirdik. Bu sayı, dijital dönüşümün öğretmen yetiştirme süreçlerinde açtığı yeni ufukları ele alan çalışmalara özel bir yer ayırıyor.',
  introEn: 'In the Spring 2026 issue of Pedagogical Perspective, we present 19 research articles, reviews, and case studies spanning AI literacy and the future of social studies education. This issue gives particular attention to research exploring the new horizons that digital transformation opens within teacher education.',
};

const SEED_MASTHEAD = {
  publisherTr: 'Ordu Üniversitesi',
  publisherEn: 'Ordu University',
  address: 'Cumhuriyet Yerleşkesi, Eğitim Fakültesi, 52200 Altınordu/Ordu, Türkiye',
  contactEmail: 'editor@pedagogicalperspective.com',
  website: 'https://www.pedagogicalperspective.com',
  frequency: 'Yılda 2 sayı (Bahar, Güz) / Biannual',
  languages: 'Türkçe, İngilizce / Turkish, English',
  license: 'CC BY-NC 4.0',
  startYear: 2022,
  reviewModel: 'Çift-kör hakemlik / Double-blind peer review',
  apc: 'Makale işlem ücreti alınmamaktadır / No APC',
};

const SEED_BOARD = {
  editorInChief: { title: 'Doç. Dr.', first: 'Erhan', last: 'Yaylak', institution: 'Ordu Üniversitesi, Türkiye', orcid: '0000-0003-1163-9626' },
  associateEditors: [
    { title: 'Prof. Dr.', first: 'Author', last: 'Name', institution: 'Hacettepe Üniversitesi, Türkiye', orcid: '0000-0001-0000-0001' },
    { title: 'Doç. Dr.', first: 'Author', last: 'Name', institution: 'Ankara Üniversitesi, Türkiye', orcid: '0000-0002-0000-0002' },
  ],
  sectionEditors: [
    { title: 'Doç. Dr.', first: 'Author', last: 'Name', institution: 'Marmara Üniversitesi, Türkiye', orcid: '0000-0003-0000-0003', section: 'Öğretmen Eğitimi' },
    { title: 'Dr.', first: 'Author', last: 'Name', institution: 'Boğaziçi Üniversitesi, Türkiye', orcid: '0000-0001-0000-0004', section: 'Eğitim Teknolojileri' },
    { title: 'Doç. Dr.', first: 'Author', last: 'Name', institution: 'ODTÜ, Türkiye', orcid: '0000-0002-0000-0005', section: 'Nitel Araştırma' },
  ],
  editorialBoard: [
    { title: 'Prof. Dr.', first: 'Author', last: 'Name', institution: 'İstanbul Üniversitesi, Türkiye', orcid: '0000-0003-0000-0006' },
    { title: 'Prof. Dr.', first: 'Author', last: 'Name', institution: 'Gazi Üniversitesi, Türkiye', orcid: '0000-0001-0000-0007' },
    { title: 'Doç. Dr.', first: 'Author', last: 'Name', institution: 'Karadeniz Teknik Üniversitesi, Türkiye', orcid: '0000-0002-0000-0008' },
    { title: 'Doç. Dr.', first: 'Author', last: 'Name', institution: 'Atatürk Üniversitesi, Türkiye', orcid: '0000-0003-0000-0009' },
  ],
  internationalBoard: [
    { title: 'Prof. Dr.', first: 'Author', last: 'Name', institution: 'University of Cambridge, UK', orcid: '0000-0001-0000-0010' },
    { title: 'Prof. Dr.', first: 'Author', last: 'Name', institution: 'University of Toronto, Canada', orcid: '0000-0002-0000-0011' },
    { title: 'Assoc. Prof.', first: 'Author', last: 'Name', institution: 'University of Vienna, Austria', orcid: '0000-0003-0000-0012' },
  ],
};

const SEED_REVIEWERS = [
  { title: 'Prof. Dr.', first: 'Ahmet', last: 'Aslan', institution: 'Ankara Üniversitesi', country: 'Türkiye' },
  { title: 'Doç. Dr.', first: 'Beste', last: 'Çelik', institution: 'Boğaziçi Üniversitesi', country: 'Türkiye' },
  { title: 'Dr.', first: 'Cansu', last: 'Demir', institution: 'Hacettepe Üniversitesi', country: 'Türkiye' },
  { title: 'Doç. Dr.', first: 'Derya', last: 'Erdem', institution: 'ODTÜ', country: 'Türkiye' },
  { title: 'Prof. Dr.', first: 'Emre', last: 'Fırat', institution: 'İstanbul Üniversitesi', country: 'Türkiye' },
  { title: 'Doç. Dr.', first: 'Funda', last: 'Güneş', institution: 'Marmara Üniversitesi', country: 'Türkiye' },
  { title: 'Dr.', first: 'Gökhan', last: 'Halil', institution: 'Gazi Üniversitesi', country: 'Türkiye' },
  { title: 'Prof. Dr.', first: 'Hülya', last: 'İnce', institution: 'Karadeniz Teknik Üniversitesi', country: 'Türkiye' },
  { title: 'Doç. Dr.', first: 'İbrahim', last: 'Kaya', institution: 'Bursa Uludağ Üniversitesi', country: 'Türkiye' },
  { title: 'Dr.', first: 'Jale', last: 'Levent', institution: 'Akdeniz Üniversitesi', country: 'Türkiye' },
  { title: 'Doç. Dr.', first: 'Kerem', last: 'Mert', institution: 'Ege Üniversitesi', country: 'Türkiye' },
  { title: 'Prof. Dr.', first: 'Leyla', last: 'Naz', institution: 'Dokuz Eylül Üniversitesi', country: 'Türkiye' },
  { title: 'Assoc. Prof.', first: 'Maria', last: 'Oliveira', institution: 'University of Lisbon', country: 'Portugal' },
  { title: 'Doç. Dr.', first: 'Nuri', last: 'Polat', institution: 'Atatürk Üniversitesi', country: 'Türkiye' },
  { title: 'Dr.', first: 'Onur', last: 'Rauf', institution: 'Sakarya Üniversitesi', country: 'Türkiye' },
  { title: 'Prof. Dr.', first: 'Pelin', last: 'Sezer', institution: 'Ondokuz Mayıs Üniversitesi', country: 'Türkiye' },
  { title: 'Dr.', first: 'Rana', last: 'Tuna', institution: 'Anadolu Üniversitesi', country: 'Türkiye' },
  { title: 'Assoc. Prof.', first: 'Stefan', last: 'Vogel', institution: 'University of Vienna', country: 'Austria' },
  { title: 'Doç. Dr.', first: 'Şükrü', last: 'Yalın', institution: 'Çukurova Üniversitesi', country: 'Türkiye' },
  { title: 'Dr.', first: 'Tolga', last: 'Zafer', institution: 'Ordu Üniversitesi', country: 'Türkiye' },
];

const SEED_INDEXING = [
  { name: 'TR Dizin', status: 'indexed', since: 2024, category: 'Sosyal Bilimler' },
  { name: 'DOAJ', status: 'indexed', since: 2024, category: 'Açık Erişim' },
  { name: 'ASOS Index', status: 'indexed', since: 2022, category: 'Sosyal Bilimler' },
  { name: 'Index Copernicus', status: 'indexed', since: 2023, category: 'Uluslararası' },
  { name: 'Google Scholar', status: 'indexed', since: 2022, category: 'Genel' },
  { name: 'ERIC', status: 'pending', since: null, category: 'Eğitim' },
  { name: 'Scopus', status: 'pending', since: null, category: 'Uluslararası' },
  { name: 'Web of Science (ESCI)', status: 'pending', since: null, category: 'Uluslararası' },
];

const TYPE_LABELS = {
  research: { tr: 'Araştırma', color: '#7DBF8F' },
  review: { tr: 'Derleme', color: '#D4A84A' },
  case: { tr: 'Olgu', color: '#9B89D9' },
  editorial: { tr: 'Editöryel', color: '#D97874' },
};

const seedArticles = () => {
  const raw = [
    { titleTr: 'Öğretmen adaylarının yapay zekâ okuryazarlığı: Karma yöntem bir araştırma', titleEn: 'Pre-service teachers\' AI literacy: A mixed-methods study', authors: [['Erhan', 'Yaylak', '0000-0003-1163-9626'], ['Nazlı Begüm', 'Güven', '0000-0002-1234-5678']], pages: 22, type: 'research', keywords: ['yapay zekâ okuryazarlığı', 'öğretmen eğitimi', 'karma yöntem'] },
    { titleTr: 'Sosyal bilgiler öğretiminde etkileşimli defter uygulamaları', titleEn: 'Interactive notebook practices in social studies teaching', authors: [['Ayşe', 'Demir', '0000-0001-2345-6789']], pages: 18, type: 'research', keywords: ['etkileşimli defter', 'sosyal bilgiler', 'aktif öğrenme'] },
    { titleTr: 'Dijital vatandaşlık yetkinlikleri üzerine fenomenolojik bir inceleme', titleEn: 'A phenomenological inquiry into digital citizenship competencies', authors: [['Mehmet', 'Kaya', '0000-0002-3456-7890'], ['Zeynep', 'Aksoy', '0000-0003-4567-8901']], pages: 20, type: 'research', keywords: ['dijital vatandaşlık', 'fenomenoloji'] },
    { titleTr: 'Çevrimiçi öğretimde sınıf yönetimi: Sistematik bir derleme', titleEn: 'Classroom management in online teaching: A systematic review', authors: [['Ali', 'Şahin', '0000-0001-3456-7890']], pages: 24, type: 'review', keywords: ['çevrimiçi öğretim', 'sınıf yönetimi'] },
    { titleTr: 'Sosyal bilgiler ders kitaplarında değerler eğitimi', titleEn: 'Values education in social studies textbooks', authors: [['Fatma', 'Yıldız', '0000-0002-4567-8901'], ['Hasan', 'Çelik', '0000-0003-5678-9012']], pages: 16, type: 'research', keywords: ['değerler eğitimi', 'ders kitabı'] },
    { titleTr: 'Müze eğitimi ve öğretmen yetiştirme: Bir model önerisi', titleEn: 'Museum education and teacher training: A model proposal', authors: [['Emine', 'Arslan', '0000-0001-5678-9012']], pages: 14, type: 'research', keywords: ['müze eğitimi', 'model'] },
    { titleTr: 'Sosyal bilgiler öğretmen adaylarının Web 3.0 araçlarına yönelik tutumları', titleEn: 'Pre-service social studies teachers\' attitudes toward Web 3.0 tools', authors: [['Burak', 'Öztürk', '0000-0002-6789-0123']], pages: 19, type: 'research', keywords: ['Web 3.0', 'tutum'] },
    { titleTr: 'Coğrafi düşünme becerileri ve harita okuryazarlığı', titleEn: 'Geographic thinking skills and map literacy', authors: [['Selin', 'Koç', '0000-0003-7890-1234'], ['Tolga', 'Aydın', '0000-0001-8901-2345']], pages: 17, type: 'research', keywords: ['coğrafi düşünme', 'harita'] },
    { titleTr: 'Yapay zekâ destekli öğretim materyali geliştirme: Bir vaka çalışması', titleEn: 'AI-supported instructional material development: A case study', authors: [['Murat', 'Korkmaz', '0000-0002-9012-3456']], pages: 21, type: 'case', keywords: ['yapay zekâ', 'materyal geliştirme'] },
    { titleTr: 'Tarih öğretiminde dijital hikâye anlatımı', titleEn: 'Digital storytelling in history teaching', authors: [['Gül', 'Erdoğan', '0000-0003-0123-4567']], pages: 15, type: 'research', keywords: ['dijital hikâye', 'tarih'] },
    { titleTr: 'Sosyal bilgiler eğitiminde sürdürülebilir kalkınma temaları', titleEn: 'Sustainable development themes in social studies education', authors: [['Deniz', 'Yılmaz', '0000-0001-1234-0987'], ['Cem', 'Polat', '0000-0002-2345-1098']], pages: 18, type: 'research', keywords: ['sürdürülebilirlik'] },
    { titleTr: 'Öğretmen profesyonel kimliği gelişimi üzerine nitel bir araştırma', titleEn: 'A qualitative study on teacher professional identity development', authors: [['Pınar', 'Uçar', '0000-0003-3456-2109']], pages: 23, type: 'research', keywords: ['profesyonel kimlik', 'nitel araştırma'] },
    { titleTr: 'Sınıf içi tartışma stratejileri: Eleştirel düşünmeye etkisi', titleEn: 'In-class discussion strategies: Effects on critical thinking', authors: [['Onur', 'Bal', '0000-0001-4567-3210']], pages: 16, type: 'research', keywords: ['tartışma', 'eleştirel düşünme'] },
    { titleTr: 'Erken çocuklukta vatandaşlık eğitimi: Bir derleme', titleEn: 'Citizenship education in early childhood: A review', authors: [['Esra', 'Acar', '0000-0002-5678-4321']], pages: 14, type: 'review', keywords: ['erken çocukluk', 'vatandaşlık'] },
    { titleTr: 'Sosyal bilgilerde göç konusunun öğretimi: Karma desen', titleEn: 'Teaching migration in social studies: A mixed design', authors: [['Berk', 'Tunç', '0000-0003-6789-5432']], pages: 20, type: 'research', keywords: ['göç', 'karma desen'] },
    { titleTr: 'Mikro-öğretim deneyimlerinde teknoloji entegrasyonu', titleEn: 'Technology integration in microteaching experiences', authors: [['Ceren', 'Kara', '0000-0001-7890-6543']], pages: 17, type: 'research', keywords: ['mikro-öğretim', 'teknoloji'] },
    { titleTr: 'Salgın sonrası uzaktan eğitim algıları', titleEn: 'Post-pandemic perceptions of distance education', authors: [['Furkan', 'Avcı', '0000-0002-8901-7654'], ['Melisa', 'Şen', '0000-0003-9012-8765']], pages: 19, type: 'research', keywords: ['uzaktan eğitim', 'salgın'] },
    { titleTr: 'Sosyal bilgiler dersinde oyun temelli öğrenme uygulaması', titleEn: 'Game-based learning application in social studies', authors: [['Yasin', 'Dağ', '0000-0001-0987-6543']], pages: 15, type: 'case', keywords: ['oyun temelli öğrenme'] },
    { titleTr: 'Eğitim teknolojileri politikalarının karşılaştırmalı analizi', titleEn: 'A comparative analysis of educational technology policies', authors: [['Beste', 'İlhan', '0000-0002-0987-5432']], pages: 22, type: 'review', keywords: ['eğitim politikası', 'karşılaştırmalı analiz'] },
  ];
  return raw.map((a, i) => ({
    id: `art-${i + 1}-${Math.random().toString(36).slice(2, 7)}`,
    titleTr: a.titleTr, titleEn: a.titleEn,
    authors: a.authors.map(([first, last, orcid]) => ({ first, last, orcid })),
    pages: a.pages, type: a.type, keywords: a.keywords,
  }));
};

// ============== Utilities ==============

const padNumber = (n, w = 2) => String(n).padStart(w, '0');

const computeDOI = (journal, issue, idx) => {
  const tail = journal.doiPattern
    .replace('{year}', issue.year).replace('{volume}', issue.volume)
    .replace('{issue}', issue.number).replace('{number}', padNumber(idx));
  return `${journal.doiPrefix}/${tail}`;
};

const computePageRanges = (articles, pageStart) => {
  let cursor = pageStart;
  return articles.map(a => {
    const start = cursor;
    const end = start + a.pages - 1;
    cursor = end + 1;
    return { ...a, pageStart: start, pageEnd: end };
  });
};

// ============== Canvas helpers ==============

// Word-wraps text into lines that each fit `maxWidth` under the current ctx.font.
const wrapText = (ctx, text, maxWidth) => {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let line = words[0];
  for (let i = 1; i < words.length; i++) {
    const test = line + ' ' + words[i];
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      lines.push(line);
      line = words[i];
    }
  }
  lines.push(line);
  return lines;
};

// ============== Crossref XML helpers ==============

const xmlEsc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

// 'YYYY-MM-DD' → {year, month, day}. Falls back to today if unparseable.
const parsePublishDate = (str) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(str || '').trim());
  if (m) return { year: m[1], month: m[2], day: m[3] };
  const y = /^(\d{4})$/.exec(String(str || '').trim());
  if (y) return { year: y[1], month: null, day: null };
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return { year: String(d.getFullYear()), month: p(d.getMonth() + 1), day: p(d.getDate()) };
};

const crossrefBatchId = () => {
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  return `issuely-${ts}-${Math.random().toString(36).slice(2, 8)}`;
};

const crossrefTimestamp = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
};

const ORCID_RE = /^\d{4}-\d{4}-\d{4}-[\dXx]{4}$/;

const renderPubDate = (pub, indent) => {
  const parts = [`${indent}<publication_date media_type="online">`];
  if (pub.month) parts.push(`${indent}  <month>${pub.month}</month>`);
  if (pub.day) parts.push(`${indent}  <day>${pub.day}</day>`);
  parts.push(`${indent}  <year>${pub.year}</year>`);
  parts.push(`${indent}</publication_date>`);
  return parts.join('\n');
};

// Builds a Crossref schema 5.3.1 deposit XML for the entire issue.
// Pure function — no DOM, no fetch. Returns the XML string.
const buildCrossrefXml = ({ journal, issue, paginated, masthead }) => {
  const pub = parsePublishDate(issue.publishDate);
  const baseUrl = String(masthead.website || '').replace(/\/$/, '') || 'https://example.org';

  const articlesXml = paginated.map((a, i) => {
    const doi = computeDOI(journal, issue, i + 1);
    const tailWithoutPrefix = doi.split('/').slice(1).join('/');
    const resource = `${baseUrl}/articles/${tailWithoutPrefix}`;

    const contributorsXml = a.authors.map((au, idx) => {
      const orcid = (au.orcid || '').trim();
      const orcidLine = ORCID_RE.test(orcid)
        ? `\n            <ORCID>https://orcid.org/${xmlEsc(orcid)}</ORCID>`
        : '';
      return `          <person_name contributor_role="author" sequence="${idx === 0 ? 'first' : 'additional'}">
            <given_name>${xmlEsc(au.first || '')}</given_name>
            <surname>${xmlEsc(au.last || '')}</surname>${orcidLine}
          </person_name>`;
    }).join('\n');

    const titleTr = xmlEsc(a.titleTr || '');
    const titleEn = xmlEsc(a.titleEn || '');
    const titlesXml = titleEn
      ? `        <titles>
          <title>${titleTr}</title>
          <original_language_title language="en">${titleEn}</original_language_title>
        </titles>`
      : `        <titles>
          <title>${titleTr}</title>
        </titles>`;

    return `      <journal_article publication_type="full_text" language="tr">
${titlesXml}
        <contributors>
${contributorsXml}
        </contributors>
${renderPubDate(pub, '        ')}
        <pages>
          <first_page>${a.pageStart}</first_page>
          <last_page>${a.pageEnd}</last_page>
        </pages>
        <doi_data>
          <doi>${xmlEsc(doi)}</doi>
          <resource>${xmlEsc(resource)}</resource>
        </doi_data>
      </journal_article>`;
  }).join('\n');

  const depositorName = masthead.publisherEn || masthead.publisherTr || journal.name;
  const depositorEmail = masthead.contactEmail || 'editor@example.org';

  return `<?xml version="1.0" encoding="UTF-8"?>
<doi_batch xmlns="http://www.crossref.org/schema/5.3.1"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://www.crossref.org/schema/5.3.1 https://www.crossref.org/schemas/crossref5.3.1.xsd"
           version="5.3.1">
  <head>
    <doi_batch_id>${crossrefBatchId()}</doi_batch_id>
    <timestamp>${crossrefTimestamp()}</timestamp>
    <depositor>
      <depositor_name>${xmlEsc(depositorName)}</depositor_name>
      <email_address>${xmlEsc(depositorEmail)}</email_address>
    </depositor>
    <registrant>${xmlEsc(depositorName)}</registrant>
  </head>
  <body>
    <journal>
      <journal_metadata language="en">
        <full_title>${xmlEsc(journal.name)}</full_title>
        <abbrev_title>${xmlEsc(journal.shortName)}</abbrev_title>
        <issn media_type="electronic">${xmlEsc(journal.eissn)}</issn>
      </journal_metadata>
      <journal_issue>
${renderPubDate(pub, '        ')}
        <journal_volume>
          <volume>${xmlEsc(issue.volume)}</volume>
        </journal_volume>
        <issue>${xmlEsc(issue.number)}</issue>
      </journal_issue>
${articlesXml}
    </journal>
  </body>
</doi_batch>
`;
};

// ============== Sections nav config ==============

const SECTIONS = [
  { id: 'cover', label: 'Kapak', icon: ImageIcon, romanIdx: 'i' },
  { id: 'masthead', label: 'Jenerik', icon: ScrollText, romanIdx: 'ii' },
  { id: 'board', label: 'Editör Kurulu', icon: Users, romanIdx: 'iii' },
  { id: 'indexing', label: 'İndeks Bilgisi', icon: Database, romanIdx: 'iv' },
  { id: 'toc', label: 'İçindekiler', icon: Layout, romanIdx: 'v' },
  { id: 'articles', label: 'Makaleler', icon: FileText, romanIdx: '1' },
  { id: 'reviewers', label: 'Sayı Hakemleri', icon: UserCheck, romanIdx: 'vi' },
];

// ============== UI primitives ==============

const StatusPill = ({ label, color, dim }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 9px', fontSize: 11,
    fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
    letterSpacing: 0.3, textTransform: 'uppercase',
    color: dim ? PALETTE.textMuted : color,
    background: dim ? 'transparent' : `${color}15`,
    border: `1px solid ${dim ? PALETTE.borderSoft : color + '40'}`,
    borderRadius: 999,
  }}>
    <span style={{ width: 5, height: 5, borderRadius: 999, background: dim ? PALETTE.textMuted : color }} />
    {label}
  </span>
);

const SectionHeader = ({ romanIdx, title, subtitle, count }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    marginBottom: 28, paddingBottom: 18,
    borderBottom: `1px solid ${PALETTE.borderSoft}`,
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
      <div style={{
        fontFamily: 'Fraunces, serif', fontSize: 32, fontStyle: 'italic', fontWeight: 500,
        color: PALETTE.goldDim, paddingTop: 0, minWidth: 32, lineHeight: 1, letterSpacing: -1,
      }}>{(romanIdx || '').toUpperCase()}</div>
      <div>
        <h2 style={{
          fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 500,
          color: PALETTE.ink, margin: 0, letterSpacing: -0.7, lineHeight: 1.05,
        }}>{title}</h2>
        <p style={{
          fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 14, color: PALETTE.textDim,
          margin: '8px 0 0', maxWidth: 640, lineHeight: 1.5,
        }}>{subtitle}</p>
      </div>
    </div>
    {count !== undefined && count !== null && (
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
        color: PALETTE.textMuted, letterSpacing: 0.5,
      }}>
        <Hash size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
        {count}
      </div>
    )}
  </div>
);

const FieldLabel = ({ children }) => (
  <div style={{
    fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase',
    color: PALETTE.textMuted, fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500, marginBottom: 6,
  }}>{children}</div>
);

const TextField = ({ value, onChange, placeholder, mono, multiline, rows = 3 }) => {
  const style = {
    width: '100%', padding: '10px 12px',
    background: PALETTE.bg, border: `1px solid ${PALETTE.border}`,
    color: PALETTE.text, borderRadius: 4, outline: 'none',
    fontFamily: mono ? 'JetBrains Mono, monospace' : 'DM Sans, sans-serif',
    fontSize: mono ? 12 : 13,
    lineHeight: 1.55,
    transition: 'border-color 0.12s ease-out',
    resize: multiline ? 'vertical' : 'none',
    boxSizing: 'border-box',
  };
  if (multiline) {
    return <textarea value={value} placeholder={placeholder} rows={rows}
      onChange={e => onChange(e.target.value)}
      style={style}
      onFocus={e => e.currentTarget.style.borderColor = PALETTE.gold}
      onBlur={e => e.currentTarget.style.borderColor = PALETTE.border} />;
  }
  return <input value={value} placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
    style={style}
    onFocus={e => e.currentTarget.style.borderColor = PALETTE.gold}
    onBlur={e => e.currentTarget.style.borderColor = PALETTE.border} />;
};

const InlineEdit = ({ value, onChange, mono, multiline, placeholder, fontSize = 14, fontWeight = 400 }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);
  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const commit = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };
  const baseStyle = {
    fontFamily: mono ? 'JetBrains Mono, monospace' : 'DM Sans, sans-serif',
    fontSize, fontWeight, color: PALETTE.text,
    background: 'transparent', border: 'none', outline: 'none',
    width: '100%', padding: '4px 6px', borderRadius: 4,
  };

  if (editing) {
    if (multiline) {
      return <textarea ref={ref} value={draft}
        onChange={e => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === 'Escape') cancel(); }}
        style={{ ...baseStyle, background: PALETTE.surfaceAlt, minHeight: 60, resize: 'vertical' }} />;
    }
    return <input ref={ref} value={draft}
      onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === 'Escape') cancel(); if (e.key === 'Enter') commit(); }}
      style={{ ...baseStyle, background: PALETTE.surfaceAlt }} />;
  }
  return <div onClick={() => setEditing(true)}
    style={{ ...baseStyle, cursor: 'text', color: value ? PALETTE.text : PALETTE.textMuted, minHeight: 22, whiteSpace: multiline ? 'pre-wrap' : 'normal' }}
    onMouseEnter={e => e.currentTarget.style.background = PALETTE.borderSoft}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >{value || placeholder}</div>;
};

// ============== Shared: Person Row ==============

const PersonRow = ({ person, onUpdate, onDelete, showSection, showCountry, deletable = true }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: showSection
      ? '85px 1fr 1fr 1fr 32px'
      : (showCountry ? '85px 1fr 1fr 1fr 90px 32px' : '85px 1fr 1fr 1.5fr 32px'),
    gap: 10, alignItems: 'center',
    padding: '10px 14px',
    background: PALETTE.surface,
    borderBottom: `1px solid ${PALETTE.borderSoft}`,
  }}>
    <input value={person.title}
      onChange={e => onUpdate({ ...person, title: e.target.value })}
      style={{ background: 'transparent', border: 'none', color: PALETTE.goldDim, fontFamily: 'DM Sans', fontSize: 12, outline: 'none', width: '100%' }} />
    <input value={person.first}
      onChange={e => onUpdate({ ...person, first: e.target.value })}
      style={{ background: 'transparent', border: 'none', color: PALETTE.text, fontFamily: 'DM Sans', fontSize: 13, outline: 'none', fontWeight: 500, width: '100%' }} />
    <input value={person.last}
      onChange={e => onUpdate({ ...person, last: e.target.value })}
      style={{ background: 'transparent', border: 'none', color: PALETTE.text, fontFamily: 'DM Sans', fontSize: 13, outline: 'none', fontWeight: 500, width: '100%' }} />
    {showSection ? (
      <input value={person.section || ''} placeholder="Bölüm/Alan"
        onChange={e => onUpdate({ ...person, section: e.target.value })}
        style={{ background: 'transparent', border: 'none', color: PALETTE.textDim, fontFamily: 'DM Sans', fontSize: 12, outline: 'none', fontStyle: 'italic', width: '100%' }} />
    ) : (
      <input value={person.institution}
        onChange={e => onUpdate({ ...person, institution: e.target.value })}
        style={{ background: 'transparent', border: 'none', color: PALETTE.textDim, fontFamily: 'DM Sans', fontSize: 12, outline: 'none', width: '100%' }} />
    )}
    {showCountry && (
      <input value={person.country || ''}
        onChange={e => onUpdate({ ...person, country: e.target.value })}
        style={{ background: 'transparent', border: 'none', color: PALETTE.textMuted, fontFamily: 'DM Sans', fontSize: 12, outline: 'none', width: '100%' }} />
    )}
    {deletable ? (
      <button onClick={onDelete}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: PALETTE.textMuted, padding: 4 }}
        onMouseEnter={e => e.currentTarget.style.color = PALETTE.danger}
        onMouseLeave={e => e.currentTarget.style.color = PALETTE.textMuted}>
        <Trash2 size={13} />
      </button>
    ) : <div />}
  </div>
);

const AddBtn = ({ onClick, label }) => (
  <button onClick={onClick}
    style={{
      width: '100%', padding: '10px',
      background: 'transparent', border: `1px dashed ${PALETTE.border}`,
      color: PALETTE.textDim, fontFamily: 'DM Sans', fontSize: 12,
      borderRadius: 4, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = PALETTE.gold; e.currentTarget.style.color = PALETTE.gold; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = PALETTE.border; e.currentTarget.style.color = PALETTE.textDim; }}
  >
    <Plus size={14} /> {label}
  </button>
);

// ============== Cover Section ==============

const CoverSection = ({ cover, setCover, issue, setIssue, journal, onGenerateIntro, introGenerating }) => (
  <>
    <SectionHeader romanIdx="i" title="Kapak" subtitle="Sayının yüzü: tema vurgusu, sezon ve sayıya giriş paragrafı." />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <div>
        <FieldLabel>Kapak Önizleme</FieldLabel>
        {/* Cover preview keeps the navy/gold cover look — hardcoded, independent
            of the light app shell. It represents the actual printed cover. */}
        <div style={{
          aspectRatio: '210 / 297',
          background: 'linear-gradient(135deg, #1A2440 0%, #0B1220 100%)',
          border: '1px solid #1B2540',
          borderRadius: 4,
          padding: '40px 32px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
        }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#D4A84A', letterSpacing: 2, textTransform: 'uppercase' }}>
              eISSN {journal.eissn}
            </div>
            <div style={{
              fontFamily: 'Fraunces, serif', fontSize: 36, fontStyle: 'italic',
              fontWeight: 500, color: PALETTE.coverInk, lineHeight: 1.05,
              marginTop: 14, letterSpacing: -1,
            }}>{journal.name}</div>
            <div style={{ marginTop: 20, fontFamily: 'Fraunces, serif', fontSize: 13, color: '#8FA0BF', fontStyle: 'italic' }}>
              An open-access journal of educational research
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: '#D4A84A', letterSpacing: 1.5, textTransform: 'uppercase',
            }}>{cover.thematicFocus}</div>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 34, color: PALETTE.coverInk, fontWeight: 500 }}>
                Vol. {issue.volume}
              </span>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 34, color: '#D4A84A', fontStyle: 'italic' }}>
                No. {issue.number}
              </span>
            </div>
            <div style={{ marginTop: 4, fontFamily: 'Fraunces, serif', fontSize: 16, color: '#8FA0BF', fontStyle: 'italic' }}>
              {issue.season} {issue.year}
            </div>
          </div>
          <div style={{
            position: 'absolute', top: 16, right: 18,
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid #8E7536',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Fraunces, serif', fontSize: 14, fontStyle: 'italic', color: '#D4A84A',
          }}>P</div>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: PALETTE.textMuted, fontStyle: 'italic', fontFamily: 'DM Sans' }}>
          Canlı önizleme — alttaki alanlar değiştirilince anında güncellenir.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <FieldLabel>Tematik Odak (Kapakta görünür)</FieldLabel>
          <TextField value={cover.thematicFocus} onChange={v => setCover({ ...cover, thematicFocus: v })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <FieldLabel>Sezon</FieldLabel>
            <TextField value={issue.season} onChange={v => setIssue({ ...issue, season: v })} />
          </div>
          <div>
            <FieldLabel>Yayın Tarihi</FieldLabel>
            <TextField value={issue.publishDate} onChange={v => setIssue({ ...issue, publishDate: v })} mono />
          </div>
        </div>

        {/* AI intro generator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          background: PALETTE.goldGlow,
          border: `1px solid ${PALETTE.goldDim}`,
          borderRadius: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <Sparkles size={16} color={PALETTE.gold} weight="regular" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: PALETTE.text, fontFamily: 'DM Sans', fontWeight: 600 }}>
                Sayı tanıtım paragrafı taslağı
              </div>
              <div style={{ fontSize: 11, color: PALETTE.textDim, fontFamily: 'DM Sans', marginTop: 3, fontStyle: 'italic' }}>
                Tematik odak + makale başlıklarından TR + EN draft. Claude Sonnet 4.6.
              </div>
            </div>
          </div>
          <button onClick={onGenerateIntro} disabled={introGenerating}
            style={{
              padding: '8px 14px', borderRadius: 4,
              background: introGenerating ? PALETTE.surfaceAlt : PALETTE.ink ?? '#1A1F2E',
              color: introGenerating ? PALETTE.textDim : PALETTE.bg,
              border: `1px solid ${introGenerating ? PALETTE.border : (PALETTE.ink ?? '#1A1F2E')}`,
              cursor: introGenerating ? 'wait' : 'pointer',
              fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap',
              transition: 'opacity 0.12s, background 0.12s',
            }}
            onMouseEnter={e => { if (!introGenerating) e.currentTarget.style.opacity = '0.92'; }}
            onMouseLeave={e => { if (!introGenerating) e.currentTarget.style.opacity = '1'; }}>
            {introGenerating ? (
              <><Loader2 size={13} className="ily-spin" style={{ animation: 'ily-spin 0.8s linear infinite' }} /> <span>Üretiliyor</span></>
            ) : (
              <><Sparkles size={13} /> <span>Taslak üret</span></>
            )}
          </button>
        </div>

        <div>
          <FieldLabel>Sayı Tanıtım Paragrafı (TR)</FieldLabel>
          <IntroSwap busy={introGenerating && !cover.introTr}
            value={cover.introTr}
            onChange={v => setCover({ ...cover, introTr: v })} />
        </div>
        <div>
          <FieldLabel>Issue Introduction (EN)</FieldLabel>
          <IntroSwap busy={introGenerating && !cover.introEn}
            value={cover.introEn}
            onChange={v => setCover({ ...cover, introEn: v })} />
        </div>
      </div>
    </div>
  </>
);

const IntroSkeleton = ({ lines = 5 }) => (
  <div style={{
    padding: 14,
    background: PALETTE.surface,
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 4,
    display: 'flex', flexDirection: 'column', gap: 8,
  }}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="ily-skel" style={{
        height: 12,
        width: i === lines - 1 ? '62%' : '100%',
      }} />
    ))}
  </div>
);

// Cross-fade between AI shimmer skeleton and editable TextField with blur,
// so the moment the AI delivers reads as "this content materialized."
const IntroSwap = ({ busy, value, onChange }) => (
  <AnimatePresence mode="wait" initial={false}>
    {busy ? (
      <motion.div key="skel"
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(4px)' }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <IntroSkeleton lines={5} />
      </motion.div>
    ) : (
      <motion.div key="field"
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(2px)' }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <TextField value={value} onChange={onChange} multiline rows={6} />
      </motion.div>
    )}
  </AnimatePresence>
);

// ============== Masthead Section ==============

const MastheadSection = ({ masthead, setMasthead, journal }) => {
  const set = (k, v) => setMasthead({ ...masthead, [k]: v });
  return (
    <>
      <SectionHeader romanIdx="ii" title="Jenerik" subtitle="Künye sayfası: yayıncı bilgisi, iletişim, lisans, yayın modeli." />
      <div style={{
        background: PALETTE.surface, border: `1px solid ${PALETTE.border}`,
        borderRadius: 4, padding: 24,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <FieldLabel><MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Yayıncı (TR)</FieldLabel>
              <TextField value={masthead.publisherTr} onChange={v => set('publisherTr', v)} />
            </div>
            <div>
              <FieldLabel>Publisher (EN)</FieldLabel>
              <TextField value={masthead.publisherEn} onChange={v => set('publisherEn', v)} />
            </div>
            <div>
              <FieldLabel>Adres</FieldLabel>
              <TextField value={masthead.address} onChange={v => set('address', v)} multiline rows={2} />
            </div>
            <div>
              <FieldLabel><Mail size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> İletişim E-postası</FieldLabel>
              <TextField value={masthead.contactEmail} onChange={v => set('contactEmail', v)} mono />
            </div>
            <div>
              <FieldLabel><Globe size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Web Sitesi</FieldLabel>
              <TextField value={masthead.website} onChange={v => set('website', v)} mono />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <FieldLabel>Kuruluş Yılı</FieldLabel>
                <TextField value={masthead.startYear} onChange={v => set('startYear', v)} mono />
              </div>
              <div>
                <FieldLabel>eISSN</FieldLabel>
                <div style={{ padding: '10px 12px', background: PALETTE.bg, border: `1px solid ${PALETTE.borderSoft}`, borderRadius: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: PALETTE.goldDim }}>
                  {journal.eissn}
                </div>
              </div>
            </div>
            <div>
              <FieldLabel><Calendar size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Yayın Sıklığı</FieldLabel>
              <TextField value={masthead.frequency} onChange={v => set('frequency', v)} />
            </div>
            <div>
              <FieldLabel>Yayın Dilleri</FieldLabel>
              <TextField value={masthead.languages} onChange={v => set('languages', v)} />
            </div>
            <div>
              <FieldLabel>Lisans</FieldLabel>
              <TextField value={masthead.license} onChange={v => set('license', v)} mono />
            </div>
            <div>
              <FieldLabel>Hakemlik Modeli</FieldLabel>
              <TextField value={masthead.reviewModel} onChange={v => set('reviewModel', v)} />
            </div>
            <div>
              <FieldLabel>Makale İşlem Ücreti (APC)</FieldLabel>
              <TextField value={masthead.apc} onChange={v => set('apc', v)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ============== Board Section ==============

const BoardSection = ({ board, setBoard }) => {
  const updateGroup = (key, idx, person) => {
    if (key === 'editorInChief') return setBoard({ ...board, editorInChief: person });
    const next = [...board[key]]; next[idx] = person;
    setBoard({ ...board, [key]: next });
  };
  const addToGroup = (key) => {
    const newP = { title: 'Dr.', first: 'Ad', last: 'Soyad', institution: 'Kurum, Ülke', orcid: '' };
    setBoard({ ...board, [key]: [...board[key], newP] });
  };
  const removeFromGroup = (key, idx) => {
    setBoard({ ...board, [key]: board[key].filter((_, i) => i !== idx) });
  };

  const groups = [
    { key: 'editorInChief', label: 'Baş Editör', single: true },
    { key: 'associateEditors', label: 'Yardımcı Editörler' },
    { key: 'sectionEditors', label: 'Bölüm Editörleri', showSection: true },
    { key: 'editorialBoard', label: 'Yayın Kurulu (Yurt İçi)' },
    { key: 'internationalBoard', label: 'Uluslararası Danışma Kurulu' },
  ];

  const totalCount = 1 + board.associateEditors.length + board.sectionEditors.length +
    board.editorialBoard.length + board.internationalBoard.length;

  return (
    <>
      <SectionHeader romanIdx="iii" title="Editör Kurulu" subtitle="Hiyerarşik editör listesi: jenerik sayfasının arkasında basılan kurul." count={totalCount} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {groups.map(g => (
          <div key={g.key}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
              <h3 style={{
                fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 500,
                color: PALETTE.gold, margin: 0, fontStyle: 'italic',
              }}>{g.label}</h3>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: PALETTE.textMuted }}>
                {g.single ? '' : `${board[g.key].length} kişi`}
              </span>
            </div>
            <div style={{
              background: PALETTE.surface, border: `1px solid ${PALETTE.border}`,
              borderRadius: 4, overflow: 'hidden',
            }}>
              {g.single ? (
                <PersonRow person={board.editorInChief}
                  deletable={false}
                  onUpdate={p => updateGroup('editorInChief', 0, p)}
                  onDelete={() => {}} />
              ) : (
                board[g.key].map((p, i) => (
                  <PersonRow key={i} person={p}
                    showSection={g.showSection}
                    onUpdate={np => updateGroup(g.key, i, np)}
                    onDelete={() => removeFromGroup(g.key, i)} />
                ))
              )}
            </div>
            {!g.single && (
              <div style={{ marginTop: 6 }}>
                <AddBtn onClick={() => addToGroup(g.key)} label={`${g.label} ekle`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

// ============== Reviewers Section ==============

const ReviewersSection = ({ reviewers, setReviewers }) => {
  const sorted = useMemo(() => [...reviewers].sort((a, b) =>
    (a.last + a.first).localeCompare(b.last + b.first, 'tr')
  ), [reviewers]);

  const update = (idx, p) => {
    const realIdx = reviewers.indexOf(sorted[idx]);
    const next = [...reviewers]; next[realIdx] = p;
    setReviewers(next);
  };
  const remove = (idx) => {
    const realIdx = reviewers.indexOf(sorted[idx]);
    setReviewers(reviewers.filter((_, i) => i !== realIdx));
  };
  const add = () => {
    setReviewers([...reviewers, { title: 'Dr.', first: 'Ad', last: 'Soyad', institution: 'Kurum', country: 'Türkiye' }]);
  };

  return (
    <>
      <SectionHeader romanIdx="vi" title="Sayı Hakemleri" subtitle="Bu sayıda hakemlik yapan akademisyenlerin teşekkür listesi. Soyada göre alfabetik sıralanır." count={reviewers.length} />
      <div style={{
        padding: '10px 14px', background: PALETTE.surface,
        border: `1px solid ${PALETTE.borderSoft}`, borderRadius: 4,
        marginBottom: 8,
        display: 'grid',
        gridTemplateColumns: '85px 1fr 1fr 1fr 90px 32px',
        gap: 10, fontSize: 10, letterSpacing: 1.2,
        color: PALETTE.textMuted, textTransform: 'uppercase', fontFamily: 'DM Sans',
      }}>
        <div>Unvan</div><div>Ad</div><div>Soyad</div><div>Kurum</div><div>Ülke</div><div></div>
      </div>
      <div style={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 4, overflow: 'hidden' }}>
        {sorted.map((p, i) => (
          <PersonRow key={`${p.last}-${p.first}-${i}`} person={p}
            showCountry
            onUpdate={np => update(i, np)} onDelete={() => remove(i)} />
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <AddBtn onClick={add} label="Hakem ekle" />
      </div>
      <div style={{
        marginTop: 16, padding: 14,
        background: PALETTE.surface, border: `1px dashed ${PALETTE.borderSoft}`,
        borderRadius: 4, fontSize: 11, color: PALETTE.textMuted, fontFamily: 'DM Sans',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Award size={14} color={PALETTE.gold} weight="regular" />
        <span>Bu liste frontmatter DOCX'te <em>"Bu Sayının Hakemleri / Reviewers of This Issue"</em> başlığı altında basılacak.</span>
      </div>
    </>
  );
};

// ============== Indexing Section ==============

const IndexRow = ({ item, onUpdate, onDelete }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '1fr 1fr 90px 32px',
    gap: 10, padding: '12px 14px', alignItems: 'center',
    borderBottom: `1px solid ${PALETTE.borderSoft}`,
  }}>
    <input value={item.name} onChange={e => onUpdate({ ...item, name: e.target.value })}
      style={{ background: 'transparent', border: 'none', color: PALETTE.text, fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, outline: 'none', width: '100%' }} />
    <input value={item.category || ''} placeholder="Kategori"
      onChange={e => onUpdate({ ...item, category: e.target.value })}
      style={{ background: 'transparent', border: 'none', color: PALETTE.textDim, fontFamily: 'DM Sans', fontSize: 11, fontStyle: 'italic', outline: 'none', width: '100%' }} />
    <select value={item.status || 'pending'} onChange={e => onUpdate({ ...item, status: e.target.value })}
      style={{ background: PALETTE.bg, border: `1px solid ${PALETTE.borderSoft}`, color: PALETTE.textDim, fontFamily: 'DM Sans', fontSize: 11, padding: '4px 6px', borderRadius: 3, outline: 'none' }}>
      <option value="indexed">Dizinli</option>
      <option value="pending">Beklemede</option>
    </select>
    <button onClick={onDelete}
      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: PALETTE.textMuted, padding: 4 }}
      onMouseEnter={e => e.currentTarget.style.color = PALETTE.danger}
      onMouseLeave={e => e.currentTarget.style.color = PALETTE.textMuted}>
      <Trash2 size={13} />
    </button>
  </div>
);

const IndexingSection = ({ indexing, setIndexing }) => {
  const update = (i, item) => { const next = [...indexing]; next[i] = item; setIndexing(next); };
  const remove = (i) => setIndexing(indexing.filter((_, idx) => idx !== i));
  const add = () => setIndexing([...indexing, { name: 'Yeni İndeks', status: 'pending', since: null, category: '' }]);

  const indexed = indexing.filter(i => i.status === 'indexed');
  const pending = indexing.filter(i => i.status === 'pending');

  return (
    <>
      <SectionHeader romanIdx="iv" title="İndeks Bilgisi" subtitle="Derginin dizinlendiği veya başvuru aşamasında olduğu uluslararası dizinler." count={indexing.length} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 500, color: PALETTE.success, margin: '0 0 10px', fontStyle: 'italic' }}>
            Dizinlenenler <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: PALETTE.textMuted }}>{indexed.length}</span>
          </h3>
          <div style={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 4, overflow: 'hidden' }}>
            {indexing.map((it, i) => it.status === 'indexed' && (
              <IndexRow key={i} item={it} onUpdate={ni => update(i, ni)} onDelete={() => remove(i)} />
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 500, color: PALETTE.gold, margin: '0 0 10px', fontStyle: 'italic' }}>
            Başvuru Aşamasında <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: PALETTE.textMuted }}>{pending.length}</span>
          </h3>
          <div style={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 4, overflow: 'hidden' }}>
            {indexing.map((it, i) => it.status === 'pending' && (
              <IndexRow key={i} item={it} onUpdate={ni => update(i, ni)} onDelete={() => remove(i)} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <AddBtn onClick={add} label="İndeks ekle" />
      </div>
    </>
  );
};

// ============== TOC Section ==============

const TocSection = ({ paginated, journal, issue }) => (
  <>
    <SectionHeader romanIdx="v" title="İçindekiler" subtitle="Makale listesinden otomatik üretilir. Sıralama değiştirildiğinde anında güncellenir." count={paginated.length} />
    <div style={{
      background: PALETTE.paper, color: '#1A1A1A',
      padding: '40px 48px', borderRadius: 4,
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 28, borderBottom: '1px solid #C8B98E', paddingBottom: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: '#8B6F2A', textTransform: 'uppercase' }}>
          {journal.name} · Vol. {issue.volume}, No. {issue.number} · {issue.season} {issue.year}
        </div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontStyle: 'italic', fontWeight: 500, margin: '10px 0 4px', color: '#1A1A1A' }}>
          Contents <span style={{ color: '#8B6F2A' }}>·</span> İçindekiler
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {paginated.map((a, i) => (
          <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 50px', gap: 16, alignItems: 'baseline' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#8B6F2A', fontWeight: 500 }}>{padNumber(i + 1)}</div>
            <div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 500, color: '#1A1A1A', lineHeight: 1.3 }}>{a.titleTr}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 12, fontStyle: 'italic', color: '#5A5A5A', marginTop: 2 }}>{a.titleEn}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#7A7A7A', marginTop: 4 }}>
                {a.authors.map(au => `${au.first} ${au.last}`).join(', ')}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#5A5A5A' }}>
              {a.pageStart}
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

// ============== Articles Section ==============

const ArticleRow = ({ article, index, onUpdate, onDelete, doiString }) => {
  const [expanded, setExpanded] = useState(false);
  const typeMeta = TYPE_LABELS[article.type] || TYPE_LABELS.research;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: article.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? PALETTE.surfaceAlt : PALETTE.surface,
    borderTop: `1px solid ${PALETTE.borderSoft}`,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', alignItems: 'flex-start', padding: '14px 16px', gap: 12 }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', color: PALETTE.textMuted, paddingTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, touchAction: 'none' }}>
          <GripVertical size={16} weight="light" />
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: PALETTE.gold, fontWeight: 500 }}>{padNumber(index + 1)}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <StatusPill label={typeMeta.tr} color={typeMeta.color} />
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: PALETTE.textDim }}>s. {article.pageStart}–{article.pageEnd}</span>
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: PALETTE.goldDim }}>{doiString}</span>
          </div>
          <div style={{ marginBottom: 4 }}>
            <InlineEdit value={article.titleTr} onChange={v => onUpdate({ ...article, titleTr: v })} fontSize={15} fontWeight={500} />
          </div>
          <div style={{ marginBottom: 8, display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 10, color: PALETTE.textMuted, fontFamily: 'DM Sans', letterSpacing: 1, paddingTop: 8 }}>EN</span>
            <div style={{ flex: 1 }}>
              <InlineEdit value={article.titleEn} onChange={v => onUpdate({ ...article, titleEn: v })} fontSize={13} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: PALETTE.textDim, fontFamily: 'DM Sans' }}>
            <Users size={12} weight="regular" />
            <span>{article.authors.map(a => `${a.first} ${a.last}`).join(', ')}</span>
          </div>
          <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
              exit={{ opacity: 0, height: 0, filter: 'blur(2px)' }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
            <div style={{ marginTop: 14, padding: 14, background: PALETTE.bg, borderRadius: 4, border: `1px solid ${PALETTE.borderSoft}` }}>
              <FieldLabel>Yazarlar & ORCID</FieldLabel>
              {article.authors.map((au, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: PALETTE.text, fontFamily: 'DM Sans' }}>{au.first} {au.last}</span>
                  <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: PALETTE.goldDim }}>{au.orcid}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 16, marginTop: 14, alignItems: 'flex-end' }}>
                <div>
                  <FieldLabel>Sayfa sayısı</FieldLabel>
                  <input type="number" min="1" value={article.pages}
                    onChange={e => onUpdate({ ...article, pages: parseInt(e.target.value) || 1 })}
                    style={{ width: 70, padding: '6px 8px', background: PALETTE.surfaceAlt, border: `1px solid ${PALETTE.border}`, color: PALETTE.text, borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 13 }} />
                </div>
                <div>
                  <FieldLabel>Tür</FieldLabel>
                  <select value={article.type} onChange={e => onUpdate({ ...article, type: e.target.value })}
                    style={{ padding: '6px 8px', background: PALETTE.surfaceAlt, border: `1px solid ${PALETTE.border}`, color: PALETTE.text, borderRadius: 4, fontFamily: 'DM Sans', fontSize: 13 }}>
                    {Object.entries(TYPE_LABELS).map(([k, v]) => (<option key={k} value={k}>{v.tr}</option>))}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <FieldLabel>Anahtar Kelimeler</FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {article.keywords.map((kw, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', fontSize: 11, background: PALETTE.surfaceAlt, border: `1px solid ${PALETTE.border}`, color: PALETTE.textDim, borderRadius: 3, fontFamily: 'DM Sans' }}>
                      <Tag size={10} weight="regular" /> {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={() => setExpanded(!expanded)}
            style={{ background: 'transparent', border: 'none', color: PALETTE.textDim, cursor: 'pointer', padding: 4 }}>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <button onClick={() => {
              const title = article.titleTr || 'Bu makale';
              toast(`"${title.length > 40 ? title.slice(0, 40) + '…' : title}" silinsin mi?`, {
                description: 'Bu işlem geri alınamaz.',
                action: { label: 'Sil', onClick: () => { onDelete(article.id); toast.success('Makale silindi'); } },
                cancel: { label: 'Vazgeç', onClick: () => {} },
                duration: 8000,
              });
            }}
            style={{ background: 'transparent', border: 'none', color: PALETTE.textMuted, cursor: 'pointer', padding: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = PALETTE.danger}
            onMouseLeave={e => e.currentTarget.style.color = PALETTE.textMuted}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ArticlesSection = ({ paginated, journal, issue, setArticles, addArticle }) => {
  const updateArticle = (u) => setArticles(prev => prev.map(a => a.id === u.id ? u : a));
  const deleteArticle = (id) => setArticles(prev => prev.filter(a => a.id !== id));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setArticles(prev => {
      const from = prev.findIndex(a => a.id === active.id);
      const to = prev.findIndex(a => a.id === over.id);
      if (from < 0 || to < 0) return prev;
      const next = arrayMove(prev, from, to);
      toast.success('Sıra güncellendi', { description: `Makale ${from + 1} → ${to + 1}. Sayfa ve DOI yeniden hesaplandı.`, duration: 2500 });
      return next;
    });
  };

  return (
    <>
      <SectionHeader romanIdx="1" title="Makaleler" subtitle="Sürükleyerek yeniden sırala — sayfa aralıkları ve DOI numaraları anında güncellenir." count={paginated.length} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={paginated.map(a => a.id)} strategy={verticalListSortingStrategy}>
          <div style={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 4, overflow: 'hidden' }}>
            {paginated.map((a, i) => (
              <ArticleRow
                key={a.id}
                article={a}
                index={i}
                onUpdate={updateArticle}
                onDelete={deleteArticle}
                doiString={computeDOI(journal, issue, i + 1)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div style={{ marginTop: 10 }}>
        <AddBtn onClick={addArticle} label="Makale ekle" />
      </div>
    </>
  );
};

// ============== Sidebar ==============

const Sidebar = ({ activeSection, setActiveSection, journal, issue, totalArticles, totalPages, totalBoard, totalReviewers, totalIndexing, onGenerateDocx, docxGenerating, onGenerateCrossref, crossrefGenerating, onGenerateCoverImage, coverImageGenerating }) => {
  const counts = {
    cover: null, masthead: null,
    board: totalBoard, indexing: totalIndexing,
    toc: totalArticles, articles: totalArticles,
    reviewers: totalReviewers,
  };

  return (
    <aside style={{
      width: 288, flexShrink: 0,
      borderRight: `1px solid ${PALETTE.border}`,
      padding: '24px 20px',
      background: PALETTE.surface,
      overflowY: 'auto',
    }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 2, color: PALETTE.goldDim, textTransform: 'uppercase', marginBottom: 8 }}>
          Aktif sayı
        </div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 500, color: PALETTE.ink, lineHeight: 1.02, letterSpacing: -1 }}>
          Vol. {issue.volume}, <span style={{ fontStyle: 'italic', color: PALETTE.gold }}>No. {issue.number}</span>
        </div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 13, color: PALETTE.textDim, marginTop: 6, fontStyle: 'italic' }}>
          {issue.season} {issue.year}
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
        marginBottom: 24, padding: '12px 0',
        borderTop: `1px solid ${PALETTE.borderSoft}`,
        borderBottom: `1px solid ${PALETTE.borderSoft}`,
      }}>
        <div style={{ paddingRight: 12, borderRight: `1px solid ${PALETTE.borderSoft}` }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: PALETTE.ink, fontWeight: 500, lineHeight: 1, letterSpacing: -0.5 }}>{totalArticles}</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1.6, color: PALETTE.textMuted, marginTop: 6, textTransform: 'uppercase' }}>Makale</div>
        </div>
        <div style={{ paddingLeft: 16 }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: PALETTE.ink, fontWeight: 500, lineHeight: 1, letterSpacing: -0.5 }}>{totalPages}</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1.6, color: PALETTE.textMuted, marginTop: 6, textTransform: 'uppercase' }}>Sayfa</div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, letterSpacing: 1.6, color: PALETTE.textMuted, textTransform: 'uppercase', marginBottom: 10, fontWeight: 500 }}>
          Sayı Bölümleri
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SECTIONS.map(s => {
            const active = activeSection === s.id;
            const Icon = s.icon;
            const cnt = counts[s.id];
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px',
                  background: active ? PALETTE.goldGlow : 'transparent',
                  border: active ? `1px solid ${PALETTE.goldDim}` : '1px solid transparent',
                  borderRadius: 4, cursor: 'pointer',
                  fontFamily: 'DM Sans', fontSize: 13,
                  color: active ? PALETTE.gold : PALETTE.textDim,
                  textAlign: 'left', width: '100%',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = PALETTE.surfaceAlt; e.currentTarget.style.color = PALETTE.text; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PALETTE.textDim; } }}
              >
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: 11, fontStyle: 'italic', color: active ? PALETTE.gold : PALETTE.textMuted, minWidth: 16, textAlign: 'center' }}>
                  {s.romanIdx}
                </span>
                <Icon size={14} weight="regular" />
                <span style={{ flex: 1, fontWeight: active ? 600 : 400 }}>{s.label}</span>
                {cnt !== null && cnt !== undefined && (
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: PALETTE.textMuted }}>{cnt}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1.8, color: PALETTE.textMuted, textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>
          Çıktılar
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { icon: FileText, label: 'Frontmatter DOCX', sub: 'Word — baskıya hazır', onClick: onGenerateDocx, active: true, busy: docxGenerating },
            { icon: FileCode2, label: 'Crossref deposit', sub: 'XML — schema 5.3.1', onClick: onGenerateCrossref, active: true, busy: crossrefGenerating },
            { icon: ImageIcon, label: 'Kapak görseli', sub: 'PNG — 1200×1697', onClick: onGenerateCoverImage, active: true, busy: coverImageGenerating },
            { icon: Send, label: 'LinkedIn kartları', sub: 'Yakında', active: false },
            { icon: Archive, label: 'Tam paket (.zip)', sub: 'Yakında', active: false },
          ].map((o, i) => (
            <button key={i} disabled={!o.active || o.busy} onClick={o.onClick}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px',
                background: 'transparent',
                border: `1px solid ${o.active ? PALETTE.border : PALETTE.borderSoft}`,
                borderRadius: 4, fontFamily: 'DM Sans', fontSize: 12,
                color: o.active ? (o.busy ? PALETTE.textDim : PALETTE.text) : PALETTE.textMuted,
                cursor: o.active ? (o.busy ? 'wait' : 'pointer') : 'not-allowed',
                width: '100%', textAlign: 'left',
                fontWeight: 500,
                transition: 'background 0.12s, border-color 0.12s',
              }}
              onMouseEnter={e => { if (o.active && !o.busy) { e.currentTarget.style.background = PALETTE.goldGlow; e.currentTarget.style.borderColor = PALETTE.goldDim; } }}
              onMouseLeave={e => { if (o.active && !o.busy) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = PALETTE.border; } }}>
              <o.icon size={14} weight="light" color={o.active ? (o.busy ? PALETTE.textDim : PALETTE.gold) : PALETTE.textMuted} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: o.active ? PALETTE.text : PALETTE.textMuted }}>{o.label}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 11, color: PALETTE.textMuted, marginTop: 1 }}>
                  {o.busy ? 'Üretiliyor' : o.sub}
                </div>
              </div>
              {o.active && (
                o.busy
                  ? <Loader2 size={12} color={PALETTE.gold} style={{ animation: 'ily-spin 0.8s linear infinite' }} />
                  : <Download size={12} color={PALETTE.textMuted} />
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

// ============== Command Palette (Cmd+K) ==============

const CommandPalette = ({ open, setOpen, setActiveSection, onGenerateDocx, onGenerateCrossref, onGenerateCoverImage, onGenerateIntro }) => {
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setOpen]);

  const go = (id) => { setActiveSection(id); setOpen(false); };
  const run = (fn) => { fn(); setOpen(false); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(11,18,32,.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: '15vh',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, scale: 0.99, filter: 'blur(2px)' }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(560px, 92vw)',
              background: PALETTE.bg,
              border: `1px solid ${PALETTE.border}`,
              borderRadius: 12,
              boxShadow: '0 30px 60px -20px rgba(11,18,32,.35)',
              overflow: 'hidden',
            }}
          >
            <Command label="Komut Paleti">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: `1px solid ${PALETTE.borderSoft}` }}>
            <Search size={16} color={PALETTE.textMuted} />
            <Command.Input
              autoFocus
              placeholder="Bölüm veya komut ara…"
              style={{
                flex: 1, border: 0, outline: 'none', background: 'transparent',
                fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: PALETTE.text,
              }}
            />
            <kbd style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: PALETTE.textMuted, padding: '2px 6px', background: PALETTE.surfaceAlt, borderRadius: 4 }}>ESC</kbd>
          </div>
          <Command.List style={{ maxHeight: 360, overflow: 'auto', padding: 8 }}>
            <Command.Empty style={{ padding: '16px', fontFamily: 'DM Sans', fontSize: 13, color: PALETTE.textMuted, textAlign: 'center' }}>
              Sonuç yok
            </Command.Empty>
            <Command.Group heading="Bölümler" style={paletteGroup}>
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <Command.Item key={s.id} value={`bolum ${s.label}`} onSelect={() => go(s.id)} style={paletteItem}>
                    <Icon size={14} color={PALETTE.goldDim} />
                    <span style={{ flex: 1 }}>{s.label}</span>
                    <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 11, color: PALETTE.textMuted }}>{s.romanIdx}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
            <Command.Group heading="Çıktılar" style={paletteGroup}>
              <Command.Item value="docx frontmatter indir" onSelect={() => run(onGenerateDocx)} style={paletteItem}>
                <FileText size={14} color={PALETTE.goldDim} /> <span style={{ flex: 1 }}>Frontmatter DOCX indir</span> <Download size={12} color={PALETTE.textMuted} />
              </Command.Item>
              <Command.Item value="crossref xml indir" onSelect={() => run(onGenerateCrossref)} style={paletteItem}>
                <FileCode2 size={14} color={PALETTE.goldDim} /> <span style={{ flex: 1 }}>Crossref XML indir</span> <Download size={12} color={PALETTE.textMuted} />
              </Command.Item>
              <Command.Item value="kapak gorseli indir" onSelect={() => run(onGenerateCoverImage)} style={paletteItem}>
                <ImageIcon size={14} color={PALETTE.goldDim} /> <span style={{ flex: 1 }}>Kapak görseli indir (PNG)</span> <Download size={12} color={PALETTE.textMuted} />
              </Command.Item>
            </Command.Group>
            <Command.Group heading="AI" style={paletteGroup}>
              <Command.Item value="ai sayi tanitim olustur" onSelect={() => run(onGenerateIntro)} style={paletteItem}>
                <Sparkles size={14} color={PALETTE.goldDim} /> <span style={{ flex: 1 }}>AI ile sayı tanıtım taslağı üret</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const paletteGroup = { fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 1.4, color: PALETTE.textMuted, padding: '8px 10px 4px', textTransform: 'uppercase' };
const paletteItem = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 4, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 14, color: PALETTE.text };

// ============== Main App ==============

export default function App() {
  const [journal] = useState(SEED_JOURNAL);
  const [issue, setIssue] = useState(SEED_ISSUE);
  const [articles, setArticles] = useState(seedArticles);
  const [cover, setCover] = useState(SEED_COVER);
  const [masthead, setMasthead] = useState(SEED_MASTHEAD);
  const [board, setBoard] = useState(SEED_BOARD);
  const [reviewers, setReviewers] = useState(SEED_REVIEWERS);
  const [indexing, setIndexing] = useState(SEED_INDEXING);
  const [activeSection, setActiveSection] = useState('cover');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [docxGenerating, setDocxGenerating] = useState(false);
  const [crossrefGenerating, setCrossrefGenerating] = useState(false);
  const [coverImageGenerating, setCoverImageGenerating] = useState(false);
  const [introGenerating, setIntroGenerating] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = FONTS_HREF;
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch (e) {} };
  }, []);

  const paginated = useMemo(() => computePageRanges(articles, issue.pageStart), [articles, issue.pageStart]);
  const totalPages = paginated.length ? paginated[paginated.length - 1].pageEnd - issue.pageStart + 1 : 0;
  const totalBoard = 1 + board.associateEditors.length + board.sectionEditors.length + board.editorialBoard.length + board.internationalBoard.length;

  const addArticle = () => {
    const newArt = {
      id: `art-${Date.now()}`,
      titleTr: 'Yeni makale başlığı', titleEn: 'New article title',
      authors: [{ first: 'Yazar', last: 'Adı', orcid: '0000-0000-0000-0000' }],
      pages: 15, type: 'research', keywords: [],
    };
    setArticles(prev => [...prev, newArt]);
  };

  // ============== AI Intro Paragraph Generator ==============
  const generateIntroParagraphs = async () => {
    if (introGenerating) return;
    setIntroGenerating(true);

    const articlesSummary = paginated.map((a, i) =>
      `${i + 1}. "${a.titleTr}" / "${a.titleEn}"${a.keywords.length ? ` — Anahtar kelimeler: ${a.keywords.join(', ')}` : ''}`
    ).join('\n');

    const prompt = `You are drafting an editorial introduction for a peer-reviewed academic journal issue. The Editor-in-Chief will use this as the opening paragraph welcoming readers to the issue.

Journal: ${journal.name} (${journal.shortName})
Volume ${issue.volume}, Issue ${issue.number} — ${issue.season} ${issue.year}
Thematic Focus: ${cover.thematicFocus || 'General education research'}
Total articles: ${paginated.length}

Articles in this issue:
${articlesSummary}

Task: Write two parallel introductory paragraphs (TR and EN):
1. introTr: 3-4 sentences in formal academic editorial Turkish. Warm but professional editor's voice. Mention the thematic focus and identify 2-3 broader themes that emerge across the articles. Do NOT list articles individually. Position the issue's contribution to the field.
2. introEn: 3-4 sentences in English, parallel content and tone.

Style notes:
- Substantive editorial framing, not generic "we are excited to present"
- Acknowledge authors and contributors collectively
- Tone fitting for an editor-in-chief's opening note

Return ONLY valid JSON with no markdown fences or preamble:
{"introTr": "...", "introEn": "..."}`;

    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
        })
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(`API yanıt vermedi (${response.status})${errorBody ? ': ' + errorBody : ''}`);
      }

      const data = await response.json();
      const text = (data.text || '')
        .replace(/```json|```/g, '')
        .trim();

      const parsed = JSON.parse(text);

      if (parsed.introTr && parsed.introEn) {
        setCover(c => ({ ...c, introTr: parsed.introTr, introEn: parsed.introEn }));
        toast.success('AI taslağı hazır', { description: 'Sayı tanıtım paragrafları üretildi.' });
      } else {
        throw new Error('Yanıt formatı beklenmedik — introTr/introEn alanları eksik');
      }
    } catch (e) {
      console.error('Intro generation failed:', e);
      toast.error('AI taslak üretimi başarısız', { description: e.message });
    } finally {
      setIntroGenerating(false);
    }
  };

  // ============== Cover Image PNG Generator ==============
  const generateCoverImage = async () => {
    if (coverImageGenerating) return;
    setCoverImageGenerating(true);
    try {
      // Pre-load the exact font variants we'll draw with. Canvas silently
      // falls back to a default font if these aren't ready in time.
      await Promise.all([
        document.fonts.load("italic 500 150px Fraunces"),
        document.fonts.load("italic 400 50px Fraunces"),
        document.fonts.load("500 130px Fraunces"),
        document.fonts.load("italic 500 130px Fraunces"),
        document.fonts.load("italic 500 60px Fraunces"),
        document.fonts.load("italic 500 60px Fraunces"),
        document.fonts.load("500 36px 'JetBrains Mono'"),
        document.fonts.load("500 40px 'JetBrains Mono'"),
      ]);

      const W = 1200, H = 1697;
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');

      const gold = '#D4A84A';
      const goldDim = '#8E7536';
      const paper = '#F4EFE3';
      const textDim = '#8FA0BF';

      // Background — 135deg gradient, top-left light navy to bottom-right deep navy.
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#1A2440');
      grad.addColorStop(1, '#0B1220');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle gold accent line at the top (mirrors the preview's gradient seam)
      const accent = ctx.createLinearGradient(0, 0, W, 0);
      accent.addColorStop(0, 'rgba(212,168,74,0)');
      accent.addColorStop(0.5, 'rgba(212,168,74,0.6)');
      accent.addColorStop(1, 'rgba(212,168,74,0)');
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, W, 3);

      const left = 130;
      const rightEdge = W - 130;

      // Top: eISSN line (uppercase mono, gold-dim)
      ctx.fillStyle = goldDim;
      ctx.font = "500 36px 'JetBrains Mono', monospace";
      ctx.textBaseline = 'top';
      ctx.textAlign = 'start';
      ctx.fillText(`eISSN ${journal.eissn}`, left, 180);

      // Journal title — italic Fraunces. Auto-shrink if it overflows the column.
      const titleMaxWidth = rightEdge - left - 180; // leave room for badge
      let titleSize = 150;
      while (titleSize > 60) {
        ctx.font = `italic 500 ${titleSize}px Fraunces, serif`;
        if (ctx.measureText(journal.name).width <= titleMaxWidth) break;
        titleSize -= 6;
      }
      ctx.fillStyle = paper;
      ctx.font = `italic 500 ${titleSize}px Fraunces, serif`;
      ctx.fillText(journal.name, left, 240);

      // Subtitle
      ctx.fillStyle = textDim;
      ctx.font = "italic 400 38px Fraunces, serif";
      ctx.fillText('An open-access journal of educational research', left, 240 + titleSize + 50);

      // Top-right badge — circle with shortName initial
      const badgeR = 65;
      const badgeCx = rightEdge - badgeR;
      const badgeCy = 180 + badgeR;
      ctx.strokeStyle = goldDim;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(badgeCx, badgeCy, badgeR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = gold;
      ctx.font = "italic 500 64px Fraunces, serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((journal.shortName || journal.name || 'P')[0], badgeCx, badgeCy + 4);
      ctx.textAlign = 'start';
      ctx.textBaseline = 'top';

      // Bottom group anchored from the bottom edge.
      const seasonText = `${issue.season} ${issue.year}`;
      const bottomMargin = 200;
      const seasonY = H - bottomMargin - 60;

      // Season Year (italic, dim, lowest line)
      ctx.fillStyle = textDim;
      ctx.font = "italic 500 50px Fraunces, serif";
      ctx.fillText(seasonText, left, seasonY);

      // Vol. X  No. Y  — large, paper + italic gold
      const volLineY = seasonY - 140;
      ctx.fillStyle = paper;
      ctx.font = "500 130px Fraunces, serif";
      const volText = `Vol. ${issue.volume}`;
      ctx.fillText(volText, left, volLineY);
      const volWidth = ctx.measureText(volText).width;

      ctx.fillStyle = gold;
      ctx.font = "italic 500 130px Fraunces, serif";
      ctx.fillText(`No. ${issue.number}`, left + volWidth + 36, volLineY);

      // Thematic focus — uppercase mono, gold, with word wrap.
      const themeY = volLineY - 90;
      ctx.fillStyle = gold;
      ctx.font = "500 32px 'JetBrains Mono', monospace";
      const themeLines = wrapText(ctx, (cover.thematicFocus || '').toUpperCase(), rightEdge - left);
      themeLines.forEach((line, i) => {
        ctx.fillText(line, left, themeY - (themeLines.length - 1 - i) * 42);
      });

      // Bottom-left decorative serif numeral (vol number, oversized faded)
      ctx.save();
      ctx.fillStyle = 'rgba(212,168,74,0.06)';
      ctx.font = "italic 500 380px Fraunces, serif";
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(String(issue.volume), W - 320, H - 60);
      ctx.restore();

      // Bottom hairline above season
      ctx.strokeStyle = 'rgba(212,168,74,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left, seasonY - 24);
      ctx.lineTo(left + 220, seasonY - 24);
      ctx.stroke();

      // Export
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${journal.shortName}_Vol${issue.volume}_No${issue.number}_${issue.year}_Cover.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 200);
      toast.success('Kapak görseli indirildi', { description: `${journal.shortName}_Vol${issue.volume}_No${issue.number}_${issue.year}_Cover.png` });
    } catch (e) {
      console.error('Cover image generation failed:', e);
      toast.error('Kapak görseli oluşturulamadı', { description: e.message });
    } finally {
      setTimeout(() => setCoverImageGenerating(false), 600);
    }
  };

  // ============== Crossref XML Deposit Generator ==============
  const generateCrossrefXml = () => {
    if (crossrefGenerating) return;
    setCrossrefGenerating(true);
    try {
      const xml = buildCrossrefXml({ journal, issue, paginated, masthead });
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${journal.shortName}_Vol${issue.volume}_No${issue.number}_${issue.year}_Crossref.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 200);
      toast.success('Crossref XML indirildi', { description: `${paginated.length} makale · ${journal.shortName} Vol ${issue.volume}.${issue.number}` });
    } catch (e) {
      console.error('Crossref XML generation failed:', e);
      toast.error('Crossref XML üretilemedi', { description: e.message });
    } finally {
      setTimeout(() => setCrossrefGenerating(false), 600);
    }
  };

  // ============== Frontmatter DOCX Generator ==============
  const generateFrontmatterDocx = () => {
    setDocxGenerating(true);

    const esc = (s) => String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const gold = '8B6F2A';

    // Cover page
    const coverHtml = `
      <div class="cover">
        <div class="cover-issn">eISSN ${esc(journal.eissn)}</div>
        <div class="cover-title">${esc(journal.name)}</div>
        <div class="cover-subtitle"><i>An open-access journal of educational research</i></div>
        <div class="cover-bottom">
          <div class="cover-theme">${esc(cover.thematicFocus)}</div>
          <div class="cover-vol">Vol. ${esc(issue.volume)} <span class="italic">No. ${esc(issue.number)}</span></div>
          <div class="cover-season"><i>${esc(issue.season)} ${esc(issue.year)}</i></div>
        </div>
      </div>
    `;

    // Masthead
    const mhRow = (l, r) => `<tr><td class="meta-label">${esc(l)}</td><td>${esc(r)}</td></tr>`;
    const mastheadHtml = `
      <h1 class="page-title">Jenerik / Masthead</h1>
      <table class="meta-table">
        ${mhRow('Yayıncı / Publisher', `${masthead.publisherTr} · ${masthead.publisherEn}`)}
        ${mhRow('Adres / Address', masthead.address)}
        ${mhRow('İletişim / Contact', masthead.contactEmail)}
        ${mhRow('Web', masthead.website)}
        ${mhRow('Kuruluş Yılı / Founded', masthead.startYear)}
        ${mhRow('eISSN', journal.eissn)}
        ${mhRow('DOI Prefix', journal.doiPrefix)}
        ${mhRow('Yayın Sıklığı / Frequency', masthead.frequency)}
        ${mhRow('Yayın Dilleri / Languages', masthead.languages)}
        ${mhRow('Lisans / License', masthead.license)}
        ${mhRow('Hakemlik / Peer Review', masthead.reviewModel)}
        ${mhRow('Makale İşlem Ücreti / APC', masthead.apc)}
      </table>
    `;

    // Board
    const formatPerson = (p, opts = {}) => {
      const name = [p.title, p.first, p.last].filter(Boolean).join(' ');
      const orcid = p.orcid ? `<span class="orcid">ORCID: ${esc(p.orcid)}</span>` : '';
      const section = opts.showSection && p.section ? ` <i>(${esc(p.section)})</i>` : '';
      return `<div class="board-person"><div class="board-name">${esc(name)}${section}</div><div class="board-inst">${esc(p.institution || '')}${orcid ? ' · ' + orcid : ''}</div></div>`;
    };
    const boardHtml = `
      <h1 class="page-title">Editör Kurulu / Editorial Board</h1>
      <h2 class="board-group">Baş Editör / Editor-in-Chief</h2>
      ${formatPerson(board.editorInChief)}
      <h2 class="board-group">Yardımcı Editörler / Associate Editors</h2>
      ${board.associateEditors.map(p => formatPerson(p)).join('')}
      <h2 class="board-group">Bölüm Editörleri / Section Editors</h2>
      ${board.sectionEditors.map(p => formatPerson(p, { showSection: true })).join('')}
      <h2 class="board-group">Yayın Kurulu / Editorial Board</h2>
      ${board.editorialBoard.map(p => formatPerson(p)).join('')}
      <h2 class="board-group">Uluslararası Danışma Kurulu / International Advisory Board</h2>
      ${board.internationalBoard.map(p => formatPerson(p)).join('')}
    `;

    // Indexing
    const indexed = indexing.filter(i => i.status === 'indexed');
    const pending = indexing.filter(i => i.status === 'pending');
    const indexLi = (it) => `<li><strong>${esc(it.name)}</strong>${it.category ? `<span class="muted"> — ${esc(it.category)}</span>` : ''}${it.since ? `<span class="muted"> · ${esc(it.since)}–</span>` : ''}</li>`;
    const indexingHtml = `
      <h1 class="page-title">İndeks Bilgisi / Indexing</h1>
      <p class="intro-paragraph"><i>${esc(journal.name)}</i>, aşağıdaki ulusal ve uluslararası dizinlerde taranmaktadır. / This journal is indexed in the following databases.</p>
      <h2 class="board-group">Dizinlenenler / Indexed In</h2>
      <ul class="index-list">${indexed.map(indexLi).join('')}</ul>
      <h2 class="board-group">Başvuru Aşamasında / Under Application</h2>
      <ul class="index-list">${pending.map(indexLi).join('')}</ul>
    `;

    // TOC
    const tocRow = (a, i) => `
      <tr>
        <td class="toc-num">${padNumber(i + 1)}</td>
        <td class="toc-title">
          <div class="toc-title-tr">${esc(a.titleTr)}</div>
          <div class="toc-title-en"><i>${esc(a.titleEn)}</i></div>
          <div class="toc-authors">${a.authors.map(au => esc(au.first + ' ' + au.last)).join(', ')}</div>
        </td>
        <td class="toc-page">${a.pageStart}</td>
      </tr>
    `;
    const tocHtml = `
      <h1 class="page-title">İçindekiler / Contents</h1>
      <div class="issue-intro">
        <p>${esc(cover.introTr)}</p>
        <p><i>${esc(cover.introEn)}</i></p>
      </div>
      <table class="toc-table">
        ${paginated.map((a, i) => tocRow(a, i)).join('')}
      </table>
    `;

    // Reviewers
    const sortedReviewers = [...reviewers].sort((a, b) =>
      (a.last + a.first).localeCompare(b.last + b.first, 'tr'));
    const reviewersHtml = `
      <h1 class="page-title">Bu Sayının Hakemleri / Reviewers of This Issue</h1>
      <p class="intro-paragraph"><i>${esc(journal.name)}</i> ${esc(issue.season)} ${esc(issue.year)} sayısının hakemlik sürecine katkı sağlayan değerli akademisyenlere teşekkür ederiz. / We thank the following scholars for their valuable contribution to the peer-review process of this issue.</p>
      <table class="rev-table">
        ${sortedReviewers.map(r => `<tr><td class="rev-name">${esc((r.title || '') + ' ' + r.first + ' ' + r.last)}</td><td class="rev-inst"><i>${esc(r.institution)}</i></td><td class="rev-country">${esc(r.country || '')}</td></tr>`).join('')}
      </table>
    `;

    // Full Word-compatible HTML
    const fullHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${esc(journal.name)} — Vol. ${esc(issue.volume)} No. ${esc(issue.number)} Frontmatter</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page WordSection1 { size: 21cm 29.7cm; margin: 2.5cm 2.5cm 2.5cm 2.5cm; }
div.WordSection1 { page: WordSection1; }
body { font-family: 'Cambria', 'Times New Roman', serif; font-size: 11pt; color: #1A1A1A; line-height: 1.4; }
h1.page-title { font-family: 'Cambria', serif; font-size: 22pt; font-weight: normal; font-style: italic; color: #${gold}; margin: 0 0 8pt 0; padding-bottom: 6pt; border-bottom: 1.5pt solid #${gold}; }
h2.board-group { font-family: 'Cambria', serif; font-size: 13pt; font-style: italic; font-weight: normal; color: #${gold}; margin: 16pt 0 6pt 0; }
.page-break { page-break-before: always; mso-special-character: line-break; }
.cover { height: 24cm; position: relative; padding: 2cm 0; }
.cover-issn { font-family: 'Consolas', monospace; font-size: 9pt; letter-spacing: 0.2em; color: #${gold}; text-transform: uppercase; }
.cover-title { font-family: 'Cambria', serif; font-size: 36pt; font-style: italic; margin-top: 14pt; line-height: 1.05; }
.cover-subtitle { font-family: 'Cambria', serif; font-size: 12pt; color: #5A5A5A; margin-top: 20pt; }
.cover-bottom { margin-top: 16cm; }
.cover-theme { font-family: 'Consolas', monospace; font-size: 10pt; letter-spacing: 0.15em; color: #${gold}; text-transform: uppercase; }
.cover-vol { font-family: 'Cambria', serif; font-size: 32pt; margin-top: 16pt; }
.cover-vol .italic { font-style: italic; color: #${gold}; }
.cover-season { font-family: 'Cambria', serif; font-size: 14pt; color: #5A5A5A; margin-top: 4pt; }
.meta-table { width: 100%; border-collapse: collapse; margin-top: 14pt; }
.meta-table td { padding: 7pt 8pt; border-bottom: 0.5pt solid #C8B98E; vertical-align: top; }
.meta-table td.meta-label { width: 38%; color: #${gold}; font-size: 10pt; font-variant: small-caps; }
.board-person { margin: 8pt 0; padding-left: 14pt; border-left: 2pt solid #E8DCB8; }
.board-name { font-weight: normal; }
.board-inst { color: #5A5A5A; font-style: italic; font-size: 10pt; margin-top: 2pt; }
.orcid { font-family: 'Consolas', monospace; font-size: 9pt; color: #${gold}; font-style: normal; }
.index-list { padding-left: 24pt; }
.index-list li { margin: 5pt 0; }
.muted { color: #888; font-size: 10pt; }
.intro-paragraph { font-size: 11pt; color: #444; margin: 10pt 0 14pt 0; }
.issue-intro { margin: 14pt 0; padding: 12pt 14pt; background: #F7F2E5; border-left: 3pt solid #${gold}; }
.issue-intro p { margin: 0 0 8pt 0; }
.issue-intro p:last-child { margin: 0; color: #5A5A5A; }
.toc-table { width: 100%; border-collapse: collapse; margin-top: 8pt; }
.toc-table td { padding: 8pt 6pt; border-bottom: 0.5pt solid #DDD; vertical-align: top; }
.toc-num { width: 30pt; font-family: 'Consolas', monospace; font-size: 10pt; color: #${gold}; }
.toc-title-tr { font-weight: normal; }
.toc-title-en { color: #5A5A5A; font-size: 10pt; margin-top: 2pt; }
.toc-authors { color: #777; font-size: 9pt; margin-top: 4pt; font-style: normal; }
.toc-page { width: 50pt; text-align: right; font-family: 'Consolas', monospace; font-size: 10pt; color: #5A5A5A; }
.rev-table { width: 100%; border-collapse: collapse; margin-top: 8pt; }
.rev-table td { padding: 5pt 6pt; border-bottom: 0.3pt solid #EEE; vertical-align: top; }
.rev-name { width: 35%; }
.rev-inst { color: #5A5A5A; font-size: 10pt; }
.rev-country { width: 70pt; color: #888; font-size: 10pt; }
</style>
</head>
<body>
<div class="WordSection1">
${coverHtml}
<div class="page-break"></div>
${mastheadHtml}
<div class="page-break"></div>
${boardHtml}
<div class="page-break"></div>
${indexingHtml}
<div class="page-break"></div>
${tocHtml}
<div class="page-break"></div>
${reviewersHtml}
</div>
</body>
</html>`;

    try {
      const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${journal.shortName}_Vol${issue.volume}_No${issue.number}_${issue.year}_Frontmatter.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 200);
      toast.success('Frontmatter DOCX indirildi', { description: 'Word\'de açıp yazıevine teslim edebilirsin.' });
    } catch (e) {
      console.error('DOCX generation failed:', e);
      toast.error('DOCX üretilemedi', { description: e.message });
    } finally {
      setTimeout(() => setDocxGenerating(false), 600);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: PALETTE.bg, color: PALETTE.text, fontFamily: 'DM Sans, sans-serif' }}>
      <style>{GLOBAL_CSS}</style>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, sans-serif',
            border: `1px solid ${PALETTE.border}`,
            background: PALETTE.bg,
            color: PALETTE.text,
          },
        }}
      />
      <CommandPalette
        open={paletteOpen} setOpen={setPaletteOpen}
        setActiveSection={setActiveSection}
        onGenerateDocx={generateFrontmatterDocx}
        onGenerateCrossref={generateCrossrefXml}
        onGenerateCoverImage={generateCoverImage}
        onGenerateIntro={generateIntroParagraphs}
      />
      <header style={{
        borderBottom: `1px solid ${PALETTE.border}`, padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: PALETTE.surface,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = '#/'; }}
             style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 24, color: PALETTE.ink, letterSpacing: -0.6 }}>Issuely</span>
            <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 13, color: PALETTE.textDim, fontWeight: 400 }}>issue workshop</span>
          </a>
          <div style={{ paddingLeft: 20, borderLeft: `1px solid ${PALETTE.border}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 14, color: PALETTE.text, fontWeight: 500 }}>{journal.name}</span>
              <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 12, color: PALETTE.textDim }}>
                Vol. {issue.volume} · No. {issue.number}
              </span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: PALETTE.textMuted, letterSpacing: 0.6 }}>
              eISSN {journal.eissn} · DOI {journal.doiPrefix}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999,
            background: PALETTE.goldGlow, border: `1px solid ${PALETTE.goldDim}`,
            fontFamily: 'JetBrains Mono', fontSize: 10, color: PALETTE.goldDim,
            letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: PALETTE.gold }} />
            Taslak
          </span>
          <button
            onClick={() => setPaletteOpen(true)}
            title="Komut paleti (⌘K)"
            style={{
              background: 'transparent', border: `1px solid ${PALETTE.border}`,
              color: PALETTE.textDim, padding: '7px 12px', borderRadius: 4,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500,
              transition: 'border-color 0.12s, color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = PALETTE.ink; e.currentTarget.style.color = PALETTE.ink; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = PALETTE.border; e.currentTarget.style.color = PALETTE.textDim; }}>
            <Search size={13} weight="regular" /> Komut paleti
            <kbd style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: PALETTE.textMuted, padding: '1px 5px', background: PALETTE.surfaceAlt, borderRadius: 3, marginLeft: 2 }}>⌘K</kbd>
          </button>
          <button style={{
            background: 'transparent', border: `1px solid ${PALETTE.border}`,
            color: PALETTE.textDim, padding: '7px 12px', borderRadius: 4,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500,
          }}>
            <Settings size={13} weight="regular" /> Dergi Ayarları
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100dvh - 72px)' }}>
        <Sidebar
          activeSection={activeSection} setActiveSection={setActiveSection}
          journal={journal} issue={issue}
          totalArticles={articles.length} totalPages={totalPages}
          totalBoard={totalBoard} totalReviewers={reviewers.length}
          totalIndexing={indexing.length}
          onGenerateDocx={generateFrontmatterDocx}
          docxGenerating={docxGenerating}
          onGenerateCrossref={generateCrossrefXml}
          crossrefGenerating={crossrefGenerating}
          onGenerateCoverImage={generateCoverImage}
          coverImageGenerating={coverImageGenerating}
        />

        <main style={{ flex: 1, padding: '28px 32px', minWidth: 0, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeSection === 'cover' && <CoverSection cover={cover} setCover={setCover} issue={issue} setIssue={setIssue} journal={journal} onGenerateIntro={generateIntroParagraphs} introGenerating={introGenerating} />}
              {activeSection === 'masthead' && <MastheadSection masthead={masthead} setMasthead={setMasthead} journal={journal} />}
              {activeSection === 'board' && <BoardSection board={board} setBoard={setBoard} />}
              {activeSection === 'indexing' && <IndexingSection indexing={indexing} setIndexing={setIndexing} />}
              {activeSection === 'toc' && <TocSection paginated={paginated} journal={journal} issue={issue} />}
              {activeSection === 'articles' && (
                <ArticlesSection
                  paginated={paginated} journal={journal} issue={issue}
                  setArticles={setArticles} addArticle={addArticle}
                />
              )}
              {activeSection === 'reviewers' && <ReviewersSection reviewers={reviewers} setReviewers={setReviewers} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
