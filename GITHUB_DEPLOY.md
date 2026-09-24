# Publishing FoodWise RWP to GitHub Pages

This gets you a real, shareable link like:

```
https://<your-github-username>.github.io/<repo-name>/
```

anyone can open in a browser — no install needed on their end. A GitHub
Actions workflow is already included in this project
(`.github/workflows/deploy.yml`) that automatically builds and deploys the
site every time you push to `main`, so after the one-time setup below,
publishing updates is just `git push`.

## 1. Create the GitHub repository

Go to **https://github.com/new** and create a new repository (e.g. named
`foodwise-rwp`). Leave it empty — don't add a README/.gitignore there,
since this project already has them.

## 2. Push this project to it

Open a terminal in the `foodwise-rwp` folder you downloaded and run:

```bash
git init
git add .
git commit -m "Initial FoodWise RWP prototype"
git branch -M main
git remote add origin https://github.com/<your-github-username>/<repo-name>.git
git push -u origin main
```

Replace `<your-github-username>` and `<repo-name>` with your actual values.

## 3. Turn on GitHub Pages

On GitHub, go to your repo → **Settings → Pages**. Under **Build and
deployment → Source**, choose **GitHub Actions** (not "Deploy from a
branch"). That's it — you don't need to pick a workflow, the one already
in this repo is detected automatically.

## 4. Watch it deploy

Go to the **Actions** tab in your repo. You'll see a run called "Deploy
FoodWise RWP to GitHub Pages" — it takes about a minute. Once it shows a
green check, go back to **Settings → Pages** and your live URL is shown at
the top:

```
https://<your-github-username>.github.io/<repo-name>/
```

Share that link — anyone can open it directly in a browser on desktop or
mobile. It works standalone with the bundled demo dataset (no backend
required), exactly like it did on your machine.

## Updating the live site later

Any time you want to publish changes:

```bash
git add .
git commit -m "describe your change"
git push
```

The Actions workflow rebuilds and redeploys automatically within a minute
or two — no extra steps.

## Common issues

- **Blank page / assets 404 after deploying**: this almost always means
  the base path is wrong. The workflow sets it automatically from your
  repo name (`VITE_BASE_PATH: /${{ github.event.repository.name }}/`), so
  this should just work — but if you renamed the repo after the first
  deploy, push a new commit to re-trigger the build with the new name.
- **Refreshing a page like `/restaurants/r1` shows a 404**: this is
  already handled — `public/404.html` and a small inline script in
  `index.html` work together to redirect deep links correctly on GitHub
  Pages (which has no server-side routing of its own). If you copied only
  parts of this project rather than the whole folder, make sure both of
  those files came along.
- **Actions tab shows a red X**: click into the failed run to see the
  error — most commonly a `package.json` issue. Paste me the error and
  I'll help you fix it.
- **Wanting real accounts / a live database for site visitors**: GitHub
  Pages only hosts static files, so it can't run the FastAPI backend.
  The site will still work great in its offline demo mode for anyone who
  opens the link. To give visitors real accounts too, you'd deploy
  `backend/` separately to a host that runs Python (Render, Railway, Fly.io,
  a VPS, etc.) and set `VITE_API_BASE_URL` to that backend's public URL
  before the GitHub Actions build runs (as a repository secret/variable
  passed into the workflow's `env:` block) — let me know if you want help
  wiring that up.

## Alternative: Netlify / Vercel

If you'd rather not use GitHub Pages, both Netlify and Vercel can deploy
straight from a GitHub repo with zero config (`npm run build`, publish
directory `dist`) and give you a live link just as easily — useful if you
later add the backend too, since both can also host it.
