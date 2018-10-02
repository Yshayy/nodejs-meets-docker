const { Observable } = require("rxjs");

module.exports = {
    createNatsObservable: function(nats, topic){
        return Observable.create(obs=>{
            const sid = nats.subscribe(topic, (msg)=>{
                obs.next(msg)
            });
            return ()=> nats.subscribe(sid);
        }); 
    }
}