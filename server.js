let net = require("net")
let { DestructurePayload, bytesConsumed } = require("./connect")
let publish = require("./publish")
let initServer = net.createServer((socket) => {
    // Wrapper interface implemented here 
    socket.on("close", (action) => {
        console.log("closed")
    })
    //Not Implemented
    socket.on("connect", (action) => {
        console.log("connected")
    })
    socket.on("data", (action) => {
        //console.log(action)
        if (action[0] == 16) {
            DestructurePayload.connect_Payload(action)
            socket.write(Buffer.from([0x20, 0x02, 0x00, 0x00]))
        }
        console.log((action[0] & 0x3))
        if ((action[0] & 0x3) ) {
           console.log(publish(action))
        }
    })
})
initServer.listen(1883, () => {
    //Test
})