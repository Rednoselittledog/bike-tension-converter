# Spoke converter

Converts bicycle spoke tension (kgf) to a tension-meter gauge reading (mm) and back, for 2.0 mm spokes.
The calibration curve lives in `app/utils/calibration.js`.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm test
```

## Deploy

The app is fully client-side, so it deploys as a static site:

- Build command: `npm run generate`
- Output directory: `.output/public`
