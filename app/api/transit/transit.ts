import { Line } from '../../models/transit.model.js';
export class Transit {
    static getLineData = async (transitApiKey): Promise<Line[]> => {
        let response = await fetch(`https://api.511.org/transit/lines?api_key=${transitApiKey}&operator_id=SF&format=JSON`);
        let lineData = await response.json();
        console.log('remaining requests', response.headers.get('ratelimit-remaining'));
        return lineData;
    }

    static getPredictionData = async (transitApiKey) => {
        let response = await fetch(`https://api.511.org/transit/TripUpdates?api_key=${transitApiKey}&agency=SF&format=json`);
        let predictions = await response.json();
        return predictions;
    }

    static getLatestAlert = async (twitterApiKey) => {
        let response = await fetch('https://api.twitter.com/2/users/109702390/tweets',  {
            method: "GET",
            headers: {"Authorization" : `Bearer ${twitterApiKey}` }
        });
        let alerts = await response.json();
        return alerts;
    }
}