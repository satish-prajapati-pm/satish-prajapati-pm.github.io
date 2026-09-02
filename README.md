# satish-prajapati-pm.github.io

Personal brand website — Satish Prajapati, Digital Product & Delivery Leader.
Static site, no build step, no dependencies. Open `index.html` and it runs.

## Structure

```
.
├── index.html                  # the page (semantic HTML, all content)
├── assets/
│   ├── css/
│   │   └── style.css           # design tokens + all styling (numbered sections)
│   ├── js/
│   │   └── main.js             # progressive enhancement only
│   └── media/
│       ├── favicon.svg         # SP monogram
│       └── (project imagery, og-image.png, CV pdf → put them here)
├── .nojekyll                   # stops GitHub Pages running Jekyll
└── README.md
```

Everything is class-based. Colours, type and spacing live as CSS custom
properties in the `:root` block at the top of `style.css` — change a token
there and it updates site-wide.

## Deploying to GitHub Pages

This repo is a **user site**, so Pages serves whatever is at the root of the
default branch.

1. Copy the contents of this folder (not the folder itself) to the repo root.
2. Commit and push to `main`.
3. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
4. Live at https://satish-prajapati-pm.github.io/ within a minute or two.

## Adding images

Drop files into `assets/media/` and reference them as
`assets/media/your-file.webp`. Two worth adding:

- `og-image.png` — 1200×630, used by the social preview meta tag.
- Project imagery for the three featured case studies.

## Editing content

| What | Where |
|---|---|
| Copy, headings, case studies | `index.html` |
| Colours, type scale, spacing | `:root` in `assets/css/style.css` |
| Delivery-stage content (Approach) | `STAGES` array in `assets/js/main.js` |
| Metric numbers | `data-count` / `data-prefix` / `data-suffix` in `index.html` |

## Outstanding

Placeholders marked `[… TO BE PROVIDED]` in `index.html` need real figures
before the site should be shared widely. Search the file for `class="todo"`.

## Accessibility & performance notes

- Semantic landmarks, one `<h1>`, logical heading order, skip link.
- All motion is disabled under `prefers-reduced-motion: reduce`.
- No frameworks, no bundler; only external request is Google Fonts.
- JavaScript is enhancement-only — the page reads fine without it.
