import express from 'express';
import path from 'path';
import browserSync from 'browser-sync';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

// Získání aktuálního adresáře
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Nastavení Express.js serveru
const app = express();
let menuItems = [
    { name: 'Hovězí steak', description: 'Šťavnatý hovězí steak s grilovanou zeleninou a domácí omáčkou.', price: '450 Kč' },
    { name: 'Krémové risotto', description: 'Risotto s čerstvými houbami a parmazánem.', price: '320 Kč' },
    { name: 'Dezert: Čokoládový fondant', description: 'Teplý fondant s vanilkovou zmrzlinou.', price: '180 Kč' },
];

// Nastavení pro Express
app.set('view engine', 'ejs');
app.set('views', __dirname);  // Nastavení pro kořenový adresář

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));  // Statické soubory pro CSS, obrázky a další
app.use(express.static(path.join(__dirname)));  // Kořenový adresář pro statické soubory

// Route pro hlavní stránku
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main/main.html'));
});

// Route pro restauraci
app.get('/restaurace', (req, res) => {
    res.render('restaurant/restaurace.ejs', { menuItems });
});

// Route pro administrátorskou stránku
app.get('/admin', (req, res) => {
    console.log("Accessing /admin route");
    res.render('restaurant/admin/admin.ejs', { menuItems });
});

// Přidání položky do menu
app.post('/admin/add', (req, res) => {
    console.log("Formulář pro přidání položky byl odeslán.");
    const { name, description, price } = req.body;
    menuItems.push({ name, description, price });
    console.log(menuItems);
    res.redirect('/admin');
});

app.post('/admin/delete', (req, res) => {
    console.log("Formulář pro odstranění položky byl odeslán.");
    const { index } = req.body;
    menuItems.splice(index, 1);
    console.log(menuItems);
    res.redirect('/admin');
});

// Spuštění serveru na portu 3000
const server = app.listen(3000, '0.0.0.0', () => {
    console.log('Server běží na http://0.0.0.0:3000');
});

// Inicializace BrowserSync pro hot reload
browserSync.init({
    proxy: 'http://localhost:3000',  // Proxy pro tvůj Express server
    files: ['*.html', '*.css', '*.js'], // Sledování změn ve všech HTML, CSS a JS souborech
    open: true,  // Otevře automaticky prohlížeč
    notify: false // Skrytí notifikací v prohlížeči
});
