'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import {
  t, ts, pick, pickText, tAdmin, Kw, isRTL, LANG_META, NUMBER_LOCALE, LANGS,
} from '@/lib/i18n'
import {
  Menu, X, Search, Star, Sparkles, ArrowRight, ArrowLeft, Check, FlaskConical, Leaf,
  GitCompare, BookOpen, Building2, ShieldCheck, Trash2, Pencil, Plus, LogOut,
  BarChart3, Globe, MapPin, ExternalLink, Droplets, Sun, Moon, AlertTriangle, Beaker, Mail,
  Scissors, HeartPulse, Factory, BadgeCheck, HelpCircle, ShoppingBag, ListChecks,
  Share2, Copy, Play, ChevronUp, ChevronDown, Trophy, Scale, Info, RefreshCw, ArrowLeftRight, Tag, Compass
} from 'lucide-react'

const HERO_IMG = 'https://images.unsplash.com/photo-1585945037805-5fd82c2e60b1?crop=entropy&cs=srgb&fm=jpg&q=85'
const DEFAULT_ARTICLE_IMG = 'https://images.unsplash.com/photo-1713768704571-6aeb0d0e5105?crop=entropy&cs=srgb&fm=jpg&q=85'

const VERTICALS = [
  { id: 'skincare', fr: 'Soins de la peau', en: 'Skincare', ar: 'العناية بالبشرة' },
  { id: 'hair', fr: 'Cheveux & Cuir chevelu', en: 'Hair & Scalp', ar: 'الشعر وفروة الرأس' },
  { id: 'wellness', fr: 'Bien-être', en: 'Wellness', ar: 'العافية' },
]

const CONCERNS = [
  { id: 'acne', vertical: 'skincare', fr: 'Acné & imperfections', en: 'Acne & blemishes', ar: 'حبّ الشباب والبثور' },
  { id: 'sensitive', vertical: 'skincare', fr: 'Peau sensible', en: 'Sensitive skin', ar: 'البشرة الحسّاسة' },
  { id: 'aging', vertical: 'skincare', fr: 'Anti-âge', en: 'Anti-aging', ar: 'مكافحة الشيخوخة' },
  { id: 'dryness', vertical: 'skincare', fr: 'Sécheresse', en: 'Dryness', ar: 'الجفاف' },
  { id: 'oily', vertical: 'skincare', fr: 'Peau grasse', en: 'Oily skin', ar: 'البشرة الدهنية' },
  { id: 'pigmentation', vertical: 'skincare', fr: 'Taches pigmentaires', en: 'Dark spots', ar: 'البقع الداكنة' },
  { id: 'hair-loss', vertical: 'hair', fr: 'Chute de cheveux', en: 'Hair loss', ar: 'تساقط الشعر' },
  { id: 'dandruff', vertical: 'hair', fr: 'Pellicules', en: 'Dandruff', ar: 'القشرة' },
  { id: 'dry-hair', vertical: 'hair', fr: 'Cheveux secs & abîmés', en: 'Dry & damaged hair', ar: 'الشعر الجاف والتالف' },
  { id: 'sensitive-scalp', vertical: 'hair', fr: 'Cuir chevelu sensible', en: 'Sensitive scalp', ar: 'فروة رأس حسّاسة' },
  { id: 'sleep', vertical: 'wellness', fr: 'Sommeil', en: 'Sleep', ar: 'النوم' },
  { id: 'stress', vertical: 'wellness', fr: 'Stress & détente', en: 'Stress & relaxation', ar: 'التوتر والاسترخاء' },
  { id: 'energy', vertical: 'wellness', fr: 'Énergie & fatigue', en: 'Energy & fatigue', ar: 'الطاقة والإرهاق' },
  { id: 'digestion', vertical: 'wellness', fr: 'Digestion', en: 'Digestion', ar: 'الهضم' },
  { id: 'immunity', vertical: 'wellness', fr: 'Immunité', en: 'Immunity', ar: 'المناعة' },
]
const SKIN_TYPES = [
  { id: 'normal', fr: 'Normale', en: 'Normal', ar: 'عادية' },
  { id: 'dry', fr: 'Sèche', en: 'Dry', ar: 'جافّة' },
  { id: 'oily', fr: 'Grasse', en: 'Oily', ar: 'دهنية' },
  { id: 'combination', fr: 'Mixte', en: 'Combination', ar: 'مختلطة' },
  { id: 'sensitive', fr: 'Sensible', en: 'Sensitive', ar: 'حسّاسة' },
]
const CATEGORIES = [
  { id: 'cleanser', vertical: 'skincare', fr: 'Nettoyant', en: 'Cleanser', ar: 'غسول' },
  { id: 'serum', vertical: 'skincare', fr: 'Sérum', en: 'Serum', ar: 'سيروم' },
  { id: 'moisturizer', vertical: 'skincare', fr: 'Crème hydratante', en: 'Moisturizer', ar: 'كريم مرطّب' },
  { id: 'sunscreen', vertical: 'skincare', fr: 'Protection solaire', en: 'Sunscreen', ar: 'واقٍ من الشمس' },
  { id: 'shampoo', vertical: 'hair', fr: 'Shampoing', en: 'Shampoo', ar: 'شامبو' },
  { id: 'conditioner', vertical: 'hair', fr: 'Après-shampoing', en: 'Conditioner', ar: 'بلسم' },
  { id: 'hair-treatment', vertical: 'hair', fr: 'Soin / Masque capillaire', en: 'Hair treatment', ar: 'علاج / ماسك للشعر' },
  { id: 'scalp-serum', vertical: 'hair', fr: 'Sérum cuir chevelu', en: 'Scalp serum', ar: 'سيروم لفروة الرأس' },
  { id: 'supplement', vertical: 'wellness', fr: 'Complément alimentaire', en: 'Supplement', ar: 'مكمّل غذائي' },
  { id: 'tea', vertical: 'wellness', fr: 'Tisane', en: 'Herbal tea', ar: 'شاي أعشاب' },
  { id: 'bath-body', vertical: 'wellness', fr: 'Bain & Corps', en: 'Bath & Body', ar: 'الاستحمام والجسم' },
]

const label = (list, id, lang) => {
  const it = list.find((x) => x.id === id)
  return it ? pick(it, lang) : id
}

// ---------- small ui helpers ----------

