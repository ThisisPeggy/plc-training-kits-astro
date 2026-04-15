# PLC Training Kits Astro Site

English marketing website for PLC training kits and automation services.

## Tech Stack

- Astro 5
- Static site output
- Product data managed in `src/data/products.ts`

## Main Structure

```text
/
|- public/                  # Static assets
|- src/
|  |- components/           # Shared UI components
|  |- data/                 # Product and category data
|  |- images/               # Product images used by Astro
|  |- layouts/              # Shared page layout
|  |- pages/                # Route pages
|  `- styles/               # Global styles
|- package.json
`- vercel.json
```

## Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Notes

- Main product content lives in `src/data/products.ts`.
- Product detail routes are generated from `src/pages/products/[slug].astro`.
- Category routes are generated from `src/pages/products/[category].astro`.
- Static build output is generated to `dist/`.
