/** Base-aware path for links (works on github.io/roono-status/ and status.roono.app). */
export function basePath(path = ""): string {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\//, "");
  return clean ? `${base}${clean}` : base;
}
