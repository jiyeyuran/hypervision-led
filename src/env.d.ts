/// <reference types="astro/client" />

import type { AppEnv } from './lib/server/types';

declare global {
  namespace App {
    interface Locals {
      runtime: {
        env: AppEnv;
      };
    }
  }
}

export {};
