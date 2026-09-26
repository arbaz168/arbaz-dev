# arbaz-dev

Personal site: one static page with an animated hero, case studies with architecture diagrams, a live webhook inbox simulator, an experience timeline and contact details. Content lives in `lib/content.ts`.

All motion stops under `prefers-reduced-motion`.

Next.js (App Router) with `output: "export"`, so the build is plain HTML, CSS and JS in `out/` and runs on any static host. The simulator in `lib/webhookSim.ts` runs entirely in the browser and models the pattern from [aspnetcore-webhook-inbox](https://github.com/arbaz168/aspnetcore-webhook-inbox).

```bash
npm install
npm run dev
```

```bash
npm run build
```
