'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Menu, X, Search, Star, Sparkles, ArrowRight, ArrowLeft, Check, FlaskConical, Leaf,
  GitCompare, BookOpen, Building2, ShieldCheck, Trash2, Pencil, Plus, LogOut,
  BarChart3, Globe, MapPin, ExternalLink, Droplets, Sun, Beaker, Mail
} from 'lucide-react'

const HERO_IMG = 'https://images.unsplash.com/photo-1585945037805-5fd82c2e60b1?crop=entropy&cs=srgb&fm=jpg&q=85'

const CONCERNS = [
  { id: 'acne', fr: 'Acné & imperfections', en: 'Acne & blemishes' },
  { id: 'sensitive', fr: 'Peau sensible', en: 'Sensitive skin' },
  { id: 'aging', fr: 'Anti-âge', en: 'Anti-aging' },
  { id: 'dryness', fr: 'Sécheresse', en: 'Dryness' },
  { id: 'oily', fr: 'Peau grasse', en: 'Oily skin' },
  { id: 'pigmentation', fr: 'Taches pigmentaires', en: 'Dark spots' },
]
const SKIN_TYPES = [
  { id: 'normal', fr: 'Normale', en: 'Normal' },
  { id: 'dry', fr: 'Sèche', en: 'Dry' },
  { id: 'oily', fr: 'Grasse', en: 'Oily' },
  { id: 'combination', fr: 'Mixte', en: 'Combination' },
  { id: 'sensitive', fr: 'Sensible', en: 'Sensitive' },
]
const CATEGORIES = [
  { id: 'cleanser', fr: 'Nettoyant', en: 'Cleanser' },
  { id: 'serum', fr: 'Sérum', en: 'Serum' },
  { id: 'moisturizer', fr: 'Crème hydratante', en: 'Moisturizer' },
  { id: 'sunscreen', fr: 'Protection solaire', en: 'Sunscreen' },
]

const label = (list, id, lang) => {
  const it = list.find((x) => x.id === id)
  return it ? it[lang] : id
}

// ---------- small ui helpers ----------
const Stars = ({ rating }) => (
  <span className="flex items-center gap-1 text-amber-500">
    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
    <span className="text-xs font-semibold text-stone-700">{rating?.toFixed(1)}</span>
  </span>
)

