# Research: Agendamento de Laboratórios

## Decision
Use vanilla JavaScript, HTML5 and CSS3 for the site, with browser `localStorage` as the persistence layer. The UI will remain minimal and direct, and the implementation will avoid frameworks to preserve speed and simplicity.

## Rationale
- JavaScript + HTML/CSS is the requested technology and fits a static site implementation.
- Vanilla JS avoids framework overhead, shrinking load size and simplifying maintenance.
- `localStorage` provides lightweight persistence without backend complexity, ideal for a browser-based prototype.
- Minimal styling and direct page structure improve access performance and reduce code volume.
- No automated tests keeps the scope aligned with the current version requirement.

## Alternatives considered
- React/Vue/Svelte: rejected because they add bundle size and complexity for a simple internal reservation site.
- Backend database: rejected because the user requested a site built with JS/HTML/CSS and the current scope is a lightweight static deployment.
- In-memory only storage: rejected because it loses persistency on page reload; `localStorage` is a better fit for this environment.
- Complex UI libraries: rejected to keep the experience minimal and fast.
