// index.js
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Helper para normalizar texto
const normalize = (str = '') =>
  str.toLowerCase()
     .normalize('NFD')
     .replace(/[\u0300-\u036f]/g, '')
     .trim();

// Base URL (en Render configura BASE_URL)
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;
const IMAGES   = { punto: `${BASE_URL}/images/punto-de-servicios.png` };

// Lista de centros con servicio en Colombia
const serviceCenters = [
  {
    region:   'Antioquia',
    name:     'Punto de Servicios S.A. – Envigado',
    address:  'Calle 33B Sur # 47-66, Barrio El Portal (232,8 km)',
    products: 'Notebook, Mobile Phone, LCD Monitors, Desktop PC, All-in-one PCs, ZenFone, Commercial NB, Gaming NB, Premium Phone, Gaming Handhelds',
    imageUrl: IMAGES.punto
  },
  {
    region:   'Atlántico',
    name:     'Punto de Servicios S.A. – Barranquilla',
    address:  'Calle 75 # 44-56 (716,1 km)',
    products: 'Notebook, Mobile Phone, LCD Monitors, Desktop PC',
    imageUrl: IMAGES.punto
  },
  {
    region:   'Bogotá, Distrito Capital',
    name:     'Punto de Servicios S.A. – Quinta Paredes',
    address:  'Carrera 40 # 24A-59 (23,7 km)',
    products: 'Notebook, Mobile Phone, LCD Monitors, Desktop PC, All-in-one PCs, ZenFone, Commercial NB, Gaming NB, Premium Phone, Gaming Handhelds',
    imageUrl: IMAGES.punto
  },
  {
    region:   'Bogotá, Distrito Capital',
    name:     'Punto de Servicios S.A. – Carrera 49',
    address:  'Carrera 49 # 93-12 (28,8 km)',
    products: 'Notebook, Mobile Phone, LCD Monitors, Desktop PC, All-in-one PCs, ZenFone, Commercial NB, Gaming NB, Premium Phone, Gaming Handhelds',
    imageUrl: IMAGES.punto
  },
  {
    region:   'Quindío',
    name:     'Punto de Servicios S.A. – Armenia',
    address:  'Calle 17N # 14-21, Barrio Laureles (151,4 km)',
    products: 'Notebook, Mobile Phone, LCD Monitors, Desktop PC, All-in-one PCs, ZenFone, Commercial NB, Gaming NB, Premium Phone, Gaming Handhelds',
    imageUrl: IMAGES.punto
  },
  {
    region:   'Quindío',
    name:     'Punto de Servicios S.A. – Calarcá',
    address:  'Avenida 4 Norte No. 25N-62 (276,2 km)',
    products: 'Notebook, Mobile Phone, LCD Monitors, Desktop PC, All-in-one PCs, ZenFone, Commercial NB, Gaming NB, Premium Phone, Gaming Handhelds',
    imageUrl: IMAGES.punto,
    pbx:      '01 8000 196 054',
    cel:      '(+57) 333 6025 354',
    hours:    'L 7 – 15:30; M-V 7 – 17:00 (excepto festivos)'
  },
  {
    region:   'Santander',
    name:     'Punto de Servicios S.A. – Bucaramanga',
    address:  'Carrera 29 # 30-53, Barrio La Aurora (311,5 km)',
    products: 'Notebook, Mobile Phone, LCD Monitors, Desktop PC, All-in-one PCs, ZenFone, Commercial NB, Gaming NB, Gaming Handhelds',
    imageUrl: IMAGES.punto
  }
];

// POST /nearest
app.post('/nearest', (req, res) => {
  const regionInput = normalize(req.body.region || '');
  const matches = serviceCenters.filter(sc => normalize(sc.region) === regionInput);

  if (!matches.length) {
    return res.status(404).json({ error: 'Sin centro de servicio en esta región.' });
  }

  const centers = matches.map(sc => {
    const enc = encodeURIComponent(sc.address);
    return {
      name:        sc.name,
      address:     sc.address,
      products:    sc.products,
      ...(sc.pbx   && { pbx:   sc.pbx }),
      ...(sc.cel   && { cel:   sc.cel }),
      ...(sc.hours && { hours: sc.hours }),
      imageUrl:    sc.imageUrl,
      mapLink:     `https://www.google.com/maps/dir/?api=1&destination=${enc}`,
      addressLink: `https://www.google.com/maps/search/?api=1&query=${enc}`,
      embedUrl:    `https://maps.google.com/maps?q=${enc}&output=embed`
    };
  });

  res.json({ centers });
});

// GET /map
app.get('/map', (req, res) => {
  const enc = encodeURIComponent(req.query.address || '');
  const embed = `https://maps.google.com/maps?q=${enc}&output=embed`;
  res.send(`
    <!DOCTYPE html><html lang="es"><head>
      <meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <title>Mapa Centro de Servicio</title>
      <style>html,body{margin:0;padding:0;height:100%}iframe{width:100%;height:100%;border:none}</style>
    </head><body>
      <iframe src="${embed}" allowfullscreen loading="lazy"></iframe>
    </body></html>`);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});