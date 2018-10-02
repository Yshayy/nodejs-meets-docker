const nats = require('nats').connect({url: "nats://nats:4222"})
const axios = require('axios');
const {createNatsObservable} = require("./utils/observable");
const {empty, merge, from, defer} = require('rxjs');
const { map, filter, distinct, tap, flatMap } = require("rxjs/operators");
const feedsData = require("./streams/feeds");

const feeds =  defer(async ()=> await axios.default.get(`${process.env.SUBSCRIPTIONS_API_URL}/api/sources/twitter`))
                .pipe(
                    map(x=> x.data),
                    flatMap(x=> from(x)),
                )

const newFeeds = createNatsObservable(nats,"new-subscriptions")
.pipe(
    map(x=> JSON.parse(x)),
    filter(x=> x.source.type === "twitter"),
    map(x=> x.source.feed)
)

const allFeeds = merge(feeds, newFeeds).pipe(distinct());

allFeeds.pipe(
   flatMap(x=> (feedsData[x] || empty()).pipe(
    map(msg=> ({
        body: msg.body,
        source: x.source
    })))
   ) ,
    tap(x=> console.log(x))
)
.subscribe(x=> nats.publish("feed-messages", JSON.stringify(x)));



