const nats = require('nats').connect({url: "nats://nats:4222"});
const { merge, defer, from  } = require('rxjs')
const { flatMap, map, tap  } = require('rxjs/operators')
const axios = require('axios');
const {createNatsObservable} = require("./utils/observable");

const notifiers = {
    "email": process.env["EMAIL_NOTIFIER_URL"]
}

const getFeedEntryKey = ({type, feed})=> `${type}:${feed}`

const subscriptions =  defer(async ()=> await axios.default.get(`${process.env.SUBSCRIPTIONS_API_URL}/api/subscriptions`))
                .pipe(
                    map(x=> x.data),
                    flatMap(x=> from(x)),
                )


const newSubscriptions = createNatsObservable(nats,"new-subscriptions")
.pipe(
    map(x=> JSON.parse(x)),
);

const allSubscriptions = {};

merge(subscriptions, newSubscriptions)
    .subscribe(x=>{
        console.log("subscription data", x);
        let feedEntry = getFeedEntryKey(x.source);
        allSubscriptions[feedEntry] = allSubscriptions[feedEntry] || [];
        allSubscriptions[feedEntry].push(x.target);
    })

createNatsObservable(nats,"feed-messages")
        .pipe(
            tap(x=> console.log("new feed message", x)),
            map(JSON.parse),
            flatMap(x=>
                from(
                    allSubscriptions[getFeedEntryKey(x.source)]
                ).pipe(
                    map(target=> ({target, title: x.title , message:x.body}))
                )
            )
        ).subscribe(t=>{
            axios.post(`${notifiers[t.target.type]}/send`, {
                to: t.target.address,
                title: t.title,
                message: t.message
            })
        });
        
            
