import React from 'react';
import history from '../../history';

class PollResults extends React.Component {
    state = {
        pollAnswers: {},
        barWidth: {},
        allVotes: 0
    }

    //fetches current data from database
    componentDidMount = () => {
        const { db, pollId } = this.props;

        const docRef = db.collection("anonymousPolls").doc(`${pollId}`);
        docRef.get().then((doc) => {
            if (doc.exists) {
                this.setState({pollAnswers: doc.data().pollAnswers}, () => {
                    this.calculateBarPercentages();
                });
            } else {
                console.log("No such document in database!");
            }
        }).catch((err) => {
            console.log("Error getting document: ", err);
        });
    }

    //calculates how much filled should be each of result bars
    calculateBarPercentages = () => {
        const { pollAnswers } = this.state;
        let allVotes = 0;

        //counts all the votes
        Object.keys(pollAnswers).forEach(index => {
            allVotes += pollAnswers[index].votes;
            this.setState({ allVotes: allVotes});
        });

        let updatedPollAnswers = pollAnswers;

        //divides every option's votes by sum of all votes and multiplies it by 100 to get fill percentage
        Object.keys(pollAnswers).forEach(index => {
            if (allVotes != 0) {
                updatedPollAnswers[index].percentage = Math.round((updatedPollAnswers[index].votes / allVotes) * 100);
            } else {
                updatedPollAnswers[index].percentage = 0;
            }
        });

        this.setState({ pollAnswers: updatedPollAnswers });
    }

    //shows voting screen 
    goBackToVoting = (e) => {
        e.preventDefault();
        history.push(`/poll/${this.props.pollId}`);
    }

    //renders poll results
    renderResults = () => {
        const { pollAnswers } = this.state;

        const resultsList = Object.keys(pollAnswers).map((key) => (
            <div key={key}>
                <div className="results_info">
                    <span className="results_info_content">{pollAnswers[key].content}</span>
                    <span className="results_info_votes">{pollAnswers[key].votes} Votes</span>
                </div>
                <div className="results_bar_container">
                    <div className="results_bar_fillable">
                        <div className="results_bar_filled" style={{width: `${pollAnswers[key].percentage}%`}}></div>
                    </div>
                    <div className="results_bar_percentage">{pollAnswers[key].percentage}%</div>
                </div>
            </div>
        ));

        return resultsList;
    }

    render() {
        const { allVotes } = this.state;
        const votesAmountMsg = (allVotes == 1) ? 'vote' : 'votes';

        return (
            <div>
                {this.renderResults()}
                <div className="results_bottom-wrapper">
                    <div className="results_votes-number"><span>{this.state.allVotes}</span> {votesAmountMsg}</div>
                    <div className="results_vote-btn bottom-hover-animation" onClick={(e) => this.goBackToVoting(e)}>Vote</div>
                </div>
            </div>
        );
    }
}

export default PollResults;