'use client'
// =============================================================================
// Communauté : Avis clients, Questions/Réponses & Forum + modération admin
// Composants autonomes (Tailwind + thème dz-) réutilisés dans page.js.
// =============================================================================
import { useEffect, useState, useCallback } from 'react'
import {
  Star, ThumbsUp, BadgeCheck, MessageCircle, MessagesSquare, Plus, ArrowLeft,
  Pin, Check, X, Trash2, Loader2, ShieldCheck, CornerDownRight, Send, Users,
} from 'lucide-react'
import { t, ts, pick } from '@/lib/i18n'

// ---- petits atomes -------------------------------------------------------
const inputCls =
  'w-full rounded-dz-brand border border-dz-rule bg-dz-surface px-3 py-2 text-[14px] text-dz-ink outline-none transition-colors placeholder:text-dz-text-4 focus:border-dz-accent'
const btnInk =
  'inline-flex items-center justify-center gap-1.5 rounded-dz-pill bg-dz-ink px-4 py-2 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-dz-accent disabled:opacity-50'
const btnGhost =
  'inline-flex items-center justify-center gap-1.5 rounded-dz-pill border border-dz-rule bg-dz-surface px-3.5 py-2 text-[13px] font-medium text-dz-nav transition-colors duration-200 hover:border-dz-accent/40 hover:text-dz-accent'

const fmtDate = (iso, lang) => {
  if (!iso) return ''
  try {
    const loc = lang === 'ar' ? 'ar' : lang === 'en' ? 'en-GB' : 'fr-FR'
    return new Date(iso).toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return String(iso).slice(0, 10) }
}

const Stars = ({ value = 0, size = 14 }) => (
  <span className="inline-flex items-center gap-0.5" dir="ltr">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} style={{ width: size, height: size }}
        className={i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-dz-surface-2 text-dz-rule'} />
    ))}
  </span>
)

const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0)
  return (
    <span className="inline-flex items-center gap-1" dir="ltr" data-testid="star-picker">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" data-testid={`star-${i}`}
          onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => onChange(i)}
          className="p-0.5">
          <Star className={`h-6 w-6 transition-colors ${i <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'fill-dz-surface-2 text-dz-rule'}`} />
        </button>
      ))}
    </span>
  )
}

const StaffBadge = ({ lang }) => (
  <span className="inline-flex items-center gap-1 rounded-dz-pill bg-dz-accent-bg px-2 py-0.5 text-[10.5px] font-semibold text-dz-accent">
    <ShieldCheck className="h-3 w-3" /> {t(lang, 'Équipe Dermalyze', 'Dermalyze Team')}
  </span>
)

const SectionHead = ({ icon: Icon, title, right }) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <h2 className="flex items-center gap-2 font-display text-2xl font-normal tracking-[-0.02em] text-dz-ink">
      {Icon && <Icon className="h-5 w-5 text-dz-accent" />} {title}
    </h2>
    {right}
  </div>
)

// remember display name across the session for a smoother repeat experience
const useName = () => {
  const [name, setName] = useState('')
  useEffect(() => { try { setName(localStorage.getItem('dz_community_name') || '') } catch { /* ignore */ } }, [])
  const save = (n) => { setName(n); try { localStorage.setItem('dz_community_name', n) } catch { /* ignore */ } }
  return [name, save]
}

