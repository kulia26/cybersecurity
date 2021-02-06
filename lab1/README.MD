## Testing
Catch tcp traffic on port 8080
```
$ sudo tcpdump tcp port 8080 -AX
```
Catch tcp traffic on port 8080 and write to packet.ppp file
```
$ sudo tcpdump tcp port 8080 -w packet.ppp
```
Reveal file
```
$ less packet.ppp
```
## Run
```
$ node client.js
```
for tcp client run
```
$ node server.js
```
for tcp server run
