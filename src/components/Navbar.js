import React from 'react';
import history from '../history';

class Navbar extends React.Component {

    render() {
        let content, style;
        
        //if user is on the create poll screen it shows only app logo, if user is on the voting or results screen, it shows also "create another poll" button
        if (history.location.pathname.startsWith("/poll/")) {
            content = (
                <>
                    <div className="navbar_logo" onClick={() => history.push('/')}>Polla</div>
                    <div className="navbar_create-poll bottom-hover-animation" onClick={() => history.push('/')}>Create another poll</div>
                </>
            )

            style = {justifyContent: 'space-between'}
        } else {
            content = (
                <>
                    <div className="navbar_logo" onClick={() => history.push('/')}>Polla</div>
                </>
            )

            style = {justifyContent: 'center'}
        }

        return (
            <div className="navbar_container" style={style}>
                {content}
            </div>
        )
    }
}

export default Navbar;