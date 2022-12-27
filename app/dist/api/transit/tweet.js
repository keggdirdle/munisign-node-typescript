export class TransitAlerts {
    constructor() {
        this.getLastestAlert = () => {
            const latestTweet = "";
            for (var i = 0; i < latestTweet.length; i++) {
                showMessage(i);
            }
            function showMessage(i) {
                setTimeout(() => {
                    console.log(latestTweet.substring(i, i + 19));
                }, i * 100);
            }
        };
    }
}
