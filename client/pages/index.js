
/* Chrome: type 'thisisunsafe' to bypass security warning */

const LandingPage = ({currentUser}) => {
    return currentUser ? 
        <h1>You are signed in.</h1>
        :
        <h1>You are NOT signed in.</h1>
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    return {};
};

export default LandingPage;