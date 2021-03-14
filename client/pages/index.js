import axios from 'axios';

// could create an external name service to map that name to a simpler domain
const INGRESS = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
const DOMAIN = 'ticketing.dev';

const LandingPage = ({currentUser}) => {
    console.log(currentUser);
    return <h1>Landing Page</h1>;
}

LandingPage.getInitialProps = async () => {
    if(typeof window === 'undefined') {
        // executed on the server - setup ingress access.
        const {data} = await axios.get(INGRESS + '/api/users/currentuser', {
            headers: {
                Host: 'ticketing.dev'
            }
        });
        return data;
    } else {
        // executed on the browser
        const {data} = await axios.get('/api/users/currentuser');
        // {currentUser: {...}}
        return data;
    }
    return({});
    /*const cookie = 'todo';
    const response = await axios.get(BASE + '/api/users/currentuser');
    console.log(response);
    return response.data;
    */
};

export default LandingPage;