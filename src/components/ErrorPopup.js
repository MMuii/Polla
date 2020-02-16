import React from 'react';

const ErrorPopup = (props) => {
    return (
        <div className="error-popup">
            <div className="error-popup_message">{props.errorMsg}</div>
            <div className="error-popup_close-btn" onClick={props.hidePopup}></div>
        </div>
    )
}

export default ErrorPopup;