var _a;
export class Transit {
}
_a = Transit;
Transit.getLineData = async (transitApiKey) => {
    let response = await fetch(`https://api.511.org/transit/lines?api_key=${transitApiKey}&operator_id=SF&format=JSON`);
    let lineData = await response.json();
    console.log('remaining requests', response.headers.get('ratelimit-remaining'));
    return lineData;
};
Transit.getPredictionData = async (transitApiKey) => {
    let response = await fetch(`https://api.511.org/transit/TripUpdates?api_key=${transitApiKey}&agency=SF&format=json`);
    let predictions = await response.json();
    return predictions;
};
Transit.getLatestAlert = async (twitterApiKey) => {
    let response = await fetch('https://api.twitter.com/2/users/109702390/tweets', {
        method: "GET",
        headers: { "Authorization": `Bearer ${twitterApiKey}` }
    });
    let alerts = await response.json();
    return alerts;
};
