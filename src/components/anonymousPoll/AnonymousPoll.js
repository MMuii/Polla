import React from 'react';
import { db } from '../../config/firebaseConfig';
import firebase from '../../config/firebaseConfig';
import _ from 'lodash';
import history from '../../history';

import Footer from '../Footer';
import Navbar from '../Navbar';
import ErrorPopup from '../ErrorPopup';
import Error404 from '../Error404';
import PollAnswers from './PollAnswers';
import PollResults from './PollResults';
import SharePoll from '../SharePoll';

class AnonymousPoll extends React.Component {
    state = {
        pollData: {},
        questionsChecked: [],
        didUserVote: false,
        errorMessage: '',
        err404: false
    }

    //fetches poll data from database
    componentDidMount = () => {
        const { pollId } = this.props.match.params;
        const docRef = db.collection("anonymousPolls").doc(`${pollId}`);

        docRef.get().then((doc) => {
            if (doc.exists) {
                this.setState({ pollData: doc.data() }, () => {
                    let questionsCheckedArr = []

                    for (let i = 0; i < Object.keys(this.state.pollData.pollAnswers).length; i++) {
                        questionsCheckedArr.push(false);
                    }

                    this.setState({ questionsChecked: questionsCheckedArr });
                });
            } else {
                //there is no such document in database
                this.setState({ err404: true });
            }
        }).catch((err) => {
            //error getting document from database
            console.log("Error getting document: ", err);
        });
    }

    //controlls checkboxes, if multiple answers are allowed user can check more than 1 checkbox, if not, it automatically unchecks all checkboxes except the clicked one
    handleCheckbox = (e) => {
        if (this.state.pollData.multipleAnswers == true) {
            let checkValue = false;

            if (e.target.checked) {
                checkValue = true;
            }
    
            const newArr = this.state.questionsChecked;
            newArr[e.target.parentNode.id] = checkValue;
    
            this.setState({ questionsChecked: newArr });
        } else {
            let newArr = [];
            for (let i = 0; i < this.state.questionsChecked.length; i++) {
                if (i == e.target.id) {
                    newArr.push(true);
                } else {
                    newArr.push(false);
                }
            }
            this.setState({ questionsChecked: newArr });
        }
    }

    //sends user vote to database and updates votes amount
    vote = (e) => {
        e.preventDefault();

        //if user has already voted it displays message that he can't vote anymore
        if (!this.state.didUserVote) {
            if (this.state.questionsChecked.includes(true, 0)) {
                const { pollId } = this.props.match.params;
                const { questionsChecked } = this.state;
        
                for (let i = 0; i < questionsChecked.length; i++) {
                    if (questionsChecked[i]) {
                        db.collection('anonymousPolls').doc(`${pollId}`).update({
                            [`pollAnswers.${i}.votes`]: firebase.firestore.FieldValue.increment(1)
                        }).then(() => {
                            this.setState({ didUserVote: true });
                            this.showResults();
                        });
                    }
                }
            } else {
                this.setState({ errorMessage: 'Select your answer first!' });
            }
        } else {
            this.setState({ errorMessage: 'You have already voted on this poll!' });
        }
    }

    //shows poll results
    showResults = () => {
        history.push(`/poll/${this.props.match.params.pollId}/results`);
    }

    //runs if URL has changed
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    //sets questionsChecked state to initial
    onRouteChanged() {
        let newArr = this.state.questionsChecked;
        for (let i = 0; i < newArr.length; i++) {
            newArr[i] = false;
        }

        this.setState({ questionsChecked: newArr });
    }

    render() {
        let wrappedContent, content, displayResults = false;

        if (this.props.match.url == `/poll/${this.props.match.params.pollId}/results`) {
            displayResults = true;
        }

        //if poll data hasn't been downloaded yet, it shows loading screen
        if (_.isEmpty(this.state.pollData) && !this.state.err404) {
            wrappedContent = (
                <>
                    <div className="title-wrapper">
                        <h1>Loading</h1>
                        <h2>Just a second...</h2>
                    </div>
                </>
            )
        } else if (this.state.err404) {
            return <Error404 message={'There is no such poll in database!'}/>
        } else {
            if (displayResults) {
                content = <PollResults pollAnswers={this.state.pollData.pollAnswers} db={db} pollId={this.props.match.params.pollId}/>;
            } else {
                content = <PollAnswers pollAnswers={this.state.pollData.pollAnswers} vote={this.vote} handleCheckbox={this.handleCheckbox} showResults={this.showResults} checkboxesStatus={this.state.questionsChecked}/>;
            }

            //content to render
            wrappedContent = (
                <>
                    <div className="title-wrapper">
                        <h1>{this.state.pollData.pollQuestion}</h1>
                        {displayResults ? <></> : <h2>{this.state.pollData.multipleAnswers ? 'Select one or more answers' : 'Select one answer'}</h2>}
                    </div>
                    {content}
                </>
            );
        }

        //if there is an error and error popup is visible, it also shows half-transparent black layer to dim rest of the content
        const dimLayerStyle = {
            display: (this.state.errorMessage == '') ? 'none' : 'block'
        }

        //hides error popup
        const hidePopup = () => {this.setState({ errorMessage: ''} )};

        return (
            <>
            <div className="background"></div>
            <div className="anonymous-poll">
                <Navbar location={this.props.location} pollId={this.props.match.params}/>
                <div className="wrapper wrapper--outer">
                    <div className="wrapper--inner">
                        {wrappedContent}
                    </div>
                    <div className="wrapper--inner">
                        <SharePoll location={this.props.location}/>
                    </div>
                    <Footer />
                </div>
                <div className="popup-dimmer" style={dimLayerStyle} onClick={hidePopup}></div>
                {this.state.errorMessage && <ErrorPopup errorMsg={this.state.errorMessage} hidePopup={hidePopup}/>}
            </div>
            </>
        )
    }
}

export default AnonymousPoll;