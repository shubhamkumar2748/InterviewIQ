#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/Frontend"
npm install
npm run dev -- --host 0.0.0.0
