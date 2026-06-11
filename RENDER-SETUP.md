# Render setup (follow exactly)

## I can't connect Cursor to Render

Paste **Logs** into Cursor when something fails. These steps avoid the Ruby mistake.

---

## Option A — Blueprint (recommended)

1. **Delete** any existing Render services for this repo (Settings → Delete).
2. Render dashboard → **New +** → **Blueprint**.
3. Select repo: `mo-othman98/foreigners-club-app`.
4. Click **Apply**.
5. Wait until status is **Live**.

Blueprint reads `render.yaml` and sets **Node** automatically.

---

## Option B — Docker (if Blueprint fails)

1. Delete old service.
2. **New +** → **Web Service** → repo `foreigners-club-app`.
3. **Language / Runtime:** **Docker** (not Ruby, not Static).
4. Leave **Dockerfile Path** as `Dockerfile`.
5. **Root Directory:** blank.
6. Add environment variables:
   - `DATA_DIR` = `/var/data`
   - `DATABASE_URL` = `file:/var/data/app.db`
7. Add disk: mount `/var/data`, 1 GB.
8. **Create Web Service**.

---

## Before deploying — push latest code

```bash
cd ~/Documents/foreigners-club-app
git add .
git commit -m "Fix Render deploy"
git push
```

---

## Success check

Open: `https://YOUR-SERVICE.onrender.com/api/connect`

Should show: `{"profiles":[]}`
