/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface CloudflareEnv {
  ANTHROPIC_API_KEY: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}
