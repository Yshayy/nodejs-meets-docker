require('colors');

module.exports = (colorArray)=>(str)=>str[colorArray[str.length % (colorArray.length - 1)]]