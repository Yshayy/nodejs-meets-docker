const { Observable } = require("rxjs");

module.exports = {
    createNatsObservable: function(nats, topic, workerGroup){
        return Observable.create(obs=>{
            const natsOptions = {};
            if (workerGroup){
                natsOptions.queue = workerGroup
            }
            const sid = nats.subscribe(topic, natsOptions, (msg)=>{
                obs.next(msg)
            });
            return ()=> nats.subscribe(sid);
        }); 
    }
}