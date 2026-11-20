# satish-prajapati-pm.github.io

Personal site for Satish Prajapati, Project Manager. Plain HTML, CSS and JavaScript, no build step.

```
index.html
404.html
robots.txt, sitemap.xml
assets/css/style.css
assets/js/main.js
assets/fonts/        Fraunces + Inter (latin subset, SIL Open Font License)
assets/media/        favicon, touch icon, social preview, photo
```

## Running locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

## Notes

- Colours live as custom properties at the top of `style.css`. Green and amber are reserved for project status.
- Animations respect `prefers-reduced-motion`; without JavaScript the page shows its final state.
- There is a Content-Security-Policy meta tag in `index.html`. If you change the small inline script in the `<head>`, regenerate its hash:

  ```
  printf '%s' 'document.documentElement.classList.add("js")' | openssl dgst -sha256 -binary | openssl base64 -A
  ```

## Deploying

GitHub Pages, deploy from branch `main`, folder `/`. Turn on "Enforce HTTPS" in Settings > Pages.
