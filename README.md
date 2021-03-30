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

# Prod

## Github deployment to DigitalOcean

 * Setup DigitalOcean account
 * Setup Kubernetes Cluster & doctl
 * Run ingress-nginx Setup for DigitalOcean
 * Add Kubernetes secrets:
    * kubectl create secret generic jwt-secret --from-literal=JWT-KEY=--keyHere--
    * kubectl create secret generic stripe-secret --from-literal=STRIPE-KEY=--keyHere--
 * Buy domain & update infra/k8s-prod deploy-manifests.yaml
 * Update clients build-client.js baseUrl property to new domain (http://...)
 * Setup Loadbalancer: https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/20144736#content
 * Update app.ts to always use "secure:false"
 * Add keys / secrets to github (see deploy-*.yaml)
 * Rename workflows for digitalOcean to enable auto-deployment on push

 ## Teardown

 * Destroy the cluster & load balancer on Digital Ocean
 * Cancel Domain
 * optional: Remove GitHub actions & secrets

# Notes

## Correct Event Publishing for Prod
We should really save the event to an event queue in a transaction with the ticket and then send the event in another process...
see:
https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19485352

# TODO

 * Prevent Express from closing NATS connect on errors
 * Add https for DO: cert-manager.io
 * Add email support: mailchimp/sendgrid/similar
 * Add 'build' steps for prod cluster (create Dockerfile for prod style build)
 * Create a staging cluster / staging branch with corresponding actions to be able to test before deployments
 * Add additional functions & services

# Resources

 * Domain Names Cheap: namecheap.com
 * Domain linking: https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19989504
 * https://www.udemy.com/course/microservices-with-node-js-and-react