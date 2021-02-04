## Testing
Catch tcp traffic on localhost loopback (127.0.0.1) port 2000
```
$ sudo tcpdump -v tcp -i lo0 -A -X port 2000
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
