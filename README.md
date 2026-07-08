# @majo/plugin-seo-audit

A **Majo** plugin (one plugin, one repo) that fetches every deployed project's
live site and scores its on-page SEO — title, meta description, `<h1>`,
`og:image`, viewport, canonical — surfacing concrete issues.

- **Route:** `GET /api/plugins/majo.seo-audit/audit`
- **Permissions:** `projects:read`, `http:outbound`, `api:route`
- **Contract:** [`@majo/plugin-sdk`](https://github.com/MajoCommand/majo-plugin-sdk)

```bash
npm install
npm test        # pure scorer, no network
```

The scoring core (`auditHtml`) is pure and fully tested; the plugin entry wires
it to the scoped API + `fetch`.
