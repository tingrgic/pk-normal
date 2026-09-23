import type { MouseEvent } from "react";

export const RETURN_TO_TOP = "pk-normal:return-to-top";

/** Stay in the current document and do not resume the intro on arrival. */
export function returnToTop(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  window.dispatchEvent(new Event(RETURN_TO_TOP));
  history.replaceState(history.state, "", "#pocetak");
  document.querySelector<HTMLAnchorElement>(".nav .wordmark")?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}
