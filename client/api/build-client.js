import axios from 'axios';

const BuildClient = ({ req }) => {
    if (typeof window === 'undefined') {
        // on the server
        return axios.create({
            // could create an external name service to map that name to a simpler domain
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        // on the browser
        return axios.create({
            baseUrl: '/'
        });
    }
};

export default BuildClient;