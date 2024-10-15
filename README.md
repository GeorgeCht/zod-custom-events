<div align="center">

# Zod Custom Events

Type safe, framework agnostic, Zod based, custom events extension library.

[![NPM Version](https://img.shields.io/npm/v/zod-custom-events.svg?style=flat-square)](https://www.npmjs.com/package/@georgecht/zod-custom-events)
[![JSR Version](https://jsr.io/badges/@georgecht/zod-custom-events)](https://jsr.io/@georgecht/zod-custom-events)
[![JSR Score](https://jsr.io/badges/@georgecht/zod-custom-events/score)](https://jsr.io/@<scope>/<package>)
[![CI](https://img.shields.io/github/actions/workflow/status/georgecht/zod-custom-events/release.yml?style=flat-square)](https://github.com/georgecht/zod-custom-events/actions/workflows/release.yml)
[![Codecov](https://codecov.io/github/GeorgeCht/zod-custom-events/graph/badge.svg?token=X8MC11L7NV)](https://codecov.io/github/GeorgeCht/zod-custom-events)
[![Checked with Biome](https://img.shields.io/badge/checked_with-biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/georgecht/zod-custom-events/blob/master/LICENSE)
![NPM Bundle Size](https://img.shields.io/bundlephobia/min/zod-custom-events)
<!-- [![NPM Downloads](https://img.shields.io/npm/zod-custom-events.svg)](https://www.npmjs.org/package/zod-custom-events) -->

</div>



- ✅ Utilize the full controll of [`CustomEvents`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) with a custom API
- ✅ End-to-end type safety; validate event payload at runtime via your provided [`Zod`](https://github.com/colinhacks/zod) schema
- ✅ Framework agnostic; runs on any `JavaScript` environment
- ✅ Supports all [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) native properties and methods inherited by the [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) interface
- ✅ Middleware support for event processing
- ✅ Less than __1kb__ minified and gzipped

<img src="./.github/assets/example.png" width="1024px" alt="example" />

## Installation

Install zod-custom-events using your favorite package manager or CDN, then include it in your project:

### Using Node.js or Bun

```bash
# Install with npm
npm install zod-custom-events

# Install with pnpm
pnpm add zod-custom-events

# Install with yarn
yarn add zod-custom-events

# Install with bun
bun add zod-custom-events
```

### Using JSR

```bash
# Install in a node project
npx jsr add @georgecht/zod-custom-events

# Install in a deno project
deno add jsr:@georgecht/zod-custom-events

# Install in a bun project
bunx jsr add @georgecht/zod-custom-events
```

### Using a CDN

```html
<script src="https://cdn.jsdelivr.net/npm/zod-custom-events@latest/dist/index.min.js"></script>
```
