const colors = require('colors');
colors.enabled = true;
module.exports = (colorArray)=>(str)=>str[colorArray[str.length % (colorArray.length)]]