import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { Favorites } from '../favorites/favorites.js';
import { Main } from '../main.js';
import { Display } from '../utils/display.utils.js';

export class WebServer {
    static runWebServer = () => {
        const app = express();
        const __filename = fileURLToPath(import.meta.url);
        app.use(express.static(path.join(__filename + '/../../../web/public/')));
        const port = 8080;

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

        const home = path.join(__filename + '/../../../web/');
        app.get('/', (req, res) => {
            res.sendFile(home + "index.html");
        })

        app.get('/start', (req, res) => {
            Main.init();
            res.end();
        })

        app.get('/favorites', (req, res) => {
            const favorites = JSON.stringify(Array.from(Favorites.getFavorites().entries()));
            //map = new Map(JSON.parse(jsonText));
            res.send(favorites);
        })

        app.get('/exit', (req, res) => {
            Display.clear();
            Main.exit();
            res.end();
        })

        app.get('/kill', () => {
            console.log('killing')
            process.exit();
        })
    }
}