import Link from 'next/link';

const footerLinks = {
    'Play': [
        { href: '/play', label: 'Play a Round' },
        { href: '/categories', label: 'Collections' },
        { href: '/how-to-play', label: 'How It Flows' },
        { href: '/faq', label: 'FAQ' },
    ],
    'Read': [
        { href: '/blog', label: 'Puzzle Notes' },
        { href: '/blog/tips-and-tricks', label: 'Tips & Tricks' },
        { href: '/blog/benefits-of-puzzle-games', label: 'Brain Benefits' },
        { href: '/blog/neuroscience-of-puzzle-solving', label: 'Neuroscience' },
        { href: '/blog/history-of-card-games', label: 'Card Game History' },
        { href: '/blog/screen-time-guide', label: 'Screen Time Guide' },
    ],
    'Company': [
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
        { href: '/accessibility', label: 'Accessibility' },
    ],
    'Legal': [
        { href: '/privacy-policy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms' },
        { href: '/cookie-policy', label: 'Cookies' },
        { href: '/disclaimer', label: 'Disclaimer' },
    ],
};

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border-light)',
            padding: '3rem 0 2rem',
            marginTop: '4rem',
            background: 'linear-gradient(180deg, rgba(255,251,244,0.4), rgba(239,245,233,0.8))',
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2.5rem',
                }}>
                    <div>
                        <Link href="/" style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: '1rem',
                            letterSpacing: '-0.03em',
                            color: 'var(--text-primary)',
                        }}>
                            JigMerge
                        </Link>
                        <p style={{
                            color: 'var(--text-tertiary)',
                            fontSize: '0.88rem',
                            marginTop: '0.5rem',
                            lineHeight: 1.6,
                        }}>
                            Cozy puzzle breaks, bright little wins, and calm play at your own pace.
                        </p>
                    </div>

                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                color: 'var(--text-tertiary)',
                                marginBottom: '0.75rem',
                            }}>
                                {title}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {links.map((link) => (
                                    <li key={link.href} style={{ marginBottom: '0.375rem' }}>
                                        <Link href={link.href} style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.8125rem',
                                        }}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                }}>
                    <p style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '0.75rem',
                    }}>
                        © {new Date().getFullYear()} JigMerge
                    </p>
                    <Link href="/sitemap-page" style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '0.75rem',
                    }}>
                        Sitemap
                    </Link>
                </div>
            </div>
        </footer>
    );
}
