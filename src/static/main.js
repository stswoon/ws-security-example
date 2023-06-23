import {Client} from '@stomp/stompjs'; //https://github.com/stomp-js/stompjs

let client;
let token;

window.token = async () => {
    token = await fetch("/token", {method: 'POST'}).then(res => res.text());
    console.log("Token=" + token);
}

window.connect = async () => {
    client = new Client({
        brokerURL: "ws://" + window.location.host + "/ws" + "?token=" + token,
        onConnect: () => console.log("connected"),
        onStompError: () => console.error("error"), //reconnect, automatically done by this Client
        debug: (value) => console.log("debug:", value)
    });
    client.activate();
}

let subscriptions = {}
window.subscribe = () => {
    const topic = document.getElementById("subscribe-topic").value;
    const subscription = client.subscribe("/topic/" + topic, message => console.log(`Received: ${message.body}`));
    subscriptions[topic] = subscription;
}

window.unsubscribe = () => {
    const topic = document.getElementById("subscribe-topic").value;
    subscriptions[topic].unsubscribe();
    delete subscriptions[topic];
}

window.send = () => {
    const topic = document.getElementById("send-topic").value;
    const msg = document.getElementById("send-message").value;
    client.publish({destination: "/topic/" + topic, body: msg});
}

window.disconnect = () => {
    client.deactivate();
    subscriptions = {};
}