// =============================================================================
// AVIS CLIENTS
// =============================================================================
export const ReviewsSection = ({ lang, targetType, targetSlug, targetName }) => {
  const [data, setData] = useState(null)
  const [sort, setSort] = useState('recent')
  const [showForm, setShowForm] = useState(false)
  const [done, setDone] = useState(false)
  const [name, setName] = useName()
  const [form, setForm] = useState({ rating: 0, title: '', body: '', email: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    fetch(`/api/reviews?target_type=${targetType}&target_slug=${encodeURIComponent(targetSlug)}&sort=${sort}`)
      .then((r) => r.json()).then(setData).catch(() => setData({ reviews: [], summary: { average: 0, count: 0, distribution: {} } }))
  }, [targetType, targetSlug, sort])
  useEffect(() => { load() }, [load])

  const summary = data?.summary || { average: 0, count: 0, distribution: {} }
  const reviews = data?.reviews || []

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (form.rating < 1) return setErr(ts(lang, 'Choisissez une note.', 'Please pick a rating.'))
    if (name.trim().length < 2) return setErr(ts(lang, 'Indiquez votre nom.', 'Please enter your name.'))
    if (form.body.trim().length < 5) return setErr(ts(lang, 'Votre avis est trop court.', 'Your review is too short.'))
    setBusy(true)
    const res = await fetch('/api/reviews', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_type: targetType, target_slug: targetSlug, author_name: name, rating: form.rating, title: form.title, body: form.body, email: form.email, lang }),
    })
    setBusy(false)
    if (res.ok) { setDone(true); setShowForm(false); setForm({ rating: 0, title: '', body: '', email: '' }) }
    else setErr(ts(lang, 'Une erreur est survenue.', 'Something went wrong.'))
  }

  const vote = async (id) => {
    await fetch(`/api/reviews/${id}/helpful`, { method: 'POST' })
    setData((d) => ({ ...d, reviews: d.reviews.map((r) => r.id === id ? { ...r, helpful: (r.helpful || 0) + 1 } : r) }))
  }

  return (
    <section className="mt-12 border-t border-dz-rule pt-10" data-testid="reviews-section" id="reviews">
      <SectionHead icon={Star} title={t(lang, 'Avis des clients', 'Customer reviews')}
        right={<button data-testid="write-review-btn" className={btnInk} onClick={() => { setShowForm((s) => !s); setDone(false) }}>
          <Plus className="h-4 w-4" /> {t(lang, 'Écrire un avis', 'Write a review')}
        </button>} />

      {summary.count > 0 ? (
        <div className="grid gap-6 rounded-dz-card border border-dz-rule bg-dz-surface p-5 sm:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center justify-center border-dz-rule text-center sm:border-r sm:pr-6">
            <div className="font-display text-5xl text-dz-ink" dir="ltr" data-testid="reviews-average">{summary.average.toFixed(1)}</div>
            <div className="mt-1"><Stars value={summary.average} size={18} /></div>
            <p className="mt-1.5 text-[13px] text-dz-text-2">
              {t(lang, 'Basé sur', 'Based on')} <span dir="ltr">{summary.count}</span> {t(lang, 'avis', 'reviews')}
            </p>
            <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-dz-accent">
              <BadgeCheck className="h-3.5 w-3.5" /> {t(lang, 'Vérifiés par Dermalyze', 'Verified by Dermalyze')}
            </p>
          </div>
          <div className="flex flex-col justify-center gap-1.5">
            {[5, 4, 3, 2, 1].map((n) => {
              const c = summary.distribution?.[n] || 0
              const pct = summary.count ? Math.round((c / summary.count) * 100) : 0
              return (
                <div key={n} className="flex items-center gap-2 text-[12px] text-dz-text-2" dir="ltr">
                  <span className="w-3 text-right">{n}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <div className="h-2 flex-1 overflow-hidden rounded-dz-pill bg-dz-surface-2">
                    <div className="h-full rounded-dz-pill bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right tabular-nums">{c}</span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="rounded-dz-card border border-dashed border-dz-rule bg-dz-surface p-6 text-center text-[14px] text-dz-text-3" data-testid="reviews-empty">
          {t(lang, 'Aucun avis pour le moment. Soyez le premier à donner votre avis !', 'No reviews yet. Be the first to share yours!')}
        </p>
      )}

      {done && (
        <div className="mt-4 rounded-dz-brand border border-dz-accent/30 bg-dz-accent-bg px-4 py-3 text-[13.5px] text-dz-accent" data-testid="review-thanks">
          {t(lang, 'Merci ! Votre avis sera publié après validation par notre équipe.', 'Thank you! Your review will be published after our team reviews it.')}
        </div>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-5 space-y-3 rounded-dz-card border border-dz-rule bg-dz-surface p-5" data-testid="review-form">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-dz-ink">{t(lang, 'Votre note', 'Your rating')}</label>
            <StarPicker value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input data-testid="review-name" className={inputCls} placeholder={ts(lang, 'Votre nom', 'Your name')} value={name} onChange={(e) => setName(e.target.value)} />
            <input data-testid="review-email" className={inputCls} placeholder={ts(lang, 'Email (optionnel, non publié)', 'Email (optional, not published)')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <input data-testid="review-title" className={inputCls} placeholder={ts(lang, 'Titre (optionnel)', 'Title (optional)')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea data-testid="review-body" rows={4} className={inputCls} placeholder={ts(lang, 'Partagez votre expérience avec ce produit…', 'Share your experience with this product…')} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          {err && <p className="text-[13px] text-red-600" data-testid="review-error">{err}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className={btnInk} data-testid="review-submit">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {t(lang, 'Publier mon avis', 'Post my review')}
            </button>
            <button type="button" className={btnGhost} onClick={() => setShowForm(false)}>{t(lang, 'Annuler', 'Cancel')}</button>
          </div>
        </form>
      )}

      {reviews.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-[12px] text-dz-text-3">
            <span>{t(lang, 'Trier par', 'Sort by')} :</span>
            {[['recent', t(lang, 'Plus récents', 'Most recent')], ['helpful', t(lang, 'Plus utiles', 'Most helpful')], ['rating', t(lang, 'Mieux notés', 'Highest rated')]].map(([v, l]) => (
              <button key={v} onClick={() => setSort(v)} className={`rounded-dz-pill px-2.5 py-1 transition-colors ${sort === v ? 'bg-dz-ink text-white' : 'bg-dz-surface-2 hover:text-dz-ink'}`}>{l}</button>
            ))}
          </div>
          <div className="space-y-4">
            {reviews.map((r) => (
              <article key={r.id} className="rounded-dz-card border border-dz-rule bg-dz-surface p-4" data-testid={`review-${r.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-dz-ink">{r.author_name}</span>
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 rounded-dz-pill bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-medium text-emerald-700">
                          <BadgeCheck className="h-3 w-3" /> {t(lang, 'Achat vérifié', 'Verified purchase')}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2"><Stars value={r.rating} /><span className="text-[11px] text-dz-text-4">{fmtDate(r.created_at, lang)}</span></div>
                  </div>
                </div>
                {r.title && <p className="mt-2 text-[14px] font-semibold text-dz-ink">{r.title}</p>}
                <p className="mt-1 text-[14px] leading-relaxed text-dz-text-2">{r.body}</p>
                <button onClick={() => vote(r.id)} className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-dz-text-3 transition-colors hover:text-dz-accent" data-testid={`review-helpful-${r.id}`}>
                  <ThumbsUp className="h-3.5 w-3.5" /> {t(lang, 'Utile', 'Helpful')} {r.helpful ? `(${r.helpful})` : ''}
                </button>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

// =============================================================================
// QUESTIONS / RÉPONSES (par produit)
// =============================================================================
export const QASection = ({ lang, productSlug }) => {
  const [questions, setQuestions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useName()
  const [body, setBody] = useState('')
  const [done, setDone] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    fetch(`/api/questions?product_slug=${encodeURIComponent(productSlug)}`).then((r) => r.json()).then((d) => setQuestions(d.questions || [])).catch(() => setQuestions([]))
  }, [productSlug])
  useEffect(() => { load() }, [load])

  const ask = async (e) => {
    e.preventDefault()
    if (name.trim().length < 2 || body.trim().length < 5) return
    setBusy(true)
    const res = await fetch('/api/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_slug: productSlug, author_name: name, body, lang }) })
    setBusy(false)
    if (res.ok) { setDone('q'); setShowForm(false); setBody('') }
  }

  return (
    <section className="mt-12 border-t border-dz-rule pt-10" data-testid="qa-section" id="qa">
      <SectionHead icon={MessageCircle} title={<>{t(lang, 'Questions & réponses', 'Questions & answers')} {questions.length > 0 && <span className="text-dz-text-4" dir="ltr">({questions.length})</span>}</>}
        right={<button data-testid="ask-question-btn" className={btnInk} onClick={() => { setShowForm((s) => !s); setDone('') }}><Plus className="h-4 w-4" /> {t(lang, 'Poser une question', 'Ask a question')}</button>} />

      {done === 'q' && <div className="mb-4 rounded-dz-brand border border-dz-accent/30 bg-dz-accent-bg px-4 py-3 text-[13.5px] text-dz-accent" data-testid="question-thanks">{t(lang, 'Merci ! Votre question sera publiée après validation.', 'Thank you! Your question will appear after review.')}</div>}

      {showForm && (
        <form onSubmit={ask} className="mb-5 space-y-3 rounded-dz-card border border-dz-rule bg-dz-surface p-5" data-testid="question-form">
          <input data-testid="question-name" className={inputCls} placeholder={ts(lang, 'Votre nom', 'Your name')} value={name} onChange={(e) => setName(e.target.value)} />
          <textarea data-testid="question-body" rows={3} className={inputCls} placeholder={ts(lang, 'Posez votre question sur ce produit…', 'Ask your question about this product…')} value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className={btnInk} data-testid="question-submit">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {t(lang, 'Envoyer', 'Send')}</button>
            <button type="button" className={btnGhost} onClick={() => setShowForm(false)}>{t(lang, 'Annuler', 'Cancel')}</button>
          </div>
        </form>
      )}

      {questions.length === 0 ? (
        <p className="rounded-dz-card border border-dashed border-dz-rule bg-dz-surface p-6 text-center text-[14px] text-dz-text-3" data-testid="qa-empty">
          {t(lang, 'Aucune question pour le moment. Posez la première !', 'No questions yet. Ask the first one!')}
        </p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => <QuestionItem key={q.id} q={q} lang={lang} name={name} setName={setName} onPosted={() => setDone('a')} />)}
        </div>
      )}
      {done === 'a' && <p className="mt-3 text-[13px] text-dz-accent">{t(lang, 'Merci ! Votre réponse sera publiée après validation.', 'Thank you! Your answer will appear after review.')}</p>}
    </section>
  )
}

const QuestionItem = ({ q, lang, name, setName, onPosted }) => {
  const [reply, setReply] = useState(false)
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const answers = q.answers || []
  const send = async (e) => {
    e.preventDefault()
    if (name.trim().length < 2 || body.trim().length < 5) return
    setBusy(true)
    const res = await fetch(`/api/questions/${q.id}/answers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author_name: name, body, lang }) })
    setBusy(false)
    if (res.ok) { setReply(false); setBody(''); onPosted() }
  }
  return (
    <div className="rounded-dz-card border border-dz-rule bg-dz-surface p-4" data-testid={`question-${q.id}`}>
      <div className="flex gap-2">
        <span className="mt-0.5 font-display text-lg leading-none text-dz-accent">Q</span>
        <div className="flex-1">
          <p className="text-[14.5px] font-medium text-dz-ink">{q.body}</p>
          <p className="mt-0.5 text-[11px] text-dz-text-4">{q.author_name} · {fmtDate(q.created_at, lang)}</p>
        </div>
      </div>
      {answers.map((a) => (
        <div key={a.id} className="mt-3 flex gap-2 border-t border-dz-rule pt-3" data-testid={`answer-${a.id}`}>
          <CornerDownRight className="mt-0.5 h-4 w-4 shrink-0 text-dz-text-4" />
          <div className="flex-1">
            <p className="text-[14px] leading-relaxed text-dz-text-2">{a.body}</p>
            <p className="mt-1 flex items-center gap-2 text-[11px] text-dz-text-4">
              {a.is_staff ? <StaffBadge lang={lang} /> : <span className="font-medium text-dz-text-3">{a.author_name}</span>}
              · {fmtDate(a.created_at, lang)}
            </p>
          </div>
        </div>
      ))}
      {reply ? (
        <form onSubmit={send} className="mt-3 space-y-2 border-t border-dz-rule pt-3" data-testid={`answer-form-${q.id}`}>
          <input className={inputCls} placeholder={ts(lang, 'Votre nom', 'Your name')} value={name} onChange={(e) => setName(e.target.value)} />
          <textarea rows={2} className={inputCls} placeholder={ts(lang, 'Votre réponse…', 'Your answer…')} value={body} onChange={(e) => setBody(e.target.value)} data-testid={`answer-body-${q.id}`} />
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className={btnInk} data-testid={`answer-submit-${q.id}`}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {t(lang, 'Répondre', 'Reply')}</button>
            <button type="button" className={btnGhost} onClick={() => setReply(false)}>{t(lang, 'Annuler', 'Cancel')}</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setReply(true)} className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-dz-text-3 transition-colors hover:text-dz-accent" data-testid={`reply-btn-${q.id}`}>
          <CornerDownRight className="h-3.5 w-3.5" /> {t(lang, 'Répondre', 'Reply')}
        </button>
      )}
    </div>
  )
}

// =============================================================================
// FORUM COMMUNAUTAIRE
// =============================================================================
const catLabel = (cats, id, lang) => { const c = (cats || []).find((x) => x.id === id); return c ? pick(c, lang) : id }

export const ForumView = ({ lang, nav, slug }) => {
  if (slug) return <ForumThread lang={lang} nav={nav} id={slug} />
  return <ForumList lang={lang} nav={nav} />
}

const ForumList = ({ lang, nav }) => {
  const [data, setData] = useState({ threads: [], categories: [] })
  const [cat, setCat] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useName()
  const [form, setForm] = useState({ category: 'routine', title: '', body: '' })
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    fetch(`/api/forum${cat ? `?category=${cat}` : ''}`).then((r) => r.json()).then(setData).catch(() => setData({ threads: [], categories: [] }))
  }, [cat])
  useEffect(() => { load() }, [load])

  const create = async (e) => {
    e.preventDefault()
    if (name.trim().length < 2 || form.title.trim().length < 5 || form.body.trim().length < 5) return
    setBusy(true)
    const res = await fetch('/api/forum/threads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, author_name: name, lang }) })
    setBusy(false)
    if (res.ok) { setDone(true); setShowForm(false); setForm({ category: 'routine', title: '', body: '' }) }
  }

  const cats = data.categories || []
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8" data-testid="forum-view">
      <div className="rounded-2xl bg-dz-ink p-8 text-white md:p-10">
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-normal tracking-[-0.02em] md:text-4xl"><Users className="h-7 w-7" /> {t(lang, 'Forum communautaire', 'Community forum')}</h1>
        <p className="mt-2 max-w-2xl text-dz-chip">{t(lang, 'Posez vos questions, partagez vos routines et échangez avec la communauté Dermalyze. Chaque message est validé par notre équipe.', 'Ask questions, share routines and chat with the Dermalyze community. Every message is reviewed by our team.')}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setCat('')} className={`rounded-dz-pill px-3 py-1.5 text-[13px] transition-colors ${cat === '' ? 'bg-dz-ink text-white' : 'bg-dz-surface-2 text-dz-nav hover:text-dz-ink'}`}>{t(lang, 'Toutes', 'All')}</button>
          {cats.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} data-testid={`forum-cat-${c.id}`} className={`rounded-dz-pill px-3 py-1.5 text-[13px] transition-colors ${cat === c.id ? 'bg-dz-ink text-white' : 'bg-dz-surface-2 text-dz-nav hover:text-dz-ink'}`}>{pick(c, lang)}</button>
          ))}
        </div>
        <button className={btnInk} data-testid="new-thread-btn" onClick={() => { setShowForm((s) => !s); setDone(false) }}><Plus className="h-4 w-4" /> {t(lang, 'Nouvelle discussion', 'New topic')}</button>
      </div>

      {done && <div className="mt-4 rounded-dz-brand border border-dz-accent/30 bg-dz-accent-bg px-4 py-3 text-[13.5px] text-dz-accent" data-testid="thread-thanks">{t(lang, 'Merci ! Votre discussion sera publiée après validation.', 'Thank you! Your topic will appear after review.')}</div>}

      {showForm && (
        <form onSubmit={create} className="mt-4 space-y-3 rounded-dz-card border border-dz-rule bg-dz-surface p-5" data-testid="thread-form">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={inputCls} placeholder={ts(lang, 'Votre nom', 'Your name')} value={name} onChange={(e) => setName(e.target.value)} data-testid="thread-name" />
            <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} data-testid="thread-category">
              {cats.map((c) => <option key={c.id} value={c.id}>{pick(c, lang)}</option>)}
            </select>
          </div>
          <input className={inputCls} placeholder={ts(lang, 'Titre de la discussion', 'Topic title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="thread-title" />
          <textarea rows={4} className={inputCls} placeholder={ts(lang, 'Votre message…', 'Your message…')} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} data-testid="thread-body" />
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className={btnInk} data-testid="thread-submit">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {t(lang, 'Créer la discussion', 'Create topic')}</button>
            <button type="button" className={btnGhost} onClick={() => setShowForm(false)}>{t(lang, 'Annuler', 'Cancel')}</button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-2.5">
        {(data.threads || []).length === 0 && <p className="rounded-dz-card border border-dashed border-dz-rule bg-dz-surface p-6 text-center text-[14px] text-dz-text-3">{t(lang, 'Aucune discussion pour le moment.', 'No topics yet.')}</p>}
        {(data.threads || []).map((th) => (
          <button key={th.id} onClick={() => nav('forum', th.id)} data-testid={`thread-${th.id}`}
            className="flex w-full items-center gap-4 rounded-dz-card border border-dz-rule bg-dz-surface p-4 text-left transition-all hover:border-dz-accent/40 hover:shadow-dz-card">
            <MessagesSquare className="h-5 w-5 shrink-0 text-dz-accent" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {th.pinned && <Pin className="h-3.5 w-3.5 text-amber-500" />}
                <span className="truncate text-[15px] font-semibold text-dz-ink">{th.title}</span>
              </div>
              <p className="mt-0.5 text-[12px] text-dz-text-4">
                <span className="rounded-dz-pill bg-dz-surface-2 px-2 py-0.5">{catLabel(cats, th.category, lang)}</span>
                {' · '}{t(lang, 'par', 'by')} {th.author_name} · {fmtDate(th.last_activity || th.created_at, lang)}
              </p>
            </div>
            <span className="shrink-0 text-center">
              <span className="block font-display text-xl text-dz-ink" dir="ltr">{th.reply_count || 0}</span>
              <span className="block text-[10.5px] text-dz-text-4">{t(lang, 'réponses', 'replies')}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

const ForumThread = ({ lang, nav, id }) => {
  const [data, setData] = useState(null)
  const [name, setName] = useName()
  const [body, setBody] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    fetch(`/api/forum/threads/${id}`).then((r) => r.json()).then(setData).catch(() => setData({ error: true }))
  }, [id])
  useEffect(() => { load() }, [load])

  const reply = async (e) => {
    e.preventDefault()
    if (name.trim().length < 2 || body.trim().length < 5) return
    setBusy(true)
    const res = await fetch(`/api/forum/threads/${id}/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author_name: name, body, lang }) })
    setBusy(false)
    if (res.ok) { setDone(true); setBody('') }
  }

  if (!data) return <p className="py-20 text-center text-dz-text-4">…</p>
  if (data.error || !data.thread) return <p className="py-20 text-center text-dz-text-4">{t(lang, 'Discussion introuvable.', 'Topic not found.')}</p>
  const { thread, posts } = data
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8" data-testid="forum-thread">
      <button onClick={() => nav('forum')} className="mb-5 flex items-center gap-1 text-sm text-dz-text-2 hover:text-dz-ink"><ArrowLeft className="h-4 w-4" /> {t(lang, 'Retour au forum', 'Back to forum')}</button>
      <article className="rounded-dz-card border border-dz-rule bg-dz-surface p-5">
        <div className="flex items-center gap-2">{thread.pinned && <Pin className="h-4 w-4 text-amber-500" />}<h1 className="font-display text-2xl font-normal tracking-[-0.02em] text-dz-ink">{thread.title}</h1></div>
        <p className="mt-1 text-[12px] text-dz-text-4">{t(lang, 'par', 'by')} {thread.author_name} · {fmtDate(thread.created_at, lang)}</p>
        <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-dz-text-2">{thread.body}</p>
      </article>

      <h2 className="mb-3 mt-8 text-[13px] font-semibold uppercase tracking-wider text-dz-text-4">{(posts || []).length} {t(lang, 'réponses', 'replies')}</h2>
      <div className="space-y-3">
        {(posts || []).map((p) => (
          <div key={p.id} className="rounded-dz-card border border-dz-rule bg-dz-surface p-4" data-testid={`post-${p.id}`}>
            <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-dz-text-2">{p.body}</p>
            <p className="mt-2 flex items-center gap-2 text-[11px] text-dz-text-4">{p.is_staff ? <StaffBadge lang={lang} /> : <span className="font-medium text-dz-text-3">{p.author_name}</span>} · {fmtDate(p.created_at, lang)}</p>
          </div>
        ))}
      </div>

      {done && <div className="mt-4 rounded-dz-brand border border-dz-accent/30 bg-dz-accent-bg px-4 py-3 text-[13.5px] text-dz-accent" data-testid="post-thanks">{t(lang, 'Merci ! Votre réponse sera publiée après validation.', 'Thank you! Your reply will appear after review.')}</div>}
      <form onSubmit={reply} className="mt-5 space-y-3 rounded-dz-card border border-dz-rule bg-dz-surface p-5" data-testid="post-form">
        <h3 className="text-[14px] font-semibold text-dz-ink">{t(lang, 'Répondre à la discussion', 'Reply to this topic')}</h3>
        <input className={inputCls} placeholder={ts(lang, 'Votre nom', 'Your name')} value={name} onChange={(e) => setName(e.target.value)} data-testid="post-name" />
        <textarea rows={3} className={inputCls} placeholder={ts(lang, 'Votre message…', 'Your message…')} value={body} onChange={(e) => setBody(e.target.value)} data-testid="post-body" />
        <button type="submit" disabled={busy} className={btnInk} data-testid="post-submit">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {t(lang, 'Publier', 'Post')}</button>
      </form>
    </div>
  )
}

// =============================================================================
// MODÉRATION (back-office)
// =============================================================================
const StatusPill = ({ status, lang }) => {
  const map = {
    pending: ['bg-amber-50 text-amber-700', t(lang, 'En attente', 'Pending')],
    approved: ['bg-emerald-50 text-emerald-700', t(lang, 'Approuvé', 'Approved')],
    rejected: ['bg-red-50 text-red-600', t(lang, 'Rejeté', 'Rejected')],
  }
  const [cls, lbl] = map[status] || map.pending
  return <span className={`rounded-dz-pill px-2 py-0.5 text-[10.5px] font-medium ${cls}`}>{lbl}</span>
}

const ModButtons = ({ lang, onApprove, onReject, onDelete }) => (
  <div className="flex flex-wrap gap-1.5">
    {onApprove && <button onClick={onApprove} className="inline-flex items-center gap-1 rounded-dz-pill bg-emerald-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-emerald-700"><Check className="h-3.5 w-3.5" /> {t(lang, 'Approuver', 'Approve')}</button>}
    {onReject && <button onClick={onReject} className="inline-flex items-center gap-1 rounded-dz-pill bg-dz-surface-2 px-2.5 py-1 text-[12px] font-medium text-dz-nav hover:text-dz-ink"><X className="h-3.5 w-3.5" /> {t(lang, 'Rejeter', 'Reject')}</button>}
    {onDelete && <button onClick={onDelete} className="inline-flex items-center gap-1 rounded-dz-pill bg-red-50 px-2.5 py-1 text-[12px] font-medium text-red-600 hover:bg-red-100"><Trash2 className="h-3.5 w-3.5" /> {t(lang, 'Supprimer', 'Delete')}</button>}
  </div>
)

const StatusFilter = ({ lang, value, onChange }) => (
  <div className="mb-4 flex gap-1.5">
    {[['pending', t(lang, 'En attente', 'Pending')], ['approved', t(lang, 'Approuvés', 'Approved')], ['rejected', t(lang, 'Rejetés', 'Rejected')], ['', t(lang, 'Tous', 'All')]].map(([v, l]) => (
      <button key={v} onClick={() => onChange(v)} className={`rounded-dz-pill px-3 py-1 text-[12.5px] transition-colors ${value === v ? 'bg-dz-ink text-white' : 'bg-dz-surface-2 text-dz-nav hover:text-dz-ink'}`}>{l}</button>
    ))}
  </div>
)

export const CommunityModeration = ({ lang, token, kind }) => {
  const [status, setStatus] = useState('pending')
  const [items, setItems] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const auth = { Authorization: `Bearer ${token}` }
  const jauth = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const endpoint = kind === 'forum' ? 'forum' : kind // reviews | questions | forum
  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/${endpoint}${status ? `?status=${status}` : ''}`, { headers: auth })
      .then((r) => r.json()).then((d) => { setItems(kind === 'reviews' ? (d.reviews || []) : kind === 'questions' ? (d.questions || []) : (d.threads || [])); if (kind === 'forum') setPosts(d.posts || []); setLoading(false) })
      .catch(() => { setItems([]); setLoading(false) })
  }, [endpoint, status])  
  useEffect(() => { load() }, [load])

  const putReview = async (id, patch) => { await fetch(`/api/admin/reviews/${id}`, { method: 'PUT', headers: jauth, body: JSON.stringify(patch) }); load() }
  const del = async (path) => { await fetch(`/api/admin/${path}`, { method: 'DELETE', headers: auth }); load() }
  const putQ = async (id, patch) => { await fetch(`/api/admin/questions/${id}`, { method: 'PUT', headers: jauth, body: JSON.stringify(patch) }); load() }
  const putAns = async (qid, aid, patch) => { await fetch(`/api/admin/questions/${qid}/answers/${aid}`, { method: 'PUT', headers: jauth, body: JSON.stringify(patch) }); load() }
  const putThread = async (id, patch) => { await fetch(`/api/admin/forum/threads/${id}`, { method: 'PUT', headers: jauth, body: JSON.stringify(patch) }); load() }
  const putPost = async (id, patch) => { await fetch(`/api/admin/forum/posts/${id}`, { method: 'PUT', headers: jauth, body: JSON.stringify(patch) }); load() }

  return (
    <div data-testid={`mod-${kind}`}>
      <StatusFilter lang={lang} value={status} onChange={setStatus} />
      {loading && <p className="py-6 text-center text-sm text-dz-text-4">…</p>}
      {!loading && items.length === 0 && <p className="rounded-dz-card border border-dashed border-dz-rule p-6 text-center text-sm text-dz-text-4">{t(lang, 'Aucun élément.', 'No items.')}</p>}

      <div className="space-y-3">
        {kind === 'reviews' && items.map((r) => (
          <div key={r.id} className="rounded-dz-card border border-dz-rule bg-white p-4" data-testid={`mod-review-${r.id}`}>
            <div className="flex flex-wrap items-center gap-2">
              <Stars value={r.rating} /><span className="text-[13px] font-semibold text-dz-ink">{r.author_name}</span>
              <StatusPill status={r.status} lang={lang} />
              {r.verified && <span className="inline-flex items-center gap-1 rounded-dz-pill bg-emerald-50 px-1.5 py-0.5 text-[10.5px] text-emerald-700"><BadgeCheck className="h-3 w-3" /> {t(lang, 'Vérifié', 'Verified')}</span>}
              <span className="text-[11px] text-dz-text-4">{r.target_type} · {r.target_slug}</span>
            </div>
            {r.title && <p className="mt-1.5 text-[14px] font-semibold text-dz-ink">{r.title}</p>}
            <p className="mt-1 text-[13.5px] text-dz-text-2">{r.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <ModButtons lang={lang}
                onApprove={r.status !== 'approved' ? () => putReview(r.id, { status: 'approved' }) : null}
                onReject={r.status !== 'rejected' ? () => putReview(r.id, { status: 'rejected' }) : null}
                onDelete={() => del(`reviews/${r.id}`)} />
              <button onClick={() => putReview(r.id, { verified: !r.verified })} className="inline-flex items-center gap-1 rounded-dz-pill border border-dz-rule px-2.5 py-1 text-[12px] text-dz-nav hover:text-dz-accent">
                <BadgeCheck className="h-3.5 w-3.5" /> {r.verified ? t(lang, 'Retirer vérifié', 'Unverify') : t(lang, 'Marquer vérifié', 'Mark verified')}
              </button>
            </div>
          </div>
        ))}

        {kind === 'questions' && items.map((q) => (
          <div key={q.id} className="rounded-dz-card border border-dz-rule bg-white p-4" data-testid={`mod-question-${q.id}`}>
            <div className="flex flex-wrap items-center gap-2"><span className="text-[13px] font-semibold text-dz-ink">{q.author_name}</span><StatusPill status={q.status} lang={lang} /><span className="text-[11px] text-dz-text-4">{q.product_slug}</span></div>
            <p className="mt-1 text-[14px] text-dz-ink">{q.body}</p>
            <div className="mt-2"><ModButtons lang={lang}
              onApprove={q.status !== 'approved' ? () => putQ(q.id, { status: 'approved' }) : null}
              onReject={q.status !== 'rejected' ? () => putQ(q.id, { status: 'rejected' }) : null}
              onDelete={() => del(`questions/${q.id}`)} /></div>
            {(q.answers || []).map((a) => (
              <div key={a.id} className="mt-2 flex flex-wrap items-center gap-2 border-t border-dz-rule pt-2 text-[13px]">
                <CornerDownRight className="h-3.5 w-3.5 text-dz-text-4" />
                <span className="flex-1 text-dz-text-2">{a.body} <span className="text-dz-text-4">— {a.is_staff ? 'Staff' : a.author_name}</span></span>
                <StatusPill status={a.status} lang={lang} />
                <ModButtons lang={lang}
                  onApprove={a.status !== 'approved' ? () => putAns(q.id, a.id, { status: 'approved' }) : null}
                  onReject={a.status !== 'rejected' ? () => putAns(q.id, a.id, { status: 'rejected' }) : null}
                  onDelete={() => del(`questions/${q.id}/answers/${a.id}`)} />
              </div>
            ))}
          </div>
        ))}

        {kind === 'forum' && items.map((th) => (
          <div key={th.id} className="rounded-dz-card border border-dz-rule bg-white p-4" data-testid={`mod-thread-${th.id}`}>
            <div className="flex flex-wrap items-center gap-2">{th.pinned && <Pin className="h-3.5 w-3.5 text-amber-500" />}<span className="text-[14px] font-semibold text-dz-ink">{th.title}</span><StatusPill status={th.status} lang={lang} /><span className="text-[11px] text-dz-text-4">{th.category} · {th.author_name}</span></div>
            <p className="mt-1 text-[13.5px] text-dz-text-2">{th.body}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <ModButtons lang={lang}
                onApprove={th.status !== 'approved' ? () => putThread(th.id, { status: 'approved' }) : null}
                onReject={th.status !== 'rejected' ? () => putThread(th.id, { status: 'rejected' }) : null}
                onDelete={() => del(`forum/threads/${th.id}`)} />
              <button onClick={() => putThread(th.id, { pinned: !th.pinned })} className="inline-flex items-center gap-1 rounded-dz-pill border border-dz-rule px-2.5 py-1 text-[12px] text-dz-nav hover:text-dz-accent"><Pin className="h-3.5 w-3.5" /> {th.pinned ? t(lang, 'Désépingler', 'Unpin') : t(lang, 'Épingler', 'Pin')}</button>
            </div>
          </div>
        ))}

        {kind === 'forum' && posts.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-dz-text-4">{t(lang, 'Réponses du forum', 'Forum replies')}</p>
            {posts.map((p) => (
              <div key={p.id} className="mb-2 flex flex-wrap items-center gap-2 rounded-dz-card border border-dz-rule bg-white p-3 text-[13px]" data-testid={`mod-post-${p.id}`}>
                <span className="flex-1 text-dz-text-2">{p.body} <span className="text-dz-text-4">— {p.author_name}</span></span>
                <StatusPill status={p.status} lang={lang} />
                <ModButtons lang={lang}
                  onApprove={p.status !== 'approved' ? () => putPost(p.id, { status: 'approved' }) : null}
                  onReject={p.status !== 'rejected' ? () => putPost(p.id, { status: 'rejected' }) : null}
                  onDelete={() => del(`forum/posts/${p.id}`)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
