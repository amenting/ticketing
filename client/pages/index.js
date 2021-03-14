import axios from 'axios';

// could create an external name service to map that name to a simpler domain
const BASE = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';

const LandingPage = ({currentUser}) => {
    console.log(currentUser);
    return <h1>Landing Page</h1>;
}

LandingPage.getInitialProps = async ({request}) => {
    const cookie = 'todo';
    const response = await axios.get(BASE + '/api/users/currentuser');
    console.log(response);
    return response.data;
};

export default LandingPage;