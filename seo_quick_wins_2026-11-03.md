# SEO quick wins — 3 November 2026

Site: https://memento-mori.vercel.app

Evidence: analytics-mcp, GA4 property `466420534` (Memento Mori); production HTML, robots.txt and sitemap fetched on 3 November; current repository source. The findings below record the original audit. The implementation update supersedes its proposed copy and calendar indexing plan. Changes are local; no deployment was made.

## Implementation update

Applied following the user's request:

- Homepage title: `Life in Weeks Calculator | Memento Mori`; H1: `Your life in weeks`. The introduction and explanation use plain language, including the 80-year assumption. Search and social metadata agree.
- Added a permanent contextual homepage link to `/blog/life-in-weeks`, outside the rotating newest-post list.
- Journal title: `Stoicism and Life in Weeks | Memento Mori`; guide title: `Life in Weeks: How the Calendar Works | Memento Mori`.
- Removed the repeated brand from calendar metadata titles.
- Reconsidered calendar indexing in response to the user's question: personalized table and burst pages now specify `noindex, follow` for both general robots and Googlebot. Removed all 18 sample calendars from the sitemap, which now contains 11 public pages/articles. Robots.txt still allows crawling so search engines can see noindex. Existing calendar URLs and sharing behavior are retained; no year-only routes were added. The homepage remains the general calculator. Previously indexed personal calendars can lose their search entries after recrawling; this is an indexing policy change, not a guaranteed ranking improvement.
- Updated the existing journal navigation test's heading expectation.

Validation: focused Biome checks and TypeScript passed. The user-provided `bun_build_20261103-100445.log` records a successful `--debug-prerender` build, and `bun_react_doctor_report__20261103-100611.json` reports 100/100 with zero diagnostics. Verified the existing build's generated homepage, journal and guide titles, homepage H1 and guide link, social metadata, public-page indexability, sitemap entries and robots.txt. The compiled calendar module includes both noindex directives. The start log confirms successful startup, followed by shutdown. No additional build was run after the user provided these logs. Dynamic calendar responses were not fetched from a running server.

## Traffic baseline

GA4 property time zone: America/Vancouver. Latest complete 28 days: **6 October–2 November 2026**. Comparison: **8 September–5 October 2026**.

| Metric                                   | Latest 28 days | Previous 28 days |
| ---------------------------------------- | -------------: | ---------------: |
| All-channel sessions                     |            141 |              140 |
| Organic Search sessions                  |             81 |               81 |
| Organic users                            |             65 |               58 |
| Engaged organic sessions                 |             53 |               50 |
| Organic engagement rate, calculated      |          65.4% |            61.7% |
| Homepage organic landings, plain `/` URL |             67 |               70 |
| Individual blog-post organic landings    |              3 |                2 |
| Organic landings with `(not set)`        |              6 |                2 |

Two additional recent organic landings used a translated homepage URL. The recent individual-post landings were two for `/blog/what-is-memento-mori` and one for `/blog/famous-stoics-on-mortality`. `/blog` received one organic landing. These are recorded GA4 sessions, not Search Console clicks.

The homepage received 82.7% of recorded organic landings before counting its translated variant. Prioritize the existing calculator page. Engagement is not evidence of a Google ranking factor or a proven ranking problem.

## Apply in this order

### 1. Make the homepage explicitly describe the calculator

Priority: first. Expected opportunity: broader relevance and clearer search presentation; uplift is unquantified. Estimated implementation: 20–40 minutes plus validation.

Production currently has the title `Memento Mori Life Calendar - Visualize Your Life in Weeks`, an H1 containing only `Memento Mori`, and the introduction `Every week is numbered. Enter your birthdate to see yours.` The current title is already descriptive; the most concrete gap is the heading and immediate explanation of the tool.

Suggested copy:

- Title: `Life in Weeks Calculator — Memento Mori Calendar`
- H1: `Memento Mori Life Calendar` (retain the existing brand styling where practical).
- Introduction: `See your life in weeks. Enter your birthdate to calculate weeks lived and explore an 80-year calendar. Free, with no account required.`
- Meta description: `See your life in weeks with a free Memento Mori calendar. Enter your birthdate to calculate weeks lived and explore your remaining weeks on an 80-year grid.`

Keep the 80-year assumption visible; remaining weeks are an illustration, not a personalized lifespan prediction. Put homepage-specific metadata in `app/page.tsx`; account for the root `%s | Memento Mori` title template so the brand is included once. Update homepage social titles if changing its search title.

Validate: production title, description and one visible descriptive H1; mobile layout; form still works. Review query impressions and CTR in Search Console after recrawl before attributing a lift.

