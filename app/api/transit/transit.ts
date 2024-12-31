import { Line } from '../../models/transit.model.js';
export class Transit {
    static getLineData = async (transitApiKey: string, agency: string): Promise<Line[]> => {
        let response = await fetch(`https://api.511.org/transit/lines?api_key=${transitApiKey}&operator_id=${agency}&format=JSON`);
        let lineData = await response.json();
        //console.log('remaining requests', response.headers.get('ratelimit-remaining'));
        return lineData;
    }

    static getPredictionData = async (transitApiKey: string, agency: string) => {
        let response = await fetch(`https://api.511.org/transit/TripUpdates?api_key=${transitApiKey}&agency=${agency}&format=json`);
        let predictions = await response.json();
        return predictions;
    }

    static getLatestAlert = async (twitterBearerKey: string) => {
        let response = await fetch(`https://api.twitter.com/2/users/109702390/tweets?exclude=retweets&tweet.fields=text`,  {
            method: "GET",
            headers: {"Authorization" : `Bearer ${twitterBearerKey}` }
        });
        let alerts = await response.json();
         console.log(JSON.stringify(alerts));
         //error
        if(alerts["detail"]) {
            return { data: [{ text: alerts["detail"]}]};
        }
        return alerts;
    }

    static getStops = async (transitApiKey: string, agency: string) => {
        let response = await fetch(`https://api.511.org/transit/stops?api_key=${transitApiKey}&operator_id=${agency}&format=json`);
        return await response.json();
    }
}


