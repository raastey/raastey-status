/** Base-aware path for links (works on github.io/raastey-status/ and status.raastey.app). */
export function basePath(path = ""): string {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\//, "");
  return clean ? `${base}${clean}` : base;
}
