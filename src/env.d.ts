/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  WAITLIST: KVNamespace;
  ASGARDEO_CLIENT_ID: string;
  ASGARDEO_CLIENT_SECRET: string;
  SESSION_SECRET: string;
}

declare namespace App {
  interface Locals extends Runtime {}
}
