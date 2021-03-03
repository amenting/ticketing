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