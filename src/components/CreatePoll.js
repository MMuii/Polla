import React from 'react';
import { db } from '../config/firebaseConfig';
import Hashids from 'hashids';
import TextareaAutosize from 'react-textarea-autosize';
import history from '../history';
import Navbar from './Navbar';
import Footer from './Footer';
import ErrorPopup from './ErrorPopup';

class CreatePoll extends React.Component {
    state = {
        pollQuestion: '',
        pollAnswers: {'0': {content: '', votes: 0}, '1': {content: '', votes: 0}, '2':{content: '', votes: 0}},
        multipleAnswers: false,
        lastAnswerIndex: 2,
        errorMessage: ''
    }

    //renders list of input fields for poll options
    renderAnswers = () => {
        const answers = Object.keys(this.state.pollAnswers).map((key, index) => (
            <input type="text" className="answer-input" id={index} placeholder="Enter poll answer" key={index} onChange={this.handleChange}autoComplete="off"></input>
        ));

        return answers;
    }

    //adds new input field for next poll option
    addPollAnswer = () => {
        const newContent = this.state.pollAnswers;
        const index = this.state.lastAnswerIndex + 1;

        newContent[index] = {};
        newContent[index].content = '';
        newContent[index].votes = 0;

        this.setState({ pollAnswers: newContent, lastAnswerIndex: index });
    }

    //controlls input from poll option fields
    handleChange = (e) => {
        e.preventDefault();
        const { lastAnswerIndex } = this.state;

        const newContent = this.state.pollAnswers;
        newContent[e.target.id].content = e.target.value;
        this.setState({ pollAnswers: newContent });

        if (e.target.getAttribute('id') == lastAnswerIndex && this.state.pollAnswers[lastAnswerIndex].content != '') {
            this.addPollAnswer();
        }
    }

    //controlls input from poll question field
    handleQuestionChange = (e) => {
        this.setState({ pollQuestion: e.target.value });
    }
    
    //validates user's input and if it is correct uploads data to database
    handleSubmit = (e) => {
        e.preventDefault();

        const {pollQuestion, pollAnswers, multipleAnswers} = this.state;

        const hashids = new Hashids();
        const d = new Date();
        const pollId = hashids.encode(d.getTime());

        const answersToUpload = {};

        for (let i = 0; i < Object.keys(pollAnswers).length; i++) {
            if (/\S/.test(pollAnswers[i].content) == true) {
                answersToUpload[i] = pollAnswers[i];
            }
        }


        if (Object.keys(answersToUpload).length < 1) {
            this.setState({ errorMessage: 'Enter one or more poll options first'});
            return;
        }

        if (!/\S/.test(pollQuestion)) {
            this.setState({ errorMessage: 'Enter poll question first' });
            return;
        }

        db.collection("anonymousPolls").doc(`${pollId}`).set({
            pollQuestion: pollQuestion,
            pollAnswers: answersToUpload,
            multipleAnswers: multipleAnswers
        }).then(() => {
            history.push(`/poll/${pollId}`);
        }).catch((err) => {
            this.setState({ errorMessage: 'Error uploading data to database' });
        return (<div>Error creating poll: {err}</div>)
        })
    }

    //checks if multiple answers are allowed
    checkMultipleAnswers = (e) => {
        if (e.target.checked) {
            this.setState({ multipleAnswers: true });
            return;
        }

        this.setState({ multipleAnswers: false });
    }

    render() {
        const dimLayerStyle = {
            display: (this.state.errorMessage == '') ? 'none' : 'block'
        }

        const hidePopup = () => {this.setState({ errorMessage: ''} )};

        return (
            <>
            <div className="background"></div>
            <div className="create-poll">
                <Navbar location={this.props.location}/>
                <div className="wrapper wrapper--outer">
                    <div className="wrapper--inner">
                        <h1>Create poll</h1>
                        <form>
                            <TextareaAutosize className="question-input" placeholder="Enter poll question" onChange={this.handleQuestionChange}/>
                            {this.renderAnswers()}

                            <label className="container container--multiple-answers"><span>Allow multiple answers</span>
                            <input type="checkbox" onChange={(e) => this.checkMultipleAnswers(e)}/>
                            <span className="checkmark"></span>
                            </label>
                            <button className="create-poll-button main-btn" onClick={(e) => this.handleSubmit(e)}>Create poll</button>
                        </form>
                        <Footer />
                    </div>
                </div>
                <div className="popup-dimmer" style={dimLayerStyle} onClick={hidePopup}></div>
                {this.state.errorMessage && <ErrorPopup errorMsg={this.state.errorMessage} hidePopup={hidePopup}/>}
            </div>
            </>
        );
    }
}

export default CreatePoll;