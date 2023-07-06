import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { Favorites } from '../favorites/favorites.js';
import { Main, lineDataStore } from '../main.js';
import { Display } from '../utils/display.utils.js';
import cors from 'cors';
import { Transit } from '../api/transit/transit.js';
import { transitApiKey } from '../keys.js';

export class WebServer {
    static runWebServer = () => {
        const app = express();
        const __filename = fileURLToPath(import.meta.url);
        app.use(cors({
            origin: '*'
        }));
        app.use(express.static(path.join(__filename + '/../../../web/web-admin/public/')));
        const port = 8080;

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

        const home = path.join(__filename + '/../../../web/web-admin/');
        app.get('/', (req, res) => {
            res.sendFile(home + "index.html");
        })

        app.get('/start', (req, res) => {
            Main.init();
            res.end();
        })

        app.get('/favorites', (req, res) => {
            const favorites = JSON.stringify(Array.from(Favorites.getFavorites(req).entries()));
            //map = new Map(JSON.parse(jsonText));
            res.send(favorites);
        })

        app.get('/getLines', (req, res) => {
            const lines = JSON.stringify(Array.from(lineDataStore));
            res.send(lines);
        })

        app.get('/getStops', (req = 'SF', res) => {
            Transit.getStops(transitApiKey, req).then(data => 
                { 
                    res.send(data);
                });
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