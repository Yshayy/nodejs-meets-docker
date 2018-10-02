const nats = require('nats').connect({url: "nats://nats:4222"})
const axios = require('axios');
const {createNatsObservable} = require("./utils/observable");
const {empty, merge, from, defer} = require('rxjs');
const { map, filter, distinct, tap, flatMap } = require("rxjs/operators");
const feedsData = require("./streams/feeds");

const feeds =  defer(async ()=> await axios.default.get(`${process.env.SUBSCRIPTIONS_API_URL}/api/sources/stocktwits`))
                .pipe(
                    map(x=> x.data),
                    flatMap(x=> from(x)),
                )

const newFeeds = createNatsObservable(nats,"new-subscriptions")
.pipe(
    map(x=> JSON.parse(x)),
    filter(x=> x.source.type === "stocktwits"),
    map(x=> x.source.feed)
)

const allFeeds = merge(feeds, newFeeds).pipe(distinct());

allFeeds.pipe(
   flatMap(x=> feedsData.get(x).pipe(
    map(msg=> ({
        title: "new stock info on " + x,
        body: msg.body,
        source: {
            type: "stocktwits",
            feed: x
        }
    })))
   ) ,
    tap(x=> console.log(x))
)
.subscribe(x=> {
    console.log("publishing new message");
    nats.publish("feed-messages", JSON.stringify(x))
});



