import * as universal from '../entries/pages/examples/_layout.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/examples/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/examples/+layout.ts";
export const imports = ["_app/immutable/nodes/2.7K6fvXe1.js","_app/immutable/chunks/disclose-version.BcvwuTr4.js","_app/immutable/chunks/runtime.Cjuk95Ml.js","_app/immutable/chunks/props.CnKyG9G2.js","_app/immutable/chunks/proxy.Cc6fi5nY.js","_app/immutable/chunks/snippet.oTIXrgI_.js","_app/immutable/chunks/render.D5jNgPOw.js","_app/immutable/chunks/events.DrILCSVv.js","_app/immutable/chunks/attributes.Bt4tGm2O.js","_app/immutable/chunks/client.of6eQoV6.js","_app/immutable/chunks/entry.DT83CXea.js","_app/immutable/chunks/control.CYgJF_JY.js","_app/immutable/chunks/index-client.DibeTDnh.js","_app/immutable/chunks/controls.svelte.EJqBkrRw.js","_app/immutable/chunks/globalState.svelte.CHPqU7Zl.js"];
export const stylesheets = ["_app/immutable/assets/2.BP02lCKC.css"];
export const fonts = [];
