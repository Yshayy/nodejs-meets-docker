
require("colors");
const {expect} = require("chai");
const Magic = require('../src/magic.js')
describe("magic tests",function(){
    const magic = Magic(["red", "green", "blue"]);
    [
    {text: "", color:"red"},
    {text: "a", color:"green"},
    {text: "aa", color:"blue"},
    {text: "aaa", color:"red"},
    {text: "123456", color:"red"}
].forEach(({
        text,
       color 
    })=>
         it(`text "${text}" should display in color ${color}`, 
         ()=>expect(magic(text)).to.eql(text[color]))
    );
});