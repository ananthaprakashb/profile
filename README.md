# Ananthaprakash — profile site

A fast, responsive, and accessible personal site for Ananthaprakash Nithiyanantham.

## What is included

- A modern one-page portfolio with About, Journey, Work, Research, Writing, and Connect sections.
- Light and dark themes with saved visitor preference.
- Mobile navigation, active-section highlighting, project filters, and subtle motion.
- SEO metadata, Open Graph sharing tags, Person structured data, sitemap, and robots file.
- A GitHub Pages deployment workflow with no framework or dependency overhead.
- Accessibility support for keyboard navigation, reduced motion, focus states, and semantic landmarks.
- An official LinkedIn public-profile badge that refreshes from LinkedIn when the page loads.
- A current-work portfolio featuring Impact Commons, Semantic Saga, DrawDiagrams, Cristóvão, mcp-gate, and Safe Payments.
- An Engineering Stepstone section with its live projects and a Blogger feed that surfaces the latest published article.

## LinkedIn live view

The site uses LinkedIn’s official public-profile badge for a live LinkedIn panel. It does not scrape LinkedIn or store
LinkedIn credentials. Public profile changes can appear in the badge after a page refresh, subject to LinkedIn’s public
visibility settings and caching.

The badge does not rewrite the handcrafted About, Journey, Work, Research, or Writing content. Full automated access to
LinkedIn profile fields requires LinkedIn approval for its restricted Profile API and a secure server-side OAuth
integration; GitHub Pages alone cannot safely hold those credentials.

## Engineering Stepstone

The profile treats Engineering Stepstone as the public bridge between working software and the lessons behind it:

- [Impact Commons](https://research.engineeringstepstone.com/) — profile-guided opportunities, peer-review pathways, research tools, and evidence.
- [DrawDiagrams](https://diagrams.engineeringstepstone.com/) — an accessible, browser-first Mermaid and infographic studio.
- [Engineering Stepstone](https://www.engineeringstepstone.com/) — articles on payments, reliability, secure agentic systems, visual thinking, and production engineering.

The page includes verified static article fallbacks for resilience, then loads the five newest Blogger entries through the public JSONP feed. The newest post becomes the featured article and the following four populate the recent-writing list. No blog credentials are stored in the site.

## Run locally

The site is plain HTML, CSS, and JavaScript. From the repository root:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Deploy

Merging the site into `main` triggers `.github/workflows/pages.yml`. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions** if it is not already selected.

The expected project Pages URL is:

`https://ananthaprakashb.github.io/profile/`

## Easy content updates

- Profile and page content: `index.html`
- Visual system and responsive layouts: `styles.css`
- Interactions and filtering: `script.js`
- Social preview and structured metadata: the `<head>` of `index.html`

## Product roadmap

The site now establishes a current public profile, living Engineering Stepstone feed, and connection path. Future iterations can add:

- A data file or CMS for projects, talks, and publications.
- A moderated “people and ideas” directory.
- Topic-based introductions and collaboration requests.
- Newsletter or update subscriptions with explicit consent.
- Analytics that preserve visitor privacy.
