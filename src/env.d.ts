/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  WAITLIST: KVNamespace;
}

declare namespace App {
  interface Locals extends Runtime {}
}
