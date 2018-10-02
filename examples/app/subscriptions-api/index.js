const app = require("express")();
const bodyParser = require("body-parser");
const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const mongoist = require('mongoist');
const validator = require("express-joi-validation")({});
const nats = require('nats').connect({url: "nats://nats:4222"})
const db = mongoist(process.env.MONGO_URL, {});

app.use(bodyParser.json());

app.post(
  "/api/subscriptions",
  validator.body(Joi.object({ 
      source: Joi.object({
          type: Joi.string().required().valid('twitter'),
          feed: Joi.string().required()
      }),
      target: Joi.object({
        type: Joi.string().required().valid('email'),
        address: Joi.string().required()
    })
 })),
  asyncHandler(async (req, res) => {  
      const msg = {...req.body};
      await db.collection("subscriptions").insert(
          msg
      );
      nats.publish("new-subscriptions", 
          JSON.stringify(msg)
      );
      res.sendStatus(200);
  })
);

app.get(
  "/api/subscriptions",
  asyncHandler(async (req, res) => {
     res.json(await db.collection("subscriptions").find());
  })
);

app.delete(
  "/api/subscriptions/:id",
  validator.params({
      id : Joi.string().required()
  }),
  asyncHandler(async (req, res) => {
    await db.collection("subscriptions").remove({
        _id: mongoist.ObjectId(req.params.id)
    }, { justOne:true });
    res.sendStatus(200);
  })
);

app.get(
  "/api/sources/:type",
  validator.params({
    type : Joi.string().required()
  }),
  asyncHandler(async (req, res) => {
    const sources = await db.collection("subscriptions").find({
        "source.type":req.params.type
    },{
        "source.feed": true
    })

    res.json([...new Set(sources.map(x=>x.source.feed))]);
  })
);

app.listen(process.env.PORT || 3000, ()=>{
    console.log("subscriptions api is running")
});