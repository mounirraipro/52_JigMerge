import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us – JigMerge',
    description: 'Learn what JigMerge is, how the game is made, and the standards we use for gameplay, site quality, and player trust.',
    keywords: ['about JigMerge', 'puzzle game team', 'browser puzzle game', 'JigMerge mission'],
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    return (
        <>
            <div className="page-header">
                <div className="container">
                    <h1 className="gradient-text">About JigMerge</h1>
                    <p>Why we built the game, how we think about quality, and what players can expect from this site.</p>
                </div>
            </div>

            <div className="page-content">
                <h2>What JigMerge Is</h2>
                <p>
                    JigMerge is a free browser game that blends the visual satisfaction of jigsaw puzzles with
                    the planning mindset of tile-based strategy games. Instead of forcing players through a noisy
                    app install, account wall, or premium upgrade flow, we wanted a version that feels simple:
                    open the site, understand the rules quickly, and start playing.
                </p>
                <p>
                    The game is designed for people who like calm challenge. Some players arrive because they
                    love puzzles. Others come because they want a more intentional alternative to passive screen
                    time. Our job is to make that experience easy to access and worth returning to.
                </p>

                <h2>Why We Built It</h2>
                <p>
                    The idea behind JigMerge came from a gap we kept noticing in online puzzle spaces. Many sites
                    offered either very traditional jigsaws or extremely fast, ad-heavy casual games. We wanted
                    something in between: a puzzle that felt visually intuitive, mechanically satisfying, and calm
                    enough to support real focus.
                </p>
                <p>
                    That led to the tile-swapping system at the center of JigMerge. It keeps the visual pleasure
                    of restoring an image, but it also creates a more readable digital interaction. You are not
                    fighting awkward piece geometry. You are making deliberate decisions on a clear grid, which is
                    better suited to browsers, touch screens, and short repeat sessions.
                </p>

                <h2>What We Care About</h2>
                <p>
                    <strong>Playability first:</strong> The game itself should stay central. Ads, navigation, and
                    supporting content should never make the puzzle harder to understand or enjoy.
                </p>
                <p>
                    <strong>Useful supporting content:</strong> We publish blog posts, guides, and family-facing
                    resources to help people understand the game, choose better puzzle experiences, and think more
                    clearly about digital play.
                </p>
                <p>
                    <strong>Trust and transparency:</strong> We aim to be clear about what the site does, what data
                    it uses, and what players should expect. If a page covers privacy, children, ads, or legal use,
                    it should match the real behavior of the site.
                </p>

                <h2>How We Approach Content</h2>
                <p>
                    JigMerge includes editorial content because puzzle sites feel more useful when they offer more
                    than a single landing page. Our articles focus on strategy, family use, game history, and the
                    psychology of puzzle-solving. When we make claims about learning, attention, or child use, we
                    try to ground those pages in reputable public references and keep the tone practical rather than
                    sensational.
                </p>
                <p>
                    We do not treat the blog as filler for ads. The goal is to publish pages that answer real user
                    questions: how the game works, why puzzle difficulty matters, what makes a browser game feel
                    trustworthy, and how parents can judge whether a digital puzzle is worth their child&apos;s time.
                </p>

                <h2>How the Site Supports Itself</h2>
                <p>
                    JigMerge is free to access. To help cover hosting and maintenance, the site may display ads
                    from third-party providers such as Google AdSense. We try to keep advertising secondary to the
                    actual experience. Legal, safety, and support pages exist to inform users, not to maximize ad
                    inventory, and that is how we intend to keep them.
                </p>

                <h2>What We Do Not Do</h2>
                <ul>
                    <li>We do not require account creation to play.</li>
                    <li>We do not sell premium access to core gameplay.</li>
                    <li>We do not run chat, public profiles, or social posting features on the site.</li>
                    <li>We do not present the site as medical, educational, or therapeutic advice.</li>
                </ul>

                <h2>Who JigMerge Is For</h2>
                <p>
                    The site is built for casual players, puzzle fans, families looking for calmer browser content,
                    and anyone who wants short sessions of focused problem-solving. Some people use the game as a
                    break between tasks. Some play with children. Some simply enjoy visual strategy. We try to make
                    the experience flexible enough to support all three.
                </p>

                <h2>Contact and Feedback</h2>
                <p>
                    We treat feedback as part of improving the site. If you spot a broken page, confusing rule,
                    misleading statement, accessibility issue, or privacy concern, please use the{' '}
                    <a href="/contact">Contact page</a>. Clear support paths make a site more useful, and they
                    help us keep JigMerge aligned with the standards we want to publish under.
                </p>
            </div>
        </>
    );
}
