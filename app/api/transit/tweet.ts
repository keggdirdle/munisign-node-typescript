export class TransitAlerts {
    getLastestAlert = () => {
        const latestTweet: string = "";
        for(var i = 0; i < latestTweet.length; i++) {
            showMessage(i)
        }
        function showMessage(i) {
            setTimeout(() => {
            console.log(latestTweet.substring(i, i+19));
            }, i * 100);
        }
    }
}