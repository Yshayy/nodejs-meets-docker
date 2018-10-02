
const { Observable, of, from} = require("rxjs");
const { flatMap, repeat, scan, delay, share } = require("rxjs/operators");


//taken from https://api.stocktwits.com/api/2/streams/symbol/aapl.json
const template = (stock)=> [{"body":"$AAPL Building on this ATH today great months ahead","created_at":"2018-10-02T18:18:53Z"},{"body":"@eddietowers777 Bad deal! $AAPL is a much safer bet than $FB!","created_at":"2018-10-02T18:18:44Z"},{"body":"$AAPL ho hum...boring advance which is the best kind","created_at":"2018-10-02T18:18:03Z"},{"body":"$AAPL apples I love apples","created_at":"2018-10-02T18:17:53Z"},{"body":"$AAPL The most innovative company in the world 🍏","created_at":"2018-10-02T18:16:38Z"},{"body":"$amd wait until the news gets out !!! LMAO $intc $aapl $amzn AMD getting crushed now","created_at":"2018-10-02T18:16:21Z"},{"body":"$AAPL looks like this is the safest name to put your money in, even near all time highs.","created_at":"2018-10-02T18:15:44Z"},{"body":"$AAPL You have to enjoy this ride up but even Bulls know this is getting odd. NAS down, Tech down, Adv/Dcl line not good &amp; low Vol. Just odd","created_at":"2018-10-02T18:15:31Z"},{"body":"$AAPL Apple Watch Blood Pressure Monitor? Hmmm how about an Apple Watch Lie Detector. Mandatory for tRump that would beep every time he lies","created_at":"2018-10-02T18:15:09Z"},{"body":"$amd $intc $spy $qqq $aapl poor amd this is NOT good news folks 26.6 prob today at least","created_at":"2018-10-02T18:14:55Z"},{"body":"$AAPL options way cheap.","created_at":"2018-10-02T18:14:19Z"},{"body":"$AAPL if apple can&#39;t break 230 - PUTS. top of shoulder. NASDAQ has shown that apple is overvalued for sector. iPhone sales not impressive","created_at":"2018-10-02T18:13:49Z"},{"body":"$AAPL bears are punch drunk after 90 days beating. Crazy run, still undervalued. Nice 30 day consolidation, next leg up is obvious.","created_at":"2018-10-02T18:12:55Z"},{"body":"$AAPL 50$ run from\nLast ER I have been in Aapl for 10years and can’t remember such a MONSTER run between earnings","created_at":"2018-10-02T18:12:16Z"},{"body":"$AAPL stop buying with just one hand and use two","created_at":"2018-10-02T18:12:09Z"},{"body":"$AAPL oh great just what we need, mandatory trump tweets: &quot;Suit seeks to block Trump from sending mandatory &#39;presidential alerts&#39; to phones&quot;","created_at":"2018-10-02T18:11:28Z"},{"body":"$AAPL any biotechs on this board? $NWBO hit a high of $117. Now $.19 but flying. NCI just affirmed positive PS1 results cancer vaccine.","created_at":"2018-10-02T18:10:53Z"},{"body":"$AAPL it wants it bad","created_at":"2018-10-02T18:10:20Z"},{"body":"$AAPL I meant 230!!!","created_at":"2018-10-02T18:09:32Z"},{"body":"$AAPL objective is to go over 130 and stays there by today or tomorrow!!! Then, focus on 235+!!! Very bullish to the max!!!","created_at":"2018-10-02T18:09:00Z"},{"body":"$SFIX Next up, a company that helps you pick your next aapl iphone. $AAPL","created_at":"2018-10-02T18:07:22Z"},{"body":"$AAPL https://www.macrumors.com/2018/10/02/ios-12-1-charging-bug-fix/","created_at":"2018-10-02T18:06:58Z"},{"body":"$AAPL bears are trying to scare us bulls away, but its not working. In it to win it!","created_at":"2018-10-02T18:04:07Z"},{"body":"$SPY $AAPL they will provide guidance &gt;$100B for holiday quarter. I’m in.","created_at":"2018-10-02T18:01:12Z"},{"body":"$AAPL don&#39;t forget.. pigs get slaughtered","created_at":"2018-10-02T17:59:16Z"},{"body":"Most Active Equity Options And Strikes For Midday - Tuesday, Oct. 2 $PBR $GE $AAPL $BAC $FTV $INTC $AMD https://goo.gl/fTPYEQ","created_at":"2018-10-02T17:58:57Z"},{"body":"$SPY Don&#39;t see how $AAPL earnings worth risk. Went up $9 on announcement. $30 since. Safer after imo","created_at":"2018-10-02T17:57:42Z"},{"body":"$AAPL Classic stealing of shares, right now, if you selling you going to cry in 2 weeks time, next price level $230-$240","created_at":"2018-10-02T17:57:42Z"},{"body":"$AAPL 240s getting hit lotto","created_at":"2018-10-02T17:55:03Z"},{"body":"$AAPL is trading 47% higher than it did 1 yr ago, &amp; has been going up an average 27% per yr for the last five years. Also pays a dividend.","created_at":"2018-10-02T17:54:34Z"}]
.map(x=> ({...x, body: x.body.replace(/aapl/i, stock)})).reverse() ;


const createFakeTimedObservable = function(stockData){
    return from(stockData)
    .pipe(
        scan((prev,next)=> {
            const lastTime = new Date(prev.created_at);
            return {...next, delay: new Date(next.created_at) - lastTime} 
        }),
        flatMap(({delay:delayDuration, ...x}) => {
            return of(x).pipe(
                delay((delayDuration || 0) * 2)
            );
        }),
        repeat(),
        share()
    )
}

module.exports = {
        get: (feed)=> createFakeTimedObservable(template(feed))
}