* pluntuml - https://plantuml.com/ru/sequence-diagram
* stomp-protocol for MQ - https://stomp.github.io/stomp-specification-1.2.html
* ws security - WS Stomp Security

```plantuml
@startuml
== First connection ==
UI -> WebSocketService: http://getTicket + H: Authorization
WebSocketService -> IdentityProvider: http://introspect
WebSocketService <-- IdentityProvider: 200 OK
WebSocketService -> WebSocketService: save in DB random 1 min life UUID
UI <-- WebSocketService: ticket: UUID

UI -> WebSocketService: ws://api?ticket={ticket}
WebSocketService -> WebSocketService: check ticket and time from DB
UI <-- WebSocketService: establish connection

== Introspect token example ==

UI -> WebSocketService: STOMP ANY_FRAME\n stompHeader: Authorization
WebSocketService -> IDP: http://introspect
WebSocketService <-- IDP: 200 OK
UI <-- WebSocketService

== Introspect after logout ==

UI -> WebSocketService: STOMP ANY_FRAME\n stompHeader: Authorization
WebSocketService -> IDP: http://introspect
WebSocketService <-- IDP: 401 Unauthorized
UI <-- WebSocketService: ERROR 401 Unauthorized
UI <-- WebSocketService: Close connection

== Reconnect ==

UI -> IdentityProvider: update token and reconnect (with timeout to avoid ddos)
IdentityProvider --> UI
UI -> WebSocketService: http://getTicket .....

@enduml

```

* mjs
* nodaemon
* express
* stomp-broker-js - https://www.npmjs.com/package/stomp-broker-js
* middleware - Add in stompServer.js new line - https://github.com/4ib3r/StompBrokerJS/pull/34/commits/702ce52624112fcde967b52ca185c0e0098f72ee
* node debug

* module - `<script type="module" src="main.js"></script>`
* stomp - https://github.com/stomp-js/stompjs (https://www.npmjs.com/package/@stomp/stompjs not an old one https://www.npmjs.com/package/stompjs)
* reconnect
