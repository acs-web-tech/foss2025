let fs = require("fs")
function ReadData(path){
   let data = fs.readFileSync(path)
   let jsonToObject  = JSON.parse(data.toString())
   return jsonToObject
}
module.exports = ReadData