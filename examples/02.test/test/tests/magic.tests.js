
const colors = require("colors");
colors.enabled = true;

const {expect} = require("chai");
const axios = require("axios");
describe("magic tests",async function(){
    await Promise.all(
    [
    {text: "", color:"inverse"},
    {text: "a", color:"grey"},
    {text: "aa", color:"yellow"},
    {text: "aaa", color:"red"}
    ].map(({
        text,
       color 
    })=>
         it(`text "${text}" should display in color ${color}`, 
         async ()=>{
             const result = await axios.get(
                 `${(process.env.SERVICE_URL || "http://hello-color")}/${text}`);
             
            expect(result.data.trim()).to.eql(`/${text}`[color]);
         })
    ));
});