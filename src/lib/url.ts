/** Ensure URLs are absolute-from-root (start with "/"), unless already http(s) or protocol-relative */
export function toAbsolute(href?: string): string {
    if (!href) return "";
    const s = href.trim();
    if (/^(https?:)?\/\//i.test(s)) return s;      // http://, https://, //cdn...
    if (s.startsWith("/")) return s;               // already absolute
    return "/" + s.replace(/^\/+/, "");            // make absolute
  }
  
  /** Convert a storage path (e.g. "images/...") to your image proxy */
  export function toImageProxy(path?: string): string {
    if (!path) return "";
    // Already absolute proxy?
    if (path.startsWith("/api/image")) return toAbsolute(path);
    // Already full URL to GCS or CDN?
    if (/^(https?:)?\/\//i.test(path)) return path;
    // Treat as bucket path and proxy via API
    return `/api/image?path=${encodeURIComponent(path)}`;
  }
  