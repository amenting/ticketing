Ticketing Sample App
---

# Prerequisites:
docker with kubernetes
kubernetes.github.io/ingress-nginx
npm
typescript

# Development
Runs with skaffold in a local kubernetes cluster.
Possibly just run in google cloud if pc is too slow.

Run with:

skaffold dev

If auto-refresh is not working:
use "ts-node-dev --poll src/index.ts" in package.json "start" script.

Cert error: just type "thisisunsafe" into the chrome tab...

# Notes

## Correct Event Publishing for Prod
We should really save the event to an event queue in a transaction with the ticket and then send the event in another process...
see:
https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19485352