const SafetyBadge = ({ safety, lang }) => (
  <Badge className={safety === 'green' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-amber-100 text-amber-800 hover:bg-amber-100'}>
    {safety === 'green' ? (lang === 'fr' ? 'Sûr' : 'Safe') : (lang === 'fr' ? 'Prudence' : 'Caution')}
  </Badge>
)

const EvidenceBadge = ({ evidence, lang }) => (
  <Badge variant="outline" className="border-stone-300 text-stone-600">
    {lang === 'fr'
      ? evidence === 'strong' ? 'Preuves solides' : evidence === 'moderate' ? 'Preuves modérées' : 'Preuves limitées'
      : evidence === 'strong' ? 'Strong evidence' : evidence === 'moderate' ? 'Moderate evidence' : 'Limited evidence'}
  </Badge>
)

const SectionTitle = ({ children, sub }) => (
  <div className="mb-6">
    <h2 className="text-2xl md:text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>{children}</h2>
    {sub && <p className="text-stone-500 mt-1 text-sm md:text-base">{sub}</p>}
  </div>
)

// ---------- Product Card ----------
const ProductCard = ({ p, lang, onOpen }) => (
  <Card data-testid={`product-card-${p.slug}`} onClick={() => onOpen(p.slug)} className="group cursor-pointer overflow-hidden border-stone-200 hover:shadow-lg transition-all duration-300 bg-white">
    <div className="relative aspect-square overflow-hidden bg-stone-100">
      <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
      {p.german_made && (
        <Badge className="absolute top-2 left-2 bg-stone-900/85 text-white hover:bg-stone-900/85 text-[10px]">🇩🇪 Made in Germany</Badge>
      )}
    </div>
    <CardContent className="p-3 md:p-4">
      <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">{p.brand_name}</p>
      <h3 className="text-sm md:text-base font-semibold text-stone-900 leading-snug line-clamp-2 mt-0.5">{p.name}</h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-bold text-stone-900">{p.price_eur?.toFixed(2)} €</span>
        <Stars rating={p.rating} />
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {(p.concerns || []).slice(0, 2).map((c) => (
          <Badge key={c} variant="secondary" className="text-[10px] bg-stone-100 text-stone-600 hover:bg-stone-100">{label(CONCERNS, c, lang)}</Badge>
        ))}
      </div>
    </CardContent>
  </Card>
)

// ---------- Header ----------
const Header = ({ lang, setLang, nav, route }) => {
  const [open, setOpen] = useState(false)
  const items = [
    { v: 'products', fr: 'Produits', en: 'Products' },
    { v: 'ingredients', fr: 'Ingrédients', en: 'Ingredients' },
    { v: 'brands', fr: 'Marques', en: 'Brands' },
    { v: 'german-brands', fr: 'Marques allemandes', en: 'German Brands' },
    { v: 'compare', fr: 'Comparer', en: 'Compare' },
    { v: 'finder', fr: 'Product Finder', en: 'Product Finder' },
    { v: 'learn', fr: 'Guides', en: 'Guides' },
    { v: 'for-brands', fr: 'Pour les marques', en: 'For Brands' },
  ]
  const go = (v) => { nav(v); setOpen(false) }
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <button data-testid="logo-btn" onClick={() => go('home')} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-800 flex items-center justify-center">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>Dermalyze</span>
          </button>
          <nav className="hidden lg:flex items-center gap-1">
            {items.map((it) => (
              <button key={it.v} data-testid={`nav-${it.v}`} onClick={() => go(it.v)}
                className={`px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors ${route.view === it.v ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}>
                {it[lang]}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button data-testid="lang-toggle" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50">
              <Globe className="h-3.5 w-3.5" /> {lang === 'fr' ? 'FR' : 'EN'}
            </button>
            <button data-testid="mobile-menu-btn" className="lg:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-stone-200 bg-white">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {items.map((it) => (
              <button key={it.v} data-testid={`mobile-nav-${it.v}`} onClick={() => go(it.v)}
                className="text-left px-3 py-2.5 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50">
                {it[lang]}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

// ---------- Home ----------
const HomeView = ({ lang, nav, products, ingredients, brands, articles }) => {
  const featured = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4)
  const german = brands.filter((b) => b.german)
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-stone-100 to-white">
        <div className="container mx-auto px-4 py-10 md:py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mb-4">
              {lang === 'fr' ? 'Skincare basé sur la science' : 'Science-based skincare'}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-stone-900 leading-tight" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              {lang === 'fr' ? 'Comprenez enfin ce que vous mettez sur votre peau' : 'Finally understand what you put on your skin'}
            </h1>
            <p className="text-stone-600 mt-4 text-base md:text-lg max-w-lg">
              {lang === 'fr'
                ? 'Analysez les ingrédients, comparez les produits et trouvez la routine idéale — avec un focus unique sur les marques dermatologiques allemandes.'
                : 'Analyze ingredients, compare products and find your ideal routine — with a unique focus on German dermatological brands.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button data-testid="hero-finder-btn" size="lg" className="bg-emerald-800 hover:bg-emerald-900 text-white" onClick={() => nav('finder')}>
                <Sparkles className="h-4 w-4 mr-2" />
                {lang === 'fr' ? 'Lancer le Product Finder' : 'Start the Product Finder'}
              </Button>
              <Button data-testid="hero-products-btn" size="lg" variant="outline" className="border-stone-300" onClick={() => nav('products')}>
                {lang === 'fr' ? 'Explorer les produits' : 'Explore products'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="flex gap-6 mt-8">
              <div><p className="text-2xl font-bold text-stone-900">{products.length}</p><p className="text-xs text-stone-500">{lang === 'fr' ? 'Produits analysés' : 'Products analyzed'}</p></div>
              <div><p className="text-2xl font-bold text-stone-900">{ingredients.length}</p><p className="text-xs text-stone-500">{lang === 'fr' ? 'Ingrédients décryptés' : 'Ingredients decoded'}</p></div>
              <div><p className="text-2xl font-bold text-stone-900">{german.length}</p><p className="text-xs text-stone-500">{lang === 'fr' ? 'Marques allemandes' : 'German brands'}</p></div>
            </div>
          </div>
          <div className="relative">
            <img src={HERO_IMG} alt="skincare" className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]" />
          </div>
        </div>
      </section>

      {/* Concerns */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <SectionTitle sub={lang === 'fr' ? 'Explorez les produits par préoccupation' : 'Explore products by concern'}>
          {lang === 'fr' ? 'Quelle est votre préoccupation ?' : 'What is your concern?'}
        </SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CONCERNS.map((c) => (
            <button key={c.id} data-testid={`concern-${c.id}`} onClick={() => nav('products', null, { concern: c.id })}
              className="p-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-700 hover:shadow-md transition-all text-left">
              <Leaf className="h-5 w-5 text-emerald-700 mb-2" />
              <p className="text-sm font-semibold text-stone-800">{c[lang]}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-stone-50 py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <SectionTitle sub={lang === 'fr' ? 'Les mieux notés par la communauté' : 'Top rated by the community'}>
              {lang === 'fr' ? 'Produits en vedette' : 'Featured products'}
            </SectionTitle>
            <Button variant="ghost" className="text-emerald-800" onClick={() => nav('products')}>
              {lang === 'fr' ? 'Tout voir' : 'View all'} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {featured.map((p) => <ProductCard key={p.slug} p={p} lang={lang} onOpen={(s) => nav('product', s)} />)}
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-end justify-between mb-6">
          <SectionTitle sub={lang === 'fr' ? 'Ce que dit la science sur chaque actif' : 'What science says about each active'}>
            {lang === 'fr' ? 'Ingrédients décryptés' : 'Ingredients decoded'}
          </SectionTitle>
          <Button variant="ghost" className="text-emerald-800" onClick={() => nav('ingredients')}>
            {lang === 'fr' ? 'Tout voir' : 'View all'} <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {ingredients.slice(0, 6).map((i) => (
            <button key={i.slug} data-testid={`home-ingredient-${i.slug}`} onClick={() => nav('ingredient', i.slug)}
              className="p-4 rounded-xl border border-stone-200 bg-white hover:shadow-md transition-all text-left">
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="h-4 w-4 text-emerald-700" />
                <p className="font-semibold text-stone-900 text-sm">{i.name}</p>
              </div>
              <p className="text-xs text-stone-500 mb-2 font-mono">{i.inci}</p>
              <div className="flex gap-1.5 flex-wrap"><SafetyBadge safety={i.safety} lang={lang} /><EvidenceBadge evidence={i.evidence} lang={lang} /></div>
            </button>
          ))}
        </div>
      </section>

      {/* German brands */}
      <section className="bg-stone-900 text-white py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                🇩🇪 {lang === 'fr' ? 'L’excellence dermatologique allemande' : 'German dermatological excellence'}
              </h2>
              <p className="text-stone-400 mt-1 text-sm">{lang === 'fr' ? 'Plus de 100 ans de recherche et de rigueur scientifique' : 'Over 100 years of research and scientific rigor'}</p>
            </div>
            <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-stone-800" onClick={() => nav('german-brands')}>
              {lang === 'fr' ? 'Découvrir' : 'Discover'} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {german.slice(0, 5).map((b) => (
              <button key={b.slug} data-testid={`home-brand-${b.slug}`} onClick={() => nav('brand', b.slug)}
                className="p-4 rounded-xl bg-stone-800 hover:bg-stone-700 transition-colors text-left">
                <p className="font-bold text-white">{b.name}</p>
                <p className="text-xs text-stone-400 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" />{b.city} · {b.founded}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-end justify-between mb-6">
          <SectionTitle sub={lang === 'fr' ? 'Apprenez à connaître votre peau' : 'Get to know your skin'}>
            {lang === 'fr' ? 'Derniers guides' : 'Latest guides'}
          </SectionTitle>
          <Button variant="ghost" className="text-emerald-800" onClick={() => nav('learn')}>
            {lang === 'fr' ? 'Tout voir' : 'View all'} <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {articles.slice(0, 3).map((a) => (
            <Card key={a.slug} data-testid={`home-article-${a.slug}`} onClick={() => nav('article', a.slug)} className="cursor-pointer overflow-hidden border-stone-200 hover:shadow-lg transition-all group">
              <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                <img src={a.image} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="bg-stone-100 text-stone-600 mb-2 text-[10px] uppercase">{a.category}</Badge>
                <h3 className="font-semibold text-stone-900 leading-snug">{a.title?.[lang]}</h3>
                <p className="text-sm text-stone-500 mt-1.5 line-clamp-2">{a.excerpt?.[lang]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* For brands CTA */}
      <section className="container mx-auto px-4 pb-14">
        <div className="rounded-2xl bg-emerald-900 text-white p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              {lang === 'fr' ? 'Vous êtes une marque ?' : 'Are you a brand?'}
            </h2>
            <p className="text-emerald-100 mt-2 max-w-xl">
              {lang === 'fr'
                ? 'Faites analyser et référencer vos produits sur la plateforme de référence de la skincare transparente.'
                : 'Get your products analyzed and listed on the reference platform for transparent skincare.'}
            </p>
          </div>
          <Button data-testid="cta-for-brands" size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50" onClick={() => nav('for-brands')}>
            {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
          </Button>
        </div>
      </section>
    </div>
  )
}

// ---------- Products list ----------
const ProductsView = ({ lang, nav, initialFilters }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(initialFilters?.category || 'all')
  const [concern, setConcern] = useState(initialFilters?.concern || 'all')
  const [skinType, setSkinType] = useState('all')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const p = new URLSearchParams()
      if (category !== 'all') p.set('category', category)
      if (concern !== 'all') p.set('concern', concern)
      if (skinType !== 'all') p.set('skin_type', skinType)
      if (search) p.set('search', search)
      const res = await fetch(`/api/products?${p.toString()}`)
      const data = await res.json()
      setProducts(data.products || [])
      setLoading(false)
    }
    const t = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [search, category, concern, skinType])

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle sub={lang === 'fr' ? 'Tous les produits analysés par nos experts' : 'All products analyzed by our experts'}>
        {lang === 'fr' ? 'Produits' : 'Products'}
      </SectionTitle>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input data-testid="products-search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'fr' ? 'Rechercher un produit ou une marque...' : 'Search a product or brand...'} className="pl-9" />
        </div>
        <div className="grid grid-cols-3 gap-2 md:flex">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="filter-category" className="w-full md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'fr' ? 'Catégorie' : 'Category'}</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c[lang]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={concern} onValueChange={setConcern}>
            <SelectTrigger data-testid="filter-concern" className="w-full md:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'fr' ? 'Préoccupation' : 'Concern'}</SelectItem>
              {CONCERNS.map((c) => <SelectItem key={c.id} value={c.id}>{c[lang]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={skinType} onValueChange={setSkinType}>
            <SelectTrigger data-testid="filter-skin" className="w-full md:w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'fr' ? 'Type de peau' : 'Skin type'}</SelectItem>
              {SKIN_TYPES.map((s) => <SelectItem key={s.id} value={s.id}>{s[lang]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading ? (
        <p className="text-stone-400 py-12 text-center">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</p>
      ) : products.length === 0 ? (
        <p data-testid="no-products" className="text-stone-400 py-12 text-center">{lang === 'fr' ? 'Aucun produit trouvé.' : 'No products found.'}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((p) => <ProductCard key={p.slug} p={p} lang={lang} onOpen={(s) => nav('product', s)} />)}
        </div>
      )}
    </div>
  )
}

// ---------- Product detail ----------
const ProductDetailView = ({ slug, lang, nav, setCompareA }) => {
  const [p, setP] = useState(null)
  useEffect(() => { fetch(`/api/products/${slug}`).then((r) => r.json()).then(setP) }, [slug])
  if (!p) return <p className="text-center py-20 text-stone-400">...</p>
  if (p.error) return <p className="text-center py-20 text-stone-400">{p.error}</p>
  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => nav('products')} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 mb-5">
        <ArrowLeft className="h-4 w-4" /> {lang === 'fr' ? 'Retour aux produits' : 'Back to products'}
      </button>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative rounded-2xl overflow-hidden bg-stone-100 aspect-square">
          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
          {p.german_made && <Badge className="absolute top-3 left-3 bg-stone-900/85 text-white hover:bg-stone-900/85">🇩🇪 Made in Germany</Badge>}
        </div>
        <div>
          <button data-testid="product-brand-link" onClick={() => nav('brand', p.brand_slug)} className="text-xs uppercase tracking-wider text-emerald-800 font-semibold hover:underline">{p.brand_name}</button>
          <h1 data-testid="product-title" className="text-2xl md:text-4xl font-bold text-stone-900 mt-1" style={{ fontFamily: 'var(--font-playfair), serif' }}>{p.name}</h1>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-2xl font-bold text-stone-900">{p.price_eur?.toFixed(2)} €</span>
            <Stars rating={p.rating} />
            <Badge variant="secondary" className="bg-stone-100 text-stone-600">{label(CATEGORIES, p.category, lang)}</Badge>
          </div>
          <p className="text-stone-600 mt-4 leading-relaxed">{p.description?.[lang]}</p>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">{lang === 'fr' ? 'Préoccupations ciblées' : 'Targeted concerns'}</p>
            <div className="flex flex-wrap gap-1.5">
              {(p.concerns || []).map((c) => <Badge key={c} className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{label(CONCERNS, c, lang)}</Badge>)}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">{lang === 'fr' ? 'Types de peau' : 'Skin types'}</p>
            <div className="flex flex-wrap gap-1.5">
              {(p.skin_types || []).map((s) => <Badge key={s} variant="outline" className="border-stone-300 text-stone-600">{label(SKIN_TYPES, s, lang)}</Badge>)}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-2">{lang === 'fr' ? 'Actifs clés' : 'Key actives'}</p>
            <div className="grid gap-2">
              {(p.ingredient_details || []).map((i) => (
                <button key={i.slug} data-testid={`product-ingredient-${i.slug}`} onClick={() => nav('ingredient', i.slug)}
                  className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-emerald-700 hover:shadow-sm transition-all text-left bg-white">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-emerald-700" />
                    <div><p className="text-sm font-semibold text-stone-900">{i.name}</p><p className="text-[11px] text-stone-400 font-mono">{i.inci}</p></div>
                  </div>
                  <SafetyBadge safety={i.safety} lang={lang} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <Button data-testid="affiliate-btn" size="lg" className="bg-emerald-800 hover:bg-emerald-900 text-white flex-1" onClick={() => window.open(p.affiliate_url, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" /> {lang === 'fr' ? 'Voir le produit' : 'View product'}
            </Button>
            <Button data-testid="compare-btn" size="lg" variant="outline" className="border-stone-300 flex-1" onClick={() => { setCompareA(p.slug); nav('compare') }}>
              <GitCompare className="h-4 w-4 mr-2" /> {lang === 'fr' ? 'Comparer' : 'Compare'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Ingredients ----------
const IngredientsView = ({ lang, nav, ingredients }) => (
  <div className="container mx-auto px-4 py-8">
    <SectionTitle sub={lang === 'fr' ? 'Chaque actif évalué selon les preuves scientifiques' : 'Every active rated according to scientific evidence'}>
      {lang === 'fr' ? 'Ingrédients' : 'Ingredients'}
    </SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {ingredients.map((i) => (
        <Card key={i.slug} data-testid={`ingredient-card-${i.slug}`} onClick={() => nav('ingredient', i.slug)} className="cursor-pointer border-stone-200 hover:shadow-lg transition-all">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center"><FlaskConical className="h-4.5 w-4.5 text-emerald-700" /></div>
                <div><p className="font-bold text-stone-900">{i.name}</p><p className="text-[11px] text-stone-400 font-mono">{i.inci}</p></div>
              </div>
              <SafetyBadge safety={i.safety} lang={lang} />
            </div>
            <p className="text-sm text-stone-500 mt-3 line-clamp-2">{i.description?.[lang]}</p>
            <div className="flex gap-1.5 flex-wrap mt-3">
              <EvidenceBadge evidence={i.evidence} lang={lang} />
              {(i.good_for || []).slice(0, 2).map((c) => <Badge key={c} variant="secondary" className="bg-stone-100 text-stone-600 text-[10px]">{label(CONCERNS, c, lang)}</Badge>)}
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
  if (!i) return <p className="text-center py-20 text-stone-400">...</p>
  if (i.error) return <p className="text-center py-20 text-stone-400">{i.error}</p>
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => nav('ingredients')} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 mb-5">
        <ArrowLeft className="h-4 w-4" /> {lang === 'fr' ? 'Retour aux ingrédients' : 'Back to ingredients'}
      </button>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 data-testid="ingredient-title" className="text-3xl md:text-4xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>{i.name}</h1>
          <p className="text-stone-400 font-mono text-sm mt-1">INCI : {i.inci}</p>
        </div>
        <div className="flex gap-2"><SafetyBadge safety={i.safety} lang={lang} /><EvidenceBadge evidence={i.evidence} lang={lang} /></div>
      </div>
      <p className="text-stone-600 mt-5 leading-relaxed text-base md:text-lg">{i.description?.[lang]}</p>

      <div className="grid md:grid-cols-2 gap-4 mt-7">
        <Card className="border-stone-200">
          <CardContent className="p-5">
            <p className="font-semibold text-stone-900 mb-3 flex items-center gap-2"><Check className="h-4 w-4 text-emerald-700" />{lang === 'fr' ? 'Bénéfices' : 'Benefits'}</p>
            <ul className="space-y-2">
              {(i.benefits?.[lang] || []).map((b, idx) => (
                <li key={idx} className="text-sm text-stone-600 flex items-start gap-2"><span className="text-emerald-700 mt-0.5">•</span>{b}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-stone-200">
          <CardContent className="p-5">
            <p className="font-semibold text-stone-900 mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-700" />{lang === 'fr' ? 'Profil' : 'Profile'}</p>
            <div className="space-y-2 text-sm text-stone-600">
              <p>{lang === 'fr' ? 'Comédogénicité' : 'Comedogenicity'} : <span className="font-semibold">{i.comedogenic}/5</span></p>
              <p className="flex items-center gap-1.5 flex-wrap">{lang === 'fr' ? 'Recommandé pour' : 'Recommended for'} :
                {(i.good_for || []).map((c) => <Badge key={c} variant="secondary" className="bg-stone-100 text-stone-600 text-[10px]">{label(CONCERNS, c, lang)}</Badge>)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {(i.products || []).length > 0 && (
        <div className="mt-9">
          <SectionTitle>{lang === 'fr' ? 'Produits contenant cet actif' : 'Products with this active'}</SectionTitle>
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
        <div className="rounded-2xl bg-stone-900 text-white p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>🇩🇪 {lang === 'fr' ? 'Marques allemandes' : 'German Brands'}</h1>
          <p className="text-stone-300 mt-3 max-w-2xl">
            {lang === 'fr'
              ? "L'Allemagne est le berceau de la dermo-cosmétique moderne : pH physiologique, essais cliniques rigoureux, formules minimalistes. Découvrez les marques qui ont fait cette réputation."
              : 'Germany is the birthplace of modern dermo-cosmetics: physiological pH, rigorous clinical trials, minimalist formulas. Discover the brands that built this reputation.'}
          </p>
        </div>
      ) : (
        <SectionTitle sub={lang === 'fr' ? 'Les marques référencées sur la plateforme' : 'Brands listed on the platform'}>
          {lang === 'fr' ? 'Marques' : 'Brands'}
        </SectionTitle>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <Card key={b.slug} data-testid={`brand-card-${b.slug}`} onClick={() => nav('brand', b.slug)} className="cursor-pointer border-stone-200 hover:shadow-lg transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>{b.name}</p>
                {b.german && <span title="Made in Germany">🇩🇪</span>}
              </div>
              <p className="text-xs text-stone-400 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" />{b.city}, {b.country} · {lang === 'fr' ? 'depuis' : 'since'} {b.founded}</p>
              <p className="text-sm text-stone-500 mt-3 line-clamp-3">{b.description?.[lang]}</p>
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
  if (!b) return <p className="text-center py-20 text-stone-400">...</p>
  if (b.error) return <p className="text-center py-20 text-stone-400">{b.error}</p>
  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => nav('brands')} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 mb-5">
        <ArrowLeft className="h-4 w-4" /> {lang === 'fr' ? 'Retour aux marques' : 'Back to brands'}
      </button>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 data-testid="brand-title" className="text-3xl md:text-4xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>{b.name} {b.german && '🇩🇪'}</h1>
          <p className="text-stone-400 text-sm mt-1 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{b.city}, {b.country} · {lang === 'fr' ? 'fondée en' : 'founded in'} {b.founded}</p>
        </div>
        <Button variant="outline" className="border-stone-300" onClick={() => window.open(b.website, '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" /> {lang === 'fr' ? 'Site officiel' : 'Official website'}
        </Button>
      </div>
      <p className="text-stone-600 mt-4 leading-relaxed max-w-3xl">{b.description?.[lang]}</p>
      <div className="mt-9">
        <SectionTitle>{lang === 'fr' ? `Produits ${b.name}` : `${b.name} products`}</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {(b.products || []).map((p) => <ProductCard key={p.slug} p={p} lang={lang} onOpen={(s) => nav('product', s)} />)}
        </div>
      </div>
    </div>
  )
}

// ---------- Compare ----------
const CompareView = ({ lang, nav, products, compareA, setCompareA }) => {
  const [a, setA] = useState(compareA || '')
  const [b, setB] = useState('')
  const [result, setResult] = useState(null)
  useEffect(() => {
    if (a && b && a !== b) {
      fetch(`/api/compare?a=${a}&b=${b}`).then((r) => r.json()).then(setResult)
    } else setResult(null)
  }, [a, b])

  const rowLabel = 'text-xs uppercase tracking-wider text-stone-400 font-semibold py-3 pr-4'
  const ingName = (slug) => result?.ingredient_details?.find((i) => i.slug === slug)?.name || slug

  const ProductCol = ({ p }) => (
    <div className="text-center">
      <img src={p.image} alt={p.name} className="h-24 w-24 md:h-36 md:w-36 object-cover rounded-xl mx-auto" />
      <p className="text-[11px] uppercase tracking-wider text-stone-400 mt-2">{p.brand_name}</p>
      <button onClick={() => nav('product', p.slug)} className="font-semibold text-stone-900 text-sm hover:underline leading-snug">{p.name}</button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SectionTitle sub={lang === 'fr' ? 'Comparez deux produits côte à côte' : 'Compare two products side by side'}>
        {lang === 'fr' ? 'Comparateur' : 'Compare'}
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        <Select value={a} onValueChange={(v) => { setA(v); setCompareA(v) }}>
          <SelectTrigger data-testid="compare-select-a"><SelectValue placeholder={lang === 'fr' ? 'Produit A' : 'Product A'} /></SelectTrigger>
          <SelectContent>{products.map((p) => <SelectItem key={p.slug} value={p.slug}>{p.brand_name} — {p.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={b} onValueChange={setB}>
          <SelectTrigger data-testid="compare-select-b"><SelectValue placeholder={lang === 'fr' ? 'Produit B' : 'Product B'} /></SelectTrigger>
          <SelectContent>{products.map((p) => <SelectItem key={p.slug} value={p.slug}>{p.brand_name} — {p.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {!result && <p className="text-center text-stone-400 py-10">{lang === 'fr' ? 'Sélectionnez deux produits pour lancer la comparaison.' : 'Select two products to start comparing.'}</p>}
      {result && !result.error && (
        <Card className="border-stone-200 overflow-hidden" data-testid="compare-result">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-[80px_1fr_1fr] md:grid-cols-[140px_1fr_1fr] gap-2 items-start">
              <div></div>
              <ProductCol p={result.a} />
              <ProductCol p={result.b} />
              {[
                { l: lang === 'fr' ? 'Prix' : 'Price', va: `${result.a.price_eur?.toFixed(2)} €`, vb: `${result.b.price_eur?.toFixed(2)} €` },
                { l: lang === 'fr' ? 'Note' : 'Rating', va: `★ ${result.a.rating}`, vb: `★ ${result.b.rating}` },
                { l: lang === 'fr' ? 'Catégorie' : 'Category', va: label(CATEGORIES, result.a.category, lang), vb: label(CATEGORIES, result.b.category, lang) },
                { l: lang === 'fr' ? 'Origine' : 'Origin', va: result.a.german_made ? '🇩🇪 Allemagne' : '—', vb: result.b.german_made ? '🇩🇪 Allemagne' : '—' },
              ].map((row, idx) => (
                <>
                  <div key={`l${idx}`} className={rowLabel}>{row.l}</div>
                  <div key={`a${idx}`} className="py-3 text-center text-sm font-semibold text-stone-800 border-t border-stone-100">{row.va}</div>
                  <div key={`b${idx}`} className="py-3 text-center text-sm font-semibold text-stone-800 border-t border-stone-100">{row.vb}</div>
                </>
              ))}
              <div className={rowLabel}>{lang === 'fr' ? 'Préoccupations' : 'Concerns'}</div>
              {[result.a, result.b].map((p, idx) => (
                <div key={idx} className="py-3 flex flex-wrap gap-1 justify-center border-t border-stone-100">
                  {(p.concerns || []).map((c) => <Badge key={c} variant="secondary" className="bg-stone-100 text-stone-600 text-[10px]">{label(CONCERNS, c, lang)}</Badge>)}
                </div>
              ))}
              <div className={rowLabel}>{lang === 'fr' ? 'Actifs' : 'Actives'}</div>
              {[result.a, result.b].map((p, idx) => (
                <div key={idx} className="py-3 flex flex-wrap gap-1 justify-center border-t border-stone-100">
                  {(p.ingredients || []).map((ing) => (
                    <Badge key={ing} className={result.common_ingredients.includes(ing)
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px]'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-100 text-[10px]'}>
                      {ingName(ing)}
                    </Badge>
                  ))}
                </div>
              ))}
            </div>
            {result.common_ingredients.length > 0 && (
              <p className="text-xs text-stone-500 mt-4 text-center">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-200 mr-1.5"></span>
                {lang === 'fr' ? 'Actifs communs aux deux produits' : 'Actives shared by both products'}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ---------- Product Finder ----------
const FinderView = ({ lang, nav }) => {
  const [step, setStep] = useState(0)
  const [skinType, setSkinType] = useState(null)
  const [concerns, setConcerns] = useState([])
  const [budget, setBudget] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleConcern = (id) => setConcerns((cur) => cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id])

  const submit = async (chosenBudget) => {
    setLoading(true)
    setStep(3)
    const res = await fetch('/api/finder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skin_type: skinType, concerns, budget: chosenBudget }),
    })
    const data = await res.json()
    setResults(data.results || [])
    setLoading(false)
  }

  const reset = () => { setStep(0); setSkinType(null); setConcerns([]); setBudget(null); setResults(null) }
  const progress = ((step + 1) / 4) * 100

  const OptionBtn = ({ active, onClick, children, testid }) => (
    <button data-testid={testid} onClick={onClick}
      className={`w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all font-medium text-sm md:text-base flex items-center justify-between ${active ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'}`}>
      {children}
      {active && <Check className="h-5 w-5 text-emerald-700" />}
    </button>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-6">
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mb-3"><Sparkles className="h-3 w-3 mr-1" /> Product Finder</Badge>
        <h1 className="text-2xl md:text-4xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>
          {lang === 'fr' ? 'Trouvez vos produits idéaux' : 'Find your ideal products'}
        </h1>
        <p className="text-stone-500 mt-2 text-sm md:text-base">{lang === 'fr' ? '3 questions, 30 secondes, des recommandations personnalisées.' : '3 questions, 30 seconds, personalized recommendations.'}</p>
      </div>
      <div className="h-1.5 bg-stone-100 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-emerald-700 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      {step === 0 && (
        <div>
          <p className="font-semibold text-stone-900 mb-4 text-lg">{lang === 'fr' ? '1. Quel est votre type de peau ?' : '1. What is your skin type?'}</p>
          <div className="grid gap-2.5">
            {SKIN_TYPES.map((s) => (
              <OptionBtn key={s.id} testid={`finder-skin-${s.id}`} active={skinType === s.id} onClick={() => { setSkinType(s.id); setTimeout(() => setStep(1), 250) }}>
                {s[lang]}
              </OptionBtn>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="font-semibold text-stone-900 mb-1 text-lg">{lang === 'fr' ? '2. Quelles sont vos préoccupations ?' : '2. What are your concerns?'}</p>
          <p className="text-sm text-stone-400 mb-4">{lang === 'fr' ? 'Plusieurs choix possibles' : 'Multiple choices allowed'}</p>
          <div className="grid gap-2.5">
            {CONCERNS.map((c) => (
              <OptionBtn key={c.id} testid={`finder-concern-${c.id}`} active={concerns.includes(c.id)} onClick={() => toggleConcern(c.id)}>
                {c[lang]}
              </OptionBtn>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="border-stone-300" onClick={() => setStep(0)}><ArrowLeft className="h-4 w-4 mr-1" />{lang === 'fr' ? 'Retour' : 'Back'}</Button>
            <Button data-testid="finder-next-btn" className="bg-emerald-800 hover:bg-emerald-900 text-white flex-1" disabled={concerns.length === 0} onClick={() => setStep(2)}>
              {lang === 'fr' ? 'Continuer' : 'Continue'} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="font-semibold text-stone-900 mb-4 text-lg">{lang === 'fr' ? '3. Quel est votre budget par produit ?' : '3. What is your budget per product?'}</p>
          <div className="grid gap-2.5">
            {[
              { id: 'low', fr: 'Économique — moins de 15 €', en: 'Budget — under €15' },
              { id: 'mid', fr: 'Modéré — jusqu’à 25 €', en: 'Moderate — up to €25' },
              { id: 'high', fr: 'Premium — peu importe le prix', en: 'Premium — price no object' },
            ].map((b) => (
              <OptionBtn key={b.id} testid={`finder-budget-${b.id}`} active={budget === b.id} onClick={() => { setBudget(b.id); submit(b.id) }}>
                {b[lang]}
              </OptionBtn>
            ))}
          </div>
          <Button variant="outline" className="border-stone-300 mt-6" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-1" />{lang === 'fr' ? 'Retour' : 'Back'}</Button>
        </div>
      )}

      {step === 3 && (
        <div>
          {loading ? (
            <p className="text-center text-stone-400 py-14">{lang === 'fr' ? 'Analyse de votre profil...' : 'Analyzing your profile...'}</p>
          ) : (
            <div>
              <p className="font-semibold text-stone-900 mb-4 text-lg" data-testid="finder-results-title">
                {lang === 'fr' ? `${results?.length || 0} produits recommandés pour vous` : `${results?.length || 0} products recommended for you`}
              </p>
              <div className="grid gap-3">
                {(results || []).map((p, idx) => (
                  <Card key={p.slug} data-testid={`finder-result-${p.slug}`} className="border-stone-200 hover:shadow-md transition-all cursor-pointer" onClick={() => nav('product', p.slug)}>
                    <CardContent className="p-3 md:p-4 flex gap-3 md:gap-4 items-center">
                      <span className="text-lg font-bold text-stone-300 w-6">{idx + 1}</span>
                      <img src={p.image} alt={p.name} className="h-16 w-16 md:h-20 md:w-20 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] uppercase tracking-wider text-stone-400">{p.brand_name}</p>
                        <p className="font-semibold text-stone-900 text-sm md:text-base leading-snug truncate">{p.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-bold">{p.price_eur?.toFixed(2)} €</span>
                          <Stars rating={p.rating} />
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1.5 bg-stone-100 rounded-full flex-1 overflow-hidden max-w-[140px]">
                            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${p.match_percent}%` }}></div>
                          </div>
                          <span className="text-xs font-semibold text-emerald-700">{p.match_percent}% match</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button data-testid="finder-restart" variant="outline" className="border-stone-300 mt-6 w-full" onClick={reset}>
                {lang === 'fr' ? 'Recommencer le quiz' : 'Restart the quiz'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------- Learn / Articles ----------
const LearnView = ({ lang, nav, articles }) => {
  const [cat, setCat] = useState('all')
  const filtered = cat === 'all' ? articles : articles.filter((a) => a.category === cat)
  const cats = [
    { id: 'all', fr: 'Tous', en: 'All' },
    { id: 'learn', fr: 'Learn', en: 'Learn' },
    { id: 'guide', fr: 'Guides', en: 'Guides' },
    { id: 'research', fr: 'Research', en: 'Research' },
  ]
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle sub={lang === 'fr' ? 'Guides, décryptages et synthèses scientifiques' : 'Guides, deep-dives and scientific reviews'}>
        {lang === 'fr' ? 'Learn & Guides' : 'Learn & Guides'}
      </SectionTitle>
      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map((c) => (
          <button key={c.id} data-testid={`learn-filter-${c.id}`} onClick={() => setCat(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${cat === c.id ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}>
            {c[lang]}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <Card key={a.slug} data-testid={`article-card-${a.slug}`} onClick={() => nav('article', a.slug)} className="cursor-pointer overflow-hidden border-stone-200 hover:shadow-lg transition-all group">
            <div className="aspect-[16/9] overflow-hidden bg-stone-100">
              <img src={a.image} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-stone-100 text-stone-600 text-[10px] uppercase">{a.category}</Badge>
                <span className="text-[11px] text-stone-400">{a.published_at}</span>
              </div>
              <h3 className="font-semibold text-stone-900 leading-snug">{a.title?.[lang]}</h3>
              <p className="text-sm text-stone-500 mt-1.5 line-clamp-2">{a.excerpt?.[lang]}</p>
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
  if (!a) return <p className="text-center py-20 text-stone-400">...</p>
  if (a.error) return <p className="text-center py-20 text-stone-400">{a.error}</p>
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button onClick={() => nav('learn')} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 mb-5">
        <ArrowLeft className="h-4 w-4" /> {lang === 'fr' ? 'Retour aux guides' : 'Back to guides'}
      </button>
      <Badge variant="secondary" className="bg-stone-100 text-stone-600 text-[10px] uppercase mb-3">{a.category}</Badge>
      <h1 data-testid="article-title" className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight" style={{ fontFamily: 'var(--font-playfair), serif' }}>{a.title?.[lang]}</h1>
      <p className="text-stone-400 text-sm mt-2">{a.published_at}</p>
      <img src={a.image} alt="" className="rounded-2xl w-full aspect-[16/8] object-cover mt-6" />
      <div className="mt-7 space-y-5">
        {(a.content?.[lang] || '').split('\n\n').map((para, idx) => (
          <p key={idx} className="text-stone-700 leading-relaxed text-base md:text-lg">{para}</p>
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
    else setError(lang === 'fr' ? 'Veuillez remplir les champs requis.' : 'Please fill in the required fields.')
  }
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mb-3"><Building2 className="h-3 w-3 mr-1" />{lang === 'fr' ? 'Espace marques' : 'Brand space'}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>
            {lang === 'fr' ? 'Référencez vos produits sur Dermalyze' : 'List your products on Dermalyze'}
          </h1>
          <p className="text-stone-600 mt-4 leading-relaxed">
            {lang === 'fr'
              ? 'Rejoignez la plateforme de référence de la skincare transparente. Nos analyses indépendantes mettent en valeur les formules honnêtes et efficaces.'
              : 'Join the reference platform for transparent skincare. Our independent analyses highlight honest and effective formulas.'}
          </p>
          <ul className="mt-5 space-y-3">
            {(lang === 'fr'
              ? ['Visibilité auprès d’une audience qualifiée', 'Analyses ingrédients basées sur la science', 'Liens d’achat et suivi des performances', 'Présence bilingue FR / EN']
              : ['Visibility with a qualified audience', 'Science-based ingredient analyses', 'Purchase links and performance tracking', 'Bilingual FR / EN presence']
            ).map((t, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-stone-700"><Check className="h-4 w-4 text-emerald-700 mt-0.5" />{t}</li>
            ))}
          </ul>
        </div>
        <Card className="border-stone-200">
          <CardContent className="p-6">
            {sent ? (
              <div className="text-center py-10" data-testid="lead-success">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Check className="h-6 w-6 text-emerald-700" /></div>
                <p className="font-semibold text-stone-900">{lang === 'fr' ? 'Message envoyé !' : 'Message sent!'}</p>
                <p className="text-sm text-stone-500 mt-1">{lang === 'fr' ? 'Notre équipe vous recontactera sous 48h.' : 'Our team will get back to you within 48h.'}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label className="text-stone-700">{lang === 'fr' ? 'Nom de la marque *' : 'Brand name *'}</Label>
                  <Input data-testid="lead-brand-name" required value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label className="text-stone-700">{lang === 'fr' ? 'Votre nom' : 'Your name'}</Label>
                  <Input data-testid="lead-contact-name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label className="text-stone-700">Email *</Label>
                  <Input data-testid="lead-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label className="text-stone-700">Message</Label>
                  <Textarea data-testid="lead-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1" rows={4} />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button data-testid="lead-submit" type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white">
                  <Mail className="h-4 w-4 mr-2" /> {lang === 'fr' ? 'Envoyer la demande' : 'Send request'}
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
    { path: 'category', label: 'Catégorie (cleanser/serum/moisturizer/sunscreen)', type: 'text' },
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
  ],
  brands: [
    { path: 'name', label: 'Nom', type: 'text' },
    { path: 'slug', label: 'Slug', type: 'text' },
    { path: 'country', label: 'Pays', type: 'text' },
    { path: 'city', label: 'Ville', type: 'text' },
    { path: 'founded', label: 'Année de création', type: 'number' },
    { path: 'german', label: 'Marque allemande', type: 'bool' },
    { path: 'website', label: 'Site web', type: 'text' },
    { path: 'description.fr', label: 'Description FR', type: 'textarea' },
    { path: 'description.en', label: 'Description EN', type: 'textarea' },
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
    { path: 'benefits.fr', label: 'Bénéfices FR (csv)', type: 'csv' },
    { path: 'benefits.en', label: 'Bénéfices EN (csv)', type: 'csv' },
  ],
  articles: [
    { path: 'slug', label: 'Slug', type: 'text' },
    { path: 'category', label: 'Catégorie (learn/guide/research)', type: 'text' },
    { path: 'image', label: 'Image URL', type: 'text' },
    { path: 'published_at', label: 'Date (YYYY-MM-DD)', type: 'text' },
    { path: 'title.fr', label: 'Titre FR', type: 'text' },
    { path: 'title.en', label: 'Titre EN', type: 'text' },
    { path: 'excerpt.fr', label: 'Extrait FR', type: 'textarea' },
    { path: 'excerpt.en', label: 'Extrait EN', type: 'textarea' },
    { path: 'content.fr', label: 'Contenu FR', type: 'textarea' },
    { path: 'content.en', label: 'Contenu EN', type: 'textarea' },
  ],
}

const AdminCrud = ({ entity, token, lang }) => {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const fields = ADMIN_FIELDS[entity]

  const load = useCallback(async () => {
    const res = await fetch(`/api/${entity}`)
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
    if (!confirm(lang === 'fr' ? 'Supprimer cet élément ?' : 'Delete this item?')) return
    await fetch(`/api/admin/${entity}/${item.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  const displayName = (item) => item.name || item.title?.fr || item.slug

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-stone-500">{items.length} {lang === 'fr' ? 'éléments' : 'items'}</p>
        <Button data-testid={`admin-add-${entity}`} size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white" onClick={startNew}>
          <Plus className="h-4 w-4 mr-1" /> {lang === 'fr' ? 'Ajouter' : 'Add'}
        </Button>
      </div>
      <div className="border border-stone-200 rounded-lg overflow-hidden divide-y divide-stone-100">
        {items.map((item) => (
          <div key={item.id || item.slug} data-testid={`admin-row-${item.slug}`} className="flex items-center justify-between px-4 py-2.5 bg-white hover:bg-stone-50">
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">{displayName(item)}</p>
              <p className="text-xs text-stone-400 font-mono">{item.slug}</p>
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
            <DialogTitle>{editing?.id ? (lang === 'fr' ? 'Modifier' : 'Edit') : (lang === 'fr' ? 'Ajouter' : 'Add')} — {entity}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              {fields.map((f) => {
                const raw = getPath(editing, f.path)
                const value = f.type === 'csv' ? (Array.isArray(raw) ? raw.join(', ') : raw || '') : raw ?? ''
                const onChange = (v) => {
                  let parsed = v
                  if (f.type === 'number') parsed = v === '' ? '' : parseFloat(v)
                  if (f.type === 'csv') parsed = v.split(',').map((s) => s.trim()).filter(Boolean)
                  setEditing((cur) => setPath(cur, f.path, parsed))
                }
                return (
                  <div key={f.path}>
                    <Label className="text-xs text-stone-600">{f.label}</Label>
                    {f.type === 'textarea' ? (
                      <Textarea data-testid={`admin-field-${f.path}`} value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1" />
                    ) : f.type === 'bool' ? (
                      <div className="mt-1">
                        <button type="button" data-testid={`admin-field-${f.path}`} onClick={() => setEditing((cur) => setPath(cur, f.path, !getPath(cur, f.path)))}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${getPath(editing, f.path) ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-stone-50 border-stone-200 text-stone-500'}`}>
                          {getPath(editing, f.path) ? 'Oui / Yes' : 'Non / No'}
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
              <Button data-testid="admin-save-btn" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white" disabled={saving} onClick={save}>
                {saving ? '...' : (lang === 'fr' ? 'Enregistrer' : 'Save')}
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

  useEffect(() => { setToken(localStorage.getItem('admin_token')) }, [])
  useEffect(() => {
    if (!token) return
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).then((r) => {
      if (r.status === 401) { localStorage.removeItem('admin_token'); setToken(null); return null }
      return r.json()
    }).then((d) => d && setStats(d))
    fetch('/api/admin/leads', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setLeads(d.leads || []))
  }, [token])

  const login = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    const data = await res.json()
    if (res.ok) { localStorage.setItem('admin_token', data.token); setToken(data.token) }
    else setError(lang === 'fr' ? 'Mot de passe incorrect' : 'Invalid password')
  }

  const logout = () => { localStorage.removeItem('admin_token'); setToken(null) }

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-sm">
        <Card className="border-stone-200">
          <CardContent className="p-6">
            <h1 className="text-xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'var(--font-playfair), serif' }}>Back-office</h1>
            <p className="text-sm text-stone-500 mb-5">{lang === 'fr' ? 'Accès réservé à l’administration' : 'Admin access only'}</p>
            <form onSubmit={login} className="space-y-3">
              <Input data-testid="admin-password" type="password" placeholder={lang === 'fr' ? 'Mot de passe' : 'Password'} value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && <p className="text-sm text-red-600" data-testid="admin-login-error">{error}</p>}
              <Button data-testid="admin-login-btn" type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-white">{lang === 'fr' ? 'Connexion' : 'Log in'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>Back-office</h1>
        <Button data-testid="admin-logout" variant="outline" size="sm" className="border-stone-300" onClick={logout}>
          <LogOut className="h-3.5 w-3.5 mr-1.5" /> {lang === 'fr' ? 'Déconnexion' : 'Log out'}
        </Button>
      </div>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-7">
          {[
            { k: 'products', fr: 'Produits', en: 'Products' },
            { k: 'brands', fr: 'Marques', en: 'Brands' },
            { k: 'ingredients', fr: 'Ingrédients', en: 'Ingredients' },
            { k: 'articles', fr: 'Articles', en: 'Articles' },
            { k: 'leads', fr: 'Leads', en: 'Leads' },
          ].map((s) => (
            <Card key={s.k} className="border-stone-200"><CardContent className="p-4">
              <p className="text-2xl font-bold text-stone-900" data-testid={`stat-${s.k}`}>{stats[s.k]}</p>
              <p className="text-xs text-stone-500">{s[lang]}</p>
            </CardContent></Card>
          ))}
        </div>
      )}
      <Tabs defaultValue="products">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger data-testid="admin-tab-products" value="products">{lang === 'fr' ? 'Produits' : 'Products'}</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-brands" value="brands">{lang === 'fr' ? 'Marques' : 'Brands'}</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-ingredients" value="ingredients">{lang === 'fr' ? 'Ingrédients' : 'Ingredients'}</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-articles" value="articles">Articles</TabsTrigger>
          <TabsTrigger data-testid="admin-tab-leads" value="leads">Leads</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-4"><AdminCrud entity="products" token={token} lang={lang} /></TabsContent>
        <TabsContent value="brands" className="mt-4"><AdminCrud entity="brands" token={token} lang={lang} /></TabsContent>
        <TabsContent value="ingredients" className="mt-4"><AdminCrud entity="ingredients" token={token} lang={lang} /></TabsContent>
        <TabsContent value="articles" className="mt-4"><AdminCrud entity="articles" token={token} lang={lang} /></TabsContent>
        <TabsContent value="leads" className="mt-4">
          <div className="border border-stone-200 rounded-lg overflow-hidden divide-y divide-stone-100">
            {leads.length === 0 && <p className="p-4 text-sm text-stone-400">{lang === 'fr' ? 'Aucun lead pour le moment.' : 'No leads yet.'}</p>}
            {leads.map((l) => (
              <div key={l.id} className="px-4 py-3 bg-white" data-testid={`lead-row-${l.id}`}>
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-stone-900">{l.brand_name} <span className="font-normal text-stone-400">— {l.contact_name}</span></p>
                  <span className="text-[11px] text-stone-400">{(l.created_at || '').slice(0, 10)}</span>
                </div>
                <p className="text-xs text-emerald-800">{l.email}</p>
                {l.message && <p className="text-sm text-stone-600 mt-1">{l.message}</p>}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ---------- Footer ----------
const Footer = ({ lang, nav }) => (
  <footer className="bg-stone-900 text-stone-400 mt-10">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-full bg-emerald-700 flex items-center justify-center"><Droplets className="h-3.5 w-3.5 text-white" /></div>
            <span className="font-bold text-white" style={{ fontFamily: 'var(--font-playfair), serif' }}>Dermalyze</span>
          </div>
          <p className="text-xs leading-relaxed">{lang === 'fr' ? 'La skincare décryptée par la science. Indépendant, transparent, bilingue.' : 'Skincare decoded by science. Independent, transparent, bilingual.'}</p>
        </div>
        <div>
          <p className="text-white text-sm font-semibold mb-3">{lang === 'fr' ? 'Explorer' : 'Explore'}</p>
          {[['products', lang === 'fr' ? 'Produits' : 'Products'], ['ingredients', lang === 'fr' ? 'Ingrédients' : 'Ingredients'], ['brands', lang === 'fr' ? 'Marques' : 'Brands'], ['german-brands', lang === 'fr' ? 'Marques allemandes' : 'German Brands']].map(([v, l]) => (
            <button key={v} onClick={() => nav(v)} className="block text-xs py-1 hover:text-white">{l}</button>
          ))}
        </div>
        <div>
          <p className="text-white text-sm font-semibold mb-3">{lang === 'fr' ? 'Outils' : 'Tools'}</p>
          {[['finder', 'Product Finder'], ['compare', lang === 'fr' ? 'Comparateur' : 'Compare'], ['learn', 'Learn & Guides']].map(([v, l]) => (
            <button key={v} onClick={() => nav(v)} className="block text-xs py-1 hover:text-white">{l}</button>
          ))}
        </div>
        <div>
          <p className="text-white text-sm font-semibold mb-3">{lang === 'fr' ? 'Professionnels' : 'Professionals'}</p>
          <button onClick={() => nav('for-brands')} className="block text-xs py-1 hover:text-white">{lang === 'fr' ? 'Pour les marques' : 'For Brands'}</button>
          <button data-testid="footer-admin-link" onClick={() => nav('admin')} className="block text-xs py-1 hover:text-white">Back-office</button>
        </div>
      </div>
      <p className="text-[11px] text-stone-600 mt-8 pt-6 border-t border-stone-800">© 2025 Dermalyze — {lang === 'fr' ? 'Les informations fournies ne remplacent pas un avis médical.' : 'Information provided does not replace medical advice.'}</p>
    </div>
  </footer>
)

// ---------- App ----------
function App() {
  const [lang, setLangState] = useState('fr')
  const [route, setRoute] = useState({ view: 'home', param: null, extra: null })
  const [products, setProducts] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [brands, setBrands] = useState([])
  const [articles, setArticles] = useState([])
  const [compareA, setCompareA] = useState('')

  const setLang = (l) => { setLangState(l); try { localStorage.setItem('lang', l) } catch {} }

  useEffect(() => {
    try { const saved = localStorage.getItem('lang'); if (saved) setLangState(saved) } catch {}
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
  }, [])

  const nav = useCallback((view, param = null, extra = null) => {
    setRoute({ view, param, extra })
    const hash = `#/${view}${param ? `/${encodeURIComponent(param)}` : ''}`
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
    window.scrollTo({ top: 0 })
  }, [])

  const v = route.view
  return (
    <div className="min-h-screen bg-white text-stone-900">
      <Header lang={lang} setLang={setLang} nav={nav} route={route} />
      <main>
        {v === 'home' && <HomeView lang={lang} nav={nav} products={products} ingredients={ingredients} brands={brands} articles={articles} />}
        {v === 'products' && <ProductsView lang={lang} nav={nav} initialFilters={route.extra} />}
        {v === 'product' && <ProductDetailView slug={route.param} lang={lang} nav={nav} setCompareA={setCompareA} />}
        {v === 'ingredients' && <IngredientsView lang={lang} nav={nav} ingredients={ingredients} />}
        {v === 'ingredient' && <IngredientDetailView slug={route.param} lang={lang} nav={nav} />}
        {v === 'brands' && <BrandsView lang={lang} nav={nav} germanOnly={false} />}
        {v === 'german-brands' && <BrandsView lang={lang} nav={nav} germanOnly={true} />}
        {v === 'brand' && <BrandDetailView slug={route.param} lang={lang} nav={nav} />}
        {v === 'compare' && <CompareView lang={lang} nav={nav} products={products} compareA={compareA} setCompareA={setCompareA} />}
        {v === 'finder' && <FinderView lang={lang} nav={nav} />}
        {v === 'learn' && <LearnView lang={lang} nav={nav} articles={articles} />}
        {v === 'article' && <ArticleDetailView slug={route.param} lang={lang} nav={nav} />}
        {v === 'for-brands' && <ForBrandsView lang={lang} />}
        {v === 'admin' && <AdminView lang={lang} />}
      </main>
      <Footer lang={lang} nav={nav} />
    </div>
  )
}

export default App;
