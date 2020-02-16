import React from 'react';
import history from '../history';
import Logo from '../components/Navbar';

const Error404 = (props) => {
    return (
        <div className="background anonymous-poll">
            <Logo />
            <div className="wrapper wrapper--inner wrapper--outer">
                <div className="title-wrapper">
                    <h1>Error 404</h1>
                    <h2>{props.message} Try going <span className="text-btn" onClick={() => {history.push('/create-poll')}}>home</span>.</h2>
                </div>
            </div>
        </div>
    )
}  

export default Error404;