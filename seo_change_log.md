# SEO change log

Evaluation note. This file records what was measured, what the previous recommendation got wrong, and what a later check should compare. It does not promise a ranking or a click count.

## Who wrote it

- Model: Grok 4.7 (xAI), in the Grok Build session on this repo.
- Written: 2026-11-16 (UTC date on the tool responses is 2026-11-17).
- Sources that returned data:
  - Google Analytics Data API, property `properties/466420534` ("Memento Mori"), timezone America/Vancouver. Report window `90daysAgo` through `yesterday` relative to that call.
  - Search Console property list. Verified owner property: `https://memento-mori.vercel.app/`.
  - Live HTML from `curl` of `https://memento-mori.vercel.app/` and `https://memento-mori.vercel.app/table/1990/1/1` on that same day.
  - Current repo files: `app/page.tsx`, `app/layout.tsx`, `app/[view]/[...params]/page.tsx`, `app/sitemap.tsx`, `app/robots.ts`.
- Source that did not return data: Search Console search analytics (clicks, impressions, queries, position). The property list call succeeded. The query report tool then failed with "Tool not found" on three attempts. No query, impression, CTR, or average-position number in this file comes from Search Console. Do not treat any query below as a measured query.

## Retraction of the previous recommendation

The previous answer said the homepage title was "Memento Mori Life Calendar - Visualize Your Life in Weeks" and that personal calendar URLs should be given `noindex`. Both claims are false for the site as it is now.

| Claim in the previous answer                                       | What is true now                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage title should be changed to "How many weeks have I lived?" | Production `<title>` is already `Life in Weeks Calculator \| Memento Mori`. Local `app/page.tsx` (not what `curl` returned) sets `How many weeks have I lived? \| Memento Mori`. Google is reading the production title, not the unreleased local string. |
| Add `noindex` to `/table/…` and `/burst/…`                         | Production already sends `noindex, follow` on `/table/1990/1/1`. The repo sets `robots.index: false` in `app/[view]/[...params]/page.tsx`.                                                                                                                |
| Calendar URLs are in the sitemap                                   | `app/sitemap.tsx` lists only `/`, `/about`, `/blog`, and `/blog/{slug}`.                                                                                                                                                                                  |

Those two changes are already shipped. Recommending them again would not create clicks.

GA still recorded organic landings on `/table/YYYY/MM/DD` during the 90-day window (13 sessions on `/table/2009/12/16` alone, and 183 distinct organic page paths). That does not prove those URLs are still indexed. `noindex` does not remove a URL from the report of visits that already happened, and this report was not split before and after the tag shipped. I did not inspect Google's index.

## Measured baseline

GA, organic search only, 90 days ending the day before the API call.

Channel totals for the same window, all channels, so the organic number has a denominator:

| Channel        | Sessions | Engaged sessions | Engagement rate | Avg session duration |
| -------------- | -------- | ---------------- | --------------- | -------------------- |
| Organic Search | 232      | 154              | 0.664           | 158 s                |
| Direct         | 128      | 39               | 0.305           | 165 s                |
| Referral       | 13       | 10               | 0.769           | 204 s                |
| AI Assistant   | 4        | 3                | 0.75            | 37 s                 |

Organic landing pages with at least 2 sessions:

| Landing page                       | Sessions | Engaged | Engagement rate |
| ---------------------------------- | -------- | ------- | --------------- |
| `/`                                | 186      | 132     | 0.710           |
| `/table/2009/12/16`                | 13       | 8       | 0.615           |
| `(not set)`                        | 10       | 0       | 0               |
| `/blog/what-is-memento-mori`       | 3        | 2       | 0.667           |
| `/blog/famous-stoics-on-mortality` | 2        | 2       | 1               |
| `/table/1972/02/10`                | 2        | 0       | 0               |
| `/table/1975/05/01`                | 2        | 2       | 1               |
| `/table/1991/05/19`                | 2        | 1       | 0.5             |

`/` is 186 / 232 = 80% of organic landing sessions. Journal URLs are not the landing page. The page-view report (not landings) still shows `/blog` at 27 views and `/about` at 12 views inside organic sessions, so people open those after arriving. That is not a Google click on the article.

Live HTML, production:

- Home title: `Life in Weeks Calculator | Memento Mori`
- Home robots: `index, follow`
- Home canonical: `https://memento-mori.vercel.app`
- Sample calendar title: `Your Life in Weeks - Age 36 - Table View | Memento Mori`
- Sample calendar robots: `noindex, follow`
- Sample calendar canonical: the calendar URL itself, not `/`

`robots.ts` allows `/` and points at `sitemap.xml`. It does not disallow `/table` or `/burst`. `noindex` is the control, not `robots.txt`.

## Reasoning that survives the correction

Google clicks in this window land on the calculator, not on the journal. A new stoicism essay does not match that behavior. The weekends article and the life-in-weeks article already exist. Another definition of memento mori would compete with `/blog/what-is-memento-mori`, which had 3 organic landing sessions.

The content that matches the page Google already sends people to is a single indexable article whose heading is the count, with an HTML table of weeks lived by age, and a link to the form on `/`. Suggested title: "How Many Weeks Have I Lived?". That is a proposal. It is not a query Search Console returned, because that report failed.

Shipping the local homepage title (`How many weeks have I lived?`) is a separate, smaller change. It is not "missing SEO." It replaces a live title that already says "Life in Weeks Calculator." Whether that swap raises CTR is unknown until Search Console impressions and clicks are read for the homepage before and after. Do not change the title and the article in the same week if the goal is to know which one moved.

## Projected KPI

These are evaluation targets, not a forecast. No search-volume tool was called. No impression count was returned. A percentage lift would be invented.

Compare the next full 90 days after a change is deployed to production against the baseline above. Same property, same organic-landing definition.

| KPI                                              | Baseline already measured | Pass condition                                                                                       | Fail condition                                                                                                                            |
| ------------------------------------------------ | ------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Organic sessions on the property                 | 232 / 90 days             | Report the new count. No pass line. The sample is too small to call a 10% move real.                 | Treating noise as a win.                                                                                                                  |
| Homepage share of organic landings               | 186 / 232 = 80%           | Stays at or above 80% if the only change is the homepage title.                                      | Share falls because `/table/…` landings grow. That would mean `noindex` is not what Google is using.                                      |
| New article organic landings                     | 0 (page does not exist)   | At least 1 organic landing session in the 90 days after index. That only proves Google sent someone. | 0 landings is an acceptable result at this traffic level. It is not proof the article was wrong. It is proof it did not earn a click yet. |
| Search Console homepage clicks, impressions, CTR | Not measured this session | Pull them before the title edit and again 28 days after. CTR change is the title KPI.                | Judging the title from GA sessions alone. Sessions mix rankings, season, and branded queries.                                             |

If Search Console is queried later, the first report to save into this file is: property `https://memento-mori.vercel.app/`, web search, dimensions `query` and `page`, same 90-day window as the GA baseline (`start` about 90 days before the GA `yesterday`). Until those rows exist, this log has no query list.

## What not to do on the back of this log

- Do not add `noindex` again. It is already on the calendar routes in production.
- Do not canonical calendar URLs to `/` without a separate decision. They currently canonical to themselves, which is correct for a shareable `noindex` URL.
- Do not invent a click target such as "double organic traffic." Nothing in the API response supports a rate.
