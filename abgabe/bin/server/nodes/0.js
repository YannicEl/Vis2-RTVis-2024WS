import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CKNYa1EK.js","_app/immutable/chunks/disclose-version.BcvwuTr4.js","_app/immutable/chunks/runtime.Cjuk95Ml.js","_app/immutable/chunks/snippet.oTIXrgI_.js"];
export const stylesheets = ["_app/immutable/assets/0.hJctMLDN.css"];
export const fonts = ["_app/immutable/assets/courier_prime_latin_ext_400.D3hTVHu3.woff2","_app/immutable/assets/courier_prime_latin_400.DLcZnEcv.woff2","_app/immutable/assets/courier_prime_latin_ext_700.BwCddwwI.woff2"];