// Conteneur du handoff : max-width 1320px, gouttière 44px (20px en mobile).
const Container = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-dz px-5 md:px-11 ${className}`}>{children}</div>
)

// Meta / données en IBM Plex Mono, uppercase, letter-spacing large.
const Mono = ({ children, className = '', as: Tag = 'span', ...rest }) => (
  <Tag className={`font-mono uppercase ${className}`} {...rest}>{children}</Tag>
)

// Score sur 10 (les notes de l'API sont sur 5).
const toScore = (rating) => ((rating || 0) * 2).toFixed(1)

// Placeholder rayé du prototype : sert de fond aux visuels le temps de leur
// chargement, et de repli quand aucune image n'est fournie.
const Placeholder = ({ label, className = '' }) => (
  <div className={`dz-placeholder flex items-end p-4 ${className}`}>
    {label && <Mono className="text-[9.5px] tracking-[0.1em] text-[#93908A]">{label}</Mono>}
  </div>
)

// En-tête de section : titre display + sous-titre + lien « Tout voir → ».
const SectionHead = ({ title, sub, action, onAction, testId }) => (
  <div className="mb-8 flex flex-col gap-3 md:mb-[38px] md:flex-row md:items-end md:justify-between">
    <h2 className="m-0 font-display text-[32px] leading-none tracking-[-0.02em] md:text-[40px] xl:text-[48px]">{title}</h2>
    <div className="flex items-center gap-6 md:pb-1.5">
      {sub && <span className="text-[14.5px] text-dz-text-2">{sub}</span>}
      {action && (
        <button data-testid={testId} onClick={onAction}
          className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-dz-accent transition-colors duration-200 hover:text-dz-accent-hover">
          {action} <span className="dz-dir-arrow inline-block">→</span>
        </button>
      )}
    </div>
  </div>
)

// Bouton plein noir (Product Finder, Découvrir) — hover accent + translateY(-1px).
const InkButton = ({ children, className = '', ...rest }) => (
  <button
    className={`inline-block whitespace-nowrap rounded-dz-pill bg-dz-ink px-5 py-[11px] text-[13.5px] font-medium text-dz-on-dark transition-[background-color,transform] duration-250 hover:-translate-y-px hover:bg-dz-accent ${className}`}
    {...rest}
  >
    {children}
  </button>
)

// Note produit : score /10 en mono accent, comme dans le pied des cartes.
const Stars = ({ rating }) => (
  <span className="dz-ltr flex items-baseline gap-[5px]">
    <span className="font-mono text-[15px] text-dz-accent">{toScore(rating)}</span>
    <span className="font-mono text-[10px] text-dz-text-4">/10</span>
  </span>
)

// Badge pill mono — accent pour « sûr », sable pour « prudence ».
const SafetyBadge = ({ safety, lang }) => (
  <Mono className={`rounded-dz-pill px-[13px] py-[7px] text-[10.5px] tracking-[0.06em] ${
    safety === 'green' ? 'bg-dz-accent-bg text-dz-accent' : 'bg-dz-sand text-dz-sand-eyebrow'
  }`}>
    {safety === 'green' ? (t(lang, 'Sûr', 'Safe')) : (t(lang, 'Prudence', 'Caution'))}
  </Mono>
)

// Niveau de preuve : badge mono accent sur #EFF3F5 (handoff §6).
const EvidenceBadge = ({ evidence, lang }) => (
  <Mono className="whitespace-nowrap rounded-dz-pill bg-dz-accent-bg px-[13px] py-[7px] text-[10.5px] tracking-[0.06em] text-dz-accent">
    {evidence === 'strong'
      ? t(lang, 'Preuves solides', 'Strong evidence')
      : evidence === 'moderate'
      ? t(lang, 'Preuves modérées', 'Moderate evidence')
      : t(lang, 'Preuves limitées', 'Limited evidence')}
  </Mono>
)

const SectionTitle = ({ children, sub }) => (
  <div className="mb-8">
    <h2 className="m-0 font-display text-[32px] leading-none tracking-[-0.02em] md:text-[40px] xl:text-[48px]">{children}</h2>
    {sub && <p className="mt-3 text-[14.5px] text-dz-text-2">{sub}</p>}
  </div>
)

// ---------- Product Card ----------
// Handoff §5 : image 210px + badge pays, marque en mono, nom en Instrument
// Serif 23px, claim, pied séparé par un filet avec le score /10 et le prix.
const ProductCard = ({ p, lang, onOpen }) => (
  <button
    data-testid={`product-card-${p.slug}`}
    onClick={() => onOpen(p.slug)}
    className="group flex flex-col overflow-hidden rounded-dz-card bg-dz-surface text-left shadow-dz-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-dz-card-hover"
  >
    <div className="dz-placeholder relative h-[210px] overflow-hidden">
      <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
      {p.german_made && (
        <Mono className="absolute right-4 top-4 rounded-dz-pill bg-white/90 px-[9px] py-[5px] text-[9.5px] tracking-[0.1em] text-dz-ink" dir="ltr">DE</Mono>
      )}
    </div>
    <div className="flex flex-1 flex-col gap-2.5 p-[22px]">
      <Mono className="text-[10.5px] tracking-[0.14em] text-dz-text-3"><Kw lang={lang}>{p.brand_name}</Kw></Mono>
      <span className="font-display text-[23px] leading-[1.15] tracking-[-0.015em] text-pretty"><Kw lang={lang} variant="title">{p.name}</Kw></span>
      <span className="line-clamp-2 text-[13.5px] font-light leading-[1.55] text-dz-text-2">{pick(p.description, lang)}</span>
      <span className="mt-auto flex items-center justify-between pt-[18px] shadow-dz-rule-t-card">
        <span className="dz-ltr flex items-baseline gap-[5px] pt-3.5">
          <span className="font-mono text-[19px] text-dz-accent">{toScore(p.rating)}</span>
          <span className="font-mono text-[11px] text-dz-text-4">/10</span>
        </span>
        <span className="dz-ltr pt-3.5 text-[12px] text-dz-text-4">{p.price_eur?.toFixed(2)} €</span>
      </span>
    </div>
  </button>
)

// ---------- Header ----------
// Handoff §1 : sticky 72px, fond translucide + backdrop-blur(18px) saturate(1.4),
// filet bas en box-shadow. Nav principale à gauche, groupe utilitaire à droite.
// Sélecteur de langue « sophistiqué » : un Popover thématisé qui liste les 3
// langues avec leur endonyme + libellé traduit, une pastille de code et une
// coche sur la langue active. Contenu forcé en LTR pour rester lisible et
// aligné à droite du déclencheur quelle que soit la direction de la page.
const LanguageSwitcher = ({ lang, setLang, variant = 'header' }) => {
  const [open, setOpen] = useState(false)
  const current = LANG_META[lang]

  if (variant === 'mobile') {
    // Version « segments » pour le menu mobile : les 3 langues côte à côte.
    return (
      <div dir="ltr" className="mt-1 px-3 py-2">
        <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-dz-text-3">
          {ts(lang, 'Langue', 'Language')}
        </div>
        <div className="flex gap-1.5 rounded-dz-pill bg-dz-surface-2 p-1">
          {LANGS.map((l) => {
            const active = l === lang
            return (
              <button
                key={l}
                data-testid={`lang-option-${l}`}
                onClick={() => setLang(l)}
                dir={LANG_META[l].dir}
                className={`flex-1 rounded-dz-pill px-2 py-1.5 text-center text-[12.5px] transition-all duration-200 ${
                  active
                    ? 'bg-dz-surface text-dz-accent shadow-dz-card'
                    : 'text-dz-text-2 hover:text-dz-ink'
                }`}
              >
                {LANG_META[l].native}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          data-testid="lang-toggle"
          aria-label={ts(lang, 'Changer de langue', 'Change language')}
          title={current.native}
          dir="ltr"
          className="group inline-flex items-center gap-1.5 rounded-dz-pill border border-dz-rule bg-dz-surface/70 px-2.5 py-1.5 text-dz-nav shadow-dz-lang backdrop-blur transition-all duration-200 hover:border-dz-accent/40 hover:text-dz-accent hover:shadow-dz-card"
        >
          <Globe className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100" />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em]">{current.code}</span>
          <ChevronDown className={`h-3 w-3 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        dir="ltr"
        className="w-56 rounded-dz-card border border-dz-rule bg-dz-surface p-1.5 shadow-dz-card"
      >
        <div className="px-2.5 pb-1.5 pt-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-dz-text-3">
          {ts(lang, 'Choisir la langue', 'Choose language')}
        </div>
        {LANGS.map((l) => {
          const m = LANG_META[l]
          const active = l === lang
          return (
            <button
              key={l}
              data-testid={`lang-option-${l}`}
              onClick={() => { setLang(l); setOpen(false) }}
              className={`flex w-full items-center gap-3 rounded-dz-brand px-2.5 py-2 text-left transition-colors duration-150 ${
                active
                  ? 'bg-dz-accent-bg text-dz-accent'
                  : 'text-dz-nav hover:bg-dz-surface-2 hover:text-dz-ink'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-dz-pill font-mono text-[11px] uppercase leading-none transition-colors ${
                  active ? 'bg-dz-accent text-dz-on-dark' : 'bg-dz-surface-2 text-dz-text-2'
                }`}
              >
                {m.code}
              </span>
              <span className="min-w-0 flex-1">
                <span dir={m.dir} className="block truncate text-[13.5px] font-medium leading-tight">
                  {m.native}
                </span>
                <span className="block truncate text-[11px] leading-tight text-dz-text-3">
                  {m.label[lang]}
                </span>
              </span>
              {active && <Check className="h-4 w-4 shrink-0 text-dz-accent" />}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

const Header = ({ lang, setLang, nav, route }) => {
  const [open, setOpen] = useState(false)

  const mainItems = [
    { v: 'products', fr: 'Produits', en: 'Products', ar: 'المنتجات' },
    { v: 'hubs', fr: 'Conseils', en: 'Advice', ar: 'نصائح' },
    { v: 'ingredients', fr: 'Ingrédients', en: 'Ingredients', ar: 'المكوّنات' },
    { v: 'brands', fr: 'Marques', en: 'Brands', ar: 'العلامات التجارية' },
    { v: 'german-brands', fr: 'Marques allemandes', en: 'German Brands', ar: 'علامات ألمانية', accent: true },
    { v: 'compare', fr: 'Comparer', en: 'Compare', ar: 'قارن' },
  ]
  const utilityItems = [
    // « Reels » traduit en arabe par la translittération usuelle « ريلز ».
    { v: 'reels', fr: 'Reels', en: 'Reels', ar: 'ريلز' },
    { v: 'learn', fr: 'Guides', en: 'Guides', ar: 'أدلّة' },
    { v: 'for-brands', fr: 'Pour les marques', en: 'For Brands', ar: 'للعلامات التجارية' },
  ]
  const allItems = [...mainItems, ...utilityItems, { v: 'finder', fr: 'Trouver mon produit', en: 'Product Finder', ar: 'اعثر على منتجك' }]

  const go = (v) => { nav(v); setOpen(false) }

  return (
    <header className="sticky top-0 z-30 bg-[rgba(246,245,242,0.82)] shadow-dz-header backdrop-blur-[18px] backdrop-saturate-[1.4]">
      <div dir="ltr" className="mx-auto flex h-[72px] max-w-dz items-center gap-11 px-5 md:px-11">
        <button data-testid="logo-btn" onClick={() => go('home')} className="flex shrink-0 items-baseline gap-[9px] text-dz-ink">
          <span className="font-display text-[26px] leading-none tracking-[-0.01em]">Dermalyze</span>
          <Mono className="text-[9.5px] tracking-[0.16em] text-dz-text-3">{t(lang, 'Science', 'Science')}</Mono>
        </button>

        <nav className="hidden items-center gap-7 whitespace-nowrap text-[14px] xl:flex">
          {mainItems.map((it) => (
            <button key={it.v} data-testid={`nav-${it.v}`} onClick={() => go(it.v)}
              className={`transition-colors duration-200 hover:text-dz-accent-hover ${
                it.accent || route.view === it.v ? 'text-dz-accent' : 'text-dz-nav'
              }`}>
              {pick(it, lang)}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5 whitespace-nowrap">
          {utilityItems.map((it) => (
            <button key={it.v} data-testid={`nav-${it.v}`} onClick={() => go(it.v)}
              className={`hidden text-[14px] transition-colors duration-200 hover:text-dz-accent-hover lg:block ${
                route.view === it.v ? 'text-dz-accent' : 'text-dz-nav'
              }`}>
              {pick(it, lang)}
            </button>
          ))}

          {/* Sélecteur de langue : Popover FR / EN / AR (l'arabe bascule la page en RTL). */}
          <LanguageSwitcher lang={lang} setLang={setLang} />

          <InkButton data-testid="nav-finder" onClick={() => go('finder')} className="hidden sm:inline-block">
            {t(lang, 'Trouver mon produit', 'Product Finder')}
          </InkButton>

          <button data-testid="mobile-menu-btn" aria-label="Menu" aria-expanded={open}
            className="p-2 text-dz-ink xl:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="bg-dz-bg shadow-dz-rule-t xl:hidden">
          <div className="mx-auto flex max-w-dz flex-col px-5 py-3 md:px-11">
            {allItems.map((it) => (
              <button key={it.v} data-testid={`mobile-nav-${it.v}`} onClick={() => go(it.v)}
                className="rounded-lg px-3 py-2.5 text-left text-[14px] text-dz-nav transition-colors duration-200 hover:bg-dz-surface-2 hover:text-dz-accent">
                {pick(it, lang)}
              </button>
            ))}
            <div className="mt-1.5 shadow-dz-rule-t pt-1.5">
              <LanguageSwitcher lang={lang} setLang={setLang} variant="mobile" />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// ---------- Home ----------

// Familles d'ingrédients utilisées par les filtres du handoff §6.
// Taxonomie de présentation : à terme elle doit venir de l'API (cf. handoff).
const INGREDIENT_FAMILIES = {
  niacinamide: { fr: 'Éclaircissant', en: 'Brightening', ar: 'مفتّح للبشرة' },
  'vitamine-c': { fr: 'Éclaircissant', en: 'Brightening', ar: 'مفتّح للبشرة' },
  retinol: { fr: 'Rétinoïde', en: 'Retinoid', ar: 'ريتينويد' },
  'acide-salicylique': { fr: 'Acide', en: 'Acid', ar: 'حمض' },
  'zinc-pca': { fr: 'Acide', en: 'Acid', ar: 'حمض' },
  'acide-hyaluronique': { fr: 'Hydratant', en: 'Hydrating', ar: 'مرطّب' },
  panthenol: { fr: 'Hydratant', en: 'Hydrating', ar: 'مرطّب' },
  ceramides: { fr: 'Hydratant', en: 'Hydrating', ar: 'مرطّب' },
  squalane: { fr: 'Hydratant', en: 'Hydrating', ar: 'مرطّب' },
  'aloe-vera': { fr: 'Hydratant', en: 'Hydrating', ar: 'مرطّب' },
  glycerine: { fr: 'Hydratant', en: 'Hydrating', ar: 'مرطّب' },
  'coenzyme-q10': { fr: 'Antioxydant', en: 'Antioxidant', ar: 'مضادّ للأكسدة' },
}
const INGREDIENT_FILTERS = [
  { id: 'all', fr: 'Tous', en: 'All', ar: 'الكل' },
  { id: 'Éclaircissant', fr: 'Éclaircissant', en: 'Brightening', ar: 'مفتّح للبشرة' },
  { id: 'Rétinoïde', fr: 'Rétinoïde', en: 'Retinoid', ar: 'ريتينويد' },
  { id: 'Acide', fr: 'Acide', en: 'Acid', ar: 'حمض' },
  { id: 'Hydratant', fr: 'Hydratant', en: 'Hydrating', ar: 'مرطّب' },
]
const familyOf = (slug, lang) => pick(INGREDIENT_FAMILIES[slug], lang) || t(lang, 'Actif', 'Active')
const familyIdOf = (slug) => INGREDIENT_FAMILIES[slug]?.fr || 'Actif'

// Suggestions « Populaire » du handoff, pointant vers la liste filtrée
// correspondante plutôt que vers une recherche en dur.
const SUGGESTIONS = [
  { fr: 'Rétinol', en: 'Retinol', ar: 'ريتينول', go: (nav) => nav('ingredient', 'retinol') },
  { fr: 'Peau sensible', en: 'Sensitive skin', ar: 'البشرة الحسّاسة', go: (nav) => nav('hub', 'sensitive') },
  // Nom de marque : aucun équivalent arabe, il reste tel quel (pastille .dz-kw).
  { fr: 'Eucerin', en: 'Eucerin', ar: '[[Eucerin]]', go: (nav) => nav('brand', 'eucerin') },
  { fr: 'Anti-taches', en: 'Dark spots', ar: 'مكافحة البقع', go: (nav) => nav('hub', 'pigmentation') },
]

// Animation de comptage : easeOutCubic sur 1500 ms, déclenchée à l'entrée dans
// le viewport (IntersectionObserver) et court-circuitée si l'utilisateur a
// demandé moins d'animations.
const useCountUp = (duration = 1500) => {
  const ref = useRef(null)
  const [t, setT] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof window === 'undefined') return

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setT(1)
      return
    }

    let raf
    const run = () => {
      const start = performance.now()
      const tick = () => {
        const p = Math.min(1, (performance.now() - start) / duration)
        setT(1 - Math.pow(1 - p, 3))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    if (typeof IntersectionObserver === 'undefined') { run(); return () => cancelAnimationFrame(raf) }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { observer.disconnect(); run() }
    }, { threshold: 0.35 })
    observer.observe(node)

    return () => { observer.disconnect(); cancelAnimationFrame(raf) }
  }, [duration])

  return [ref, t]
}

// Handoff §3 : trois colonnes séparées par des filets, nombre en Instrument
// Serif 52px + libellé alignés sur la baseline.
const StatsBand = ({ stats, lang }) => {
  const [ref, progress] = useCountUp()
  const fmt = (v) => Math.round((v || 0) * progress).toLocaleString(NUMBER_LOCALE[lang] || NUMBER_LOCALE.fr)
  return (
    <div ref={ref} data-testid="home-stats" className="mt-14 grid grid-cols-1 shadow-dz-rule-t sm:grid-cols-3 md:mt-[72px]">
      {stats.map((s, i) => (
        <div key={s.key}
          className={`flex items-baseline gap-4 pt-[30px] ${
            i === 0 ? 'sm:pr-10' : i === 1 ? 'sm:px-10 sm:shadow-dz-rule-x' : 'sm:pl-10'
          }`}>
          <span className="font-display text-[52px] leading-none tracking-[-0.02em] tabular-nums">{fmt(s.value)}</span>
          <span className="text-[13.5px] text-dz-text-2">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

// Recherche héro intelligente : normalise l'entrée (accents, espaces,
// apostrophes) et propose des suggestions groupées (produits, ingrédients,
// préoccupations, marques) avec navigation clavier.
const normalizeText = (s) => (s || '').toString().toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[’'`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

// Catégories éditoriales, partagées par la home, Learn et les fiches article.
const ARTICLE_CATEGORIES = [
  { id: 'learn', fr: 'Learn', en: 'Learn', ar: 'تعلَّم' },
  { id: 'guide', fr: 'Guides', en: 'Guides', ar: 'أدلّة' },
  { id: 'research', fr: 'Research', en: 'Research', ar: 'أبحاث' },
  { id: 'how-to', fr: 'How-to', en: 'How-to', ar: 'كيف تفعلها' },
]

const HERO_TYPE_LABEL = {
  product: { fr: 'Produit', en: 'Product', ar: 'منتج' },
  ingredient: { fr: 'Ingrédient', en: 'Ingredient', ar: 'مكوّن' },
  concern: { fr: 'Préoccupation', en: 'Concern', ar: 'مشكلة' },
  brand: { fr: 'Marque', en: 'Brand', ar: 'علامة تجارية' },
}

const HeroSearch = ({ lang, nav, products, ingredients, brands }) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef(null)

  const nq = normalizeText(query)
  const tokens = nq ? nq.split(' ').filter(Boolean) : []
  const match = (hay) => { const h = normalizeText(hay); return tokens.every((tok) => h.includes(tok)) }

  const prod = tokens.length ? products.filter((p) => match(`${p.name} ${p.brand_name} ${p.slug}`)).slice(0, 5) : []
  const ing = tokens.length ? ingredients.filter((i) => match(`${i.name} ${i.slug} ${i.inci || ''}`)).slice(0, 4) : []
  const conc = tokens.length ? CONCERNS.filter((c) => match(`${c.fr} ${c.en} ${c.id}`)).slice(0, 4) : []
  const brd = tokens.length ? brands.filter((b) => match(`${b.name} ${b.slug}`)).slice(0, 3) : []

  const items = [
    ...prod.map((p) => ({ type: 'product', key: 'p-' + p.slug, label: p.name, sub: p.brand_name, img: p.image, go: () => nav('product', p.slug) })),
    ...ing.map((i) => ({ type: 'ingredient', key: 'i-' + i.slug, label: i.name, sub: i.inci, go: () => nav('ingredient', i.slug) })),
    ...conc.map((c) => ({ type: 'concern', key: 'c-' + c.id, label: pick(c, lang), sub: pickText(VERTICALS.find((v) => v.id === c.vertical), lang), go: () => nav('products', null, { concern: c.id, vertical: c.vertical }) })),
    ...brd.map((b) => ({ type: 'brand', key: 'b-' + b.slug, label: b.name + (b.german ? ' 🇩🇪' : ''), sub: b.city, go: () => nav('brand', b.slug) })),
  ]
  const showDropdown = open && tokens.length > 0

  useEffect(() => { setActive(0) }, [query])
  useEffect(() => {
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const choose = (it) => { setOpen(false); setQuery(''); it.go() }
  const submit = (e) => {
    e.preventDefault()
    if (showDropdown && items[active]) { choose(items[active]); return }
    const q = query.trim()
    if (q) { setOpen(false); nav('products', null, { search: q }) }
  }
  const onKeyDown = (e) => {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Escape') { setOpen(false) }
  }

  return (
    <div id="finder" ref={wrapRef} className="relative max-w-[530px]">
      <form onSubmit={submit}
        className="flex items-center gap-3 rounded-dz-pill border border-dz-rule bg-dz-surface p-2 pl-5 shadow-dz-search transition-[box-shadow,border-color] duration-200 focus-within:border-dz-accent/35 focus-within:ring-4 focus-within:ring-dz-accent-bg">
        <Search className="h-4 w-4 shrink-0 text-dz-text-4" />
        <input
          data-testid="hero-finder-input"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-label={ts(lang, 'Rechercher', 'Search')}
          placeholder={ts(lang, 'Un produit, un ingrédient, une préoccupation…', 'A product, an ingredient, a concern…')}
          className="min-w-0 flex-1 border-none bg-transparent py-3 text-[15px] font-light text-dz-ink outline-none focus:outline-none focus-visible:outline-none placeholder:text-dz-text-4"
        />
        <button type="submit" data-testid="hero-finder-btn"
          className="whitespace-nowrap rounded-dz-pill bg-dz-accent px-[26px] py-3.5 text-[14.5px] font-medium text-white transition-colors duration-250 hover:bg-dz-accent-hover">
          {t(lang, 'Lancer', 'Search')}
        </button>
      </form>

      {showDropdown && (
        <div data-testid="hero-suggestions"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-dz-card border border-dz-rule bg-dz-surface shadow-dz-card">
          {items.length === 0 ? (
            <div className="px-5 py-4 text-[14px] text-dz-text-4">
              {t(lang, 'Aucun résultat — appuyez sur Entrée pour lancer la recherche', 'No result — press Enter to search')}
            </div>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto py-1.5">
              {items.map((it, idx) => (
                <li key={it.key}>
                  <button type="button"
                    data-testid={`hero-suggestion-item-${idx}`}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => choose(it)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${idx === active ? 'bg-dz-accent-bg' : 'hover:bg-dz-surface-2'}`}>
                    {it.type === 'product' && it.img
                      ? <img src={it.img} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />
                      : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-dz-surface-2"><Search className="h-3.5 w-3.5 text-dz-text-4" /></span>}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] text-dz-ink">
                        {it.type === 'concern' ? it.label : <Kw lang={lang}>{it.label}</Kw>}
                      </span>
                      {it.sub && <span className="block truncate text-[11px] text-dz-text-4">{it.sub}</span>}
                    </span>
                    <Mono className="shrink-0 rounded-dz-pill bg-dz-surface-2 px-2 py-0.5 text-[9px] tracking-[0.08em] text-dz-text-3">{pick(HERO_TYPE_LABEL[it.type], lang)}</Mono>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

const HomeView = ({ lang, nav, products, ingredients, brands, articles, reels = [] }) => {
  const [filter, setFilter] = useState('all')

  const featured = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4)
  const german = brands.filter((b) => b.german)
  const loading = products.length === 0

  // Handoff §6 : filtre sur la famille de l'ingrédient, avec état vide.
  const shownIngredients = ingredients
    .filter((i) => filter === 'all' || familyIdOf(i.slug) === filter)
    .slice(0, 6)

  const lead = articles[0]
  const secondary = articles.slice(1, 3)
  // Meta éditoriale : catégorie + temps de lecture estimé sur le contenu réel.
  const readTime = (a) => {
    const words = (pickText(a?.content, lang) || pickText(a?.excerpt, lang) || '').split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 200))
  }
  const articleMeta = (a) => (
    <>
      {a?.category ? label(ARTICLE_CATEGORIES, a.category, lang) : ''} · {readTime(a)} {t(lang, 'min', 'min')}
    </>
  )

  return (
    <div>
      {/* ---------- 1. Hero (handoff §2) ---------- */}
      <section id="top">
        <Container className="pt-12 md:pt-20">
          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-[72px]">
            <div className="pb-2">
              <Mono className="mb-6 block text-[10.5px] tracking-[0.2em] text-dz-text-3 md:mb-[34px]">
                {t(lang, 'Skincare basé sur la science', 'Science-based skincare')}
              </Mono>

              <h1 className="m-0 mb-7 font-display text-[40px] leading-[0.96] tracking-[-0.028em] text-balance md:text-[56px] lg:text-[64px] xl:text-[88px]">
                {t(lang, 'Comprenez enfin ce que vous mettez sur votre ', 'Finally understand what you put on your ')}
                <em className="italic text-dz-accent">{t(lang, 'peau', 'skin')}</em>
              </h1>

              <p className="m-0 mb-10 max-w-[530px] text-[16.5px] font-light leading-[1.62] text-dz-text text-pretty md:text-[18.5px]">
                {t(lang, 'Analysez les ingrédients, comparez les produits et trouvez la routine idéale — avec un focus unique sur les marques dermatologiques allemandes.', 'Analyze ingredients, compare products and find your ideal routine — with a unique focus on German dermatological brands.')}
              </p>

              {/* Barre de recherche intelligente (autocomplétion) */}
              <HeroSearch lang={lang} nav={nav} products={products} ingredients={ingredients} brands={brands} />

              {/* Suggestions populaires */}
              <div className="mt-[18px] flex flex-wrap items-center gap-2.5">
                <Mono className="text-[10.5px] tracking-[0.14em] text-[#9B9DA1]">
                  {t(lang, 'Populaire', 'Popular')}
                </Mono>
                {SUGGESTIONS.map((s) => (
                  <button key={s.fr} data-testid={`hero-suggestion-${s.en.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => s.go(nav)}
                    className="rounded-dz-pill px-3.5 py-[7px] text-[13px] text-dz-text shadow-dz-chip transition-all duration-200 hover:text-dz-accent hover:shadow-dz-chip-accent">
                    {pick(s, lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Visuel en arche inversée */}
            <div className="dz-placeholder relative h-[380px] overflow-hidden rounded-dz-arch md:h-[500px] lg:h-[620px]">
              <img src={HERO_IMG} alt="" className="h-full w-full object-cover" />
            </div>
          </div>

          {/* ---------- 2. Bandeau de chiffres (handoff §3) ---------- */}
          <StatsBand
            lang={lang}
            stats={[
              { key: 'products', value: products.length, label: t(lang, 'Produits analysés', 'Products analyzed') },
              { key: 'ingredients', value: ingredients.length, label: t(lang, 'Ingrédients décryptés', 'Ingredients decoded') },
              { key: 'brands', value: german.length, label: t(lang, 'Marques allemandes', 'German brands') },
            ]}
          />
        </Container>
      </section>

      {/* ---------- 3. Préoccupations (handoff §4) ---------- */}
      <section id="concerns">
        <Container className="pt-20 md:pt-32">
          <SectionHead
            title={t(lang, 'Quelle est votre préoccupation ?', 'What is your concern?')}
            sub={t(lang, 'Trois univers, une même exigence scientifique', 'Three universes, the same scientific rigor')}
          />
          <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2 lg:grid-cols-3">
            {VERTICALS.map((v, idx) => {
              const tags = CONCERNS.filter((c) => c.vertical === v.id)
              return (
                <div key={v.id} data-testid={`vertical-card-${v.id}`}
                  className="flex flex-col gap-[22px] rounded-dz-card bg-dz-surface p-[30px] pt-[34px] shadow-dz-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-dz-card-hover">
                  <div className="flex items-center justify-between">
                    <Mono className="text-[10.5px] tracking-[0.16em] text-dz-accent">{String(idx + 1).padStart(2, '0')}</Mono>
                    <Mono className="text-[10.5px] tracking-[0.1em] text-dz-text-4">
                      {tags.length} {t(lang, 'axes', 'areas')}
                    </Mono>
                  </div>
                  <div>
                    <h3 className="m-0 mb-2 font-display text-[30px] leading-[1.1] tracking-[-0.015em]">
                      <button onClick={() => nav('products', null, { vertical: v.id })} className="text-left transition-colors duration-200 hover:text-dz-accent">
                        {pick(v, lang)}
                      </button>
                    </h3>
                    <p className="m-0 text-[14.5px] font-light leading-[1.5] text-dz-text-2">
                      {v.id === 'skincare'
                        ? (t(lang, 'Acné, sensibilité, anti-âge, taches...', 'Acne, sensitivity, anti-aging, spots...'))
                        : v.id === 'hair'
                        ? (t(lang, 'Chute, pellicules, cheveux abîmés...', 'Hair loss, dandruff, damaged hair...'))
                        : (t(lang, 'Sommeil, stress, énergie, digestion...', 'Sleep, stress, energy, digestion...'))}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {tags.map((c) => (
                      <button key={c.id} data-testid={`concern-${c.id}`} onClick={() => nav('hub', c.id)}
                        className="rounded-dz-pill bg-dz-surface-2 px-3.5 py-2 text-[13px] text-dz-nav transition-all duration-200 hover:bg-dz-accent hover:text-white">
                        {pick(c, lang)}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ---------- 4. Produits en vedette (handoff §5) ---------- */}
      <section id="produits">
        <Container className="pt-20 md:pt-32">
          <SectionHead
            title={t(lang, 'Produits en vedette', 'Featured products')}
            sub={t(lang, 'Les mieux notés par la communauté', 'Top rated by the community')}
            action={t(lang, 'Tout voir', 'View all')}
            onAction={() => nav('products')}
            testId="home-products-all"
          />
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-dz-card bg-dz-surface shadow-dz-card">
                    <Skeleton className="h-[210px] rounded-none" />
                    <div className="flex flex-col gap-2.5 p-[22px]">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-6 w-4/5" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="mt-4 h-5 w-24" />
                    </div>
                  </div>
                ))
              : featured.map((p) => <ProductCard key={p.slug} p={p} lang={lang} onOpen={(s) => nav('product', s)} />)}
          </div>
        </Container>
      </section>

      <ReelsRail reels={reels} lang={lang} nav={nav} />

      {/* ---------- 5. Ingrédients décryptés (handoff §6) ---------- */}
      <section id="ingredients">
        <Container className="pt-20 md:pt-32">
          <SectionHead
            title={t(lang, 'Ingrédients décryptés', 'Ingredients decoded')}
            sub={t(lang, 'Ce que dit la science sur chaque actif', 'What science says about each active')}
            action={t(lang, 'Tout voir', 'View all')}
            onAction={() => nav('ingredients')}
            testId="home-ingredients-all"
          />

          <div className="mb-[22px] flex flex-wrap gap-2">
            {INGREDIENT_FILTERS.map((f) => (
              <button key={f.id} data-testid={`ingredient-filter-${f.id}`} onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`cursor-pointer rounded-dz-pill px-[17px] py-[9px] text-[13px] transition-all duration-200 ${
                  filter === f.id ? 'bg-dz-ink text-dz-on-dark' : 'bg-dz-surface text-dz-text hover:text-dz-accent'
                }`}>
                {pick(f, lang)}
              </button>
            ))}
          </div>

          <div className="rounded-dz-card bg-dz-surface px-5 py-2.5 shadow-dz-card md:px-[30px]">
            {loading && (
              <div className="divide-y divide-dz-rule-card">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:gap-[30px]">
                    <Skeleton className="h-7 w-full md:w-[230px]" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            )}

            {!loading && shownIngredients.length === 0 && (
              <p data-testid="ingredients-empty" className="py-10 text-center text-[14.5px] font-light text-dz-text-2">
                {t(lang, 'Aucun ingrédient dans cette famille.', 'No ingredient in this family.')}
              </p>
            )}

            {!loading && shownIngredients.map((i) => (
              <button key={i.slug} data-testid={`home-ingredient-${i.slug}`} onClick={() => nav('ingredient', i.slug)}
                className="group grid w-full grid-cols-1 items-center gap-3 py-6 text-left shadow-dz-rule-b transition-colors duration-200 last:shadow-none hover:text-dz-accent lg:grid-cols-[230px_1fr_160px_150px] lg:gap-[30px]">
                <span className="font-display text-[26px] leading-[1.15] tracking-[-0.015em]"><Kw lang={lang} variant="title">{i.name}</Kw></span>
                <span className="line-clamp-2 text-[14.5px] font-light leading-[1.55] text-dz-text-2">{pick(i.description, lang)}</span>
                <Mono className="text-[10.5px] tracking-[0.12em] text-dz-text-4">{familyOf(i.slug, lang)}</Mono>
                <span className="lg:justify-self-end"><EvidenceBadge evidence={i.evidence} lang={lang} /></span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- 6. Dossier marques allemandes (handoff §7) ---------- */}
      <section id="marques" className="mt-20 bg-dz-sand md:mt-32">
        <Container className="py-16 md:py-[104px]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <Mono className="mb-6 block text-[10.5px] tracking-[0.2em] text-dz-sand-eyebrow">
                {t(lang, 'Dossier', 'Feature')}
              </Mono>
              <h2 className="m-0 mb-5 font-display text-[38px] leading-[1.02] tracking-[-0.025em] text-balance md:text-[48px] xl:text-[58px]">
                {t(lang, 'L’excellence dermatologique allemande', 'German dermatological excellence')}
              </h2>
              <p className="m-0 mb-9 max-w-[430px] text-[17.5px] font-light leading-[1.62] text-dz-sand-text">
                {t(lang, 'Plus de 100 ans de recherche et de rigueur scientifique.', 'Over 100 years of research and scientific rigor.')}
              </p>
              <InkButton data-testid="home-german-brands-cta" onClick={() => nav('german-brands')} className="px-[30px] py-[15px] text-[14.5px]">
                {t(lang, 'Découvrir', 'Discover')}
              </InkButton>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {german.slice(0, 4).map((b) => (
                <button key={b.slug} data-testid={`home-brand-${b.slug}`} onClick={() => nav('brand', b.slug)}
                  className="rounded-dz-brand bg-dz-bg p-6 px-6 text-left transition-transform duration-300 hover:-translate-y-[3px]">
                  <span className="mb-2 block font-display text-[24px] leading-none tracking-[-0.015em]"><Kw lang={lang} variant="title">{b.name}</Kw></span>
                  <span className="line-clamp-2 block text-[13.5px] font-light leading-[1.55] text-dz-sand-text-2">
                    <Kw lang={lang}>{b.city}</Kw> — {pick(b.description, lang)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- 7. Derniers guides (handoff §8) ---------- */}
      <section id="guides">
        <Container className="pt-20 md:pt-32">
          <SectionHead
            title={t(lang, 'Derniers guides', 'Latest guides')}
            sub={t(lang, 'Apprenez à connaître votre peau', 'Get to know your skin')}
            action={t(lang, 'Tout voir', 'View all')}
            onAction={() => nav('learn')}
            testId="home-guides-all"
          />
          <div className="grid grid-cols-1 gap-[26px] lg:grid-cols-[1.35fr_1fr]">
            {lead && (
              <button data-testid={`home-article-${lead.slug}`} onClick={() => nav('article', lead.slug)}
                className="flex flex-col overflow-hidden rounded-dz-lead bg-dz-surface text-left shadow-dz-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-dz-card-hover">
                <span className="dz-placeholder block h-[240px] overflow-hidden md:h-[360px]">
                  <img src={lead.image || DEFAULT_ARTICLE_IMG} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="block px-[30px] pb-[34px] pt-7">
                  <Mono className="mb-3 block text-[10.5px] tracking-[0.14em] text-dz-text-4">{articleMeta(lead)}</Mono>
                  <span className="mb-3 block font-display text-[28px] leading-[1.08] tracking-[-0.02em] text-pretty md:text-[38px]">
                    {pick(lead.title, lang)}
                  </span>
                  <span className="block max-w-[520px] text-[15px] font-light leading-[1.6] text-dz-text-2">{pick(lead.excerpt, lang)}</span>
                </span>
              </button>
            )}
            <div className="flex flex-col gap-4">
              {secondary.map((a) => (
                <button key={a.slug} data-testid={`home-article-${a.slug}`} onClick={() => nav('article', a.slug)}
                  className="grid flex-1 grid-cols-[110px_1fr] items-center gap-[22px] overflow-hidden rounded-dz-guide bg-dz-surface text-left shadow-dz-card transition-transform duration-300 hover:-translate-y-[3px] md:grid-cols-[150px_1fr]">
                  <span className="dz-placeholder block h-full self-stretch overflow-hidden">
                    <img src={a.image || DEFAULT_ARTICLE_IMG} alt="" className="h-full w-full object-cover" />
                  </span>
                  <span className="block py-[22px] pr-6">
                    <Mono className="mb-2.5 block text-[10.5px] tracking-[0.14em] text-dz-text-4">{articleMeta(a)}</Mono>
                    <span className="block font-display text-[21px] leading-[1.15] tracking-[-0.015em] text-pretty md:text-[24px]">
                      {pick(a.title, lang)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- 8. CTA marques (handoff §9) ---------- */}
      <section id="marques-pro">
        <Container className="pt-20 md:pt-32">
          <div className="grid grid-cols-1 items-center gap-10 rounded-dz-cta bg-dz-ink px-8 py-14 text-dz-on-dark md:grid-cols-[1fr_auto] md:gap-16 md:px-16 md:py-[72px]">
            <div>
              <h2 className="m-0 mb-3.5 font-display text-[34px] leading-[1.04] tracking-[-0.025em] md:text-[46px]">
                {t(lang, 'Vous êtes une marque ?', 'Are you a brand?')}
              </h2>
              <p className="m-0 max-w-[600px] text-[17px] font-light leading-[1.62] text-dz-on-dark-muted">
                {t(lang, 'Faites analyser et référencer vos produits sur la plateforme de référence de la skincare transparente.', 'Get your products analyzed and listed on the reference platform for transparent skincare.')}
              </p>
            </div>
            <button data-testid="cta-for-brands" onClick={() => nav('for-brands')}
              className="justify-self-start whitespace-nowrap rounded-dz-pill bg-dz-on-dark px-[34px] py-4 text-[15px] font-medium text-dz-ink transition-[transform,color] duration-250 hover:-translate-y-0.5 hover:text-dz-accent">
              {t(lang, 'Nous contacter', 'Contact us')}
            </button>
          </div>
        </Container>
      </section>
    </div>
  )
}

// ---------- Reels / Shorts ----------
// Les vidéos sont hébergées chez un tiers : on ne stocke qu'une URL et on en
// dérive le provider, l'iframe d'embed et la vignette.
const parseVideoUrl = (url = '') => {
  const u = String(url || '')
  let m
  if ((m = u.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/))) {
    const id = m[1]
    return {
      provider: 'youtube',
      id,
      // autoplay muet + boucle : le seul mode de lecture automatique accepté par les navigateurs
      embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0&playsinline=1&modestbranding=1`,
      // oardefault = image au format original (vertical pour les Shorts, sans bandes noires) ;
      // repli sur hqdefault (toujours disponible) via onError si oardefault manque.
      thumbnail: `https://i.ytimg.com/vi/${id}/oardefault.jpg`,
      thumbnailFallback: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      watch: `https://www.youtube.com/shorts/${id}`,
    }
  }
  if ((m = u.match(/instagram\.com\/(?:reels?|p)\/([\w-]+)/))) {
    const id = m[1]
    return { provider: 'instagram', id, embed: `https://www.instagram.com/reel/${id}/embed/`, thumbnail: null, watch: u }
  }
  if ((m = u.match(/tiktok\.com\/.*\/video\/(\d+)/))) {
    const id = m[1]
    return { provider: 'tiktok', id, embed: `https://www.tiktok.com/embed/v2/${id}`, thumbnail: null, watch: u }
  }
  return { provider: null, id: null, embed: null, thumbnail: null, watch: u || null }
}

const formatDuration = (s) => {
  if (!s && s !== 0) return null
  return `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
}

// Libellé de l'entité liée (produit ou ingrédient), pour le CTA sous la vidéo.
const reelLink = (reel) => {
  if (reel.product_slug) return { view: 'product', slug: reel.product_slug }
  if (reel.ingredient_slug) return { view: 'ingredient', slug: reel.ingredient_slug }
  return null
}

// Carte verticale 9:16 du rail d'accueil.
const ReelCard = ({ reel, lang, onOpen }) => {
  const video = parseVideoUrl(reel.video_url)
  const duration = formatDuration(reel.duration_s)
  return (
    <button
      data-testid={`reel-card-${reel.slug}`}
      onClick={() => onOpen(reel.slug)}
      aria-label={pickText(reel.title, lang)}
      className="group relative aspect-[9/16] w-[220px] shrink-0 snap-start overflow-hidden rounded-dz-card bg-dz-ink text-left shadow-dz-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-dz-card-hover md:w-[248px]"
    >
      {video.thumbnail ? (
        <img
          src={video.thumbnail}
          alt=""
          loading="lazy"
          onError={(e) => {
            if (video.thumbnailFallback && e.currentTarget.src !== video.thumbnailFallback) {
              e.currentTarget.src = video.thumbnailFallback
            }
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span className="dz-placeholder absolute inset-0 block" />
      )}
      {/* Dégradé pour garder le texte lisible quelle que soit la vignette */}
      <span className="absolute inset-0 bg-gradient-to-t from-dz-ink/85 via-dz-ink/15 to-dz-ink/5" />

      <span className="absolute left-4 right-4 top-4 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 transition-transform duration-300 group-hover:scale-110">
          <Play className="h-3.5 w-3.5 fill-dz-ink text-dz-ink" />
        </span>
        {duration && (
          <Mono className="rounded-dz-pill bg-dz-ink/70 px-2 py-1 text-[9.5px] tracking-[0.1em] text-white">{duration}</Mono>
        )}
      </span>

      <span className="absolute inset-x-0 bottom-0 block p-4">
        <span className="line-clamp-3 block font-display text-[20px] leading-[1.15] tracking-[-0.015em] text-white text-pretty">
          {pick(reel.title, lang)}
        </span>
      </span>
    </button>
  )
}

// Rail horizontal de la page d'accueil.
const ReelsRail = ({ reels, lang, nav }) => {
  if (!reels.length) return null
  return (
    <section id="reels">
      <Container className="pt-20 md:pt-32">
        <SectionHead
          title={t(lang, 'En 60 secondes', 'In 60 seconds')}
          sub={t(lang, 'La science de la peau, format court', 'Skin science, short form')}
          action={t(lang, 'Tout voir', 'View all')}
          onAction={() => nav('reels')}
          testId="home-reels-all"
        />
        <div className="-mx-5 flex snap-x snap-mandatory gap-[22px] overflow-x-auto px-5 pb-4 md:-mx-11 md:px-11"
          style={{ scrollbarWidth: 'thin' }}>
          {reels.map((r) => <ReelCard key={r.slug} reel={r} lang={lang} onOpen={(s) => nav('reels', s)} />)}
        </div>
      </Container>
    </section>
  )
}

// ---------- Reels feed (route /reels) ----------
// Deux mises en page, un seul composant :
// - desktop (lg+) : feed plein écran, vidéo + panneau côte à côte, défilement
//   par à-coups (scroll snap) dans un conteneur dédié ;
// - mobile : flux de page normal (aucun conteneur défilant imbriqué), vidéo
//   dimensionnée par la hauteur d'écran puis panneau éditorial dessous.
// Dans les deux cas, seule la vidéo active est montée en iframe.
const DESKTOP_FEED_MQ = '(min-width: 1024px)'

const ReelsView = ({ lang, nav, slug }) => {
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  // `true` = feed desktop : le conteneur est lui-même la zone défilante.
  const [feedMode, setFeedMode] = useState(false)
  const containerRef = useRef(null)
  const itemRefs = useRef([])
  // Les lecteurs 9:16 : c'est leur visibilité qui décide du reel actif.
  const playerRefs = useRef([])

  useEffect(() => {
    fetch('/api/reels')
      .then((r) => r.json())
      .then((d) => { setReels(d.reels || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_FEED_MQ)
    const apply = () => setFeedMode(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Mobile : c'est le document qui défile, on lui donne donc l'accrochage
  // vertical le temps de la vue pour que chaque reel se cale sous le header.
  // Desktop : l'accrochage vit sur le conteneur du feed, rien à poser ici.
  useEffect(() => {
    if (feedMode || !reels.length) return
    const root = document.documentElement
    root.classList.add('dz-snap-page')
    return () => root.classList.remove('dz-snap-page')
  }, [feedMode, reels.length])

  // Lien profond : #/reels/{slug} ouvre directement le bon reel.
  useEffect(() => {
    if (!reels.length || !slug) return
    const i = reels.findIndex((r) => r.slug === slug)
    if (i >= 0) {
      setActive(i)
      itemRefs.current[i]?.scrollIntoView({ block: 'start' })
    }
  }, [reels, slug])

  // Le reel actif — le seul dont l'iframe est montée — est celui dont le
  // lecteur est le plus visible. On observe les lecteurs et non les sections :
  // en mobile une section (vidéo + panneau) dépasse la hauteur d'écran, et
  // c'est bien la vidéo qu'on regarde qui doit jouer. Le maximum est pris sur
  // l'ensemble des ratios connus, sinon le dernier événement reçu — souvent
  // celui du lecteur qui sort de l'écran — l'emporterait.
  useEffect(() => {
    if (!reels.length) return
    const ratios = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = Number(e.target.dataset.index)
          if (!Number.isNaN(i)) ratios.set(i, e.isIntersecting ? e.intersectionRatio : 0)
        })
        let best = -1
        let bestRatio = 0
        ratios.forEach((ratio, i) => {
          if (ratio > bestRatio) { bestRatio = ratio; best = i }
        })
        if (best >= 0) setActive(best)
      },
      {
        // Desktop : le conteneur du feed défile. Mobile : le viewport, dont on
        // retire la hauteur du header sticky qui recouvre le haut de l'écran.
        root: feedMode ? containerRef.current : null,
        rootMargin: feedMode ? '0px' : '-72px 0px 0px 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }
    )
    playerRefs.current.filter(Boolean).forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [reels, feedMode])

  const goTo = useCallback((i) => {
    const next = Math.max(0, Math.min(i, itemRefs.current.length - 1))
    itemRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (['ArrowDown', 'j', 'PageDown'].includes(e.key)) { e.preventDefault(); goTo(active + 1) }
      if (['ArrowUp', 'k', 'PageUp'].includes(e.key)) { e.preventDefault(); goTo(active - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, goTo])

  if (loading) {
    return (
      <Container className="py-20">
        <Skeleton className="mx-auto aspect-[9/16] w-full max-w-[380px] rounded-dz-card" />
      </Container>
    )
  }

  if (!reels.length) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-[32px] tracking-[-0.02em]">{t(lang, 'Reels', 'Reels')}</h1>
        <p data-testid="reels-empty" className="mt-3 text-[14.5px] font-light text-dz-text-2">
          {t(lang, 'Aucune vidéo publiée pour le moment.', 'No video published yet.')}
        </p>
      </Container>
    )
  }

  return (
    <div
      ref={containerRef}
      data-testid="reels-feed"
      // Mobile : on laisse la page défiler (un seul ascenseur). Le conteneur ne
      // devient une zone défilante autonome qu'à partir de lg.
      className="lg:h-[calc(100dvh-72px)] lg:snap-y lg:snap-mandatory lg:overflow-y-auto lg:overscroll-contain"
    >
      {reels.map((reel, i) => {
        const video = parseVideoUrl(reel.video_url)
        const link = reelLink(reel)
        const duration = formatDuration(reel.duration_s)
        const isActive = i === active
        return (
          <section
            key={reel.slug}
            data-index={i}
            data-testid={`reel-${reel.slug}`}
            ref={(n) => { itemRefs.current[i] = n }}
            // snap-start : chaque reel se cale en haut de la zone défilante
            // (page en mobile, conteneur en desktop) pour que la vidéo prenne
            // le cadrage. scroll-mt : le header sticky (72px) ne doit pas en
            // recouvrir le haut, ni à l'accrochage, ni par lien profond, ni par
            // les flèches préc./suiv.
            // Filet de séparation entre reels, utile seulement en flux mobile.
            className={`flex snap-start scroll-mt-[72px] flex-col items-center justify-center px-5 pb-14 pt-6 md:px-11 lg:h-full lg:scroll-mt-0 lg:pb-6 ${
              i > 0 ? 'shadow-dz-rule-t lg:shadow-none' : ''
            }`}
          >
            <div className="flex w-full max-w-dz flex-col items-center gap-7 lg:h-full lg:flex-row lg:justify-center lg:gap-16">
              {/* Lecteur 9:16 : en mobile la largeur découle de la hauteur
                  d'écran disponible (70svh, soit l'écran moins le header, sa
                  marge et l'amorce du titre), pour que le reel cadré occupe
                  l'écran tout en restant entier. */}
              <div
                data-index={i}
                ref={(n) => { playerRefs.current[i] = n }}
                className="relative aspect-[9/16] w-full max-w-[min(100%,max(240px,calc(70svh*9/16)))] shrink-0 overflow-hidden rounded-dz-card bg-dz-ink shadow-dz-card lg:h-full lg:w-auto lg:max-w-full lg:shrink"
              >
                {isActive && video.embed ? (
                  <iframe
                    src={video.embed}
                    title={pickText(reel.title, lang) || reel.slug}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      if (video.thumbnailFallback && e.currentTarget.src !== video.thumbnailFallback) {
                        e.currentTarget.src = video.thumbnailFallback
                      }
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <span className="dz-placeholder absolute inset-0 block" />
                )}
                {!video.embed && (
                  <span className="absolute inset-x-0 bottom-0 bg-dz-ink/80 p-4">
                    <Mono className="text-[9.5px] tracking-[0.1em] text-white">
                      {t(lang, 'source vidéo non reconnue', 'unrecognized video source')}
                    </Mono>
                  </span>
                )}
              </div>

              {/* Panneau éditorial */}
              <div className="w-full max-w-[420px] shrink-0">
                <div className="mb-4 flex items-center gap-4">
                  <Mono className="dz-ltr text-[10.5px] tracking-[0.16em] text-dz-text-4">
                    {String(i + 1).padStart(2, '0')} / {String(reels.length).padStart(2, '0')}
                  </Mono>
                  {duration && <Mono className="text-[10.5px] tracking-[0.1em] text-dz-text-4">{duration}</Mono>}
                </div>

                <h1 className="m-0 mb-4 font-display text-[30px] leading-[1.08] tracking-[-0.02em] text-balance md:text-[38px]">
                  {pick(reel.title, lang)}
                </h1>
                <p className="m-0 text-[15px] font-light leading-[1.6] text-dz-text-2">{pick(reel.caption, lang)}</p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {link && (
                    <button
                      data-testid={`reel-cta-${reel.slug}`}
                      onClick={() => nav(link.view, link.slug)}
                      className="rounded-dz-pill bg-dz-accent px-6 py-3 text-[14px] font-medium text-white transition-colors duration-250 hover:bg-dz-accent-hover"
                    >
                      {link.view === 'product'
                        ? (t(lang, 'Voir le produit', 'View product'))
                        : (t(lang, "Voir l'ingrédient", 'View ingredient'))}
                    </button>
                  )}
                  {video.watch && (
                    <a
                      href={video.watch} target="_blank" rel="noopener noreferrer"
                      className="rounded-dz-pill px-5 py-3 text-[13px] text-dz-text shadow-dz-chip transition-all duration-200 hover:text-dz-accent hover:shadow-dz-chip-accent"
                    >
                      {t(lang, 'Ouvrir la source', 'Open source')} ↗
                    </a>
                  )}
                </div>

                {/* Navigation du feed */}
                <div className="mt-8 flex items-center gap-2">
                  <button
                    data-testid="reel-prev" onClick={() => goTo(i - 1)} disabled={i === 0}
                    aria-label={ts(lang, 'Vidéo précédente', 'Previous video')}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-dz-surface shadow-dz-card transition-colors duration-200 hover:text-dz-accent disabled:opacity-40"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    data-testid="reel-next" onClick={() => goTo(i + 1)} disabled={i === reels.length - 1}
                    aria-label={ts(lang, 'Vidéo suivante', 'Next video')}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-dz-surface shadow-dz-card transition-colors duration-200 hover:text-dz-accent disabled:opacity-40"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

// ---------- Products list ----------
const ProductsView = ({ lang, nav, initialFilters }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(initialFilters?.search || '')
  const [vertical, setVertical] = useState(initialFilters?.vertical || 'all')
  const [category, setCategory] = useState(initialFilters?.category || 'all')
  const [concern, setConcern] = useState(initialFilters?.concern || 'all')
  const [skinType, setSkinType] = useState('all')

  const visibleCategories = vertical === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.vertical === vertical)
  const visibleConcerns = vertical === 'all' ? CONCERNS : CONCERNS.filter((c) => c.vertical === vertical)

  const changeVertical = (v) => {
    setVertical(v)
    if (v !== 'all') {
      setCategory((cur) => (cur !== 'all' && !CATEGORIES.find((c) => c.id === cur && c.vertical === v) ? 'all' : cur))
      setConcern((cur) => (cur !== 'all' && !CONCERNS.find((c) => c.id === cur && c.vertical === v) ? 'all' : cur))
      if (v !== 'skincare') setSkinType('all')
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const p = new URLSearchParams()
      if (vertical !== 'all') p.set('vertical', vertical)
      if (category !== 'all') p.set('category', category)
      if (concern !== 'all') p.set('concern', concern)
      if (skinType !== 'all') p.set('skin_type', skinType)
      if (search) p.set('search', search)
      const res = await fetch(`/api/products?${p.toString()}`)
      const data = await res.json()
      setProducts(data.products || [])
      setLoading(false)
    }
    const timer = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [search, vertical, category, concern, skinType])

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle sub={t(lang, 'Tous les produits analysés par nos experts', 'All products analyzed by our experts')}>
        {t(lang, 'Produits', 'Products')}
      </SectionTitle>
      <div className="flex gap-2 mb-4 flex-wrap">
        {[{ id: 'all', fr: 'Tous', en: 'All', ar: 'الكل' }, ...VERTICALS].map((v) => (
          <button key={v.id} data-testid={`vertical-tab-${v.id}`} onClick={() => changeVertical(v.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${vertical === v.id ? 'bg-dz-ink text-dz-on-dark border-dz-ink' : 'border-dz-rule text-dz-text hover:border-dz-text-4'}`}>
            {pick(v, lang)}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dz-text-4" />
          <Input data-testid="products-search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={ts(lang, 'Rechercher un produit ou une marque...', 'Search a product or brand...')} className="pl-9" />
        </div>
        <div className="grid grid-cols-3 gap-2 md:flex">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="filter-category" className="w-full md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t(lang, 'Catégorie', 'Category')}</SelectItem>
              {visibleCategories.map((c) => <SelectItem key={c.id} value={c.id}>{pick(c, lang)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={concern} onValueChange={setConcern}>
            <SelectTrigger data-testid="filter-concern" className="w-full md:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t(lang, 'Préoccupation', 'Concern')}</SelectItem>
              {visibleConcerns.map((c) => <SelectItem key={c.id} value={c.id}>{pick(c, lang)}</SelectItem>)}
            </SelectContent>
          </Select>
          {(vertical === 'all' || vertical === 'skincare') && (
            <Select value={skinType} onValueChange={setSkinType}>
              <SelectTrigger data-testid="filter-skin" className="w-full md:w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t(lang, 'Type de peau', 'Skin type')}</SelectItem>
                {SKIN_TYPES.map((s) => <SelectItem key={s.id} value={s.id}>{pick(s, lang)}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      {loading ? (
        <p className="text-dz-text-4 py-12 text-center">{t(lang, 'Chargement...', 'Loading...')}</p>
      ) : products.length === 0 ? (
        <p data-testid="no-products" className="text-dz-text-4 py-12 text-center">{t(lang, 'Aucun produit trouvé.', 'No products found.')}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((p) => <ProductCard key={p.slug} p={p} lang={lang} onOpen={(s) => nav('product', s)} />)}
        </div>
      )}
    </div>
  )
}

// ---------- Product detail ----------
// Ligne d'étude (cliquable, ouvre la source externe).
const StudyRow = ({ s, lang, tag }) => (
  <a href={s.url || '#'} target="_blank" rel="noopener noreferrer"
    data-testid="study-row"
    className="flex items-start justify-between gap-3 rounded-lg border border-dz-rule bg-white p-3 transition-colors hover:border-dz-accent">
    <div className="min-w-0">
      <p className="text-sm font-medium text-dz-ink">{pick(s.title, lang) || s.title?.fr}</p>
      <p className="mt-0.5 text-[11px] text-dz-text-4">
        {tag && <span className="font-medium text-dz-accent">{tag} · </span>}
        {s.source}{s.year ? ` · ${s.year}` : ''}
      </p>
      {pick(s.summary, lang) && <p className="mt-1.5 text-[12.5px] leading-relaxed text-dz-text-2">{pick(s.summary, lang)}</p>}
    </div>
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[12px] text-dz-accent">
      {t(lang, "Voir l'étude", 'View study')} <ExternalLink className="h-3.5 w-3.5" />
    </span>
  </a>
)

const ProductDetailView = ({ slug, lang, nav, setCompareA }) => {
  const [p, setP] = useState(null)
  useEffect(() => { fetch(`/api/products/${slug}`).then((r) => r.json()).then(setP) }, [slug])
  if (!p) return <p className="text-center py-20 text-dz-text-4">...</p>
  if (p.error) return <p className="text-center py-20 text-dz-text-4">{p.error}</p>
  const certs = p.certifications || []
  const awards = p.awards || []
  const productStudies = p.studies || []
  const ingredientStudies = (p.ingredient_details || []).flatMap((i) => (i.studies || []).map((s) => ({ ...s, ingredient: i.name, slug: i.slug })))
  const scopeText = (sc) => sc === 'US' ? 'US' : sc === 'global' ? (t(lang, 'International', 'Global')) : 'UE'
  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => nav('products')} className="flex items-center gap-1 text-sm text-dz-text-2 hover:text-dz-ink mb-5">
        <ArrowLeft className="h-4 w-4" /> {t(lang, 'Retour aux produits', 'Back to products')}
      </button>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative rounded-2xl overflow-hidden bg-dz-surface-2 aspect-square">
          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
          {p.german_made && <Badge className="absolute top-3 left-3 bg-dz-ink/85 text-dz-on-dark hover:bg-dz-ink/85">🇩🇪 <Kw lang={lang}>Made in Germany</Kw></Badge>}
        </div>
        <div>
          <button data-testid="product-brand-link" onClick={() => nav('brand', p.brand_slug)} className="text-xs uppercase tracking-wider text-dz-accent font-semibold hover:underline"><Kw lang={lang}>{p.brand_name}</Kw></button>
          <h1 data-testid="product-title" className="text-2xl md:text-4xl font-display font-normal tracking-[-0.02em] text-dz-ink mt-1"><Kw lang={lang} variant="title">{p.name}</Kw></h1>
          <div className="flex items-center gap-4 mt-3">
            <span className="dz-ltr text-2xl font-semibold text-dz-ink">{p.price_eur?.toFixed(2)} €</span>
            <Stars rating={p.rating} />
            <Badge variant="secondary" className="bg-dz-surface-2 text-dz-text">{label(CATEGORIES, p.category, lang)}</Badge>
          </div>
          <p className="text-dz-text mt-4 leading-relaxed">{pick(p.description, lang)}</p>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider text-dz-text-4 font-semibold mb-2">{t(lang, 'Préoccupations ciblées', 'Targeted concerns')}</p>
            <div className="flex flex-wrap gap-1.5">
              {(p.concerns || []).map((c) => <Badge key={c} className="bg-dz-accent-bg text-dz-accent hover:bg-dz-accent-bg">{label(CONCERNS, c, lang)}</Badge>)}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider text-dz-text-4 font-semibold mb-2">{t(lang, 'Types de peau', 'Skin types')}</p>
            <div className="flex flex-wrap gap-1.5">
              {(p.skin_types || []).map((s) => <Badge key={s} variant="outline" className="border-dz-chip text-dz-text">{label(SKIN_TYPES, s, lang)}</Badge>)}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-dz-text-4 font-semibold mb-2">{t(lang, 'Actifs clés', 'Key actives')}</p>
            <div className="grid gap-2">
              {(p.ingredient_details || []).map((i) => (
                <button key={i.slug} data-testid={`product-ingredient-${i.slug}`} onClick={() => nav('ingredient', i.slug)}
                  className="flex items-center justify-between p-3 rounded-lg border border-dz-rule hover:border-dz-accent hover:shadow-sm transition-all text-left bg-white">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-dz-accent" />
                    <div><p className="text-sm font-semibold text-dz-ink"><Kw lang={lang}>{i.name}</Kw></p><p className="text-[11px] text-dz-text-4 font-mono"><Kw lang={lang}>{i.inci}</Kw></p></div>
                  </div>
                  <SafetyBadge safety={i.safety} lang={lang} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <BuyButton product={p} lang={lang} className="flex-1 h-11" />
            <Button data-testid="compare-btn" size="lg" variant="outline" className="border-dz-chip flex-1" onClick={() => { setCompareA(p.slug); nav('compare') }}>
              <GitCompare className="h-4 w-4 mr-2" /> {t(lang, 'Comparer', 'Compare')}
            </Button>
          </div>
        </div>
      </div>

      {(certs.length > 0 || awards.length > 0) && (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {certs.length > 0 && (
            <div data-testid="product-certifications">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dz-text-4"><BadgeCheck className="h-4 w-4 text-dz-accent" />{t(lang, 'Certifications reconnues', 'Recognized certifications')}</p>
              <div className="flex flex-wrap gap-2">
                {certs.map((c, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 rounded-dz-pill border border-dz-rule bg-white px-3 py-1.5 text-[13px] text-dz-ink">
                    <ShieldCheck className="h-3.5 w-3.5 text-dz-accent" />
                    {pick(c.name, lang)}
                    <Mono className="rounded-dz-pill bg-dz-accent-bg px-1.5 py-0.5 text-[9px] tracking-[0.08em] text-dz-accent">{scopeText(c.scope)}</Mono>
                  </span>
                ))}
              </div>
            </div>
          )}
          {awards.length > 0 && (
            <div data-testid="product-awards">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dz-text-4"><Trophy className="h-4 w-4 text-dz-sand-eyebrow" />{t(lang, 'Labels & récompenses', 'Labels & awards')}</p>
              <div className="flex flex-col gap-2">
                {awards.map((a, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-dz-sand bg-dz-surface-2 px-4 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-dz-sand"><Trophy className="h-4 w-4 text-dz-sand-eyebrow" /></span>
                    <div><p className="text-sm font-semibold text-dz-ink">{pick(a.title, lang)}</p><Mono className="text-[10px] tracking-[0.1em] text-dz-text-4">{a.year}</Mono></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(productStudies.length > 0 || ingredientStudies.length > 0) && (
        <div className="mt-12" data-testid="product-studies">
          <p className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dz-text-4"><BookOpen className="h-4 w-4 text-dz-accent" />{t(lang, 'Études & preuves scientifiques', 'Studies & scientific evidence')}</p>
          {productStudies.length > 0 && (
            <>
              <p className="mb-2 text-[13px] font-semibold text-dz-ink">{t(lang, 'Sur le produit', 'On the product')}</p>
              <div className="mb-5 grid gap-2">
                {productStudies.map((s, idx) => <StudyRow key={'ps' + idx} s={s} lang={lang} />)}
              </div>
            </>
          )}
          {ingredientStudies.length > 0 && (
            <>
              <p className="mb-2 text-[13px] font-semibold text-dz-ink">{t(lang, 'Sur les ingrédients', 'On the ingredients')}</p>
              <div className="grid gap-2">
                {ingredientStudies.map((s, idx) => <StudyRow key={'is' + idx} s={s} lang={lang} tag={s.ingredient} />)}
              </div>
            </>
          )}
          <p className="mt-3 text-[11px] text-dz-text-4">{t(lang, 'Références fournies à titre informatif (démonstration).', 'References provided for informational purposes (demo).')}</p>
        </div>
      )}
    </div>
  )
}

// ---------- Ingredients ----------
const IngredientsView = ({ lang, nav, ingredients }) => (
  <div className="container mx-auto px-4 py-8">
    <SectionTitle sub={t(lang, 'Chaque actif évalué selon les preuves scientifiques', 'Every active rated according to scientific evidence')}>
      {t(lang, 'Ingrédients', 'Ingredients')}
    </SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {ingredients.map((i) => (
        <Card key={i.slug} data-testid={`ingredient-card-${i.slug}`} onClick={() => nav('ingredient', i.slug)} className="cursor-pointer border-dz-rule hover:shadow-lg transition-all">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-dz-accent-bg flex items-center justify-center"><FlaskConical className="h-4.5 w-4.5 text-dz-accent" /></div>
                <div><p className="font-semibold text-dz-ink"><Kw lang={lang}>{i.name}</Kw></p><p className="text-[11px] text-dz-text-4 font-mono"><Kw lang={lang}>{i.inci}</Kw></p></div>
              </div>
              <SafetyBadge safety={i.safety} lang={lang} />
            </div>
            <p className="text-sm text-dz-text-2 mt-3 line-clamp-2">{pick(i.description, lang)}</p>
            <div className="flex gap-1.5 flex-wrap mt-3">
              <EvidenceBadge evidence={i.evidence} lang={lang} />
              {(i.good_for || []).slice(0, 2).map((c) => <Badge key={c} variant="secondary" className="bg-dz-surface-2 text-dz-text text-[10px]">{label(CONCERNS, c, lang)}</Badge>)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

const IngredientDetailView = ({ slug, lang, nav }) => {
  const [i, setI] = useState(null)
  useEffect(() => { fetch(`/api/ingredients/${slug}`).then((r) => r.json()).then(setI) }, [slug])
  if (!i) return <p className="text-center py-20 text-dz-text-4">...</p>
  if (i.error) return <p className="text-center py-20 text-dz-text-4">{i.error}</p>
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => nav('ingredients')} className="flex items-center gap-1 text-sm text-dz-text-2 hover:text-dz-ink mb-5">
        <ArrowLeft className="h-4 w-4" /> {t(lang, 'Retour aux ingrédients', 'Back to ingredients')}
      </button>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 data-testid="ingredient-title" className="text-3xl md:text-4xl font-display font-normal tracking-[-0.02em] text-dz-ink"><Kw lang={lang} variant="title">{i.name}</Kw></h1>
          <p className="text-dz-text-4 font-mono text-sm mt-1"><Kw lang={lang}>INCI</Kw> : <Kw lang={lang}>{i.inci}</Kw></p>
        </div>
        <div className="flex gap-2"><SafetyBadge safety={i.safety} lang={lang} /><EvidenceBadge evidence={i.evidence} lang={lang} /></div>
      </div>
      <p className="text-dz-text mt-5 leading-relaxed text-base md:text-lg">{pick(i.description, lang)}</p>

      {pick(i.regulatory, lang) && (
        <div data-testid="ingredient-regulatory" className="mt-5 rounded-xl border border-dz-rule bg-dz-bg p-4 flex gap-3">
          <ShieldCheck className="h-4 w-4 text-dz-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-wider text-dz-text-4 font-semibold mb-1">{t(lang, 'Contexte réglementaire (UE / Allemagne)', 'Regulatory context (EU / Germany)')}</p>
            <p className="text-sm text-dz-text leading-relaxed">{pick(i.regulatory, lang)}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mt-7">
        <Card className="border-dz-rule">
          <CardContent className="p-5">
            <p className="font-semibold text-dz-ink mb-3 flex items-center gap-2"><Check className="h-4 w-4 text-dz-accent" />{t(lang, 'Bénéfices', 'Benefits')}</p>
            <ul className="space-y-2">
              {(pick(i.benefits, lang) || []).map((b, idx) => (
                <li key={idx} className="text-sm text-dz-text flex items-start gap-2"><span className="text-dz-accent mt-0.5">•</span>{b}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-dz-rule">
          <CardContent className="p-5">
            <p className="font-semibold text-dz-ink mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-dz-accent" />{t(lang, 'Profil', 'Profile')}</p>
            <div className="space-y-2 text-sm text-dz-text">
              <p>{t(lang, 'Comédogénicité', 'Comedogenicity')} : <span className="dz-ltr font-semibold">{i.comedogenic}/5</span></p>
              <p className="flex items-center gap-1.5 flex-wrap">{t(lang, 'Recommandé pour', 'Recommended for')} :
                {(i.good_for || []).map((c) => <Badge key={c} variant="secondary" className="bg-dz-surface-2 text-dz-text text-[10px]">{label(CONCERNS, c, lang)}</Badge>)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {(i.products || []).length > 0 && (
        <div className="mt-9">
          <SectionTitle>{t(lang, 'Produits contenant cet actif', 'Products with this active')}</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {i.products.map((p) => <ProductCard key={p.slug} p={p} lang={lang} onOpen={(s) => nav('product', s)} />)}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Brands ----------
const BrandsView = ({ lang, nav, germanOnly }) => {
  const [brands, setBrands] = useState([])
  useEffect(() => {
    fetch(`/api/brands${germanOnly ? '?german=true' : ''}`).then((r) => r.json()).then((d) => setBrands(d.brands || []))
  }, [germanOnly])
  return (
    <div className="container mx-auto px-4 py-8">
      {germanOnly ? (
        <div className="rounded-2xl bg-dz-ink text-white p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-normal tracking-[-0.02em]">🇩🇪 {t(lang, 'Marques allemandes', 'German Brands')}</h1>
          <p className="text-dz-chip mt-3 max-w-2xl">
            {t(lang, "L'Allemagne est le berceau de la dermo-cosmétique moderne : pH physiologique, essais cliniques rigoureux, formules minimalistes. Découvrez les marques qui ont fait cette réputation.", 'Germany is the birthplace of modern dermo-cosmetics: physiological pH, rigorous clinical trials, minimalist formulas. Discover the brands that built this reputation.')}
          </p>
        </div>
      ) : (
        <SectionTitle sub={t(lang, 'Les marques référencées sur la plateforme', 'Brands listed on the platform')}>
          {t(lang, 'Marques', 'Brands')}
        </SectionTitle>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <Card key={b.slug} data-testid={`brand-card-${b.slug}`} onClick={() => nav('brand', b.slug)} className="cursor-pointer border-dz-rule hover:shadow-lg transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-lg font-display font-normal tracking-[-0.02em] text-dz-ink"><Kw lang={lang} variant="title">{b.name}</Kw></p>
                {b.german && <span title="Made in Germany">🇩🇪</span>}
              </div>
              <p className="text-xs text-dz-text-4 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /><Kw lang={lang}>{b.city}</Kw>, <Kw lang={lang}>{b.country}</Kw> · {t(lang, 'depuis', 'since')} {b.founded}</p>
              <p className="text-sm text-dz-text-2 mt-3 line-clamp-3">{pick(b.description, lang)}</p>
              {(b.certifications || []).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {b.certifications.slice(0, 3).map((c) => (
                    <Badge key={c} variant="secondary" className="bg-dz-surface-2 text-dz-text text-[10px]"><Kw lang={lang}>{c}</Kw></Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const BrandDetailView = ({ slug, lang, nav }) => {
  const [b, setB] = useState(null)
  useEffect(() => { fetch(`/api/brands/${slug}`).then((r) => r.json()).then(setB) }, [slug])
  if (!b) return <p className="text-center py-20 text-dz-text-4">...</p>
  if (b.error) return <p className="text-center py-20 text-dz-text-4">{b.error}</p>
  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => nav('brands')} className="flex items-center gap-1 text-sm text-dz-text-2 hover:text-dz-ink mb-5">
        <ArrowLeft className="h-4 w-4" /> {t(lang, 'Retour aux marques', 'Back to brands')}
      </button>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 data-testid="brand-title" className="text-3xl md:text-4xl font-display font-normal tracking-[-0.02em] text-dz-ink"><Kw lang={lang} variant="title">{b.name}</Kw> {b.german && '🇩🇪'}</h1>
          <p className="text-dz-text-4 text-sm mt-1 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /><Kw lang={lang}>{b.city}</Kw>, <Kw lang={lang}>{b.country}</Kw> · {t(lang, 'fondée en', 'founded in')} {b.founded}</p>
        </div>
        <Button variant="outline" className="border-dz-chip" onClick={() => window.open(b.website, '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" /> {t(lang, 'Site officiel', 'Official website')}
        </Button>
      </div>
      <p className="text-dz-text mt-4 leading-relaxed max-w-3xl">{pick(b.description, lang)}</p>
      <div className="grid sm:grid-cols-2 gap-3 mt-6 max-w-3xl">
        {b.manufacturer && (
          <Card className="border-dz-rule">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wider text-dz-text-4 font-semibold mb-1.5 flex items-center gap-1.5">
                <Factory className="h-3.5 w-3.5" /> {t(lang, 'Fabricant', 'Manufacturer')}
              </p>
              <p data-testid="brand-manufacturer" className="text-sm font-semibold text-dz-ink"><Kw lang={lang}>{b.manufacturer}</Kw></p>
              <p className="text-xs text-dz-text-2 mt-0.5"><Kw lang={lang}>{b.city}</Kw>, <Kw lang={lang}>{b.country}</Kw></p>
            </CardContent>
          </Card>
        )}
        {(b.certifications || []).length > 0 && (
          <Card className="border-dz-rule">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wider text-dz-text-4 font-semibold mb-2 flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5" /> {t(lang, 'Certifications & engagements', 'Certifications & commitments')}
              </p>
              <div className="flex flex-wrap gap-1.5" data-testid="brand-certifications">
                {b.certifications.map((c) => (
                  <Badge key={c} className="bg-dz-accent-bg text-dz-accent hover:bg-dz-accent-bg text-[11px]"><Kw lang={lang}>{c}</Kw></Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="mt-9">
        <SectionTitle>{t(lang, 'Produits de la marque', 'Brand products')} <Kw lang={lang}>{b.name}</Kw></SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {(b.products || []).map((p) => <ProductCard key={p.slug} p={p} lang={lang} onOpen={(s) => nav('product', s)} />)}
        </div>
      </div>
    </div>
  )
}

// ---------- Compare ----------
// Pastille de sécurité (3 niveaux) réutilisée dans l'analyse d'ingrédients.
const SAFETY_DOT = { green: 'bg-emerald-500', caution: 'bg-amber-500', red: 'bg-red-500' }
const SafetyDot = ({ safety }) => (
  <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${SAFETY_DOT[safety] || 'bg-dz-text-4'}`} />
)

// Combobox produit avec recherche : image + marque + prix.
const ProductPicker = ({ products, value, onChange, placeholder, searchPlaceholder, emptyText, disabled, disabledHint, testId, lang }) => {
  const [open, setOpen] = useState(false)
  const selected = products.find((p) => p.slug === value)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button" data-testid={testId} disabled={disabled}
          className="flex w-full items-center gap-3 rounded-2xl border border-dz-rule bg-white px-3 py-2.5 text-left transition-colors hover:border-dz-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {selected ? (
            <>
              <img src={selected.image} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] uppercase tracking-wider text-dz-text-4"><Kw lang={lang}>{selected.brand_name}</Kw></span>
                <span className="block truncate text-sm font-semibold text-dz-ink"><Kw lang={lang}>{selected.name}</Kw></span>
              </span>
              <span className="dz-ltr shrink-0 font-mono text-sm text-dz-accent">{selected.price_eur?.toFixed(2)} €</span>
            </>
          ) : (
            <span className="flex-1 truncate text-sm text-dz-text-4">{disabled && disabledHint ? disabledHint : placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 text-dz-text-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(92vw,440px)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {products.map((p) => (
                <CommandItem key={p.slug} value={`${p.brand_name} ${p.name} ${p.slug}`} onSelect={() => { onChange(p.slug); setOpen(false) }} className="gap-3">
                  <img src={p.image} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[10.5px] uppercase tracking-wider text-dz-text-4"><Kw lang={lang}>{p.brand_name}</Kw></span>
                    <span className="block truncate text-sm text-dz-ink"><Kw lang={lang}>{p.name}</Kw></span>
                  </span>
                  <span className="dz-ltr shrink-0 font-mono text-xs text-dz-text-2">{p.price_eur?.toFixed(2)} €</span>
                  {value === p.slug && <Check className="h-4 w-4 shrink-0 text-dz-accent" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// En-tête produit (colonne) — collant en haut du tableau.
const CompareProductHeader = ({ p, nav, lang }) => (
  <div className="text-center">
    {p?.image && <img src={p.image} alt={p.name} className="mx-auto h-16 w-16 rounded-xl object-cover md:h-24 md:w-24" />}
    <p className="mt-2 truncate text-[10.5px] uppercase tracking-wider text-dz-text-4"><Kw lang={lang}>{p?.brand_name}</Kw></p>
    <button onClick={() => nav('product', p.slug)} className="line-clamp-2 block w-full text-sm font-semibold leading-snug text-dz-ink hover:underline"><Kw lang={lang}>{p?.name}</Kw></button>
  </div>
)

// Ligne comparative avec surlignage du gagnant (trophée + fond accent).
const CMP_GRID = 'grid grid-cols-[92px_1fr_1fr] gap-2 md:grid-cols-[150px_1fr_1fr]'
const CompareRow = ({ rowLabel, a, b, winner, testId }) => {
  const cell = (content, side) => (
    <div data-testid={testId ? `${testId}-${side}` : undefined}
      className={`flex items-center justify-center gap-1.5 border-t border-dz-rule-card px-1 py-3 text-center text-sm font-semibold text-dz-ink ${winner === side ? 'rounded-lg bg-dz-accent-bg/70' : ''}`}>
      {winner === side && <Trophy className="h-3.5 w-3.5 shrink-0 text-dz-accent" />}
      <span>{content}</span>
    </div>
  )
  return (
    <>
      <div className="flex items-center border-t border-dz-rule-card py-3 pr-2 text-[11px] font-semibold uppercase tracking-wider text-dz-text-4">{rowLabel}</div>
      {cell(a, 'a')}
      {cell(b, 'b')}
    </>
  )
}

// Tuile "verdict" synthétique.
const VerdictTile = ({ icon, label: tileLabel, value, sub }) => (
  <div className="rounded-2xl border border-dz-rule bg-white p-4">
    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-dz-text-4">{icon}{tileLabel}</div>
    <p className="mt-1.5 text-sm font-semibold leading-snug text-dz-ink">{value}</p>
    {sub && <p className="mt-0.5 text-[11px] text-dz-text-2">{sub}</p>}
  </div>
)

// Badge d'ingrédient cliquable dans l'analyse comparative.
const CompareIngBadge = ({ slug, name, safety, accent, onOpen }) => (
  <button onClick={() => onOpen(slug)}
    className={`inline-flex items-center gap-1.5 rounded-dz-pill px-2.5 py-1 text-[11px] transition-colors ${accent ? 'bg-dz-accent-bg text-dz-accent hover:bg-dz-accent-bg/70' : 'bg-dz-surface-2 text-dz-text hover:text-dz-accent'}`}>
    <SafetyDot safety={safety} /> {name}
  </button>
)

const CompareView = ({ lang, nav, products, compareA, setCompareA, pair }) => {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  // Initialisation : lien partagé (#/compare/slugA__slugB) ou pré-sélection compareA.
  useEffect(() => {
    if (pair && pair.includes('__')) {
      const [pa, pb] = pair.split('__')
      setA(pa || ''); setB(pb || '')
    } else if (compareA) {
      setA(compareA)
    }
  }, [pair]) // init depuis lien partagé / compareA

  // Récupération de la comparaison + URL partageable.
  useEffect(() => {
    if (a && b && a !== b) {
      fetch(`/api/compare?a=${a}&b=${b}`).then((r) => r.json()).then(setResult).catch(() => setResult(null))
      const hash = `#/compare/${a}__${b}`
      if (typeof window !== 'undefined' && window.location.hash !== hash) window.history.replaceState(null, '', hash)
    } else setResult(null)
  }, [a, b])

  const productA = products.find((p) => p.slug === a)
  // Produit B restreint à la même catégorie que A (comparaison pertinente).
  const optionsB = productA ? products.filter((p) => p.slug !== a && p.category === productA.category) : []

  // Si B devient incompatible après un changement de A, on le réinitialise.
  useEffect(() => {
    if (productA && b) {
      const stillValid = products.some((p) => p.slug === b && p.category === productA.category && p.slug !== a)
      if (!stillValid) setB('')
    }
  }, [a]) // réinitialise B si incompatible après changement de A

  const handleA = (slug) => { setA(slug); setCompareA?.(slug) }
  const swap = () => { const na = b, nb = a; setA(na); setB(nb); setCompareA?.(na) }
  const reset = () => { setA(''); setB(''); setResult(null); if (typeof window !== 'undefined') window.history.replaceState(null, '', '#/compare') }

  const shareUrl = a && b && typeof window !== 'undefined' ? `${window.location.origin}/#/compare/${a}__${b}` : ''
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* clipboard unavailable */ }
  }

  const pa = result && !result.error ? result.a : null
  const pb = result && !result.error ? result.b : null
  const detail = (slug) => result?.ingredient_details?.find((i) => i.slug === slug)
  const ingName = (slug) => detail(slug)?.name || slug
  const avgComedo = (p) => {
    const list = (p?.ingredients || []).map((s) => detail(s)?.comedogenic).filter((n) => typeof n === 'number')
    if (!list.length) return null
    return list.reduce((x, y) => x + y, 0) / list.length
  }

  // Gagnants par critère.
  const bestOf = (av, bv, higher = true) => (av === bv ? null : (higher ? (av > bv ? 'a' : 'b') : (av < bv ? 'a' : 'b')))
  const priceWinner = pa && pb ? bestOf(pa.price_eur, pb.price_eur, false) : null
  const ratingWinner = pa && pb ? bestOf(pa.rating, pb.rating, true) : null
  const comedoA = avgComedo(pa), comedoB = avgComedo(pb)
  const gentleWinner = (comedoA != null && comedoB != null) ? bestOf(comedoA, comedoB, false) : null
  const valueWinner = pa && pb ? bestOf(pa.rating / pa.price_eur, pb.rating / pb.price_eur, true) : null
  const winnerName = (side) => side === 'a'
    ? <Kw lang={lang}>{pa?.name}</Kw>
    : side === 'b'
    ? <Kw lang={lang}>{pb?.name}</Kw>
    : t(lang, 'Égalité', 'Tie')

  const common = result?.common_ingredients || []
  const uniqueA = (pa?.ingredients || []).filter((i) => !common.includes(i))
  const uniqueB = (pb?.ingredients || []).filter((i) => !common.includes(i))

  const openIng = (slug) => nav('ingredient', slug)

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <SectionTitle sub={t(lang, 'Comparez deux produits côte à côte, ingrédient par ingrédient', 'Compare two products side by side, ingredient by ingredient')}>
        {t(lang, 'Comparateur', 'Compare')}
      </SectionTitle>

      {/* Sélecteurs + échanger */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <ProductPicker
          products={products} value={a} onChange={handleA} lang={lang}
          placeholder={ts(lang, 'Choisir le produit A', 'Choose product A')}
          searchPlaceholder={ts(lang, 'Rechercher un produit…', 'Search a product…')}
          emptyText={t(lang, 'Aucun produit', 'No product')}
          testId="compare-select-a"
        />
        <button onClick={swap} disabled={!a || !b} data-testid="compare-swap"
          aria-label={ts(lang, 'Échanger', 'Swap')}
          className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-dz-surface shadow-dz-card transition-colors hover:text-dz-accent disabled:opacity-40">
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <ProductPicker
          products={optionsB} value={b} onChange={setB} disabled={!a} lang={lang}
          disabledHint={t(lang, "Choisissez d'abord le produit A", 'Pick product A first')}
          placeholder={ts(lang, 'Choisir le produit B', 'Choose product B')}
          searchPlaceholder={ts(lang, 'Rechercher un produit…', 'Search a product…')}
          emptyText={t(lang, 'Aucun produit de même catégorie', 'No product in the same category')}
          testId="compare-select-b"
        />
      </div>

      {/* Note catégorie */}
      {productA && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-dz-text-2">
          <Tag className="h-3.5 w-3.5 text-dz-accent" />
          {lang === 'en'
            ? <>Comparison limited to the <b className="text-dz-ink">{label(CATEGORIES, productA.category, lang)}</b> category to stay relevant.</>
            : <>{t(lang, 'Comparaison limitée à la catégorie', 'Comparison limited to the category')} <b className="text-dz-ink">{label(CATEGORIES, productA.category, lang)}</b> {t(lang, 'pour rester pertinente.', 'to stay relevant.')}</>}
        </p>
      )}

      {(!a || !b) && (
        <div className="py-16 text-center text-dz-text-4" data-testid="compare-empty">
          <GitCompare className="mx-auto mb-3 h-8 w-8 opacity-40" />
          {t(lang, 'Sélectionnez deux produits pour lancer la comparaison.', 'Select two products to start comparing.')}
        </div>
      )}

      {result?.error && (
        <p className="py-10 text-center text-dz-text-4">{t(lang, 'Produit introuvable.', 'Product not found.')}</p>
      )}

      {pa && pb && (
        <div className="mt-8 space-y-6" data-testid="compare-result">
          {/* Verdict */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <VerdictTile icon={<Tag className="h-3.5 w-3.5" />} label={t(lang, 'Le moins cher', 'Cheapest')}
              value={winnerName(priceWinner)} sub={priceWinner ? <span className="dz-ltr">{(priceWinner === 'a' ? pa : pb).price_eur?.toFixed(2)} €</span> : null} />
            <VerdictTile icon={<Star className="h-3.5 w-3.5" />} label={t(lang, 'Le mieux noté', 'Top rated')}
              value={winnerName(ratingWinner)} sub={ratingWinner ? <span className="dz-ltr">{toScore((ratingWinner === 'a' ? pa : pb).rating)}/10</span> : null} />
            <VerdictTile icon={<Droplets className="h-3.5 w-3.5" />} label={t(lang, 'Le plus doux', 'Gentlest')}
              value={winnerName(gentleWinner)} sub={t(lang, 'comédogénicité la plus basse', 'lowest comedogenicity')} />
            <VerdictTile icon={<Scale className="h-3.5 w-3.5" />} label={t(lang, 'Meilleur rapport Q/P', 'Best value')}
              value={winnerName(valueWinner)} sub={t(lang, 'note / prix', 'rating / price')} />
          </div>

          {/* Tableau comparatif */}
          <Card className="border-dz-rule overflow-hidden">
            <CardContent className="p-0">
              <div className={`sticky top-[64px] z-10 border-b border-dz-rule bg-white/95 px-4 pb-3 pt-4 backdrop-blur md:top-[72px] ${CMP_GRID}`}>
                <div className="flex items-end">
                  <button onClick={reset} data-testid="compare-reset"
                    className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-dz-text-4 hover:text-dz-accent">
                    <RefreshCw className="h-3 w-3" />{t(lang, 'Reset', 'Reset')}
                  </button>
                </div>
                <CompareProductHeader p={pa} nav={nav} lang={lang} />
                <CompareProductHeader p={pb} nav={nav} lang={lang} />
              </div>

              <div className={`px-4 pb-4 ${CMP_GRID}`}>
                <CompareRow testId="compare-row-price" rowLabel={t(lang, 'Prix', 'Price')}
                  a={<span className="dz-ltr">{pa.price_eur?.toFixed(2)} €</span>} b={<span className="dz-ltr">{pb.price_eur?.toFixed(2)} €</span>} winner={priceWinner} />
                <CompareRow testId="compare-row-rating" rowLabel={t(lang, 'Note', 'Rating')}
                  a={<span className="dz-ltr">{toScore(pa.rating)}/10</span>} b={<span className="dz-ltr">{toScore(pb.rating)}/10</span>} winner={ratingWinner} />
                <CompareRow rowLabel={t(lang, 'Catégorie', 'Category')}
                  a={label(CATEGORIES, pa.category, lang)} b={label(CATEGORIES, pb.category, lang)} winner={null} />
                <CompareRow rowLabel={t(lang, 'Comédogénicité', 'Comedogenicity')}
                  a={comedoA != null ? <span className="dz-ltr">{comedoA.toFixed(1)}/5</span> : '—'} b={comedoB != null ? <span className="dz-ltr">{comedoB.toFixed(1)}/5</span> : '—'} winner={gentleWinner} />
                <CompareRow rowLabel={t(lang, "Nb d'actifs", 'Actives')}
                  a={(pa.ingredients || []).length} b={(pb.ingredients || []).length} winner={null} />
                <CompareRow rowLabel={t(lang, 'Origine', 'Origin')}
                  a={pa.german_made ? '🇩🇪' : '—'} b={pb.german_made ? '🇩🇪' : '—'} winner={null} />

                <div className="flex items-center border-t border-dz-rule-card py-3 pr-2 text-[11px] font-semibold uppercase tracking-wider text-dz-text-4">{t(lang, 'Préoccupations', 'Concerns')}</div>
                {[pa, pb].map((p, idx) => (
                  <div key={idx} className="flex flex-wrap justify-center gap-1 border-t border-dz-rule-card py-3">
                    {(p.concerns || []).map((c) => <Badge key={c} variant="secondary" className="bg-dz-surface-2 text-[10px] text-dz-text">{label(CONCERNS, c, lang)}</Badge>)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analyse des ingrédients */}
          <Card className="border-dz-rule">
            <CardContent className="p-4 md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-xl tracking-[-0.01em] text-dz-ink">{t(lang, 'Analyse des ingrédients', 'Ingredient analysis')}</h3>
                <div className="flex items-center gap-3 text-[11px] text-dz-text-2">
                  <span className="flex items-center gap-1"><SafetyDot safety="green" />{t(lang, 'Sûr', 'Safe')}</span>
                  <span className="flex items-center gap-1"><SafetyDot safety="caution" />{t(lang, 'Prudence', 'Caution')}</span>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-dz-accent-bg/40 p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-dz-accent">
                    <Check className="h-3.5 w-3.5" />{t(lang, 'Communs', 'Shared')} ({common.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5" data-testid="compare-common">
                    {common.length ? common.map((s) => <CompareIngBadge key={s} slug={s} name={ingName(s)} safety={detail(s)?.safety} accent onOpen={openIng} />) : <span className="text-[11px] text-dz-text-4">—</span>}
                  </div>
                </div>
                <div className="rounded-2xl bg-dz-surface-2/60 p-4">
                  <p className="mb-2 truncate text-[11px] font-semibold uppercase tracking-wider text-dz-text-4">{t(lang, 'Propres à', 'Only in')} <Kw lang={lang}>{pa.name}</Kw></p>
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueA.length ? uniqueA.map((s) => <CompareIngBadge key={s} slug={s} name={ingName(s)} safety={detail(s)?.safety} onOpen={openIng} />) : <span className="text-[11px] text-dz-text-4">—</span>}
                  </div>
                </div>
                <div className="rounded-2xl bg-dz-surface-2/60 p-4">
                  <p className="mb-2 truncate text-[11px] font-semibold uppercase tracking-wider text-dz-text-4">{t(lang, 'Propres à', 'Only in')} <Kw lang={lang}>{pb.name}</Kw></p>
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueB.length ? uniqueB.map((s) => <CompareIngBadge key={s} slug={s} name={ingName(s)} safety={detail(s)?.safety} onOpen={openIng} />) : <span className="text-[11px] text-dz-text-4">—</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partage */}
          <div className="rounded-2xl border border-dz-accent-bg bg-dz-accent-bg p-4 md:p-5">
            <p className="flex items-center gap-2 font-semibold text-dz-ink">
              <Share2 className="h-4 w-4 text-dz-accent" /> {t(lang, 'Partager cette comparaison', 'Share this comparison')}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input data-testid="compare-share-url" readOnly value={shareUrl} onFocus={(e) => e.target.select()} className="bg-white text-sm" />
              <Button data-testid="compare-share-copy" variant="outline" className="shrink-0 border-dz-accent text-dz-accent" onClick={copyLink}>
                {copied ? <><Check className="mr-2 h-4 w-4" />{t(lang, 'Copié !', 'Copied!')}</> : <><Copy className="mr-2 h-4 w-4" />{t(lang, 'Copier le lien', 'Copy link')}</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Product Finder ----------
const ROUTINE_HINTS = {
  cleanser: { fr: 'Nettoyez votre visage en douceur', en: 'Gently cleanse your face', ar: 'نظّف وجهك برفق' },
  serum: { fr: 'Appliquez le sérum ciblé', en: 'Apply your targeted serum', ar: 'ضع السيروم المخصّص' },
  moisturizer: { fr: 'Hydratez et renforcez la barrière cutanée', en: 'Moisturize and support the skin barrier', ar: 'رطّب وقوِّ حاجز البشرة' },
  sunscreen: { fr: 'Terminez par la protection solaire', en: 'Finish with sun protection', ar: 'اختم بواقٍ من الشمس' },
  shampoo: { fr: 'Lavez avec le shampoing adapté', en: 'Wash with the suitable shampoo', ar: 'اغسل بالشامبو المناسب' },
  conditioner: { fr: "Appliquez l'après-shampoing sur les longueurs", en: 'Apply conditioner to the lengths', ar: 'ضع البلسم على أطراف الشعر' },
  'hair-treatment': { fr: 'Appliquez le soin / masque capillaire', en: 'Apply the hair treatment / mask', ar: 'ضع علاج أو ماسك الشعر' },
  'scalp-serum': { fr: 'Massez le sérum sur le cuir chevelu', en: 'Massage the serum into the scalp', ar: 'دلّك السيروم على فروة الرأس' },
  supplement: { fr: 'Prenez le complément selon la posologie', en: 'Take the supplement as directed', ar: 'تناول المكمّل حسب الجرعة الموصى بها' },
  tea: { fr: 'Infusez et dégustez', en: 'Steep and enjoy', ar: 'انقع الأعشاب واستمتع' },
  'bath-body': { fr: 'Rituel bain & corps détente', en: 'Relaxing bath & body ritual', ar: 'طقس استحمام وعناية بالجسم للاسترخاء' },
}

// icon + colors per section id
const SECTION_STYLE = {
  morning: { icon: <Sun className="h-5 w-5 text-dz-sand-eyebrow" />, bg: 'bg-dz-surface-2 border-dz-sand' },
  evening: { icon: <Moon className="h-5 w-5 text-indigo-500" />, bg: 'bg-indigo-50 border-indigo-100' },
  routine: { icon: <Sparkles className="h-5 w-5 text-dz-accent" />, bg: 'bg-dz-accent-bg border-dz-accent-bg' },
}

// Normalize routine into a sections[] array (supports legacy {morning, evening, warnings})
const getRoutineSections = (routine) => {
  if (!routine) return []
  if (Array.isArray(routine.sections) && routine.sections.length) return routine.sections
  const legacy = []
  if (routine.morning?.length) legacy.push({ id: 'morning', title: { fr: 'Routine du matin', en: 'Morning routine', ar: 'روتين الصباح' }, steps: routine.morning, warnings: routine.warnings?.morning || [] })
  if (routine.evening?.length) legacy.push({ id: 'evening', title: { fr: 'Routine du soir', en: 'Evening routine', ar: 'روتين المساء' }, steps: routine.evening, warnings: routine.warnings?.evening || [] })
  return legacy
}

const RoutineDisplay = ({ routine, alternatives = [], lang, nav }) => (
  <div>
    {getRoutineSections(routine).map((section) => {
      const style = SECTION_STYLE[section.id] || SECTION_STYLE.routine
      const steps = section.steps || []
      const warnings = section.warnings || []
      return (
      <div key={section.id} data-testid={`routine-${section.id}`} className={`rounded-2xl border ${style.bg} p-4 md:p-5 mb-5`}>
        <p className="font-semibold text-dz-ink flex items-center gap-2 mb-4">
          {style.icon} {pick(section.title, lang)}
        </p>
        <div className="space-y-2.5">
          {steps.map((s) => (
            <div key={`${section.id}-${s.order}`} data-testid={`routine-step-${section.id}-${s.category}`}
              className="flex gap-3 items-center bg-white rounded-xl border border-dz-rule p-3 cursor-pointer hover:shadow-md transition-all"
              onClick={() => nav('product', s.product.slug)}>
              <div className="flex flex-col items-center shrink-0">
                <span className="h-7 w-7 rounded-full bg-dz-ink text-white text-xs font-semibold flex items-center justify-center">{s.order}</span>
              </div>
              <img src={s.product.image} alt={s.product.name} className="h-14 w-14 md:h-16 md:w-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-dz-accent font-semibold">
                  {label(CATEGORIES, s.category, lang)} — {pick(ROUTINE_HINTS[s.category], lang)}
                </p>
                <p className="font-semibold text-dz-ink text-sm leading-snug truncate"><Kw lang={lang}>{s.product.name}</Kw></p>
                <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                  <span className="text-[11px] text-dz-text-4 uppercase tracking-wide"><Kw lang={lang}>{s.product.brand_name}</Kw></span>
                  <span className="dz-ltr text-xs font-semibold text-dz-ink">{s.product.price_eur?.toFixed(2)} €</span>
                  {s.product.match_percent != null && <span className="dz-ltr text-[11px] font-semibold text-dz-accent">{s.product.match_percent}% match</span>}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-dz-chip shrink-0" />
            </div>
          ))}
        </div>
        {warnings.map((w, wi) => (
          <div key={wi} data-testid={`routine-warning-${section.id}-${wi}`}
            className={`mt-3 rounded-xl border p-3 flex gap-2.5 ${w.severity === 'high' ? 'bg-red-50 border-red-200' : w.severity === 'medium' ? 'bg-dz-surface-2 border-dz-sand' : 'bg-dz-bg border-dz-rule'}`}>
            <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${w.severity === 'high' ? 'text-red-600' : w.severity === 'medium' ? 'text-dz-sand-eyebrow' : 'text-dz-text-2'}`} />
            <div>
              <p className={`text-xs font-semibold ${w.severity === 'high' ? 'text-red-800' : w.severity === 'medium' ? 'text-dz-sand-eyebrow' : 'text-dz-nav'}`}>
                {pick(w.title, lang)}
                <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide font-semibold ${w.severity === 'high' ? 'bg-red-200 text-red-800' : w.severity === 'medium' ? 'bg-dz-sand text-dz-sand-eyebrow' : 'bg-dz-rule text-dz-text'}`}>
                  {w.severity === 'high' ? (t(lang, 'Risque élevé', 'High risk')) : w.severity === 'medium' ? (t(lang, 'Attention', 'Caution')) : 'Info'}
                </span>
              </p>
              <p className="text-xs mt-1 text-dz-text leading-relaxed">{pick(w.message, lang)}</p>
              <p className="text-[11px] text-dz-text-4 mt-1">{(w.products || []).join(' + ')}</p>
            </div>
          </div>
        ))}
        {warnings.length === 0 && (
          <p data-testid={`routine-noconflict-${section.id}`} className="mt-3 text-xs text-dz-accent flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> {t(lang, "Aucun conflit d'actifs détecté dans cette routine", 'No active-ingredient conflicts detected in this routine')}
          </p>
        )}
        <p className="text-xs text-dz-text-2 mt-3 text-right">
          {t(lang, 'Total', 'Total')} : <span className="font-semibold text-dz-ink">
            {steps.reduce((sum, s) => sum + (s.product.price_eur || 0), 0).toFixed(2)} €
          </span>
        </p>
      </div>
    )})}

    {alternatives.length > 0 && (
      <div className="mt-7">
        <p className="font-semibold text-dz-ink mb-3">{t(lang, 'Autres produits qui correspondent à votre profil', 'Other products matching your profile')}</p>
        <div className="grid gap-2.5">
          {alternatives.map((p) => (
            <Card key={p.slug} data-testid={`finder-alt-${p.slug}`} className="border-dz-rule hover:shadow-md transition-all cursor-pointer" onClick={() => nav('product', p.slug)}>
              <CardContent className="p-3 flex gap-3 items-center">
                <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-dz-text-4"><Kw lang={lang}>{p.brand_name}</Kw></p>
                  <p className="font-semibold text-dz-ink text-sm truncate"><Kw lang={lang}>{p.name}</Kw></p>
                </div>
                <div className="text-right shrink-0">
                  <p className="dz-ltr text-sm font-semibold">{p.price_eur?.toFixed(2)} €</p>
                  {p.match_percent != null && <p className="dz-ltr text-[11px] font-semibold text-dz-accent">{p.match_percent}%</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )}
  </div>
)

// Share button + generated link for a finder routine
const ShareRoutine = ({ routine, alternatives, profile, lang }) => {
  const [state, setState] = useState('idle') // idle | loading | ready | error
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const createLink = async () => {
    setState('loading')
    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routine, alternatives, profile }),
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      const shareUrl = `${window.location.origin}/#/routine/${data.id}`
      setUrl(shareUrl)
      setState('ready')
      try {
        if (navigator.share) {
          await navigator.share({
            title: ts(lang, 'Ma routine skincare', 'My skincare routine'),
            text: ts(lang, 'Voici la routine que j’ai trouvée sur Dermalyze :', 'Here is the routine I found on Dermalyze:'),
            url: shareUrl,
          })
        }
      } catch { /* user cancelled native share */ }
    } catch {
      setState('error')
    }
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* clipboard unavailable */ }
  }

  return (
    <div data-testid="share-routine" className="mt-6 rounded-2xl border border-dz-accent-bg bg-dz-accent-bg p-4 md:p-5">
      <p className="font-semibold text-dz-ink flex items-center gap-2">
        <Share2 className="h-4 w-4 text-dz-accent" /> {t(lang, 'Partager ma routine', 'Share my routine')}
      </p>
      <p className="text-sm text-dz-text mt-1">
        {t(lang, 'Générez un lien unique et envoyez votre routine à vos amis.', 'Generate a unique link and send your routine to your friends.')}
      </p>
      {state !== 'ready' ? (
        <Button data-testid="share-routine-btn" className="bg-dz-accent hover:bg-dz-ink text-white mt-3" disabled={state === 'loading'} onClick={createLink}>
          <Share2 className="h-4 w-4 mr-2" />
          {state === 'loading' ? (t(lang, 'Création du lien...', 'Creating link...')) : (t(lang, 'Créer un lien de partage', 'Create a share link'))}
        </Button>
      ) : (
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <Input data-testid="share-routine-url" readOnly value={url} onFocus={(e) => e.target.select()} className="bg-white text-sm" />
          <Button data-testid="share-routine-copy" variant="outline" className="border-dz-accent text-dz-accent shrink-0" onClick={copy}>
            {copied ? <><Check className="h-4 w-4 mr-2" />{t(lang, 'Copié !', 'Copied!')}</> : <><Copy className="h-4 w-4 mr-2" />{t(lang, 'Copier', 'Copy')}</>}
          </Button>
        </div>
      )}
      {state === 'error' && (
        <p className="text-xs text-red-600 mt-2">{t(lang, "Impossible de créer le lien. Réessayez.", 'Could not create the link. Please try again.')}</p>
      )}
    </div>
  )
}

// Read-only view of a shared routine (accessed via unique link)
const SharedRoutineView = ({ id, lang, nav }) => {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ok | notfound
  useEffect(() => {
    setStatus('loading')
    fetch(`/api/routines/${id}`).then((r) => {
      if (!r.ok) throw new Error('nf')
      return r.json()
    }).then((d) => { setData(d); setStatus('ok') }).catch(() => setStatus('notfound'))
  }, [id])

  if (status === 'loading') {
    return <div className="container mx-auto px-4 py-16 max-w-2xl text-center text-dz-text-4">{t(lang, 'Chargement de la routine...', 'Loading routine...')}</div>
  }
  if (status === 'notfound') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <p className="text-dz-ink font-semibold text-lg">{t(lang, 'Routine introuvable', 'Routine not found')}</p>
        <p className="text-dz-text-2 mt-2 text-sm">{t(lang, "Ce lien n'est plus valide ou a expiré.", 'This link is no longer valid or has expired.')}</p>
        <Button data-testid="shared-create-own" className="bg-dz-accent hover:bg-dz-ink text-white mt-5" onClick={() => nav('finder')}>
          <Sparkles className="h-4 w-4 mr-2" /> {t(lang, 'Créer ma propre routine', 'Create my own routine')}
        </Button>
      </div>
    )
  }

  const profile = data.profile || {}
  const concernLabels = (profile.concerns || []).map((c) => label(CONCERNS, c, lang)).filter(Boolean)
  const skinLabel = profile.skin_type ? label(SKIN_TYPES, profile.skin_type, lang) : null
  const budgetLabel = { low: t(lang, 'Économique', 'Budget'), mid: t(lang, 'Modéré', 'Moderate'), high: 'Premium' }[profile.budget]

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-6">
        <Badge className="bg-dz-accent-bg text-dz-accent hover:bg-dz-accent-bg mb-3"><Share2 className="h-3 w-3 mr-1" /> {t(lang, 'Routine partagée', 'Shared routine')}</Badge>
        <h1 className="text-2xl md:text-4xl font-display font-normal tracking-[-0.02em] text-dz-ink">
          {t(lang, 'Une routine personnalisée a été partagée avec vous', 'A personalized routine has been shared with you')}
        </h1>
        {(skinLabel || concernLabels.length > 0 || budgetLabel) && (
          <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
            {skinLabel && <Badge variant="secondary" className="bg-dz-surface-2 text-dz-text">{t(lang, 'Peau', 'Skin')} : {skinLabel}</Badge>}
            {concernLabels.map((c, i) => <Badge key={i} variant="secondary" className="bg-dz-surface-2 text-dz-text">{c}</Badge>)}
            {budgetLabel && <Badge variant="secondary" className="bg-dz-surface-2 text-dz-text">{t(lang, 'Budget', 'Budget')} : {budgetLabel}</Badge>}
          </div>
        )}
      </div>

      <RoutineDisplay routine={data.routine} alternatives={data.alternatives || []} lang={lang} nav={nav} />

      <div className="mt-8 rounded-2xl border border-dz-accent-bg bg-dz-accent-bg p-5 text-center">
        <p className="font-semibold text-dz-ink">{t(lang, 'Envie de votre propre routine ?', 'Want your own routine?')}</p>
        <p className="text-sm text-dz-text mt-1">{t(lang, 'Répondez à 3 questions et obtenez des recommandations personnalisées.', 'Answer 3 questions and get personalized recommendations.')}</p>
        <Button data-testid="shared-create-own" className="bg-dz-accent hover:bg-dz-ink text-white mt-3" onClick={() => nav('finder')}>
          <Sparkles className="h-4 w-4 mr-2" /> {t(lang, 'Lancer le Product Finder', 'Start the Product Finder')}
        </Button>
      </div>
    </div>
  )
}

// Reusable newsletter signup
const NewsletterSignup = ({ lang, source = 'site', variant = 'card' }) => {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | loading | done | error
  const submit = async (e) => {
    e?.preventDefault?.()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('error'); return }
    setState('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang, source }),
      })
      if (!res.ok) throw new Error('failed')
      setState('done')
    } catch { setState('error') }
  }
  return (
    <div data-testid="newsletter-signup"
      className={variant === 'card' ? 'mt-6 rounded-dz-card bg-dz-surface p-7 shadow-dz-card' : ''}>
      <Mono className="mb-3 block text-[10.5px] tracking-[0.16em] text-dz-text-4">
        {t(lang, 'Newsletter', 'Newsletter')}
      </Mono>
      <p className="m-0 font-display text-[26px] leading-[1.15] tracking-[-0.015em] text-dz-ink">
        {t(lang, 'Beauté & science, une fois par mois', 'Beauty & science, once a month')}
      </p>
      <p className="mt-2 max-w-[420px] text-[14px] font-light leading-[1.6] text-dz-text-2">
        {t(lang, 'Conseils fondés sur la science et nouvelles marques allemandes.', 'Science-based advice and new German brands.')}
      </p>
      {state === 'done' ? (
        <p data-testid="newsletter-success" className="mt-4 flex items-center gap-1.5 text-[14px] font-medium text-dz-accent">
          <Check className="h-4 w-4" /> {t(lang, 'Merci ! Vous êtes inscrit(e).', "Thanks! You're subscribed.")}
        </p>
      ) : (
        <form onSubmit={submit}
          className="mt-5 flex max-w-[460px] items-center gap-3 rounded-dz-pill bg-dz-surface p-2 pl-6 shadow-dz-search focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-dz-accent">
          <input data-testid="newsletter-email" type="email" value={email}
            onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
            aria-label={ts(lang, 'Votre email', 'Your email')}
            placeholder={ts(lang, 'Votre email', 'Your email')}
            className="min-w-0 flex-1 border-none bg-transparent py-2.5 text-[15px] font-light text-dz-ink outline-none placeholder:text-dz-text-4" />
          <button data-testid="newsletter-submit" type="submit" disabled={state === 'loading'}
            className="whitespace-nowrap rounded-dz-pill bg-dz-accent px-6 py-3 text-[14px] font-medium text-white transition-colors duration-250 hover:bg-dz-accent-hover disabled:opacity-60">
            {state === 'loading' ? (t(lang, 'Envoi...', 'Sending...')) : (t(lang, "S'inscrire", 'Subscribe'))}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p className="mt-2 text-[12.5px] text-dz-sand-eyebrow">{t(lang, 'Email invalide, réessayez.', 'Invalid email, try again.')}</p>
      )}
    </div>
  )
}

const BuyButton = ({ product, lang, className = '' }) => {
  if (!product?.affiliate_url) return null
  const onClick = () => {
    try {
      fetch('/api/track', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'affiliate_click', product_slug: product.slug, vertical: product.vertical }),
      })
    } catch { /* non-blocking */ }
    window.open(product.affiliate_url, '_blank', 'noopener,noreferrer')
  }
  return (
    <Button data-testid={`buy-btn-${product.slug}`} onClick={onClick} className={`bg-dz-accent hover:bg-dz-ink text-white ${className}`}>
      <ShoppingBag className="h-4 w-4 mr-2" /> {t(lang, 'Où acheter', 'Where to buy')}
    </Button>
  )
}


const FinderView = ({ lang, nav }) => {
  const [phase, setPhase] = useState('vertical')
  const [vertical, setVertical] = useState('skincare')
  const [skinType, setSkinType] = useState(null)
  const [concerns, setConcerns] = useState([])
  const [budget, setBudget] = useState(null)
  const [avoidIngredients, setAvoidIngredients] = useState([])
  const [results, setResults] = useState(null)
  const [routine, setRoutine] = useState(null)
  const [alternatives, setAlternatives] = useState([])
  const [loading, setLoading] = useState(false)

  const AVOID_OPTIONS = [
    { id: 'retinol', fr: 'Rétinol', en: 'Retinol', ar: 'ريتينول' },
    { id: 'acide-salicylique', fr: 'Acide salicylique', en: 'Salicylic acid', ar: 'حمض الساليسيليك' },
    { id: 'vitamine-c', fr: 'Vitamine C', en: 'Vitamin C', ar: 'فيتامين C' },
    { id: 'niacinamide', fr: 'Niacinamide', en: 'Niacinamide', ar: 'نياسيناميد' },
    { id: 'cafeine', fr: 'Caféine', en: 'Caffeine', ar: 'كافيين' },
    { id: 'melatonine', fr: 'Mélatonine', en: 'Melatonin', ar: 'ميلاتونين' },
  ]

  const toggleConcern = (id) => setConcerns((cur) => cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id])
  const toggleAvoid = (id) => setAvoidIngredients((cur) => cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id])

  const chooseVertical = (v) => { setVertical(v); setSkinType(null); setConcerns([]); setTimeout(() => setPhase(v === 'skincare' ? 'skin' : 'concerns'), 200) }

  const submit = async (avoid = avoidIngredients) => {
    setLoading(true)
    setPhase('results')
    const res = await fetch('/api/finder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skin_type: skinType, concerns, budget, vertical, avoid_ingredients: avoid }),
    })
    const data = await res.json()
    setResults(data.results || [])
    setRoutine(data.routine || null)
    setAlternatives(data.alternatives || [])
    setLoading(false)
  }

  const reset = () => { setPhase('vertical'); setVertical('skincare'); setSkinType(null); setConcerns([]); setBudget(null); setAvoidIngredients([]); setResults(null); setRoutine(null); setAlternatives([]) }

  const order = vertical === 'skincare' ? ['vertical', 'skin', 'concerns', 'budget', 'avoid', 'results'] : ['vertical', 'concerns', 'budget', 'avoid', 'results']
  const progress = ((order.indexOf(phase) + 1) / order.length) * 100
  const goBack = () => { const i = order.indexOf(phase); if (i > 0) setPhase(order[i - 1]) }

  const VERTICAL_ICONS = {
    skincare: <Droplets className="h-5 w-5 text-dz-accent" />,
    hair: <Scissors className="h-5 w-5 text-dz-accent" />,
    wellness: <HeartPulse className="h-5 w-5 text-dz-accent" />,
  }

  const OptionBtn = ({ active, onClick, children, testid }) => (
    <button data-testid={testid} onClick={onClick}
      className={`w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all font-medium text-sm md:text-base flex items-center justify-between ${active ? 'border-dz-accent bg-dz-accent-bg text-dz-accent' : 'border-dz-rule bg-white text-dz-nav hover:border-dz-text-4'}`}>
      {children}
      {active && <Check className="h-5 w-5 text-dz-accent" />}
    </button>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-6">
        <Badge className="bg-dz-accent-bg text-dz-accent hover:bg-dz-accent-bg mb-3"><Sparkles className="h-3 w-3 mr-1" /> {t(lang, 'Product Finder', 'Product Finder')}</Badge>
        <h1 className="text-2xl md:text-4xl font-display font-normal tracking-[-0.02em] text-dz-ink">
          {t(lang, 'Trouvez vos produits idéaux', 'Find your ideal products')}
        </h1>
        <p className="text-dz-text-2 mt-2 text-sm md:text-base">{t(lang, 'Quelques questions, une routine personnalisée pour votre univers.', 'A few questions, a personalized routine for your universe.')}</p>
      </div>
      <div className="h-1.5 bg-dz-surface-2 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-dz-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      {phase === 'vertical' && (
        <div>
          <p className="font-semibold text-dz-ink mb-4 text-lg">{t(lang, 'Quel univers vous intéresse ?', 'Which universe are you interested in?')}</p>
          <div className="grid gap-2.5">
            {VERTICALS.map((v) => (
              <OptionBtn key={v.id} testid={`finder-vertical-${v.id}`} active={vertical === v.id} onClick={() => chooseVertical(v.id)}>
                <span className="flex items-center gap-2.5">{VERTICAL_ICONS[v.id]} {pick(v, lang)}</span>
              </OptionBtn>
            ))}
          </div>
        </div>
      )}

      {phase === 'skin' && (
        <div>
          <p className="font-semibold text-dz-ink mb-4 text-lg">{t(lang, 'Quel est votre type de peau ?', 'What is your skin type?')}</p>
          <div className="grid gap-2.5">
            {SKIN_TYPES.map((s) => (
              <OptionBtn key={s.id} testid={`finder-skin-${s.id}`} active={skinType === s.id} onClick={() => { setSkinType(s.id); setTimeout(() => setPhase('concerns'), 250) }}>
                {pick(s, lang)}
              </OptionBtn>
            ))}
          </div>
          <Button variant="outline" className="border-dz-chip mt-6" onClick={goBack}><ArrowLeft className="h-4 w-4 mr-1" />{t(lang, 'Retour', 'Back')}</Button>
        </div>
      )}

      {phase === 'concerns' && (
        <div>
          <p className="font-semibold text-dz-ink mb-1 text-lg">{t(lang, 'Quelles sont vos préoccupations ?', 'What are your concerns?')}</p>
          <p className="text-sm text-dz-text-4 mb-4">{t(lang, 'Plusieurs choix possibles', 'Multiple choices allowed')}</p>
          <div className="grid gap-2.5">
            {CONCERNS.filter((c) => c.vertical === vertical).map((c) => (
              <OptionBtn key={c.id} testid={`finder-concern-${c.id}`} active={concerns.includes(c.id)} onClick={() => toggleConcern(c.id)}>
                {pick(c, lang)}
              </OptionBtn>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="border-dz-chip" onClick={goBack}><ArrowLeft className="h-4 w-4 mr-1" />{t(lang, 'Retour', 'Back')}</Button>
            <Button data-testid="finder-next-btn" className="bg-dz-accent hover:bg-dz-ink text-white flex-1" disabled={concerns.length === 0} onClick={() => setPhase('budget')}>
              {t(lang, 'Continuer', 'Continue')} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {phase === 'budget' && (
        <div>
          <p className="font-semibold text-dz-ink mb-4 text-lg">{t(lang, 'Quel est votre budget par produit ?', 'What is your budget per product?')}</p>
          <div className="grid gap-2.5">
            {[
              { id: 'low', fr: 'Économique — moins de 15 €', en: 'Budget — under €15', ar: 'اقتصادي — أقلّ من 15 €' },
              { id: 'mid', fr: 'Modéré — jusqu’à 25 €', en: 'Moderate — up to €25', ar: 'متوسّط — حتى 25 €' },
              { id: 'high', fr: 'Premium — peu importe le prix', en: 'Premium — price no object', ar: 'فاخر — السعر ليس عائقًا' },
            ].map((b) => (
              <OptionBtn key={b.id} testid={`finder-budget-${b.id}`} active={budget === b.id} onClick={() => { setBudget(b.id); setPhase('avoid') }}>
                {pick(b, lang)}
              </OptionBtn>
            ))}
          </div>
          <Button variant="outline" className="border-dz-chip mt-6" onClick={goBack}><ArrowLeft className="h-4 w-4 mr-1" />{t(lang, 'Retour', 'Back')}</Button>
        </div>
      )}

      {phase === 'avoid' && (
        <div>
          <p className="font-semibold text-dz-ink mb-1 text-lg">{t(lang, 'Des ingrédients à éviter ?', 'Any ingredients to avoid?')}</p>
          <p className="text-sm text-dz-text-4 mb-4">{t(lang, "Optionnel — nous exclurons les produits qui en contiennent", 'Optional — we will exclude products containing them')}</p>
          <div className="grid gap-2.5">
            {AVOID_OPTIONS.map((a) => (
              <OptionBtn key={a.id} testid={`finder-avoid-${a.id}`} active={avoidIngredients.includes(a.id)} onClick={() => toggleAvoid(a.id)}>
                {pick(a, lang)}
              </OptionBtn>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="border-dz-chip" onClick={goBack}><ArrowLeft className="h-4 w-4 mr-1" />{t(lang, 'Retour', 'Back')}</Button>
            <Button data-testid="finder-submit-btn" className="bg-dz-accent hover:bg-dz-ink text-white flex-1" onClick={() => submit()}>
              {avoidIngredients.length > 0 ? (t(lang, 'Voir ma routine', 'See my routine')) : (t(lang, 'Passer — voir ma routine', 'Skip — see my routine'))} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {phase === 'results' && (
        <div>
          {loading ? (
            <p className="text-center text-dz-text-4 py-14">{t(lang, 'Construction de votre routine...', 'Building your routine...')}</p>
          ) : (
            <div>
              <p className="font-semibold text-dz-ink mb-1 text-lg text-center" data-testid="finder-results-title">
                {t(lang, 'Votre routine personnalisée', 'Your personalized routine')}
              </p>
              <p className="text-sm text-dz-text-4 text-center mb-6">
                {t(lang, 'Étape par étape, adaptée à votre profil.', 'Step by step, tailored to your profile.')}
              </p>

              <RoutineDisplay routine={routine} alternatives={alternatives} lang={lang} nav={nav} />

              <ShareRoutine routine={routine} alternatives={alternatives} profile={{ vertical, skin_type: skinType, concerns, budget, avoid_ingredients: avoidIngredients }} lang={lang} />

              <NewsletterSignup lang={lang} source="finder" />

              <Button data-testid="finder-restart" variant="outline" className="border-dz-chip mt-6 w-full" onClick={reset}>
                {t(lang, 'Recommencer le quiz', 'Restart the quiz')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------- Content Hubs ----------
const HubsView = ({ lang, nav }) => {
  const [hubs, setHubs] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/hubs').then((r) => r.json()).then((d) => { setHubs(d.hubs || []); setLoading(false) })
  }, [])
  const vIcons = {
    skincare: <Droplets className="h-4 w-4 text-dz-accent" />,
    hair: <Scissors className="h-4 w-4 text-dz-accent" />,
    wellness: <HeartPulse className="h-4 w-4 text-dz-accent" />,
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle sub={t(lang, 'Comprendre votre problématique avant de choisir un produit', 'Understand your concern before choosing a product')}>
        {t(lang, 'Conseils par préoccupation', 'Advice by concern')}
      </SectionTitle>
      {loading ? (
        <p className="text-dz-text-4 py-12 text-center">{t(lang, 'Chargement...', 'Loading...')}</p>
      ) : (
        VERTICALS.map((v) => {
          const list = hubs.filter((h) => h.vertical === v.id)
          if (list.length === 0) return null
          return (
            <div key={v.id} className="mb-9">
              <p className="font-display font-normal tracking-[-0.02em] text-dz-ink text-lg mb-3 flex items-center gap-2">
                {vIcons[v.id]} {pick(v, lang)}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((h) => (
                  <Card key={h.slug} data-testid={`hub-card-${h.slug}`} onClick={() => nav('hub', h.slug)} className="cursor-pointer border-dz-rule hover:shadow-lg hover:border-dz-accent/40 transition-all">
                    <CardContent className="p-4 md:p-5">
                      <p className="font-semibold text-dz-ink">{pick(h.title, lang)}</p>
                      <p className="text-sm text-dz-text-2 mt-1.5 line-clamp-3">{pick(h.definition, lang)}</p>
                      <p className="text-xs text-dz-accent font-semibold mt-3 flex items-center gap-1">
                        {t(lang, 'Lire le guide complet', 'Read the full guide')} <ArrowRight className="h-3 w-3" />
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

const HubDetailView = ({ slug, lang, nav }) => {
  const [h, setH] = useState(null)
  useEffect(() => { setH(null); fetch(`/api/hubs/${slug}`).then((r) => r.json()).then(setH) }, [slug])
  if (!h) return <p className="text-center py-20 text-dz-text-4">...</p>
  if (h.error) return <p className="text-center py-20 text-dz-text-4">{h.error}</p>
  const vLabel = VERTICALS.find((v) => v.id === h.vertical)
  return (
    <div>
      <div className="bg-dz-bg">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          <button onClick={() => nav('hubs')} className="flex items-center gap-1 text-sm text-dz-text-2 hover:text-dz-ink mb-5">
            <ArrowLeft className="h-4 w-4" /> {t(lang, 'Tous les conseils', 'All advice')}
          </button>
          <Badge className="bg-dz-accent-bg text-dz-accent hover:bg-dz-accent-bg mb-3">{pick(vLabel, lang)}</Badge>
          <h1 data-testid="hub-title" className="text-3xl md:text-5xl font-display font-normal tracking-[-0.02em] text-dz-ink">{pick(h.title, lang)}</h1>
          <p className="text-dz-text mt-4 leading-relaxed text-base md:text-lg">{pick(h.definition, lang)}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl pb-10">
        {/* Causes & mistakes */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card className="border-dz-rule">
            <CardContent className="p-5">
              <p className="font-semibold text-dz-ink mb-3 flex items-center gap-2"><ListChecks className="h-4 w-4 text-dz-accent" />{t(lang, 'Causes fréquentes', 'Common causes')}</p>
              <ul className="space-y-2" data-testid="hub-causes">
                {(pick(h.causes, lang) || []).map((c, idx) => (
                  <li key={idx} className="text-sm text-dz-text flex items-start gap-2"><span className="text-dz-accent mt-0.5">•</span>{c}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-dz-sand bg-dz-surface-2/40">
            <CardContent className="p-5">
              <p className="font-semibold text-dz-ink mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-dz-sand-eyebrow" />{t(lang, 'Erreurs à éviter', 'Mistakes to avoid')}</p>
              <ul className="space-y-2" data-testid="hub-mistakes">
                {(pick(h.mistakes, lang) || []).map((m, idx) => (
                  <li key={idx} className="text-sm text-dz-text flex items-start gap-2"><X className="h-3.5 w-3.5 text-dz-sand-eyebrow mt-0.5 shrink-0" />{m}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Key ingredients */}
        {(h.ingredient_details || []).length > 0 && (
          <div className="mt-8">
            <p className="font-display font-normal tracking-[-0.02em] text-dz-ink text-lg mb-3 flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-dz-accent" /> {t(lang, 'Les actifs qui ont fait leurs preuves', 'The actives that proved themselves')}
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5" data-testid="hub-ingredients">
              {h.ingredient_details.map((i) => (
                <button key={i.slug} data-testid={`hub-ingredient-${i.slug}`} onClick={() => nav('ingredient', i.slug)}
                  className="flex items-center justify-between p-3 rounded-lg border border-dz-rule hover:border-dz-accent hover:shadow-sm transition-all text-left bg-white">
                  <div>
                    <p className="text-sm font-semibold text-dz-ink"><Kw lang={lang}>{i.name}</Kw></p>
                    <p className="text-[11px] text-dz-text-4 font-mono"><Kw lang={lang}>{i.inci}</Kw></p>
                  </div>
                  <div className="flex gap-1.5"><SafetyBadge safety={i.safety} lang={lang} /><EvidenceBadge evidence={i.evidence} lang={lang} /></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buying guide */}
        <div className="mt-8 rounded-2xl bg-dz-ink text-white p-6 md:p-8">
          <p className="font-display font-normal tracking-[-0.02em] text-lg mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-dz-on-dark" /> {t(lang, "Guide d'achat", 'Buying guide')}
          </p>
          <ol className="space-y-3" data-testid="hub-buying-guide">
            {(pick(h.buying_guide, lang) || []).map((g, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-dz-accent-bg">
                <span className="h-6 w-6 rounded-full bg-dz-accent text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                {g}
              </li>
            ))}
          </ol>
        </div>

        {/* Recommended products */}
        {(h.products || []).length > 0 && (
          <div className="mt-9">
            <SectionTitle sub={t(lang, 'Sélection triée par note de la communauté', 'Selection sorted by community rating')}>
              {t(lang, 'Produits recommandés', 'Recommended products')}
            </SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5" data-testid="hub-products">
              {h.products.slice(0, 8).map((p) => <ProductCard key={p.slug} p={p} lang={lang} onOpen={(s) => nav('product', s)} />)}
            </div>
          </div>
        )}

        {/* FAQ */}
        {(h.faqs || []).length > 0 && (
          <div className="mt-9">
            <p className="font-display font-normal tracking-[-0.02em] text-dz-ink text-lg mb-3 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-dz-accent" /> {t(lang, 'Questions fréquentes', 'Frequently asked questions')}
            </p>
            <Accordion type="single" collapsible className="border border-dz-rule rounded-xl px-4 bg-white" data-testid="hub-faqs">
              {h.faqs.map((f, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className={idx === h.faqs.length - 1 ? 'border-b-0' : ''}>
                  <AccordionTrigger className="text-left text-sm font-semibold text-dz-ink hover:no-underline">{pick(f.q, lang)}</AccordionTrigger>
                  <AccordionContent className="text-sm text-dz-text leading-relaxed">{pick(f.a, lang)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        <p className="text-[11px] text-dz-text-4 mt-8">
          {t(lang, 'Ces informations sont éducatives et ne remplacent pas un avis médical. Consultez un professionnel de santé en cas de symptômes persistants.', 'This information is educational and does not replace medical advice. Consult a healthcare professional if symptoms persist.')}
        </p>
      </div>
    </div>
  )
}

// ---------- Learn / Articles ----------
const LearnView = ({ lang, nav, articles }) => {
  const [cat, setCat] = useState('all')
  const filtered = cat === 'all' ? articles : articles.filter((a) => a.category === cat)
  const cats = [{ id: 'all', fr: 'Tous', en: 'All', ar: 'الكل' }, ...ARTICLE_CATEGORIES]
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle sub={t(lang, 'Guides, décryptages et synthèses scientifiques', 'Guides, deep-dives and scientific reviews')}>
        {t(lang, 'Learn & Guides', 'Learn & Guides')}
      </SectionTitle>
      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map((c) => (
          <button key={c.id} data-testid={`learn-filter-${c.id}`} onClick={() => setCat(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${cat === c.id ? 'bg-dz-ink text-dz-on-dark border-dz-ink' : 'border-dz-rule text-dz-text hover:border-dz-text-4'}`}>
            {pick(c, lang)}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <Card key={a.slug} data-testid={`article-card-${a.slug}`} onClick={() => nav('article', a.slug)} className="cursor-pointer overflow-hidden border-dz-rule hover:shadow-lg transition-all group">
            <div className="aspect-[16/9] overflow-hidden bg-dz-surface-2">
              <img src={a.image} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-dz-surface-2 text-dz-text text-[10px] uppercase">{label(ARTICLE_CATEGORIES, a.category, lang)}</Badge>
                <span className="text-[11px] text-dz-text-4">{a.published_at}</span>
              </div>
              <h3 className="font-semibold text-dz-ink leading-snug">{pick(a.title, lang)}</h3>
              <p className="text-sm text-dz-text-2 mt-1.5 line-clamp-2">{pick(a.excerpt, lang)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const ArticleDetailView = ({ slug, lang, nav }) => {
  const [a, setA] = useState(null)
  useEffect(() => { fetch(`/api/articles/${slug}`).then((r) => r.json()).then(setA) }, [slug])
  if (!a) return <p className="text-center py-20 text-dz-text-4">...</p>
  if (a.error) return <p className="text-center py-20 text-dz-text-4">{a.error}</p>
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button onClick={() => nav('learn')} className="flex items-center gap-1 text-sm text-dz-text-2 hover:text-dz-ink mb-5">
        <ArrowLeft className="h-4 w-4" /> {t(lang, 'Retour aux guides', 'Back to guides')}
      </button>
      <Badge variant="secondary" className="bg-dz-surface-2 text-dz-text text-[10px] uppercase mb-3">{label(ARTICLE_CATEGORIES, a.category, lang)}</Badge>
      <h1 data-testid="article-title" className="text-3xl md:text-4xl font-display font-normal tracking-[-0.02em] text-dz-ink leading-tight">{pick(a.title, lang)}</h1>
      <p className="text-dz-text-4 text-sm mt-2">{a.published_at}</p>
      <img src={a.image} alt="" className="rounded-2xl w-full aspect-[16/8] object-cover mt-6" />
      <div className="mt-7 space-y-5">
        {(pickText(a.content, lang) || '').split('\n\n').map((para, idx) => (
          <p key={idx} className="text-dz-nav leading-relaxed text-base md:text-lg">{para}</p>
        ))}
      </div>
    </div>
  )
}

// ---------- For Brands ----------
const ForBrandsView = ({ lang }) => {
  const [form, setForm] = useState({ brand_name: '', contact_name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) setSent(true)
    else setError(ts(lang, 'Veuillez remplir les champs requis.', 'Please fill in the required fields.'))
  }
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <Badge className="bg-dz-accent-bg text-dz-accent hover:bg-dz-accent-bg mb-3"><Building2 className="h-3 w-3 mr-1" />{t(lang, 'Espace marques', 'Brand space')}</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-normal tracking-[-0.02em] text-dz-ink">
            {t(lang, 'Référencez vos produits sur Dermalyze', 'List your products on Dermalyze')}
          </h1>
          <p className="text-dz-text mt-4 leading-relaxed">
            {t(lang, 'Rejoignez la plateforme de référence de la skincare transparente. Nos analyses indépendantes mettent en valeur les formules honnêtes et efficaces.', 'Join the reference platform for transparent skincare. Our independent analyses highlight honest and effective formulas.')}
          </p>
          <ul className="mt-5 space-y-3">
            {[
              ['Visibilité auprès d’une audience qualifiée', 'Visibility with a qualified audience'],
              ['Analyses ingrédients basées sur la science', 'Science-based ingredient analyses'],
              ['Liens d’achat et suivi des performances', 'Purchase links and performance tracking'],
              ['Présence bilingue FR / EN', 'Bilingual FR / EN presence'],
            ].map(([fr, en]) => t(lang, fr, en)).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-dz-nav"><Check className="h-4 w-4 text-dz-accent mt-0.5" />{benefit}</li>
            ))}
          </ul>
        </div>
        <Card className="border-dz-rule">
          <CardContent className="p-6">
            {sent ? (
              <div className="text-center py-10" data-testid="lead-success">
                <div className="h-12 w-12 rounded-full bg-dz-accent-bg flex items-center justify-center mx-auto mb-4"><Check className="h-6 w-6 text-dz-accent" /></div>
                <p className="font-semibold text-dz-ink">{t(lang, 'Message envoyé !', 'Message sent!')}</p>
                <p className="text-sm text-dz-text-2 mt-1">{t(lang, 'Notre équipe vous recontactera sous 48h.', 'Our team will get back to you within 48h.')}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label className="text-dz-nav">{t(lang, 'Nom de la marque *', 'Brand name *')}</Label>
                  <Input data-testid="lead-brand-name" required value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label className="text-dz-nav">{t(lang, 'Votre nom', 'Your name')}</Label>
                  <Input data-testid="lead-contact-name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label className="text-dz-nav">{t(lang, 'Email *', 'Email *')}</Label>
                  <Input data-testid="lead-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label className="text-dz-nav">{t(lang, 'Message', 'Message')}</Label>
                  <Textarea data-testid="lead-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1" rows={4} />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button data-testid="lead-submit" type="submit" className="w-full bg-dz-accent hover:bg-dz-ink text-white">
                  <Mail className="h-4 w-4 mr-2" /> {t(lang, 'Envoyer la demande', 'Send request')}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ---------- Admin ----------
const getPath = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
const setPath = (obj, path, value) => {
  const keys = path.split('.')
  const clone = { ...obj }
  let cur = clone
  keys.forEach((k, idx) => {
    if (idx === keys.length - 1) cur[k] = value
    else { cur[k] = { ...(cur[k] || {}) }; cur = cur[k] }
  })
  return clone
}

const ADMIN_FIELDS = {
  products: [
    { path: 'name', label: 'Nom', type: 'text' },
    { path: 'slug', label: 'Slug', type: 'text' },
    { path: 'brand_name', label: 'Marque (nom)', type: 'text' },
    { path: 'brand_slug', label: 'Marque (slug)', type: 'text' },
    { path: 'vertical', label: 'Univers (skincare/hair/wellness)', type: 'text' },
    { path: 'category', label: 'Catégorie (cleanser/serum/moisturizer/sunscreen/shampoo/conditioner/hair-treatment/scalp-serum/supplement/tea/bath-body)', type: 'text' },
    { path: 'price_eur', label: 'Prix (€)', type: 'number' },
    { path: 'rating', label: 'Note (0-5)', type: 'number' },
    { path: 'image', label: 'Image URL', type: 'text' },
    { path: 'affiliate_url', label: 'Lien affilié', type: 'text' },
    { path: 'german_made', label: 'Made in Germany', type: 'bool' },
    { path: 'concerns', label: 'Préoccupations (csv: acne,aging...)', type: 'csv' },
    { path: 'skin_types', label: 'Types de peau (csv)', type: 'csv' },
    { path: 'ingredients', label: 'Ingrédients (slugs csv)', type: 'csv' },
    { path: 'description.fr', label: 'Description FR', type: 'textarea' },
    { path: 'description.en', label: 'Description EN', type: 'textarea' },
    { path: 'description.ar', label: 'Description AR', type: 'textarea' },
  ],
  brands: [
    { path: 'name', label: 'Nom', type: 'text' },
    { path: 'slug', label: 'Slug', type: 'text' },
    { path: 'country', label: 'Pays', type: 'text' },
    { path: 'city', label: 'Ville', type: 'text' },
    { path: 'founded', label: 'Année de création', type: 'number' },
    { path: 'german', label: 'Marque allemande', type: 'bool' },
    { path: 'website', label: 'Site web', type: 'text' },
    { path: 'manufacturer', label: 'Fabricant', type: 'text' },
    { path: 'certifications', label: 'Certifications (csv)', type: 'csv' },
    { path: 'description.fr', label: 'Description FR', type: 'textarea' },
    { path: 'description.en', label: 'Description EN', type: 'textarea' },
    { path: 'description.ar', label: 'Description AR', type: 'textarea' },
  ],
  ingredients: [
    { path: 'name', label: 'Nom', type: 'text' },
    { path: 'slug', label: 'Slug', type: 'text' },
    { path: 'inci', label: 'INCI', type: 'text' },
    { path: 'safety', label: 'Sécurité (green/caution)', type: 'text' },
    { path: 'evidence', label: 'Preuves (strong/moderate/limited)', type: 'text' },
    { path: 'comedogenic', label: 'Comédogénicité (0-5)', type: 'number' },
    { path: 'good_for', label: 'Recommandé pour (csv)', type: 'csv' },
    { path: 'description.fr', label: 'Description FR', type: 'textarea' },
    { path: 'description.en', label: 'Description EN', type: 'textarea' },
    { path: 'description.ar', label: 'Description AR', type: 'textarea' },
    { path: 'benefits.fr', label: 'Bénéfices FR (csv)', type: 'csv' },
    { path: 'benefits.en', label: 'Bénéfices EN (csv)', type: 'csv' },
    { path: 'benefits.ar', label: 'Bénéfices AR (csv)', type: 'csv' },
    { path: 'regulatory.fr', label: 'Contexte réglementaire FR', type: 'textarea' },
    { path: 'regulatory.en', label: 'Contexte réglementaire EN', type: 'textarea' },
    { path: 'regulatory.ar', label: 'Contexte réglementaire AR', type: 'textarea' },
  ],
  reels: [
    { path: 'slug', label: 'Slug', type: 'text' },
    { path: 'video_url', label: 'URL de la vidéo (YouTube Shorts / Instagram Reels / TikTok)', type: 'text' },
    { path: 'duration_s', label: 'Durée (secondes)', type: 'number' },
    { path: 'vertical', label: 'Univers (skincare/hair/wellness)', type: 'text' },
    { path: 'product_slug', label: 'Produit lié (slug) — optionnel', type: 'text' },
    { path: 'ingredient_slug', label: 'Ingrédient lié (slug) — optionnel', type: 'text' },
    { path: 'status', label: 'Statut (draft/published)', type: 'text' },
    { path: 'published_at', label: 'Date (YYYY-MM-DD)', type: 'text' },
    { path: 'title.fr', label: 'Titre FR', type: 'text' },
    { path: 'title.en', label: 'Titre EN', type: 'text' },
    { path: 'title.ar', label: 'Titre AR', type: 'text' },
    { path: 'caption.fr', label: 'Légende FR', type: 'textarea' },
    { path: 'caption.en', label: 'Légende EN', type: 'textarea' },
    { path: 'caption.ar', label: 'Légende AR', type: 'textarea' },
  ],
  articles: [
    { path: 'slug', label: 'Slug', type: 'text' },
    { path: 'category', label: 'Catégorie (learn/guide/research/how-to)', type: 'text' },
    { path: 'status', label: 'Statut (draft/published)', type: 'text' },
    { path: 'vertical', label: 'Univers (skincare/hair/wellness) — optionnel', type: 'text' },
    { path: 'image', label: 'Image URL', type: 'text' },
    { path: 'published_at', label: 'Date (YYYY-MM-DD)', type: 'text' },
    { path: 'title.fr', label: 'Titre FR', type: 'text' },
    { path: 'title.en', label: 'Titre EN', type: 'text' },
    { path: 'title.ar', label: 'Titre AR', type: 'text' },
    { path: 'excerpt.fr', label: 'Extrait FR', type: 'textarea' },
    { path: 'excerpt.en', label: 'Extrait EN', type: 'textarea' },
    { path: 'excerpt.ar', label: 'Extrait AR', type: 'textarea' },
    { path: 'content.fr', label: 'Contenu FR', type: 'textarea' },
    { path: 'content.en', label: 'Contenu EN', type: 'textarea' },
    { path: 'content.ar', label: 'Contenu AR', type: 'textarea' },
  ],
  hubs: [
    { path: 'slug', label: 'Slug (= id de préoccupation, ex: acne)', type: 'text' },
    { path: 'vertical', label: 'Univers (skincare/hair/wellness)', type: 'text' },
    { path: 'title.fr', label: 'Titre FR', type: 'text' },
    { path: 'title.en', label: 'Titre EN', type: 'text' },
    { path: 'title.ar', label: 'Titre AR', type: 'text' },
    { path: 'definition.fr', label: 'Définition FR', type: 'textarea' },
    { path: 'definition.en', label: 'Définition EN', type: 'textarea' },
    { path: 'definition.ar', label: 'Définition AR', type: 'textarea' },
    { path: 'causes.fr', label: 'Causes FR (csv)', type: 'csv' },
    { path: 'causes.en', label: 'Causes EN (csv)', type: 'csv' },
    { path: 'causes.ar', label: 'Causes AR (csv)', type: 'csv' },
    { path: 'mistakes.fr', label: 'Erreurs à éviter FR (csv)', type: 'csv' },
    { path: 'mistakes.en', label: 'Erreurs à éviter EN (csv)', type: 'csv' },
    { path: 'mistakes.ar', label: 'Erreurs à éviter AR (csv)', type: 'csv' },
    { path: 'buying_guide.fr', label: "Guide d'achat FR (csv)", type: 'csv' },
    { path: 'buying_guide.en', label: "Guide d'achat EN (csv)", type: 'csv' },
    { path: 'buying_guide.ar', label: "Guide d'achat AR (csv)", type: 'csv' },
    { path: 'key_ingredients', label: 'Actifs clés (slugs csv)', type: 'csv' },
    { path: 'faqs', label: 'FAQ (JSON: [{"q":{"fr":"..","en":".."},"a":{"fr":"..","en":".."}}])', type: 'json' },
  ],
}

const AdminCrud = ({ entity, token, lang }) => {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const fields = ADMIN_FIELDS[entity]
  const [genOpen, setGenOpen] = useState(false)
  const [genTopic, setGenTopic] = useState('')
  const [genVertical, setGenVertical] = useState('skincare')
  const [genCategory, setGenCategory] = useState('guide')
  const [genBusy, setGenBusy] = useState(false)
  const [genError, setGenError] = useState('')

  const generate = async () => {
    setGenBusy(true); setGenError('')
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topic: genTopic, vertical: genVertical, category: genCategory }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Generation failed')
      const a = d.article
      setEditing({
        slug: a.slug, category: a.category, vertical: a.vertical || genVertical,
        title: a.title, excerpt: a.excerpt, content: a.content,
        image: DEFAULT_ARTICLE_IMG, published_at: new Date().toISOString().slice(0, 10), status: 'draft',
      })
      setGenOpen(false); setGenBusy(false); setOpen(true)
    } catch (e) { setGenError(e.message); setGenBusy(false) }
  }

  const load = useCallback(async () => {
    const res = await fetch(`/api/${entity}${entity === 'articles' ? '?all=1' : ''}`)
    const data = await res.json()
    setItems(data[entity] || [])
  }, [entity])
  useEffect(() => { load() }, [load])

  const startNew = () => { setEditing({}); setOpen(true) }
  const startEdit = (item) => { setEditing(item); setOpen(true) }

  const save = async () => {
    setSaving(true)
    const isEdit = !!editing.id
    const url = isEdit ? `/api/admin/${entity}/${editing.id}` : `/api/admin/${entity}`
    const body = { ...editing }
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    setSaving(false)
    if (res.ok) { setOpen(false); load() }
    else { const d = await res.json(); alert(d.error || 'Error') }
  }

  const remove = async (item) => {
    if (!confirm(ts(lang, 'Supprimer cet élément ?', 'Delete this item?'))) return
    await fetch(`/api/admin/${entity}/${item.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  const displayName = (item) => item.name || item.title?.fr || item.slug

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-dz-text-2">{items.length} {t(lang, 'éléments', 'items')}</p>
        <div className="flex gap-2">
          {entity === 'articles' && (
            <Button data-testid="admin-ai-generate" size="sm" variant="outline" className="border-dz-accent text-dz-accent" onClick={() => { setGenError(''); setGenOpen(true) }}>
              <Sparkles className="h-4 w-4 mr-1" /> {t(lang, 'Générer avec l\u2019IA', 'Generate with AI')}
            </Button>
          )}
          <Button data-testid={`admin-add-${entity}`} size="sm" className="bg-dz-accent hover:bg-dz-ink text-white" onClick={startNew}>
            <Plus className="h-4 w-4 mr-1" /> {t(lang, 'Ajouter', 'Add')}
          </Button>
        </div>
      </div>

      <Dialog open={genOpen} onOpenChange={setGenOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-dz-accent" /> {t(lang, 'Générer un article (IA)', 'Generate an article (AI)')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-dz-text">{t(lang, 'Sujet de l\u2019article', 'Article topic')}</Label>
              <Textarea data-testid="ai-topic" value={genTopic} onChange={(e) => setGenTopic(e.target.value)} rows={2} className="mt-1"
                placeholder={ts(lang, 'Ex : Comment utiliser la niacinamide', 'e.g. How to use niacinamide')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-dz-text">{t(lang, 'Univers', 'Universe')}</Label>
                <Select value={genVertical} onValueChange={setGenVertical}>
                  <SelectTrigger data-testid="ai-vertical" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{VERTICALS.map((v) => <SelectItem key={v.id} value={v.id}>{pick(v, lang)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-dz-text">{t(lang, 'Catégorie', 'Category')}</Label>
                <Select value={genCategory} onValueChange={setGenCategory}>
                  <SelectTrigger data-testid="ai-category" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="learn">Learn</SelectItem>
                    <SelectItem value="how-to">How-to</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {genError && <p className="text-xs text-red-600">{genError}</p>}
            <Button data-testid="ai-generate-btn" className="w-full bg-dz-accent hover:bg-dz-ink text-white" disabled={genBusy || genTopic.trim().length < 3} onClick={generate}>
              {genBusy ? (t(lang, 'Génération en cours\u2026 (10-20s)', 'Generating\u2026 (10-20s)')) : (t(lang, 'Générer', 'Generate'))}
            </Button>
            <p className="text-[11px] text-dz-text-4">{t(lang, 'Le contenu généré s\u2019ouvrira en brouillon pour révision avant publication.', 'Generated content opens as a draft for review before publishing.')}</p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="border border-dz-rule rounded-lg overflow-hidden divide-y divide-dz-rule-card">
        {items.map((item) => (
          <div key={item.id || item.slug} data-testid={`admin-row-${item.slug}`} className="flex items-center justify-between px-4 py-2.5 bg-white hover:bg-dz-bg">
            <div className="min-w-0">
              <p className="text-sm font-medium text-dz-ink truncate"><Kw lang={lang}>{displayName(item)}</Kw></p>
              <p className="text-xs text-dz-text-4 font-mono"><Kw lang={lang}>{item.slug}</Kw></p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Button data-testid={`admin-edit-${item.slug}`} size="sm" variant="ghost" onClick={() => startEdit(item)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button data-testid={`admin-delete-${item.slug}`} size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => remove(item)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? t(lang, 'Modifier', 'Edit') : t(lang, 'Ajouter', 'Add')} — <Kw lang={lang}>{entity}</Kw></DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              {fields.map((f) => {
                const raw = getPath(editing, f.path)
                const value = f.type === 'csv'
                  ? (Array.isArray(raw) ? raw.join(', ') : raw || '')
                  : f.type === 'json'
                    ? (typeof raw === 'string' ? raw : raw ? JSON.stringify(raw, null, 1) : '')
                    : raw ?? ''
                const onChange = (v) => {
                  let parsed = v
                  if (f.type === 'number') parsed = v === '' ? '' : parseFloat(v)
                  if (f.type === 'csv') parsed = v.split(',').map((s) => s.trim()).filter(Boolean)
                  if (f.type === 'json') { try { parsed = JSON.parse(v) } catch { parsed = v } }
                  setEditing((cur) => setPath(cur, f.path, parsed))
                }
                return (
                  <div key={f.path}>
                    <Label className="text-xs text-dz-text">{tAdmin(lang, f.label)}</Label>
                    {f.type === 'textarea' || f.type === 'json' ? (
                      <Textarea data-testid={`admin-field-${f.path}`} value={value} onChange={(e) => onChange(e.target.value)} rows={f.type === 'json' ? 6 : 3} className="mt-1" />
                    ) : f.type === 'bool' ? (
                      <div className="mt-1">
                        <button type="button" data-testid={`admin-field-${f.path}`} onClick={() => setEditing((cur) => setPath(cur, f.path, !getPath(cur, f.path)))}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${getPath(editing, f.path) ? 'bg-dz-accent-bg border-dz-accent text-dz-accent' : 'bg-dz-bg border-dz-rule text-dz-text-2'}`}>
                          {getPath(editing, f.path) ? t(lang, 'Oui', 'Yes') : t(lang, 'Non', 'No')}
                        </button>
                      </div>
                    ) : f.type === 'csv' ? (
                      <Input data-testid={`admin-field-${f.path}`} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1" />
                    ) : (
                      <Input data-testid={`admin-field-${f.path}`} type={f.type === 'number' ? 'number' : 'text'} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1" />
                    )}
                  </div>
                )
              })}
              <Button data-testid="admin-save-btn" className="w-full bg-dz-accent hover:bg-dz-ink text-white" disabled={saving} onClick={save}>
                {saving ? '...' : (t(lang, 'Enregistrer', 'Save'))}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const AdminView = ({ lang }) => {
  const [token, setToken] = useState(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [leads, setLeads] = useState([])
  const [subscribers, setSubscribers] = useState([])

  useEffect(() => { setToken(localStorage.getItem('admin_token')) }, [])
  useEffect(() => {
    if (!token) return
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).then((r) => {
      if (r.status === 401) { localStorage.removeItem('admin_token'); setToken(null); return null }
      return r.json()
    }).then((d) => d && setStats(d))
    fetch('/api/admin/leads', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setLeads(d.leads || []))
    fetch('/api/admin/subscribers', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setSubscribers(d.subscribers || []))
  }, [token])

  const login = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    const data = await res.json()
    if (res.ok) { localStorage.setItem('admin_token', data.token); setToken(data.token) }
    else setError(ts(lang, 'Mot de passe incorrect', 'Invalid password'))
  }

  const logout = () => { localStorage.removeItem('admin_token'); setToken(null) }

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-sm">
        <Card className="border-dz-rule">
          <CardContent className="p-6">
            <h1 className="text-xl font-display font-normal tracking-[-0.02em] text-dz-ink mb-1">{t(lang, 'Back-office', 'Back-office')}</h1>
            <p className="text-sm text-dz-text-2 mb-5">{t(lang, 'Accès réservé à l’administration', 'Admin access only')}</p>
            <form onSubmit={login} className="space-y-3">
              <Input data-testid="admin-password" type="password" placeholder={ts(lang, 'Mot de passe', 'Password')} value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && <p className="text-sm text-red-600" data-testid="admin-login-error">{error}</p>}
              <Button data-testid="admin-login-btn" type="submit" className="w-full bg-dz-ink hover:bg-dz-accent text-white">{t(lang, 'Connexion', 'Log in')}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-normal tracking-[-0.02em] text-dz-ink">{t(lang, 'Back-office', 'Back-office')}</h1>
        <Button data-testid="admin-logout" variant="outline" size="sm" className="border-dz-chip" onClick={logout}>
          <LogOut className="h-3.5 w-3.5 mr-1.5" /> {t(lang, 'Déconnexion', 'Log out')}
        </Button>
      </div>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {[
            { k: 'products', fr: 'Produits', en: 'Products', ar: 'المنتجات' },
            { k: 'brands', fr: 'Marques', en: 'Brands', ar: 'العلامات التجارية' },
            { k: 'ingredients', fr: 'Ingrédients', en: 'Ingredients', ar: 'المكوّنات' },
            { k: 'articles', fr: 'Articles', en: 'Articles', ar: 'المقالات' },
            { k: 'hubs', fr: 'Hubs', en: 'Hubs', ar: 'المراكز' },
            { k: 'leads', fr: 'Leads', en: 'Leads', ar: 'الطلبات' },
            { k: 'subscribers', fr: 'Abonnés', en: 'Subscribers', ar: 'المشتركون' },
            { k: 'affiliate_clicks', fr: 'Clics achat', en: 'Buy clicks', ar: 'نقرات الشراء' },
          ].map((s) => (
            <Card key={s.k} className="border-dz-rule"><CardContent className="p-4">
              <p className="text-2xl font-semibold text-dz-ink" data-testid={`stat-${s.k}`}>{stats[s.k]}</p>
              <p className="text-xs text-dz-text-2">{pick(s, lang)}</p>
            </CardContent></Card>
          ))}
        </div>
      )}
      <Tabs defaultValue="products">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger data-testid="admin-tab-products" value="products">{t(lang, 'Produits', 'Products')}</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-brands" value="brands">{t(lang, 'Marques', 'Brands')}</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-ingredients" value="ingredients">{t(lang, 'Ingrédients', 'Ingredients')}</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-articles" value="articles">{t(lang, 'Articles', 'Articles')}</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-hubs" value="hubs">{t(lang, 'Hubs', 'Hubs')}</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-reels" value="reels">{t(lang, 'Reels', 'Reels')}</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-leads" value="leads">{t(lang, 'Leads', 'Leads')}</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-subscribers" value="subscribers">{t(lang, 'Abonnés', 'Subscribers')}</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-4"><AdminCrud entity="products" token={token} lang={lang} /></TabsContent>
        <TabsContent value="brands" className="mt-4"><AdminCrud entity="brands" token={token} lang={lang} /></TabsContent>
        <TabsContent value="ingredients" className="mt-4"><AdminCrud entity="ingredients" token={token} lang={lang} /></TabsContent>
        <TabsContent value="articles" className="mt-4"><AdminCrud entity="articles" token={token} lang={lang} /></TabsContent>
        <TabsContent value="hubs" className="mt-4"><AdminCrud entity="hubs" token={token} lang={lang} /></TabsContent>
        <TabsContent value="reels" className="mt-4"><AdminCrud entity="reels" token={token} lang={lang} /></TabsContent>
        <TabsContent value="leads" className="mt-4">
          <div className="border border-dz-rule rounded-lg overflow-hidden divide-y divide-dz-rule-card">
            {leads.length === 0 && <p className="p-4 text-sm text-dz-text-4">{t(lang, 'Aucun lead pour le moment.', 'No leads yet.')}</p>}
            {leads.map((l) => (
              <div key={l.id} className="px-4 py-3 bg-white" data-testid={`lead-row-${l.id}`}>
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-dz-ink"><Kw lang={lang}>{l.brand_name}</Kw> <span className="font-normal text-dz-text-4">— {l.contact_name}</span></p>
                  <span className="text-[11px] text-dz-text-4">{(l.created_at || '').slice(0, 10)}</span>
                </div>
                <p className="text-xs text-dz-accent"><Kw lang={lang}>{l.email}</Kw></p>
                {l.message && <p className="text-sm text-dz-text mt-1">{l.message}</p>}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="subscribers" className="mt-4">
          <div className="flex justify-end mb-3">
            <Button data-testid="subscribers-export" variant="outline" size="sm" className="border-dz-chip" disabled={subscribers.length === 0}
              onClick={() => {
                const rows = [['email', 'lang', 'source', 'created_at'], ...subscribers.map((s) => [s.email, s.lang, s.source, s.created_at])]
                const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
                const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
                const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click(); URL.revokeObjectURL(url)
              }}>
              {t(lang, 'Exporter CSV', 'Export CSV')}
            </Button>
          </div>
          <div className="border border-dz-rule rounded-lg overflow-hidden divide-y divide-dz-rule-card">
            {subscribers.length === 0 && <p className="p-4 text-sm text-dz-text-4">{t(lang, 'Aucun abonné pour le moment.', 'No subscribers yet.')}</p>}
            {subscribers.map((s) => (
              <div key={s.id} className="px-4 py-3 bg-white flex justify-between items-center" data-testid={`subscriber-row-${s.id}`}>
                <div>
                  <p className="text-sm font-semibold text-dz-ink"><Kw lang={lang}>{s.email}</Kw></p>
                  <p className="text-[11px] text-dz-text-4">{t(lang, 'Source', 'Source')}: <Kw lang={lang}>{s.source}</Kw> · <Kw lang={lang}>{s.lang?.toUpperCase()}</Kw></p>
                </div>
                <span className="text-[11px] text-dz-text-4">{(s.created_at || '').slice(0, 10)}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ---------- Footer ----------
// Handoff §10 : filet haut, grille 1.5fr 1fr 1fr 1fr, en-têtes de colonne en
// mono, mention légale séparée par un second filet.
const Footer = ({ lang, nav }) => {
  const columns = [
    {
      key: 'explore',
      title: t(lang, 'Explorer', 'Explore'),
      links: [
        ['products', t(lang, 'Produits', 'Products')],
        ['ingredients', t(lang, 'Ingrédients', 'Ingredients')],
        ['brands', t(lang, 'Marques', 'Brands')],
        ['german-brands', t(lang, 'Marques allemandes', 'German Brands')],
      ],
    },
    {
      key: 'tools',
      title: t(lang, 'Outils', 'Tools'),
      links: [
        // Noms de produits maison sans équivalent arabe : rendus en pastille.
        ['finder', t(lang, 'Product Finder', 'Product Finder')],
        ['compare', t(lang, 'Comparateur', 'Compare')],
        ['hubs', t(lang, 'Conseils', 'Advice')],
        ['learn', t(lang, 'Learn & Guides', 'Learn & Guides')],
        ['reels', t(lang, 'Reels', 'Reels')],
      ],
    },
    {
      key: 'pro',
      title: t(lang, 'Professionnels', 'Professionals'),
      links: [
        ['for-brands', t(lang, 'Pour les marques', 'For Brands')],
        ['admin', t(lang, 'Back-office', 'Back-office')],
      ],
    },
  ]

  return (
    <footer className="mt-20 pt-16 shadow-dz-rule-t md:mt-[110px]">
      <Container className="pb-10">
        <div className="mb-14 max-w-xl">
          <NewsletterSignup lang={lang} source="footer" variant="footer" />
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-[52px]">
          <div>
            <div className="mb-3.5 font-display text-[28px] leading-none tracking-[-0.01em]">Dermalyze</div>
            <p className="m-0 max-w-[290px] text-[14px] font-light leading-[1.65] text-dz-text-2">
              {t(lang, 'La skincare décryptée par la science. Indépendant, transparent, bilingue.', 'Skincare decoded by science. Independent, transparent, bilingual.')}
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.key} className="flex flex-col gap-3">
              <Mono className="mb-[5px] text-[10.5px] tracking-[0.16em] text-dz-text-4">{col.title}</Mono>
              {col.links.map(([v, l]) => (
                <button key={v} data-testid={v === 'admin' ? 'footer-admin-link' : `footer-${v}`} onClick={() => nav(v)}
                  className="text-left text-[14px] text-dz-nav transition-colors duration-200 hover:text-dz-accent">
                  {l}
                </button>
              ))}
            </div>
          ))}
        </div>
      </Container>
      <Container className="pb-12 pt-[22px] text-[12.5px] text-dz-text-4 shadow-dz-rule-legal">
        © 2025 Dermalyze — {t(lang, 'Les informations fournies ne remplacent pas un avis médical.', 'Information provided does not replace medical advice.')}
      </Container>
    </footer>
  )
}

// ---------- App ----------
// Bouton flottant (FAB) vers le Product Finder — icône ronde, fixe en bas à
// droite, VISIBLE UNIQUEMENT en mobile (sm:hidden). Le libellé complet est porté
// par aria-label + title (info-bulle) pour l'accessibilité.
const FinderFab = ({ lang, nav, route }) => {
  if (route?.view === 'finder' || route?.view === 'admin') return null
  const labelTxt = ts(lang, 'Trouvez vos produits idéaux', 'Find your ideal products')
  return (
    <button
      data-testid="finder-fab"
      onClick={() => nav('finder')}
      aria-label={labelTxt}
      title={labelTxt}
      className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-dz-accent text-white shadow-dz-card-hover ring-1 ring-white/15 transition-[transform,background-color] duration-250 hover:-translate-y-0.5 hover:bg-dz-accent-hover active:translate-y-0 sm:hidden"
    >
      <Compass className="h-6 w-6" />
    </button>
  )
}

function App() {
  const [lang, setLangState] = useState('fr')
  const [route, setRoute] = useState({ view: 'home', param: null, extra: null })
  const [products, setProducts] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [brands, setBrands] = useState([])
  const [articles, setArticles] = useState([])
  const [reels, setReels] = useState([])
  const [compareA, setCompareA] = useState('')

  const setLang = (l) => { setLangState(l); try { localStorage.setItem('lang', l) } catch {} }

  // La langue pilote la direction du document : l'arabe bascule toute la page
  // en RTL (et change la famille typographique, cf. globals.css).
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = lang
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr'
  }, [lang])

  useEffect(() => {
    try { const saved = localStorage.getItem('lang'); if (saved && LANGS.includes(saved)) setLangState(saved) } catch {}
    const parseHash = () => {
      const h = (window.location.hash || '').replace(/^#\/?/, '')
      const [view, param] = h.split('/')
      setRoute({ view: view || 'home', param: param ? decodeURIComponent(param) : null, extra: null })
    }
    parseHash()
    window.addEventListener('hashchange', parseHash)
    return () => window.removeEventListener('hashchange', parseHash)
  }, [])

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then((d) => setProducts(d.products || []))
    fetch('/api/ingredients').then((r) => r.json()).then((d) => setIngredients(d.ingredients || []))
    fetch('/api/brands').then((r) => r.json()).then((d) => setBrands(d.brands || []))
    fetch('/api/articles').then((r) => r.json()).then((d) => setArticles(d.articles || []))
    fetch('/api/reels').then((r) => r.json()).then((d) => setReels(d.reels || [])).catch(() => setReels([]))
  }, [])

  // Lightweight SEO: dynamic document title + meta description per route
  useEffect(() => {
    const titles = {
      home: { fr: 'Dermalyze — La beauté & le bien-être allemands décryptés par la science', en: 'Dermalyze — German beauty & wellness decoded by science', ar: 'Dermalyze — الجمال والعافية الألمانية مُفسَّرة بالعلم' },
      products: { fr: 'Produits — Dermalyze', en: 'Products — Dermalyze', ar: 'المنتجات — Dermalyze' },
      ingredients: { fr: 'Ingrédients décryptés — Dermalyze', en: 'Ingredients decoded — Dermalyze', ar: 'المكوّنات مُفسَّرة — Dermalyze' },
      brands: { fr: 'Marques — Dermalyze', en: 'Brands — Dermalyze', ar: 'العلامات التجارية — Dermalyze' },
      'german-brands': { fr: 'Marques allemandes — Dermalyze', en: 'German brands — Dermalyze', ar: 'العلامات الألمانية — Dermalyze' },
      compare: { fr: 'Comparateur — Dermalyze', en: 'Compare — Dermalyze', ar: 'أداة المقارنة — Dermalyze' },
      finder: { fr: 'Product Finder — Dermalyze', en: 'Product Finder — Dermalyze', ar: 'اعثر على منتجك — Dermalyze' },
      hubs: { fr: 'Conseils par préoccupation — Dermalyze', en: 'Advice by concern — Dermalyze', ar: 'نصائح حسب المشكلة — Dermalyze' },
      learn: { fr: 'Learn & Guides — Dermalyze', en: 'Learn & Guides — Dermalyze', ar: 'التعلّم والأدلّة — Dermalyze' },
      reels: { fr: 'Reels — La science de la peau en 60 secondes — Dermalyze', en: 'Reels — Skin science in 60 seconds — Dermalyze', ar: 'ريلز — علم البشرة في 60 ثانية — Dermalyze' },
      'for-brands': { fr: 'Pour les marques — Entrer sur le marché MENA — Dermalyze', en: 'For brands — Enter the MENA market — Dermalyze', ar: 'للعلامات التجارية — دخول سوق الشرق الأوسط وشمال إفريقيا — Dermalyze' },
      routine: { fr: 'Routine partagée — Dermalyze', en: 'Shared routine — Dermalyze', ar: 'روتين مُشارَك — Dermalyze' },
    }
    const pageTitle = pick(titles[route.view] || titles.home, lang)
    if (typeof document !== 'undefined') {
      document.title = pageTitle
      const desc = ts(lang, 'Analysez les ingrédients, comparez les produits et trouvez votre routine — un focus unique sur les marques allemandes de santé & beauté.', 'Analyze ingredients, compare products and find your routine — a unique focus on German health & beauty brands.')
      let m = document.querySelector('meta[name="description"]')
      if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m) }
      m.setAttribute('content', desc)
    }
  }, [route.view, lang])

  const nav = useCallback((view, param = null, extra = null) => {
    setRoute({ view, param, extra })
    const hash = `#/${view}${param ? `/${encodeURIComponent(param)}` : ''}`
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
    window.scrollTo({ top: 0 })
  }, [])

  const v = route.view
  return (
    <div className="min-h-screen bg-dz-bg text-dz-ink">
      <Header lang={lang} setLang={setLang} nav={nav} route={route} />
      <main>
        {v === 'home' && <HomeView lang={lang} nav={nav} products={products} ingredients={ingredients} brands={brands} articles={articles} reels={reels} />}
        {v === 'products' && <ProductsView lang={lang} nav={nav} initialFilters={route.extra} />}
        {v === 'product' && <ProductDetailView slug={route.param} lang={lang} nav={nav} setCompareA={setCompareA} />}
        {v === 'hubs' && <HubsView lang={lang} nav={nav} />}
        {v === 'hub' && <HubDetailView slug={route.param} lang={lang} nav={nav} />}
        {v === 'ingredients' && <IngredientsView lang={lang} nav={nav} ingredients={ingredients} />}
        {v === 'ingredient' && <IngredientDetailView slug={route.param} lang={lang} nav={nav} />}
        {v === 'brands' && <BrandsView lang={lang} nav={nav} germanOnly={false} />}
        {v === 'german-brands' && <BrandsView lang={lang} nav={nav} germanOnly={true} />}
        {v === 'brand' && <BrandDetailView slug={route.param} lang={lang} nav={nav} />}
        {v === 'compare' && <CompareView lang={lang} nav={nav} products={products} compareA={compareA} setCompareA={setCompareA} pair={route.param} />}
        {v === 'finder' && <FinderView lang={lang} nav={nav} />}
        {v === 'routine' && <SharedRoutineView id={route.param} lang={lang} nav={nav} />}
        {v === 'reels' && <ReelsView lang={lang} nav={nav} slug={route.param} />}
        {v === 'learn' && <LearnView lang={lang} nav={nav} articles={articles} />}
        {v === 'article' && <ArticleDetailView slug={route.param} lang={lang} nav={nav} />}
        {v === 'for-brands' && <ForBrandsView lang={lang} />}
        {v === 'admin' && <AdminView lang={lang} />}
      </main>
      <Footer lang={lang} nav={nav} />
      <FinderFab lang={lang} nav={nav} route={route} />
    </div>
  )
}

export default App;
