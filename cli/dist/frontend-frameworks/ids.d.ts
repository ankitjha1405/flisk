/**
 * The frontend framework ids a service.json may name. It lives apart from registry.ts, which imports every provider (and
 * through them most of the CLI), so the `flisk up` gate can check `framework` without an import cycle. A test keeps this list
 * equal to the registry's keys.
 */
export declare const FRONTEND_FRAMEWORK_IDS: readonly ["react", "vue", "svelte", "preact", "lit", "solid", "qwik", "vanilla", "tanstack-router", "next"];
