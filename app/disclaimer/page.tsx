import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Disclaimer',
    description: 'Read the JigMerge disclaimer about gameplay, informational content, third-party links, and advertising.',
    keywords: ['JigMerge disclaimer', 'website disclaimer', 'browser game disclaimer'],
    alternates: {
        canonical: '/disclaimer',
    },
};

export default function DisclaimerPage() {
    return (
        <>
            <div className="page-header">
                <div className="container">
                    <h1 className="gradient-text">Disclaimer</h1>
                    <p>Last updated: March 11, 2026</p>
                </div>
            </div>

            <div className="page-content">
                <p>
                    This disclaimer explains the limits of the information and services provided on jigmerge.com.
                    We want the site to be useful and clear, but it is still important to describe what JigMerge is
                    and is not.
                </p>

                <h2>1. Entertainment Service</h2>
                <p>
                    JigMerge is a browser-based entertainment and informational website. The game, guides, category
                    pages, and blog are provided for general use, enjoyment, and practical reference. We do not
                    guarantee uninterrupted access, uninterrupted hosting, or compatibility with every browser,
                    device, extension, or network environment.
                </p>

                <h2>2. No Professional Advice</h2>
                <p>
                    Some pages discuss attention, cognition, learning, family use, or the broader benefits of puzzle
                    play. That material is for general informational purposes only. It is not medical, mental health,
                    educational, developmental, or legal advice, and it should not be relied upon as a substitute for
                    qualified professional guidance.
                </p>

                <h2>3. Accuracy and Completeness</h2>
                <p>
                    We try to keep the site accurate and current, but we cannot promise that every page will always be
                    complete, current, or free from mistakes. Historical summaries, strategy advice, and family-facing
                    articles are written to be useful, not to serve as exhaustive reference works.
                </p>

                <h2>4. Game Performance and Availability</h2>
                <p>
                    The game is provided on an “as available” basis. Performance may vary depending on device power,
                    browser behavior, extensions, and network conditions. Bugs, broken links, or temporary outages may
                    occur even when we are working to keep the site stable.
                </p>

                <h2>5. External Links</h2>
                <p>
                    Some pages may link to third-party websites for references, browser help, ad settings, or related
                    information. We do not control those sites and are not responsible for their content, availability,
                    policies, or security practices.
                </p>

                <h2>6. Advertising</h2>
                <p>
                    JigMerge may display advertising from third-party providers, including Google AdSense. The
                    presence of an ad does not mean we endorse the advertised product, service, or claim. We are not
                    responsible for the content of third-party ads or for any transaction or interaction that takes
                    place after you click one.
                </p>

                <h2>7. Family and Child Use</h2>
                <p>
                    The site is intended to be family-friendly, but parents and guardians remain responsible for
                    supervising a child&apos;s use of the web. Family-safety guidance on this site is informational and
                    should be used alongside your own judgment, device settings, and supervision practices.
                </p>

                <h2>8. Contact</h2>
                <p>
                    If you believe a page is inaccurate, misleading, broken, or inconsistent with how the site works,
                    please use the <a href="/contact">Contact page</a>. Feedback helps us improve the site and keep
                    important pages aligned with reality.
                </p>
            </div>
        </>
    );
}
