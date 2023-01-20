import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { Favorites } from '../favorites/favorites.js';
import { Main } from '../main.js';

export class WebServer {
    static runWebServer = () => {
        const app = express();
        const port = 8088;
        const __filename = fileURLToPath(import.meta.url);
        const home = path.join(__filename + '/../../../web/');

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

        app.get('/', (req, res) => {
            res.sendFile(home + "index.html");
        })

        app.get('/start', () => {
            console.log('calling init')
            Main.init();
        })

        app.get('/favorites', (req, res) => {
            const favorites = JSON.stringify(Array.from(Favorites.getFavorites().entries()));
            //map = new Map(JSON.parse(jsonText));
            console.log(favorites)
            res.send(favorites);
        })

        // app.get('/exit', (req, res) => {
        //     res.sendFile(home + "index.html");
        //     Display.clear();
        //     timers.forEach(t => {
        //         clearTimeout(t);
        //     })
        // })
        app.get('/kill', () => {
            console.log('killing')
            process.exit();
        })
    }
}