# Font licensing

| File | Family | Foundry | Status |
|---|---|---|---|
| Quasimoda-Medium.woff2 | Quasimoda (500) | Latinotype (commercial) | ⚠️ license confirmation required |
| Quasimoda-Semibold.woff2 | Quasimoda (600) | Latinotype (commercial) | ⚠️ license confirmation required |
| Quasimoda-Bold.woff2 | Quasimoda (700) | Latinotype (commercial) | ⚠️ license confirmation required |
| roboto-*.woff2 | Roboto | Google (Apache 2.0) | boilerplate leftovers, unused |

Quasimoda is the wijnvoordeel.be brand face. The woff2 files here are the
customer's own webfont files, self-hosted from their public
`/static/…/fonts/Quasimoda/` URLs for this replica **demo**. e-luscious holds
the Quasimoda license for their properties — before publishing this site to a
production domain, confirm the license covers the delivery host
(`*.aem.live` / final domain).

**Remove path** if licensing cannot be confirmed: delete `Quasimoda-*.woff2`
and their `@font-face` rules in `styles/fonts.css`. Every stack falls back to
`quasimoda-fallback` (metric-matched Arial, declared in `styles/styles.css`)
with zero layout shift.
