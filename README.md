# HRS Structural Consultants Website

A responsive, dependency-free static website designed for direct publishing with GitHub Pages.

## Contact email

The website contact email is currently set to `Hamid@hrsstructural.com`.

## Before publishing

1. Review the biography and service descriptions.
2. Add verified license information, office location, phone number, and social links if desired.
3. Confirm that the project-experience disclaimer matches how the projects may be represented.

The canonical project list is stored in `data/projects.json`, making it easy to update without changing the page markup.

## Preview locally

The project list is loaded with `fetch`, so use a local web server instead of opening `index.html` directly as a file.

On Windows, right-click `serve.ps1` and select **Run with PowerShell**, or run:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then visit `http://localhost:8000`.

Any simple static server will work. For example, with Python installed:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload all files and folders from this directory.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. Add your Squarespace domain under **Custom domain** after the GitHub Pages site is working.

GitHub will show the DNS records required for the custom domain. Preserve any existing email/MX records when editing DNS at Squarespace.

## Files

- `index.html` — page structure and copy
- `about.html` — qualifications and firm approach
- `services.html` — structural engineering services
- `projects.html` — sector-filtered project portfolio
- `contact.html` — project inquiry page
- `styles.css` — visual system and responsive layouts
- `extra.css` — multi-page layout and responsive supplements
- `script.js` — navigation, project filtering, animations, and contact form
- `data/projects.json` — project portfolio data
- `assets/hrs-logo.svg` — scalable company logo used in the header and footer
