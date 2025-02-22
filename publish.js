let { bytesConsumed }  = require("./connect");
function DestructurePayload_Publish(buffer) {
    let packets = {
        type: 0,
        remainingLength: 0,
        dup: 0,
        retain: 0,
        topicLen: 0,
        topic: Buffer.from([]) || null,
        payload: Buffer.from([]) || null
    }
    let cursor = 0
    packets.type = 3
    packets.dup = ((buffer[cursor] >> 3) & 1)
    packets.retain = ((buffer[cursor]) & 1)
    let willFitOneByte = bytesConsumed(buffer.byteLength)
    packets.remainingLength = buffer.subarray(++cursor, cursor = cursor + willFitOneByte).byteLength
    
}
module.exports = DestructurePayload_Publish