import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from './components/AdSlot';
import GameEmbedActions from './components/GameEmbedActions';
import HeroSection from './components/HeroSection';
import { gameCollections, totalPuzzleCount } from './lib/gameData';

export const metadata: Metadata = {
  title: 'JigMerge – Free Online Jigsaw Solitaire Puzzle Game',
  description: `Play JigMerge free online. Swap and merge tiles across ${totalPuzzleCount}+ puzzles in ${gameCollections.length} live collections.`,
  keywords: ['JigMerge', 'jigsaw puzzle', 'solitaire puzzle', 'online puzzle game', 'free puzzle game', 'brain games', 'tile swap puzzle'],
  alternates: {
    canonical: '/',
  },
};

const featuredCollections = gameCollections.slice(0, 6);

export default function Home() {
  return (
    <>
      <section className="home-embed-section">
        <div className="home-embed-shell">
          <div id="home-game-frame" className="home-embed-card">
            <iframe
              src="/game/index.html"
              title="Play JigMerge Free Online"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
          <GameEmbedActions targetId="home-game-frame" shareUrl="/play" />
        </div>
      </section>

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Social Proof Strip ── */}
      <section style={{
        padding: '2rem 0',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        background: 'rgba(255, 251, 244, 0.52)',
      }}>
        <div className="container home-stats-grid">
            {[
            { value: `${totalPuzzleCount}+`, label: 'Cozy Boards' },
            { value: String(gameCollections.length), label: 'Puzzle Collections' },
            { value: '3', label: 'Comfort Levels' },
            { value: '0', label: 'Downloads Needed' },
          ].map((stat) => (
            <div key={stat.label} className="home-stat-card">
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.7rem',
                fontWeight: 700,
                color: 'var(--brand-700)',
                letterSpacing: '0.01em',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginTop: '0.2rem',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <AdSlot type="banner" />

      {/* ── What Makes It Different ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">A softer kind of puzzle session</h2>
          <p className="section-subtitle">
            The layout stays familiar, but the mood is brighter, more playful, and easier to settle into.
            Everything is tuned to make each round feel welcoming, tactile, and quietly rewarding.
          </p>

          <div className="grid-3">
            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8.5h12" /><path d="M6 15.5h12" /><path d="M8.5 6v12" /><path d="M15.5 6v12" /><rect x="3" y="3" width="18" height="18" rx="5" /></svg>
              </div>
              <h3>Easy to Settle Into</h3>
              <p>Instead of wrestling with tiny puzzle tabs, you simply swap tiles on a tidy board and ease into the pattern.</p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.6 5.26 5.8.85-4.2 4.09.99 5.8L12 16.8 6.81 19l.99-5.8-4.2-4.09 5.8-.85L12 3z" /></svg>
              </div>
              <h3>Little Reward Moments</h3>
              <p>Correct neighbors snap together into one moving cluster, so every smart move feels like a tiny celebration.</p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="8" /><path d="M8 3.2 6.2 5" /><path d="M16 3.2 17.8 5" /></svg>
              </div>
              <h3>Preview, Then Play</h3>
              <p>Each board gives you a quick look at the finished picture first, so you can take a breath and plan before the shuffle begins.</p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10" /><path d="M9 16h6" /><path d="M8 3h8l3 5-7 7-7-7 3-5z" /></svg>
              </div>
              <h3>Progress That Feels Good</h3>
              <p>Moves, time, and merges give you gentle ways to chase improvement without turning the whole board into a race.</p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="12" rx="3" /><path d="M8 20h8" /><path d="M12 16v4" /><path d="M6.5 8.5h11" /></svg>
              </div>
              <h3>Comfortable on Any Screen</h3>
              <p>Phone, tablet, or desktop, the board stays easy to read so a quick break is always within reach.</p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12c3-4.5 5.6-6.75 8-6.75S17 7.5 20 12c-3 4.5-5.6 6.75-8 6.75S7 16.5 4 12z" /><circle cx="12" cy="12" r="2.5" /></svg>
              </div>
              <h3>Free and Unfussy</h3>
              <p>No accounts, no locked packs, no complicated setup. Open JigMerge, pick a board, and start unwinding.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Categories Showcase ── */}
      <section className="section" style={{ background: 'rgba(241, 247, 236, 0.75)' }}>
        <div className="container">
          <h2 className="section-title">Collections for every kind of brain break</h2>
          <p className="section-subtitle">
            Whether you want a tiny reset or a longer, satisfying unwind, each collection brings its own board size,
            tempo, and puzzle personality.
          </p>

          <div className="home-categories-grid">
            {featuredCollections.map((collection) => (
              <Link key={collection.slug} href={`/categories/${collection.slug}`} className="home-category-card" style={{ textDecoration: 'none' }}>
                <div className="home-category-icon" style={{ background: `${collection.color}22`, color: collection.color }}>
                  {collection.shortName}
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}>
                  {collection.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  {collection.gridLabel} · {collection.puzzleCount} puzzles
                </span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <Link href="/categories" className="btn btn-secondary">
              Browse All Collections
            </Link>
          </div>
        </div>
      </section>

      <AdSlot type="banner" />

      {/* ── How It Feels ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 className="section-title">Designed to feel light, playful, and calm</h2>
          <p className="section-subtitle">
            The challenge still matters, but the whole experience now leans warmer, friendlier, and more inviting.
            It is about feeling at ease while your brain stays pleasantly busy.
          </p>

          <div className="home-feel-grid">
            {[
              { title: 'Gentle motion', desc: 'Tiles drift, merge, and settle with just enough bounce to feel playful without turning noisy.' },
              { title: 'Cozy color cues', desc: 'Green keeps the space calm while warm orange highlights the places where action should feel exciting.' },
              { title: 'Cleaner surfaces', desc: 'Soft cards, brighter spacing, and lighter contrast make the template feel more welcoming from top to bottom.' },
              { title: 'Game-night energy', desc: 'The whole presentation feels a bit more cheerful and collectible, like a favorite tabletop game brought online.' },
            ].map((item) => (
              <div key={item.title} className="home-feel-card">
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>{item.title}</h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        padding: '5rem 0',
        background: 'rgba(241, 247, 236, 0.82)',
        textAlign: 'center',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div className="container">
          <h2 style={{ marginBottom: '0.5rem' }}>Ready for a lighter kind of puzzle break?</h2>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '400px',
            margin: '0 auto 2rem',
            fontSize: '0.95rem',
            lineHeight: 1.6,
          }}>
            No signup, no download, no extra friction. Just open JigMerge and enjoy a few playful minutes on the board.
          </p>
          <Link href="/play" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '0.95rem' }}>
            Start Playing
          </Link>
        </div>
      </section>
    </>
  );
}
