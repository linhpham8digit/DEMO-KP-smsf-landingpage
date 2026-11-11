# KP SMSF landing page

The Fundwise Capital SMSF property-loan landing page for Kien Phan: the full form at `/`. Sending the form turns it into a done-and-thank-you card, then scrolls on to the rest of the page. Arriving with `?from=quiz` shows that card in place of the form. `/thanks/` is an older thank-you page that no flow links to any more.
Static HTML, CSS and JS, no build step. Deploy on Vercel as a static site (framework preset "Other").

Run locally: `npx -y serve -l 3008 .` then open http://localhost:3008

The form is not connected yet: it does not send the lead anywhere (see `assets/js/lead.js`).
The quiz version lives in `8group-org/KP-smsf-quizz` and sends people on to this page when they finish.
