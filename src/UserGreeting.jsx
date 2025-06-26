
import PropTypes from "prop-types";
function UserGreeting(props){

    const welcomeMessage = <h2 className="Welcome-message">
                           Welcome {props.username}
                           </h2>

    const LoginPrompt = <h2 className="Login-Prompt">
                        Please log in to continue
                        </h2>


    return(props.isLoggedIn ? welcomeMessage: LoginPrompt

    );
     

}
UserGreeting.PropTypes = {
    isLoggedIn: PropTypes.bool,
    username: PropTypes.string,
}
UserGreeting.defaultTypes = {
    isLoggedIn: false,
    username: "Guest",
}
export default UserGreeting