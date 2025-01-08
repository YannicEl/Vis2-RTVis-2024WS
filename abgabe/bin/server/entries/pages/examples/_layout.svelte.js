import { d as spread_attributes, c as pop, p as push, h as hasContext, g as getContext, s as setContext, o as once, e as bind_props, f as copy_payload, j as assign_payload, k as spread_props, l as ensure_array_like } from "../../../chunks/index2.js";
import { e as escape_html, c as clsx, a as clsx$1, b as attr } from "../../../chunks/attributes.js";
import "../../../chunks/client.js";
import "../../../chunks/client2.js";
import { o as onDestroy, g as globalState } from "../../../chunks/globalState.svelte.js";
import { r as run } from "../../../chunks/equality.js";
function FpsCounter($$payload, $$props) {
  push();
  let { fps, $$slots, $$events, ...props } = $$props;
  $$payload.out += `<div${spread_attributes({ ...props }, { "svelte-uv3snu": true })}>${escape_html(fps.toFixed())} fps <svg class="h-4 w-4 svelte-uv3snu" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" class="svelte-uv3snu"></circle></svg></div>`;
  pop();
}
function Chevron_down($$payload, $$props) {
  const { $$slots, $$events, ...p } = $$props;
  $$payload.out += `<svg${spread_attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...p
    },
    void 0,
    void 0,
    3
  )}><path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"></path></svg>`;
}
function Chevron_up($$payload, $$props) {
  const { $$slots, $$events, ...p } = $$props;
  $$payload.out += `<svg${spread_attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...p
    },
    void 0,
    void 0,
    3
  )}><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"></path></svg>`;
}
function Chevron_double_right($$payload, $$props) {
  const { $$slots, $$events, ...p } = $$props;
  $$payload.out += `<svg${spread_attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...p
    },
    void 0,
    void 0,
    3
  )}><path fill="currentColor" d="M5.59 7.41L7 6l6 6l-6 6l-1.41-1.41L10.17 12zm6 0L13 6l6 6l-6 6l-1.41-1.41L16.17 12z"></path></svg>`;
}
function useFullscreen(element) {
  let isFullscreen = false;
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      element.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  function setIsFullscreen() {
    isFullscreen = !!document.fullscreenElement;
    console.log(isFullscreen);
  }
  element.addEventListener("fullscreenchange", setIsFullscreen);
  onDestroy(() => element.removeEventListener("fullscreenchange", setIsFullscreen));
  return {
    toggle: toggleFullscreen,
    get value() {
      return isFullscreen;
    }
  };
}
function Fullscreen($$payload, $$props) {
  const { $$slots, $$events, ...p } = $$props;
  $$payload.out += `<svg${spread_attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...p
    },
    void 0,
    void 0,
    3
  )}><path fill="currentColor" d="M5 5h5v2H7v3H5zm9 0h5v5h-2V7h-3zm3 9h2v5h-5v-2h3zm-7 3v2H5v-5h2v3z"></path></svg>`;
}
function Fullscreen_exit($$payload, $$props) {
  const { $$slots, $$events, ...p } = $$props;
  $$payload.out += `<svg${spread_attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...p
    },
    void 0,
    void 0,
    3
  )}><path fill="currentColor" d="M14 14h5v2h-3v3h-2zm-9 0h5v5H8v-3H5zm3-9h2v5H5V8h3zm11 3v2h-5V5h2v3z"></path></svg>`;
}
function Minus($$payload, $$props) {
  const { $$slots, $$events, ...p } = $$props;
  $$payload.out += `<svg${spread_attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...p
    },
    void 0,
    void 0,
    3
  )}><path fill="currentColor" d="M19 13H5v-2h14z"></path></svg>`;
}
function Plus($$payload, $$props) {
  const { $$slots, $$events, ...p } = $$props;
  $$payload.out += `<svg${spread_attributes(
    {
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...p
    },
    void 0,
    void 0,
    3
  )}><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path></svg>`;
}
function Arrow_uturn_ccw_right($$payload, $$props) {
  const { $$slots, $$events, ...p } = $$props;
  $$payload.out += `<svg${spread_attributes(
    {
      viewBox: "0 0 16 16",
      width: "1.2em",
      height: "1.2em",
      ...p
    },
    void 0,
    void 0,
    3
  )}><path fill="currentColor" fill-rule="evenodd" d="M13.53 11.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06L11.19 10H7a3.25 3.25 0 0 1 0-6.5h1A.75.75 0 0 0 8 2H7a4.75 4.75 0 0 0 0 9.5h4.19l-1.72 1.72a.75.75 0 1 0 1.06 1.06z" clip-rule="evenodd"></path></svg>`;
}
function BottomControls($$payload, $$props) {
  push();
  let {
    class: className,
    $$slots,
    $$events,
    ...props
  } = $$props;
  const fullscreen = useFullscreen(document.documentElement);
  $$payload.out += `<div${spread_attributes(
    {
      class: clsx([className, "flex justify-between"]) + " svelte-14k3uwl",
      ...props
    },
    { "svelte-14k3uwl": true }
  )}><button class="svelte-14k3uwl">`;
  Arrow_uturn_ccw_right($$payload, {
    class: "rotate- text-xl",
    style: "animation-play-state: paused;"
  });
  $$payload.out += `<!----></button> <button class="svelte-14k3uwl">`;
  Plus($$payload, { class: "text-2xl" });
  $$payload.out += `<!----></button> <button class="svelte-14k3uwl">`;
  Minus($$payload, { class: "text-2xl" });
  $$payload.out += `<!----></button> <button class="svelte-14k3uwl">`;
  Arrow_uturn_ccw_right($$payload, { class: "-scale-x-100 text-xl" });
  $$payload.out += `<!----></button> <button class="svelte-14k3uwl">`;
  if (fullscreen.value) {
    $$payload.out += "<!--[-->";
    Fullscreen_exit($$payload, { class: "text-2xl" });
  } else {
    $$payload.out += "<!--[!-->";
    Fullscreen($$payload, { class: "text-2xl" });
  }
  $$payload.out += `<!--]--></button></div>`;
  pop();
}
function isFunction(value) {
  return typeof value === "function";
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
const CLASS_VALUE_PRIMITIVE_TYPES = ["string", "number", "bigint", "boolean"];
function isClassValue(value) {
  if (value === null || value === void 0)
    return true;
  if (CLASS_VALUE_PRIMITIVE_TYPES.includes(typeof value))
    return true;
  if (Array.isArray(value))
    return value.every((item) => isClassValue(item));
  if (typeof value === "object") {
    if (Object.getPrototypeOf(value) !== Object.prototype)
      return false;
    return true;
  }
  return false;
}
const BoxSymbol = Symbol("box");
const isWritableSymbol = Symbol("is-writable");
function isBox(value) {
  return isObject(value) && BoxSymbol in value;
}
function isWritableBox(value) {
  return box.isBox(value) && isWritableSymbol in value;
}
function box(initialValue) {
  let current = initialValue;
  return {
    [BoxSymbol]: true,
    [isWritableSymbol]: true,
    get current() {
      return current;
    },
    set current(v) {
      current = v;
    }
  };
}
function boxWith(getter, setter) {
  const derived = getter();
  if (setter) {
    return {
      [BoxSymbol]: true,
      [isWritableSymbol]: true,
      get current() {
        return derived;
      },
      set current(v) {
        setter(v);
      }
    };
  }
  return {
    [BoxSymbol]: true,
    get current() {
      return getter();
    }
  };
}
function boxFrom(value) {
  if (box.isBox(value)) return value;
  if (isFunction(value)) return box.with(value);
  return box(value);
}
function boxFlatten(boxes) {
  return Object.entries(boxes).reduce(
    (acc, [key, b]) => {
      if (!box.isBox(b)) {
        return Object.assign(acc, { [key]: b });
      }
      if (box.isWritableBox(b)) {
        Object.defineProperty(acc, key, {
          get() {
            return b.current;
          },
          set(v) {
            b.current = v;
          }
        });
      } else {
        Object.defineProperty(acc, key, {
          get() {
            return b.current;
          }
        });
      }
      return acc;
    },
    {}
  );
}
function toReadonlyBox(b) {
  if (!box.isWritableBox(b)) return b;
  return {
    [BoxSymbol]: true,
    get current() {
      return b.current;
    }
  };
}
box.from = boxFrom;
box.with = boxWith;
box.flatten = boxFlatten;
box.readonly = toReadonlyBox;
box.isBox = isBox;
box.isWritableBox = isWritableBox;
function composeHandlers(...handlers) {
  return function(e) {
    for (const handler of handlers) {
      if (!handler)
        continue;
      if (e.defaultPrevented)
        return;
      if (typeof handler === "function") {
        handler.call(this, e);
      } else {
        handler.current?.call(this, e);
      }
    }
  };
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var cjs = {};
var inlineStyleParser;
var hasRequiredInlineStyleParser;
function requireInlineStyleParser() {
  if (hasRequiredInlineStyleParser) return inlineStyleParser;
  hasRequiredInlineStyleParser = 1;
  var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
  var NEWLINE_REGEX = /\n/g;
  var WHITESPACE_REGEX = /^\s*/;
  var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
  var COLON_REGEX = /^:\s*/;
  var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
  var SEMICOLON_REGEX = /^[;\s]*/;
  var TRIM_REGEX = /^\s+|\s+$/g;
  var NEWLINE = "\n";
  var FORWARD_SLASH = "/";
  var ASTERISK = "*";
  var EMPTY_STRING = "";
  var TYPE_COMMENT = "comment";
  var TYPE_DECLARATION = "declaration";
  inlineStyleParser = function(style, options) {
    if (typeof style !== "string") {
      throw new TypeError("First argument must be a string");
    }
    if (!style) return [];
    options = options || {};
    var lineno = 1;
    var column = 1;
    function updatePosition(str) {
      var lines = str.match(NEWLINE_REGEX);
      if (lines) lineno += lines.length;
      var i = str.lastIndexOf(NEWLINE);
      column = ~i ? str.length - i : column + str.length;
    }
    function position() {
      var start = { line: lineno, column };
      return function(node) {
        node.position = new Position(start);
        whitespace();
        return node;
      };
    }
    function Position(start) {
      this.start = start;
      this.end = { line: lineno, column };
      this.source = options.source;
    }
    Position.prototype.content = style;
    function error(msg) {
      var err = new Error(
        options.source + ":" + lineno + ":" + column + ": " + msg
      );
      err.reason = msg;
      err.filename = options.source;
      err.line = lineno;
      err.column = column;
      err.source = style;
      if (options.silent) ;
      else {
        throw err;
      }
    }
    function match(re) {
      var m = re.exec(style);
      if (!m) return;
      var str = m[0];
      updatePosition(str);
      style = style.slice(str.length);
      return m;
    }
    function whitespace() {
      match(WHITESPACE_REGEX);
    }
    function comments(rules) {
      var c;
      rules = rules || [];
      while (c = comment()) {
        if (c !== false) {
          rules.push(c);
        }
      }
      return rules;
    }
    function comment() {
      var pos = position();
      if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;
      var i = 2;
      while (EMPTY_STRING != style.charAt(i) && (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))) {
        ++i;
      }
      i += 2;
      if (EMPTY_STRING === style.charAt(i - 1)) {
        return error("End of comment missing");
      }
      var str = style.slice(2, i - 2);
      column += 2;
      updatePosition(str);
      style = style.slice(i);
      column += 2;
      return pos({
        type: TYPE_COMMENT,
        comment: str
      });
    }
    function declaration() {
      var pos = position();
      var prop = match(PROPERTY_REGEX);
      if (!prop) return;
      comment();
      if (!match(COLON_REGEX)) return error("property missing ':'");
      var val = match(VALUE_REGEX);
      var ret = pos({
        type: TYPE_DECLARATION,
        property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
        value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING
      });
      match(SEMICOLON_REGEX);
      return ret;
    }
    function declarations() {
      var decls = [];
      comments(decls);
      var decl;
      while (decl = declaration()) {
        if (decl !== false) {
          decls.push(decl);
          comments(decls);
        }
      }
      return decls;
    }
    whitespace();
    return declarations();
  };
  function trim(str) {
    return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
  }
  return inlineStyleParser;
}
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;
  var __importDefault = cjs.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(cjs, "__esModule", { value: true });
  cjs.default = StyleToObject2;
  var inline_style_parser_1 = __importDefault(requireInlineStyleParser());
  function StyleToObject2(style, iterator) {
    var styleObject = null;
    if (!style || typeof style !== "string") {
      return styleObject;
    }
    var declarations = (0, inline_style_parser_1.default)(style);
    var hasIterator = typeof iterator === "function";
    declarations.forEach(function(declaration) {
      if (declaration.type !== "declaration") {
        return;
      }
      var property = declaration.property, value = declaration.value;
      if (hasIterator) {
        iterator(property, value, declaration);
      } else if (value) {
        styleObject = styleObject || {};
        styleObject[property] = value;
      }
    });
    return styleObject;
  }
  return cjs;
}
var cjsExports = requireCjs();
const StyleToObject = /* @__PURE__ */ getDefaultExportFromCjs(cjsExports);
const parse = StyleToObject.default || StyleToObject;
const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char))
    return void 0;
  return char !== char.toLowerCase();
}
function splitByCase(str) {
  const parts = [];
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = STR_SPLITTERS.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function pascalCase(str) {
  if (!str)
    return "";
  return splitByCase(str).map((p) => upperFirst(p)).join("");
}
function camelCase(str) {
  return lowerFirst(pascalCase(str || ""));
}
function upperFirst(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function lowerFirst(str) {
  return str ? str[0].toLowerCase() + str.slice(1) : "";
}
function cssToStyleObj(css) {
  if (!css)
    return {};
  const styleObj = {};
  function iterator(name, value) {
    if (name.startsWith("-moz-") || name.startsWith("-webkit-") || name.startsWith("-ms-") || name.startsWith("-o-")) {
      styleObj[pascalCase(name)] = value;
      return;
    }
    if (name.startsWith("--")) {
      styleObj[name] = value;
      return;
    }
    styleObj[camelCase(name)] = value;
  }
  parse(css, iterator);
  return styleObj;
}
function executeCallbacks(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
function createParser(matcher, replacer) {
  const regex = RegExp(matcher, "g");
  return (str) => {
    if (typeof str !== "string") {
      throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
    }
    if (!str.match(regex))
      return str;
    return str.replace(regex, replacer);
  };
}
const camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
function styleToCSS(styleObj) {
  if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) {
    throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
  }
  return Object.keys(styleObj).map((property) => `${camelToKebab(property)}: ${styleObj[property]};`).join("\n");
}
function styleToString(style = {}) {
  return styleToCSS(style).replace("\n", " ");
}
const srOnlyStyles = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
  transform: "translateX(-100%)"
};
styleToString(srOnlyStyles);
function isEventHandler(key) {
  return key.length > 2 && key.startsWith("on") && key[2] === key[2]?.toLowerCase();
}
function mergeProps(...args) {
  const result = { ...args[0] };
  for (let i = 1; i < args.length; i++) {
    const props = args[i];
    for (const key in props) {
      const a = result[key];
      const b = props[key];
      const aIsFunction = typeof a === "function";
      const bIsFunction = typeof b === "function";
      if (aIsFunction && typeof bIsFunction && isEventHandler(key)) {
        const aHandler = a;
        const bHandler = b;
        result[key] = composeHandlers(aHandler, bHandler);
      } else if (aIsFunction && bIsFunction) {
        result[key] = executeCallbacks(a, b);
      } else if (key === "class") {
        const aIsClassValue = isClassValue(a);
        const bIsClassValue = isClassValue(b);
        if (aIsClassValue && bIsClassValue) {
          result[key] = clsx$1(a, b);
        } else if (aIsClassValue) {
          result[key] = clsx$1(a);
        } else if (bIsClassValue) {
          result[key] = clsx$1(b);
        }
      } else if (key === "style") {
        const aIsObject = typeof a === "object";
        const bIsObject = typeof b === "object";
        const aIsString = typeof a === "string";
        const bIsString = typeof b === "string";
        if (aIsObject && bIsObject) {
          result[key] = { ...a, ...b };
        } else if (aIsObject && bIsString) {
          const parsedStyle = cssToStyleObj(b);
          result[key] = { ...a, ...parsedStyle };
        } else if (aIsString && bIsObject) {
          const parsedStyle = cssToStyleObj(a);
          result[key] = { ...parsedStyle, ...b };
        } else if (aIsString && bIsString) {
          const parsedStyleA = cssToStyleObj(a);
          const parsedStyleB = cssToStyleObj(b);
          result[key] = { ...parsedStyleA, ...parsedStyleB };
        } else if (aIsObject) {
          result[key] = a;
        } else if (bIsObject) {
          result[key] = b;
        } else if (aIsString) {
          result[key] = a;
        } else if (bIsString) {
          result[key] = b;
        }
      } else {
        result[key] = b !== void 0 ? b : a;
      }
    }
  }
  if (typeof result.style === "object") {
    result.style = styleToString(result.style).replaceAll("\n", " ");
  }
  if (result.hidden !== true) {
    result.hidden = void 0;
    delete result.hidden;
  }
  if (result.disabled !== true) {
    result.disabled = void 0;
    delete result.disabled;
  }
  return result;
}
function useRefById({
  id,
  ref,
  deps = () => true,
  onRefChange,
  getRootNode
}) {
}
const defaultWindow = void 0;
function getActiveElement(document2) {
  let activeElement = document2.activeElement;
  while (activeElement?.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  for (const event2 of events) {
    target.addEventListener(event2, handler, options);
  }
  return () => {
    for (const event2 of events) {
      target.removeEventListener(event2, handler, options);
    }
  };
}
class Readable {
  #current;
  #start;
  constructor(initialValue, start) {
    this.#current = initialValue;
    this.#start = start;
  }
  #subscribers = 0;
  #stop = null;
  get current() {
    if (this.#subscribers === 0) {
      this.#subscribe(false);
      this.#unsubscribe();
    }
    return this.#current;
  }
  #subscribe(inEffect) {
    this.#stop = this.#start(
      (value) => {
        this.#current = value;
      },
      inEffect
    ) ?? null;
  }
  #unsubscribe() {
    if (this.#stop === null) return;
    this.#stop();
    this.#stop = null;
  }
}
function useActiveElement(opts = {}) {
  const { window = defaultWindow } = opts;
  const document2 = opts.document ?? window?.document;
  return new Readable(null, (set, insideEffect) => {
    function update() {
      if (!document2) return;
      set(getActiveElement(document2));
    }
    update();
    if (!insideEffect || !window) return;
    const removeFocusIn = addEventListener(window, "focusin", update);
    const removeFocusOut = addEventListener(window, "focusout", update);
    return () => {
      removeFocusIn();
      removeFocusOut();
    };
  });
}
useActiveElement();
class Context {
  #name;
  #key;
  /**
   * @param name The name of the context.
   * This is used for generating the context key and error messages.
   */
  constructor(name) {
    this.#name = name;
    this.#key = Symbol(name);
  }
  /**
   * The key used to get and set the context.
   *
   * It is not recommended to use this value directly.
   * Instead, use the methods provided by this class.
   */
  get key() {
    return this.#key;
  }
  /**
   * Checks whether this has been set in the context of a parent component.
   *
   * Must be called during component initialisation.
   */
  exists() {
    return hasContext(this.#key);
  }
  /**
   * Retrieves the context that belongs to the closest parent component.
   *
   * Must be called during component initialisation.
   *
   * @throws An error if the context does not exist.
   */
  get() {
    const context = getContext(this.#key);
    if (context === void 0) {
      throw new Error(`Context "${this.#name}" not found`);
    }
    return context;
  }
  /**
   * Retrieves the context that belongs to the closest parent component,
   * or the given fallback value if the context does not exist.
   *
   * Must be called during component initialisation.
   */
  getOr(fallback) {
    const context = getContext(this.#key);
    if (context === void 0) {
      return fallback;
    }
    return context;
  }
  /**
   * Associates the given value with the current component and returns it.
   *
   * Must be called during component initialisation.
   */
  set(context) {
    return setContext(this.#key, context);
  }
}
function getAriaDisabled(condition) {
  return condition ? "true" : "false";
}
function getDataDisabled(condition) {
  return condition ? "" : void 0;
}
function getAriaOrientation(orientation) {
  return orientation;
}
function getDataOrientation(orientation) {
  return orientation;
}
const ARROW_DOWN = "ArrowDown";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const ARROW_UP = "ArrowUp";
const END = "End";
const HOME = "Home";
function isElementOrSVGElement(element) {
  return element instanceof Element || element instanceof SVGElement;
}
globalThis.bitsIdCounter ??= { current: 0 };
function useId(prefix = "bits") {
  globalThis.bitsIdCounter.current++;
  return `${prefix}-${globalThis.bitsIdCounter.current}`;
}
function noop() {
}
function isValidIndex(index, arr) {
  return index >= 0 && index < arr.length;
}
function getRangeStyles(direction, min, max) {
  const styles = {
    position: "absolute"
  };
  if (direction === "lr") {
    styles.left = `${min}%`;
    styles.right = `${max}%`;
  } else if (direction === "rl") {
    styles.right = `${min}%`;
    styles.left = `${max}%`;
  } else if (direction === "bt") {
    styles.bottom = `${min}%`;
    styles.top = `${max}%`;
  } else {
    styles.top = `${min}%`;
    styles.bottom = `${max}%`;
  }
  return styles;
}
function getThumbStyles(direction, thumbPos) {
  const styles = {
    position: "absolute"
  };
  if (direction === "lr") {
    styles.left = `${thumbPos}%`;
    styles.translate = "-50% 0";
  } else if (direction === "rl") {
    styles.right = `${thumbPos}%`;
    styles.translate = "50% 0";
  } else if (direction === "bt") {
    styles.bottom = `${thumbPos}%`;
    styles.translate = "0 50%";
  } else {
    styles.top = `${thumbPos}%`;
    styles.translate = "0 -50%";
  }
  return styles;
}
function getTickStyles(direction, tickPosition, offsetPercentage) {
  const style = {
    position: "absolute"
  };
  if (direction === "lr") {
    style.left = `${tickPosition}%`;
    style.translate = `${offsetPercentage}% 0`;
  } else if (direction === "rl") {
    style.right = `${tickPosition}%`;
    style.translate = `${-offsetPercentage}% 0`;
  } else if (direction === "bt") {
    style.bottom = `${tickPosition}%`;
    style.translate = `0 ${-offsetPercentage}%`;
  } else {
    style.top = `${tickPosition}%`;
    style.translate = `0 ${offsetPercentage}%`;
  }
  return style;
}
function snapValueToStep(value, min, max, step) {
  const remainder = (value - (Number.isNaN(min) ? 0 : min)) % step;
  let snappedValue = Math.abs(remainder) * 2 >= step ? value + Math.sign(remainder) * (step - Math.abs(remainder)) : value - remainder;
  if (!Number.isNaN(min)) {
    if (snappedValue < min) {
      snappedValue = min;
    } else if (!Number.isNaN(max) && snappedValue > max) {
      snappedValue = min + Math.floor((max - min) / step) * step;
    }
  } else if (!Number.isNaN(max) && snappedValue > max) {
    snappedValue = Math.floor(max / step) * step;
  }
  const string = step.toString();
  const index = string.indexOf(".");
  const precision = index >= 0 ? string.length - index : 0;
  if (precision > 0) {
    const pow = 10 ** precision;
    snappedValue = Math.round(snappedValue * pow) / pow;
  }
  return snappedValue;
}
const SLIDER_ROOT_ATTR = "data-slider-root";
const SLIDER_THUMB_ATTR = "data-slider-thumb";
const SLIDER_RANGE_ATTR = "data-slider-range";
const SLIDER_TICK_ATTR = "data-slider-tick";
class SliderBaseRootState {
  id;
  ref;
  disabled;
  orientation;
  min;
  max;
  step;
  dir;
  autoSort;
  isActive = false;
  #direction = once(() => {
    if (this.orientation.current === "horizontal") {
      return this.dir.current === "rtl" ? "rl" : "lr";
    } else {
      return this.dir.current === "rtl" ? "tb" : "bt";
    }
  });
  get direction() {
    return this.#direction();
  }
  constructor(props) {
    this.id = props.id;
    this.ref = props.ref;
    this.disabled = props.disabled;
    this.orientation = props.orientation;
    this.min = props.min;
    this.max = props.max;
    this.step = props.step;
    this.dir = props.dir;
    this.autoSort = props.autoSort;
    useRefById({ id: this.id, ref: this.ref });
  }
  #touchAction = once(() => {
    if (this.disabled.current) return void 0;
    return this.orientation.current === "horizontal" ? "pan-y" : "pan-x";
  });
  getAllThumbs = () => {
    const node = this.ref.current;
    if (!node) return [];
    return Array.from(node.querySelectorAll(`[${SLIDER_THUMB_ATTR}]`));
  };
  #props = once(() => ({
    id: this.id.current,
    "data-orientation": getDataOrientation(this.orientation.current),
    "data-disabled": getDataDisabled(this.disabled.current),
    style: { touchAction: this.#touchAction() },
    [SLIDER_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class SliderSingleRootState extends SliderBaseRootState {
  value;
  onValueCommit;
  isMulti = false;
  constructor(props) {
    super(props);
    this.value = props.value;
    this.onValueCommit = props.onValueCommit;
  }
  applyPosition({ clientXY, start, end }) {
    const min = this.min.current;
    const max = this.max.current;
    const percent = (clientXY - start) / (end - start);
    const val = percent * (max - min) + min;
    if (val < min) {
      this.updateValue(min);
    } else if (val > max) {
      this.updateValue(max);
    } else {
      const step = this.step.current;
      const currStep = Math.floor((val - min) / step);
      const midpointOfCurrStep = min + currStep * step + step / 2;
      const midpointOfNextStep = min + (currStep + 1) * step + step / 2;
      const newValue = val >= midpointOfCurrStep && val < midpointOfNextStep ? (currStep + 1) * step + min : currStep * step + min;
      if (newValue <= max) {
        this.updateValue(newValue);
      }
    }
  }
  updateValue = (newValue) => {
    this.value.current = snapValueToStep(newValue, this.min.current, this.max.current, this.step.current);
  };
  handlePointerMove = (e) => {
    if (!this.isActive || this.disabled.current) return;
    e.preventDefault();
    e.stopPropagation();
    const sliderNode = this.ref.current;
    const activeThumb = this.getAllThumbs()[0];
    if (!sliderNode || !activeThumb) return;
    activeThumb.focus();
    const { left, right, top, bottom } = sliderNode.getBoundingClientRect();
    if (this.direction === "lr") {
      this.applyPosition({ clientXY: e.clientX, start: left, end: right });
    } else if (this.direction === "rl") {
      this.applyPosition({ clientXY: e.clientX, start: right, end: left });
    } else if (this.direction === "bt") {
      this.applyPosition({ clientXY: e.clientY, start: bottom, end: top });
    } else if (this.direction === "tb") {
      this.applyPosition({ clientXY: e.clientY, start: top, end: bottom });
    }
  };
  handlePointerDown = (e) => {
    if (e.button !== 0 || this.disabled.current) return;
    const sliderNode = this.ref.current;
    const closestThumb = this.getAllThumbs()[0];
    if (!closestThumb || !sliderNode) return;
    const target = e.target;
    if (!isElementOrSVGElement(target) || !sliderNode.contains(target)) return;
    e.preventDefault();
    closestThumb.focus();
    this.isActive = true;
    this.handlePointerMove(e);
  };
  handlePointerUp = () => {
    if (this.disabled.current) return;
    if (this.isActive) {
      this.onValueCommit.current(run(() => this.value.current));
    }
    this.isActive = false;
  };
  getPositionFromValue = (thumbValue) => {
    const min = this.min.current;
    const max = this.max.current;
    return (thumbValue - min) / (max - min) * 100;
  };
  #thumbsPropsArr = once(() => {
    const currValue = this.value.current;
    return Array.from({ length: 1 }, () => {
      const thumbValue = currValue;
      const thumbPosition = this.getPositionFromValue(thumbValue ?? 0);
      const style = getThumbStyles(this.direction, thumbPosition);
      return {
        role: "slider",
        "aria-valuemin": this.min.current,
        "aria-valuemax": this.max.current,
        "aria-valuenow": thumbValue,
        "aria-disabled": getAriaDisabled(this.disabled.current),
        "aria-orientation": getAriaOrientation(this.orientation.current),
        "data-value": thumbValue,
        tabindex: this.disabled.current ? -1 : 0,
        style,
        [SLIDER_THUMB_ATTR]: ""
      };
    });
  });
  get thumbsPropsArr() {
    return this.#thumbsPropsArr();
  }
  #thumbsRenderArr = once(() => {
    return this.thumbsPropsArr.map((_, i) => i);
  });
  get thumbsRenderArr() {
    return this.#thumbsRenderArr();
  }
  #ticksPropsArr = once(() => {
    const max = this.max.current;
    const min = this.min.current;
    const step = this.step.current;
    const difference = max - min;
    let count = Math.ceil(difference / step);
    if (difference % step == 0) {
      count++;
    }
    const currValue = this.value.current;
    return Array.from({ length: count }, (_, i) => {
      const tickPosition = i * (step / difference) * 100;
      const isFirst = i === 0;
      const isLast = i === count - 1;
      const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;
      const style = getTickStyles(this.direction, tickPosition, offsetPercentage);
      const tickValue = min + i * step;
      const bounded = tickValue <= currValue;
      return {
        "data-disabled": getDataDisabled(this.disabled.current),
        "data-orientation": getDataOrientation(this.orientation.current),
        "data-bounded": bounded ? "" : void 0,
        "data-value": tickValue,
        style,
        [SLIDER_TICK_ATTR]: ""
      };
    });
  });
  get ticksPropsArr() {
    return this.#ticksPropsArr();
  }
  #ticksRenderArr = once(() => {
    return this.ticksPropsArr.map((_, i) => i);
  });
  get ticksRenderArr() {
    return this.#ticksRenderArr();
  }
  #snippetProps = once(() => ({
    ticks: this.ticksRenderArr,
    thumbs: this.thumbsRenderArr
  }));
  get snippetProps() {
    return this.#snippetProps();
  }
}
class SliderMultiRootState extends SliderBaseRootState {
  value;
  isMulti = true;
  activeThumb = null;
  currentThumbIdx = 0;
  onValueCommit;
  constructor(props) {
    super(props);
    this.value = props.value;
    this.onValueCommit = props.onValueCommit;
  }
  applyPosition({ clientXY, activeThumbIdx, start, end }) {
    const min = this.min.current;
    const max = this.max.current;
    const percent = (clientXY - start) / (end - start);
    const val = percent * (max - min) + min;
    if (val < min) {
      this.updateValue(min, activeThumbIdx);
    } else if (val > max) {
      this.updateValue(max, activeThumbIdx);
    } else {
      const step = this.step.current;
      const currStep = Math.floor((val - min) / step);
      const midpointOfCurrStep = min + currStep * step + step / 2;
      const midpointOfNextStep = min + (currStep + 1) * step + step / 2;
      const newValue = val >= midpointOfCurrStep && val < midpointOfNextStep ? (currStep + 1) * step + min : currStep * step + min;
      if (newValue <= max) {
        this.updateValue(newValue, activeThumbIdx);
      }
    }
  }
  #getClosestThumb = (e) => {
    const thumbs = this.getAllThumbs();
    if (!thumbs.length) return;
    for (const thumb of thumbs) {
      thumb.blur();
    }
    const distances = thumbs.map((thumb) => {
      if (this.orientation.current === "horizontal") {
        const { left, right } = thumb.getBoundingClientRect();
        return Math.abs(e.clientX - (left + right) / 2);
      } else {
        const { top, bottom } = thumb.getBoundingClientRect();
        return Math.abs(e.clientY - (top + bottom) / 2);
      }
    });
    const node = thumbs[distances.indexOf(Math.min(...distances))];
    const idx = thumbs.indexOf(node);
    return { node, idx };
  };
  handlePointerMove = (e) => {
    if (!this.isActive || this.disabled.current) return;
    e.preventDefault();
    e.stopPropagation();
    const sliderNode = this.ref.current;
    const activeThumb = this.activeThumb;
    if (!sliderNode || !activeThumb) return;
    activeThumb.node.focus();
    const { left, right, top, bottom } = sliderNode.getBoundingClientRect();
    const direction = this.direction;
    if (direction === "lr") {
      this.applyPosition({
        clientXY: e.clientX,
        activeThumbIdx: activeThumb.idx,
        start: left,
        end: right
      });
    } else if (direction === "rl") {
      this.applyPosition({
        clientXY: e.clientX,
        activeThumbIdx: activeThumb.idx,
        start: right,
        end: left
      });
    } else if (direction === "bt") {
      this.applyPosition({
        clientXY: e.clientY,
        activeThumbIdx: activeThumb.idx,
        start: bottom,
        end: top
      });
    } else if (direction === "tb") {
      this.applyPosition({
        clientXY: e.clientY,
        activeThumbIdx: activeThumb.idx,
        start: top,
        end: bottom
      });
    }
  };
  handlePointerDown = (e) => {
    if (e.button !== 0 || this.disabled.current) return;
    const sliderNode = this.ref.current;
    const closestThumb = this.#getClosestThumb(e);
    if (!closestThumb || !sliderNode) return;
    const target = e.target;
    if (!isElementOrSVGElement(target) || !sliderNode.contains(target)) return;
    e.preventDefault();
    this.activeThumb = closestThumb;
    closestThumb.node.focus();
    this.isActive = true;
    this.handlePointerMove(e);
  };
  handlePointerUp = () => {
    if (this.disabled.current) return;
    if (this.isActive) {
      this.onValueCommit.current(run(() => this.value.current));
    }
    this.isActive = false;
  };
  getPositionFromValue = (thumbValue) => {
    const min = this.min.current;
    const max = this.max.current;
    return (thumbValue - min) / (max - min) * 100;
  };
  getAllThumbs = () => {
    const node = this.ref.current;
    if (!node) return [];
    const thumbs = Array.from(node.querySelectorAll(`[${SLIDER_THUMB_ATTR}]`));
    return thumbs;
  };
  updateValue = (thumbValue, idx) => {
    const currValue = this.value.current;
    if (!currValue.length) {
      this.value.current.push(thumbValue);
      return;
    }
    const valueAtIndex = currValue[idx];
    if (valueAtIndex === thumbValue) return;
    const newValue = [...currValue];
    if (!isValidIndex(idx, newValue)) return;
    const direction = newValue[idx] > thumbValue ? -1 : 1;
    const swap = () => {
      const diffIndex = idx + direction;
      newValue[idx] = newValue[diffIndex];
      newValue[diffIndex] = thumbValue;
      const thumbs = this.getAllThumbs();
      if (!thumbs.length) return;
      thumbs[diffIndex]?.focus();
      this.activeThumb = { node: thumbs[diffIndex], idx: diffIndex };
    };
    if (this.autoSort.current && (direction === -1 && thumbValue < newValue[idx - 1] || direction === 1 && thumbValue > newValue[idx + 1])) {
      swap();
      this.value.current = newValue;
      return;
    }
    const min = this.min.current;
    const max = this.max.current;
    const step = this.step.current;
    newValue[idx] = snapValueToStep(thumbValue, min, max, step);
    this.value.current = newValue;
  };
  #thumbsPropsArr = once(() => {
    const currValue = this.value.current;
    return Array.from({ length: currValue.length || 1 }, (_, i) => {
      const currThumb = run(() => this.currentThumbIdx);
      if (currThumb < currValue.length) {
        run(() => {
          this.currentThumbIdx = currThumb + 1;
        });
      }
      const thumbValue = currValue[i];
      const thumbPosition = this.getPositionFromValue(thumbValue ?? 0);
      const style = getThumbStyles(this.direction, thumbPosition);
      return {
        role: "slider",
        "aria-valuemin": this.min.current,
        "aria-valuemax": this.max.current,
        "aria-valuenow": thumbValue,
        "aria-disabled": getAriaDisabled(this.disabled.current),
        "aria-orientation": getAriaOrientation(this.orientation.current),
        "data-value": thumbValue,
        tabindex: this.disabled.current ? -1 : 0,
        style,
        [SLIDER_THUMB_ATTR]: ""
      };
    });
  });
  get thumbsPropsArr() {
    return this.#thumbsPropsArr();
  }
  #thumbsRenderArr = once(() => {
    return this.thumbsPropsArr.map((_, i) => i);
  });
  get thumbsRenderArr() {
    return this.#thumbsRenderArr();
  }
  #ticksPropsArr = once(() => {
    const max = this.max.current;
    const min = this.min.current;
    const step = this.step.current;
    const difference = max - min;
    let count = Math.ceil(difference / step);
    if (difference % step == 0) {
      count++;
    }
    const currValue = this.value.current;
    return Array.from({ length: count }, (_, i) => {
      const tickPosition = i * (step / difference) * 100;
      const isFirst = i === 0;
      const isLast = i === count - 1;
      const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;
      const style = getTickStyles(this.direction, tickPosition, offsetPercentage);
      const tickValue = min + i * step;
      const bounded = currValue.length === 1 ? tickValue <= currValue[0] : currValue[0] <= tickValue && tickValue <= currValue[currValue.length - 1];
      return {
        "data-disabled": getDataDisabled(this.disabled.current),
        "data-orientation": getDataOrientation(this.orientation.current),
        "data-bounded": bounded ? "" : void 0,
        "data-value": tickValue,
        style,
        [SLIDER_TICK_ATTR]: ""
      };
    });
  });
  get ticksPropsArr() {
    return this.#ticksPropsArr();
  }
  #ticksRenderArr = once(() => {
    return this.ticksPropsArr.map((_, i) => i);
  });
  get ticksRenderArr() {
    return this.#ticksRenderArr();
  }
  #snippetProps = once(() => ({
    ticks: this.ticksRenderArr,
    thumbs: this.thumbsRenderArr
  }));
  get snippetProps() {
    return this.#snippetProps();
  }
}
const VALID_SLIDER_KEYS = [
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  ARROW_DOWN,
  HOME,
  END
];
class SliderRangeState {
  #id;
  #ref;
  #root;
  constructor(props, root) {
    this.#id = props.id;
    this.#ref = props.ref;
    this.#root = root;
    useRefById({ id: this.#id, ref: this.#ref });
  }
  #rangeStyles = once(() => {
    const min = Array.isArray(this.#root.value.current) ? this.#root.value.current.length > 1 ? this.#root.getPositionFromValue(Math.min(...this.#root.value.current) ?? 0) : 0 : 0;
    const max = Array.isArray(this.#root.value.current) ? 100 - this.#root.getPositionFromValue(Math.max(...this.#root.value.current) ?? 0) : 100 - this.#root.getPositionFromValue(this.#root.value.current);
    return {
      position: "absolute",
      ...getRangeStyles(this.#root.direction, min, max)
    };
  });
  get rangeStyles() {
    return this.#rangeStyles();
  }
  #props = once(() => ({
    id: this.#id.current,
    "data-orientation": getDataOrientation(this.#root.orientation.current),
    "data-disabled": getDataDisabled(this.#root.disabled.current),
    style: this.rangeStyles,
    [SLIDER_RANGE_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class SliderThumbState {
  #id;
  #ref;
  #index;
  #root;
  #isDisabled = once(() => this.#root.disabled.current || this.#root.disabled.current);
  constructor(props, root) {
    this.#id = props.id;
    this.#ref = props.ref;
    this.#root = root;
    this.#index = props.index;
    useRefById({ id: this.#id, ref: this.#ref });
    this.onkeydown = this.onkeydown.bind(this);
  }
  #updateValue(newValue) {
    if (this.#root.isMulti) {
      this.#root.updateValue(newValue, this.#index.current);
    } else {
      this.#root.updateValue(newValue);
    }
  }
  onkeydown(e) {
    if (this.#isDisabled()) return;
    const currNode = this.#ref.current;
    if (!currNode) return;
    const thumbs = this.#root.getAllThumbs();
    if (!thumbs.length) return;
    const idx = thumbs.indexOf(currNode);
    if (this.#root.isMulti) {
      this.#root.currentThumbIdx = idx;
    }
    if (!VALID_SLIDER_KEYS.includes(e.key)) return;
    e.preventDefault();
    const min = this.#root.min.current;
    const max = this.#root.max.current;
    const value = this.#root.value.current;
    const thumbValue = Array.isArray(value) ? value[idx] : value;
    const orientation = this.#root.orientation.current;
    const direction = this.#root.direction;
    const step = this.#root.step.current;
    switch (e.key) {
      case HOME:
        this.#updateValue(min);
        break;
      case END:
        this.#updateValue(max);
        break;
      case ARROW_LEFT:
        if (orientation !== "horizontal") break;
        if (e.metaKey) {
          const newValue = direction === "rl" ? max : min;
          this.#updateValue(newValue);
        } else if (direction === "rl" && thumbValue < max) {
          this.#updateValue(thumbValue + step);
        } else if (direction === "lr" && thumbValue > min) {
          this.#updateValue(thumbValue - step);
        }
        break;
      case ARROW_RIGHT:
        if (orientation !== "horizontal") break;
        if (e.metaKey) {
          const newValue = direction === "rl" ? min : max;
          this.#updateValue(newValue);
        } else if (direction === "rl" && thumbValue > min) {
          this.#updateValue(thumbValue - step);
        } else if (direction === "lr" && thumbValue < max) {
          this.#updateValue(thumbValue + step);
        }
        break;
      case ARROW_UP:
        if (e.metaKey) {
          const newValue = direction === "tb" ? min : max;
          this.#updateValue(newValue);
        } else if (direction === "tb" && thumbValue > min) {
          this.#updateValue(thumbValue - step);
        } else if (direction !== "tb" && thumbValue < max) {
          this.#updateValue(thumbValue + step);
        }
        break;
      case ARROW_DOWN:
        if (e.metaKey) {
          const newValue = direction === "tb" ? max : min;
          this.#updateValue(newValue);
        } else if (direction === "tb" && thumbValue < max) {
          this.#updateValue(thumbValue + step);
        } else if (direction !== "tb" && thumbValue > min) {
          this.#updateValue(thumbValue - step);
        }
        break;
    }
    this.#root.onValueCommit.current(this.#root.value.current);
  }
  #props = once(() => ({
    ...this.#root.thumbsPropsArr[this.#index.current],
    id: this.#id.current,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
const SliderRootContext = new Context("Slider.Root");
function useSliderRoot(props) {
  const { type, ...rest } = props;
  const rootState = type === "single" ? new SliderSingleRootState(rest) : new SliderMultiRootState(rest);
  return SliderRootContext.set(rootState);
}
function useSliderRange(props) {
  return new SliderRangeState(props, SliderRootContext.get());
}
function useSliderThumb(props) {
  return new SliderThumbState(props, SliderRootContext.get());
}
function Slider($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId(),
    ref = null,
    value = void 0,
    type,
    onValueChange = noop,
    onValueCommit = noop,
    disabled = false,
    min = 0,
    max = 100,
    step = 1,
    dir = "ltr",
    autoSort = true,
    orientation = "horizontal",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  if (value === void 0) {
    value = type === "single" ? 0 : [];
  }
  const rootState = useSliderRoot({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    value: box.with(() => value, (v) => {
      value = v;
      onValueChange(v);
    }),
    // @ts-expect-error - we know
    onValueCommit: box.with(() => onValueCommit),
    disabled: box.with(() => disabled),
    min: box.with(() => min),
    max: box.with(() => max),
    step: box.with(() => step),
    dir: box.with(() => dir),
    autoSort: box.with(() => autoSort),
    orientation: box.with(() => orientation),
    type
  });
  const mergedProps = mergeProps(restProps, rootState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps, ...rootState.snippetProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload, rootState.snippetProps);
    $$payload.out += `<!----></span>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref, value });
  pop();
}
function Slider_range($$payload, $$props) {
  push();
  let {
    children,
    child,
    ref = null,
    id = useId(),
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rangeState = useSliderRange({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, rangeState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></span>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Slider_thumb($$payload, $$props) {
  push();
  let {
    children,
    child,
    ref = null,
    id = useId(),
    index,
    disabled = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const thumbState = useSliderThumb({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    index: box.with(() => index),
    disabled: box.with(() => disabled)
  });
  const mergedProps = mergeProps(restProps, thumbState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></span>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function RangeInput($$payload, $$props) {
  let {
    value = void 0,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    {
      let children = function($$payload3, { thumbs }) {
        const each_array = ensure_array_like(thumbs);
        $$payload3.out += `<span class="bg-gray-2 relative h-2 w-full grow cursor-pointer overflow-hidden"><!---->`;
        Slider_range($$payload3, { class: "absolute h-full bg-black" });
        $$payload3.out += `<!----></span> <!--[-->`;
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let index = each_array[$$index];
          $$payload3.out += `<!---->`;
          Slider_thumb($$payload3, { index });
          $$payload3.out += `<!---->`;
        }
        $$payload3.out += `<!--]-->`;
      };
      Slider($$payload2, spread_props([
        { type: "single" },
        restProps,
        {
          class: "relative flex w-full touch-none select-none items-center",
          get value() {
            return value;
          },
          set value($$value) {
            value = $$value;
            $$settled = false;
          },
          children,
          $$slots: { default: true }
        }
      ]));
    }
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { value });
}
function SideControls($$payload, $$props) {
  push();
  let {
    class: className,
    $$slots,
    $$events,
    ...props
  } = $$props;
  let controlsGrouped = [];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div${spread_attributes({
      ...props,
      class: clsx([
        className,
        "max-h-full w-[300px] overflow-auto"
      ])
    })}>`;
    {
      $$payload2.out += "<!--[-->";
      const each_array = ensure_array_like(controlsGrouped);
      $$payload2.out += `<div class="border-gray-2 flex flex-col gap-2 border-b border-l bg-white p-2"><div class="flex items-center justify-between"><h2>Controls</h2> <button class="flex items-center justify-center gap-1"><span class="pt-0.5 text-sm">hide</span> `;
      Chevron_double_right($$payload2, {});
      $$payload2.out += `<!----></button></div> <!--[-->`;
      for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
        let group = each_array[$$index_2];
        $$payload2.out += `<hr class="-mx-2"> <button class="flex items-center justify-between">${escape_html(group.name)} `;
        if (group.collapsed) {
          $$payload2.out += "<!--[-->";
          Chevron_up($$payload2, {});
        } else {
          $$payload2.out += "<!--[!-->";
          Chevron_down($$payload2, {});
        }
        $$payload2.out += `<!--]--></button> `;
        if (!group.collapsed) {
          $$payload2.out += "<!--[-->";
          const each_array_1 = ensure_array_like(group.controls);
          $$payload2.out += `<!--[-->`;
          for (let $$index_1 = 0, $$length2 = each_array_1.length; $$index_1 < $$length2; $$index_1++) {
            let control = each_array_1[$$index_1];
            $$payload2.out += `<label class="flex flex-col">`;
            if (!["button", "checkbox", "color"].includes(control.type)) {
              $$payload2.out += "<!--[-->";
              $$payload2.out += `<span class="text-sm">${escape_html(control.name)}</span>`;
            } else {
              $$payload2.out += "<!--[!-->";
            }
            $$payload2.out += `<!--]--> `;
            if (control.type === "select") {
              $$payload2.out += "<!--[-->";
              const each_array_2 = ensure_array_like(control.options);
              $$payload2.out += `<select name="examples"><!--[-->`;
              for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
                let option = each_array_2[$$index];
                $$payload2.out += `<option${attr("value", option.value)}>${escape_html(option.label)}</option>`;
              }
              $$payload2.out += `<!--]--></select>`;
            } else {
              $$payload2.out += "<!--[!-->";
              if (control.type === "number") {
                $$payload2.out += "<!--[-->";
                $$payload2.out += `<input${attr("type", control.type)}${attr("name", control.name)}${attr("value", control.value)}${attr("min", control.min)}${attr("max", control.max)}${attr("step", control.step)}>`;
              } else {
                $$payload2.out += "<!--[!-->";
                if (control.type === "range") {
                  $$payload2.out += "<!--[-->";
                  $$payload2.out += `<div class="flex gap-2">`;
                  RangeInput($$payload2, {
                    name: control.name,
                    min: control.min,
                    max: control.max,
                    step: control.step,
                    get value() {
                      return control.value;
                    },
                    set value($$value) {
                      control.value = $$value;
                      $$settled = false;
                    }
                  });
                  $$payload2.out += `<!----> <input type="number"${attr("value", control.value)}${attr("min", control.min)}${attr("max", control.max)}${attr("step", control.step)} class="w-20"></div>`;
                } else {
                  $$payload2.out += "<!--[!-->";
                  if (control.type === "button") {
                    $$payload2.out += "<!--[-->";
                    $$payload2.out += `<button${attr("type", control.type)}${attr("name", control.name)} class="border-gray-2 hover:bg-gray-1 border bg-white px-2 py-1">${escape_html(control.label)}</button>`;
                  } else {
                    $$payload2.out += "<!--[!-->";
                    if (control.type === "checkbox") {
                      $$payload2.out += "<!--[-->";
                      $$payload2.out += `<div class="flex items-center justify-between"><span class="text-sm">${escape_html(control.name)}</span> <input type="checkbox"${attr("name", control.name)}${attr("checked", control.value, true)}></div>`;
                    } else {
                      $$payload2.out += "<!--[!-->";
                      if (control.type === "color") {
                        $$payload2.out += "<!--[-->";
                        $$payload2.out += `<div class="flex items-center justify-between"><span class="text-sm">${escape_html(control.name)}</span> <input type="color"${attr("name", control.name)}${attr("value", control.value)} class="appearance-none border-none bg-white"></div>`;
                      } else {
                        $$payload2.out += "<!--[!-->";
                        $$payload2.out += `<input${attr("type", control.type)}${attr("name", control.name)}${attr("value", control.value)}>`;
                      }
                      $$payload2.out += `<!--]-->`;
                    }
                    $$payload2.out += `<!--]-->`;
                  }
                  $$payload2.out += `<!--]-->`;
                }
                $$payload2.out += `<!--]-->`;
              }
              $$payload2.out += `<!--]-->`;
            }
            $$payload2.out += `<!--]--></label>`;
          }
          $$payload2.out += `<!--]-->`;
        } else {
          $$payload2.out += "<!--[!-->";
        }
        $$payload2.out += `<!--]-->`;
      }
      $$payload2.out += `<!--]--> <hr class="-mx-2"> `;
      BottomControls($$payload2, { class: "w-full" });
      $$payload2.out += `<!----></div>`;
    }
    $$payload2.out += `<!--]--></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
function _layout($$payload, $$props) {
  push();
  let { children } = $$props;
  $$payload.out += `<main class="relative h-screen w-screen">`;
  {
    $$payload.out += "<!--[-->";
    FpsCounter($$payload, {
      class: "absolute left-0 top-0",
      fps: globalState.fps
    });
  }
  $$payload.out += `<!--]--> `;
  SideControls($$payload, { class: "absolute right-0 top-0" });
  $$payload.out += `<!----> `;
  children($$payload);
  $$payload.out += `<!----></main>`;
  pop();
}
export {
  _layout as default
};
