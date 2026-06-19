# OttrBox Text/Passcode Publish Notes

This folder is a clean publish-ready copy of the modified OttrBox project.

Target GitHub repository:

```text
https://github.com/yun-666-666/ottrbox-fil
```

Target Docker Hub image:

```text
yun666666/ottrbox-fil:latest
```

## Included
- Full OttrBox source needed to build and run with Docker.
- Text sharing and passcode retrieval changes.
- `Dockerfile` updated for pnpm-based builds.
- `docker-compose.yml` and `docker-compose.local.yml`.
- Backend and frontend pnpm lockfiles.

## Excluded
- `.codex/`
- `.git/`
- `node_modules/`
- backend `dist/`
- frontend `.next/`
- backend runtime data and uploads
- generated frontend service-worker output

## Docker Compose

For a local build from this source:

```bash
docker compose -f docker-compose.local.yml up -d --build
```

The local compose file maps host port `3001` to container port `3000`.

Open:

```text
http://localhost:3001
```

For a published image, `docker-compose.yml` already uses:

```text
yun666666/ottrbox-fil:latest
```

Then run:

```bash
docker compose up -d
```

The default compose file maps host port `3000` to container port `3000`.

## First Run
- Open the web UI.
- Register the first user/admin as prompted by OttrBox.
- Configure anonymous sharing in the admin UI if you want uploads without login.

## Notes
- The backend migration adds `Share.text`.
- Existing file-sharing behavior is preserved.
- Passcode is the existing share ID.
- README credits OttrBox, Pingvin Share, and FileCodeBox.
