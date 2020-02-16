import React from 'react';

const PollAnswers = (props) => {
    const { pollAnswers } = props;

    //renders list of poll options
    const answers = Object.keys(pollAnswers).map((key) => (
        <label id={key} key={key} className="container">{pollAnswers[key].content}
            <input id={key} checked={props.checkboxesStatus[key]} type="checkbox" onChange={(e) => props.handleCheckbox(e)}/>
            <span className="checkmark"></span>
        </label>
    ));

    return (
        <form>
            {answers}
            <div className="btn-wrapper">
                <button className="main-btn" onClick={(e) => props.vote(e)}>Vote</button>
                <button className="show-results-btn bottom-hover-animation" onClick={props.showResults}>Show results</button>    
            </div>            
        </form>
    )
}

export default PollAnswers;