[Google's title guidance](https://developers.google.com/search/docs/appearance/title-link) supports concise descriptive titles and clear main headings. Keyword targeting here is an editorial hypothesis; GA4 does not expose the search queries needed to validate it.

### 2. Consolidate duplicate calendar date URLs

Historical proposal: superseded by the implementation update above. Personalized calendar pages are now excluded from search results rather than consolidated as search landing pages.

Priority: second. Confirmed technical defect; traffic benefit uncertain. Estimated implementation: 45–90 minutes including meaningful route checks.

Both production URLs return HTTP 200 with the same calendar:

- `/table/1990/1/1` canonicals to `/table/1990/1/1`.
- `/table/1990/01/01` canonicals to `/table/1990/01/01`.

The form generates padded month/day paths through `lib/url-utils.ts`; the sitemap and footer use unpadded examples. In `app/[view]/[...params]/page.tsx`, `dateParams.join("/")` preserves either spelling in canonicals and view-switch links.

Choose one date representation. A low-churn option is unpadded `YYYY/M/D`, matching the current sitemap and footer. Normalize from validated numeric date parts; permanently redirect the other representation (301 or 308), retaining the view and supported query parameters. Align the form URL generator, canonical, Open Graph URL, breadcrumbs, view switch, footer and sitemap. Validate the view and exactly three valid date segments before creating metadata or redirecting.

Also remove the hardcoded `- Memento Mori` from the dynamic page's metadata title: the inherited title template currently produces `... - Memento Mori | Memento Mori`. This is minor presentation cleanup.

Validate: padded and unpadded dates converge on one URL, no loops, query state survives, correct dates including leap days, invalid dates/views return the intended not-found behavior, each retained calendar has its own canonical. Avoid blanket noindexing date pages: some already receive organic landings, and this audit cannot establish their index quality.

[Google's canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) supports consistent redirects, canonical annotations, sitemap entries and internal links. Actual Google-selected canonicals require Search Console inspection.

### 3. Give the existing Life in Weeks guide a permanent homepage link

Priority: third. Low effort, plausible relevance/discovery benefit. Estimated implementation: 10–20 minutes.

The homepage's `posts.slice(0, 3)` features only the newest articles. The production homepage has no direct link to `/blog/life-in-weeks`, although it links to the meaning article. The guide is discoverable through the journal and other posts, so it is not an orphan.

Add a contextual link near “How it works,” for example: `Read how a life-in-weeks calendar works.` Keep a small permanent set of useful guides alongside the chronological journal section. The meaning article is a reasonable second permanent guide; it already receives organic entries. Give the guide an explanatory role and the homepage a calculator role, avoiding interchangeable copy across both pages.

Validate: link is a rendered `<a href>` pointing to the canonical guide; anchor describes the destination. Existing post-to-homepage and related-post links are already present, so this is a focused addition.

[Google's link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) explains how crawlable links and descriptive anchors support discovery and relevance.

### 4. Improve generic secondary titles only after the first three

Priority: low. Estimated implementation: 10–20 minutes.

- `app/blog/page.tsx`: replace metadata title `Journal` with a descriptive topic such as `Memento Mori & Stoicism Journal`; consider `Memento Mori Journal` for the H1, currently `Notes on a finite life`.
- `content/blog/life-in-weeks.mdx`: consider `Life in Weeks: How an 80-Year Calendar Works` in place of `A Life in Weeks` if query evidence supports an explanatory target.

Do not rewrite all articles based on tiny GA4 samples. Two featured articles were only published on 26 October, so the 28-day window is not a fair comparison of their search potential. No Search Console evidence establishes low CTR, cannibalization or near-page-one opportunities.

## Measurement work, separate from ranking fixes

The recent event report contains `page_view`, `session_start`, `first_visit`, `user_engagement`, `scroll`, `form_start` and `click`; it contains no dedicated calendar-generation event. Add a successful `calendar_generated` event at valid form submission and configure it as a key event to evaluate whether organic visits use the tool. This does not directly increase rankings. Use non-identifying parameters such as the view; do not add names or birthdates to event payloads.

Development traffic is present: two sessions on `localhost` and one on a LAN hostname. Prevent development builds from sending production GA events, or apply an appropriately configured development exclusion. This improves measurement, not SEO. Six organic sessions have no landing page; investigate with DebugView and consent/tag behavior before inferring a cause.

## Checks that passed and old recommendations to retire

- Live robots.txt and sitemap.xml both returned HTTP 200; robots allows crawling and advertises the sitemap.
- Sitemap contains 29 URLs: homepage, about, journal, eight articles and 18 calendar examples. Do not expand arbitrary birthdate URLs as an SEO tactic.
- Sampled homepage, three articles and two calendar variants have index/follow directives and canonical tags. No global indexing block was found in this sample.
- JSON-LD scripts are present in fetched source: homepage WebApplication/FAQPage; sampled posts BlogPosting/BreadcrumbList/FAQPage; calendar BreadcrumbList. This confirms presence, not rendered Rich Results eligibility or validation.
- Current source already uses `GoogleAnalytics` with a `G-` ID. The old GTM mismatch recommendation is stale.
- Error pages exist; generated Open Graph routes exist; the old artificial-delay recommendation does not match the current dynamic page source. No production Core Web Vitals were measured, so performance is not presented as a diagnosed SEO problem.

## Search Console follow-up and timing

The connected analytics-mcp tools expose GA4, not Search Console search-performance or URL-inspection reports. Consequently, this audit cannot verify keyword positions, impressions, CTR, index coverage, sitemap submission status or Google-selected canonicals. There is no basis for an instant-traffic forecast.

After deployment, use Search Console to inspect the homepage and canonical test calendars, verify sitemap processing, and request recrawl for the few changed priority pages. Then review queries with meaningful impressions, positions around 4–20, and low CTR relative to their position to choose further title/content work. Compare organic calculator completions as well as sessions.

These fixes can be implemented now. Search effects depend on crawling and reassessment. [Google says recrawling can take days to weeks and requesting it does not guarantee indexing](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
