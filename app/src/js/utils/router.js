export class Router {
  constructor() {
    this.routes = [];

    // Bindings
    this.checkRouteBound = this.checkRoute.bind(this);
    this.handleLinkClickBound = this.handleLinkClick.bind(this);

    // Event Listeners
    window.addEventListener("popstate", this.checkRouteBound);
    document.addEventListener("click", this.handleLinkClickBound);

    // Sofort prüfen, falls das Script geladen wird, wenn das DOM schon da ist
    if (document.readyState === "complete") {
      this.checkRoute();
    } else {
      window.addEventListener("load", this.checkRouteBound);
    }
  }

  /**
   * Registriert eine Route
   * @param {string} path - z.B. "/dashboard" oder "/notes/:id"
   * @param {string} middleware - Middleware
   * @param {function} callback - Funktion, die ausgeführt wird
   */
  add(path, ...args) {
    // Normalisierung: Slashes am Anfang sicherstellen
    const normalizedPath = path.startsWith('/') ? path : '/' + path;

    let middleware = null;
    let callback = null;

    if (args.length === 2) {
      middleware = args[0];
      callback = args[1];
    } else {
      callback = args[0];
    }

    // Erstellt Regex für Parameter wie :id
    const regexPath = normalizedPath.replace(/:(\w+)/g, '(?<$1>[\\w-]+)');
    const pathRegex = new RegExp(`^${regexPath}/?$`);

    this.routes.push({
      path: normalizedPath,
      middleware: middleware,
      callback: callback,
      regex: pathRegex,
      paramNames: Array.from(normalizedPath.matchAll(/:(\w+)/g)).map(m => m[1])
    });

    return this; // Erlaubt Chaining
  }

  async checkRoute() {
    const currentPath = window.location.pathname;

    for (const route of this.routes) {
      const match = currentPath.match(route.regex);

      if (match) {
        const params = match.groups ? { ...match.groups } : {};

        if (route.middleware) {
          const result = await route.middleware(params);
          if(result === false) {
            console.warn("Access denied by middleware");
            return
          }
        }
        route.callback(params);
        return;
      }
    }

    // Optional: Fallback Route (404)
    console.warn(`Route ${currentPath} nicht definiert.`);
  }

  handleLinkClick(e) {
    const target = e.target.closest("a");

    // Nur reagieren, wenn es ein interner Link ist
    if (target && target.origin === window.location.origin) {
      const path = target.getAttribute("href");

      // Nur abfangen, wenn der Pfad auch wirklich gematcht werden kann
      if (path && !path.startsWith('http')) {
        e.preventDefault();
        window.history.pushState({}, '', path);
        this.checkRoute();
      }
    }
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.checkRoute();
  }

  destroy() {
    window.removeEventListener("load", this.checkRouteBound);
    window.removeEventListener("popstate", this.checkRouteBound);
    document.removeEventListener("click", this.handleLinkClickBound);
  }
}