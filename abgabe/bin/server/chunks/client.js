import { u as updated, s as stores } from "./client2.js";
({
  get current() {
    return updated.current;
  },
  check: stores.updated.check
});
