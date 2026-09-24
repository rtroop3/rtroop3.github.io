# TroopTechSolutions Pro

Website for TroopTechSolutions Pro, a home and small business IT services company. It is served with GitHub Pages at https://trooptechsolutions.pro. The `CNAME` file tells GitHub Pages to use that domain.

## Files
- `index.html` holds the page content: services, packages, pricing, FAQ and contact.
- `styles.css` holds the styles, with colors taken from the logo.
- `script.js` handles the mobile menu, the service filters and the contact form.
- `assets/` holds the logo, the icon-only logo and the favicon.

## Before launch: add your contact details
The live values are set; to change them, open `script.js` and edit the `CONTACT` block at the top:

```js
const CONTACT = {
  email: 'you@yourdomain.com',
  phone: '(555) 123-4567',
  serviceArea: 'Serving Your City & surrounding areas',
  hours: 'Mon–Sat, 9am–7pm',
};
```

Any field you fill in shows up in the Contact section. The contact form opens the visitor's email app with a request addressed to `email`.
