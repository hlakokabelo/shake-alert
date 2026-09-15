# Shake-Alert

live-demo [Shake-alert](https://thapeloh.vercel.app/)

A simple React + TypeScript web app that detects phone shaking using the browser's `DeviceMotionEvent` API.

## Features

- Enable or disable shake detection
- Request motion permission on supported devices
- Detect repeated strong phone movements
- Trigger an emergency action after a shake pattern
- Cooldown to reduce accidental repeated triggers

## Tech Stack

- React
- TypeScript
- Vite
- DeviceMotion API

## Run Locally

```bash
npm install
npm run dev