
export type Favorite = {
    agency: string,
    line: string,
    stop: string,
}

export class Favorites {
    protected static favorites: Favorite[] = [{
        agency: 'SF',
        line: '27', 
        stop: '13194'
    },
    {
        agency: 'SF',
        line: '19', 
        stop: '13194'
    },
    {
        agency: 'SF',
        line: '14', 
        stop: '17129'
    },
    {
        agency: 'SF',
        line: 'F', 
        stop: '15650'
    },
    {
        agency: 'SF',
        line: '7', 
        stop: '15656'
    },
    {
        agency: 'SF',
        line: '21',
        stop: '15071'
    },
    {
        agency: 'SF',
        line: '90',
        stop: '18088'
    },
    {
        agency: 'SF',
        line: 'NOWL',
        stop: '15692'
    },
    {
        agency: 'BA',
        line: 'Red-S',
        stop: 'CIVC'
    }
]
    static getFavorites(agency: string) {
        const faves = Favorites.favorites.filter(a => a.agency === agency.toUpperCase());
        let favorities = new Map();
        faves.forEach((fave) => {
            favorities.set(fave.line, fave.stop);
        })
        return favorities;
    }
}

