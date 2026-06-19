# OttrBox Fil

OttrBox Fil is a self-hosted sharing service based on OttrBox. It keeps the
original file-sharing workflow and adds two FileCodeBox-style features:
sharing plain text without uploading a file, and opening a share by entering a
passcode.

## Features

- Share files by link, using the existing OttrBox workflow.
- Share plain text directly from the upload page.
- Open shares from a passcode entry page.
- Show both the share link and the passcode after a share is created.
- Render shared text directly on the share page.
- Copy shared text to the clipboard.
- Reuse OttrBox expiration dates, password protection, visitor limits,
  anonymous sharing settings, authenticated sharing, and share-link behavior.
- Keep OttrBox storage, authentication, reverse proxy, and Docker deployment
  structure.

## Credits

This project is built on the work of several open-source projects:

- [OttrBox](https://github.com/aottr/ottrbox), the base project used here.
- [Pingvin Share](https://github.com/stonith404/pingvin-share), the original
  project that OttrBox is based on.
- [FileCodeBox](https://github.com/vastsa/FileCodeBox), which inspired the
  text-sharing and passcode retrieval workflow.

Thank you to the maintainers and contributors of those projects.

Additional thanks to GPT-5.5 for doing most of the implementation and release
assistance, and to Claude Opus 4.6 for contributing a smaller part of the work.

## Docker Deployment

The recommended deployment path is Docker Compose with the published Docker Hub
image:

```text
yunmengdocker/ottrbox-fil:latest
```

### Quick Start

Install Docker Engine with the Compose plugin on your server, clone this
repository, and start the container:

```bash
git clone https://github.com/yun-666-666/ottrbox-fil.git
cd ottrbox-fil
docker compose up -d
```

Docker Compose will pull `yunmengdocker/ottrbox-fil:latest` and create the local
`data` directory for persistent database, upload, and image data.

The service listens on:

```text
http://localhost:3000
```

Verify the container and health endpoint:

```bash
docker compose ps
curl -i http://127.0.0.1:3000/api/health
```

Expected health response:

```text
HTTP/1.1 200 OK
OK
```

Keep the generated `data` directory. It contains the SQLite database and user
uploads:

```text
./data:/opt/app/backend/data
./data/images:/opt/app/frontend/public/img
```

Back up `./data` before updating, moving servers, or changing compose files.

## Reverse Proxy Deployment

If you run OttrBox Fil behind Nginx, OpenResty, Caddy, Cloudflare, or a control
panel reverse proxy, use the reverse proxy compose example:

```bash
docker compose -f docker-compose.reverse-proxy.yml up -d
```

That file binds the app to `127.0.0.1:9970` on the host and sets
`TRUST_PROXY=true`. Point your reverse proxy to:

```text
http://127.0.0.1:9970
```

Do not expose the host port publicly unless you intentionally want direct
access without the reverse proxy.

After starting the reverse-proxy compose file, verify locally:

```bash
docker compose -f docker-compose.reverse-proxy.yml ps
curl -i http://127.0.0.1:9970/api/health
```

Then verify through your public domain:

```bash
curl -i https://your-domain.example/api/health
```

If you proxy large uploads, configure your reverse proxy with a large enough
request body limit and long enough read/send timeouts.

## Updating A Docker Deployment

From the deployment directory:

```bash
git fetch origin main --prune
git reset --hard origin/main
docker compose pull
docker compose up -d
docker compose ps
```

For reverse-proxy deployments, use the same compose file consistently:

```bash
git fetch origin main --prune
git reset --hard origin/main
docker compose -f docker-compose.reverse-proxy.yml pull
docker compose -f docker-compose.reverse-proxy.yml up -d
docker compose -f docker-compose.reverse-proxy.yml ps
```

During first startup or after an update, the container may need time to run
Prisma migrations and seed configuration. The Docker healthcheck includes a
startup grace period for that work.

## Build Locally

To build from this source tree instead of pulling the published image:

```bash
docker compose -f docker-compose.local.yml up -d --build
```

The local build compose file maps the app to:

```text
http://localhost:3001
```

## First Run

Open the web UI and register the first user as prompted. If you want users to
create shares without logging in, enable anonymous sharing in the OttrBox admin
configuration.

## Low Resource VPS Notes

Small VPS instances should pull the published Docker Hub image instead of
building the production image on the server. Building the frontend and backend
locally can keep a 1 vCPU server busy for a long time and may require more disk
space than is available. Build on a local machine or CI, push the image, then
run `docker compose pull` and `docker compose up -d` on the VPS.

After pulling a fixed published image, use `docker-compose.yml` or
`docker-compose.reverse-proxy.yml` directly. Runtime-install compose overrides
that install Prisma during container startup should only be used as temporary
recovery files and can be removed once the new image is healthy.

## Notes

- The passcode is the existing share ID.
- Text shares are stored as share content, not as uploaded files.
- Existing file shares continue to work.

## License

This repository keeps the upstream OttrBox license. See [LICENSE](LICENSE).
