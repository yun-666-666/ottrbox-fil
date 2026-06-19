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

## Docker Compose

Download `docker-compose.yml`, then run:

```bash
docker compose up -d
```

The service listens on:

```text
http://localhost:3000
```

The default compose file uses the Docker Hub image:

```text
yunmengdocker/ottrbox-fil:latest
```

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

## Notes

- The passcode is the existing share ID.
- Text shares are stored as share content, not as uploaded files.
- Existing file shares continue to work.

## License

This repository keeps the upstream OttrBox license. See [LICENSE](LICENSE).
