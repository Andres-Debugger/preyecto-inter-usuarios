export const PAGE_LOADER_STORAGE_KEY = "celestique-page-loader";

export function isPageLoaderEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(PAGE_LOADER_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setPageLoaderEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(
      PAGE_LOADER_STORAGE_KEY,
      enabled ? "on" : "off"
    );
  } catch (error) {
    void error;
  }
  if (typeof document !== "undefined") {
    document.documentElement.dataset.pageLoader = enabled ? "on" : "off";
  }
}
