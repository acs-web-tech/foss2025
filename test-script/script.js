//Import the mqtt library
const mqtt = require('mqtt');
//define the broker address
const brokerurl = "mqtt://10.2.3.22";
//define the topic where you want to publish the data
const topic = 'test/topic';
//create a client and connect it to broker
// creditails are just dummy
const client = mqtt.connect(brokerurl);

client.on('connect', () => {
    console.log("Client is connected");

    //data to be published
    const message = Buffer.from("Hello, MQTT", "utf-8");
    //sending data to the topic\
    client.publish(topic, message, (err) => {
        if (!err) {
            console.log(`Message "${message}" published to topic "${topic}" `);
        }
        else {
            console.error("Failed to publish message", err);
        }
        //close the connection after publishing or sending
        //client.end();
    })
})

//Event handlers for errors
client.on('error', (err) => {
    console.error("Connection error:", err);
});

//Evenr handlers for disconnection
client.on('close', () => {
    console.log("Disconnected from server");
})
