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
                    map(x=> ({type: "add", subscription: x })),
                    tap(x=> console.log(x))
                )


const newSubscriptions = createNatsObservable(nats,"update-subscriptions")
.pipe(
    map(x=> JSON.parse(x)),
);

const allSubscriptions = {};

merge(subscriptions, newSubscriptions)
    .subscribe(({type,subscription}) =>{
        let feedEntry = getFeedEntryKey(subscription.source);
        allSubscriptions[feedEntry] = allSubscriptions[feedEntry] || {};
        if (type === "add"){
            allSubscriptions[feedEntry][`${subscription.target.type}:${subscription.target.address}`] = subscription.target;
        }
        if (type === "remove"){
            delete allSubscriptions[feedEntry][`${subscription.target.type}:${subscription.target.address}`];
        }
    })

createNatsObservable(nats,"feed-messages")
        .pipe(
            tap(x=> console.log("new feed message", x)),
            map(JSON.parse),
            flatMap(x=>
                from(
                    Object.values(allSubscriptions[getFeedEntryKey(x.source)])
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
        
            
