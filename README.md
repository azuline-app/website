<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/azuline-app/.github/main/profile/azuline-banner-dark.svg">
    <img alt="azuline" src="https://raw.githubusercontent.com/azuline-app/.github/main/profile/azuline-banner-light.svg" width="560">
  </picture>
</p>

# azuline.app

The website, built with Astro as a static site for Cloudflare Pages. For now it is one screen: what azuline is,
that it's in development, links to GitHub and email, and one public-domain or CC BY artwork per visit.

## Commands

| Command | What it does |
|---|---|
| `bun install` | Install dependencies |
| `bun run dev` | Local server with reload at http://localhost:4321 |
| `bun run build` | Build into `dist/`, then write `dist/_headers` (scripts/headers.ts) |
| `bun run preview` | Serve `dist/` (without the `_headers` rules) |
| `bun run check` | Type check (`astro check`) and lint/format check (Biome) |
| `bun run format` | Format with Biome |

## Link previews

Every page carries Open Graph and X card tags from `src/layouts/Base.astro`, with text and links from
`src/data/site.ts`. Discord takes the colour bar from `theme-color`. The preview image is `public/og.png`
(1200×630), a screenshot of the unlisted page `/og/`. After changing the headline or the brand, rebuild, serve
`dist/` and screenshot `/og/` at 1200×630 into `public/og.png`, then build again.

## Security headers

`scripts/headers.ts` writes `dist/_headers` after each build: a Content-Security-Policy with the SHA-256 of every
inline script the build produced, HSTS, no framing, no referrer leaks beyond the origin, `noai` robot tags, and
cache rules. Inline scripts can't run unless their hash is in that file, so always deploy the output of
`bun run build`, never a `dist/` built another way.

## Artwork

`src/data/art.ts` lists the pieces with credit, licence and source. Files are WebP, at most 1000 px wide, in
`public/art/`. Add only public-domain or CC BY work, and keep the credit exact.

## Licences

- **Code and text:** MIT, see [LICENSE](LICENSE).
- **The azuline name, logo, wordmark and icons** (`public/brand/`, the favicons, `public/icon-*.png`,
  `public/apple-touch-icon.png` and `public/og.png`) are not covered by the MIT licence. A fork needs its own name
  and branding.
- **Artwork** in `public/art/` keeps its own licence, public domain or CC BY 4.0, as listed with its credit in
  `src/data/art.ts`.
- **Fonts:** Unbounded and Geologica, subset for the web, under the SIL Open Font License 1.1. The licence texts
  are in `public/fonts/`.

Contributions are welcome under the rules in the organisation's
[contributing guide](https://github.com/azuline-app/.github/blob/main/CONTRIBUTING.md), including the sign-off on
every commit.

