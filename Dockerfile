# Development image: consistent Node toolchain for Expo / Metro.
# Native store builds (EAS) or local emulators usually stay on the host — see README.

FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
