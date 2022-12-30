export class Favorites {
    static getFavorites(): Map<string, string> {
        let favorities = new Map();
        favorities.set('27', '13194');
        favorities.set('19', '13194');
        favorities.set('14', '17129');
        favorities.set('F', '15650');
        return favorities
    }
}

let f = new Map();
f.set('27-13194-BRYANT','17min & 32min');
f.set('19-13194-POLK' , '10min & 25min');
f.set('14-17129-MISSION' , '9min & 16min');
f.set('F-15650-MARKET & WHARVES' , '12min & 30min');

