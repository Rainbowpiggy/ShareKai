# ShareKAI

This folder is a complete Vite/React project prepared for Vercel. The original
single JSX component could not be deployed by itself because it had no HTML
entry point, package manifest, build script, or generated output directory.

## Test locally

1. Install Node.js 20.19 or newer.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev`.

## Deploy with Vercel

1. Upload the **contents of this folder** to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Leave the framework preset as **Vite**.
4. Confirm that the build command is `npm run build` and the output directory
   is `dist`.
5. Click **Deploy**.

If this folder is placed inside a larger repository, set Vercel's **Root
Directory** to the folder containing this `package.json` file.

This version is a front-end prototype. Its sample inventory and requests reset
when the page is refreshed because no database is connected yet.
