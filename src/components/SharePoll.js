import React from 'react';
import { ReactComponent as CopyIcon } from '../icons/copy.svg';
import clipboard from 'clipboard-polyfill';

class SharePoll extends React.Component {
    state = {
        copyText: `polla.com${this.props.location.pathname}`,
        style: { color: '#000' }
    }

    //copies poll url to clipboard
    copyToClipboard = () => {
        clipboard.writeText(`polla.com${this.props.location.pathname}`);

        //shows message that url has been successfully copied
        this.setState({ copyText: 'URL copied to clipboard!', style: { color: '#1a75ff'} });

        //after 1 second it shows poll url again
        setTimeout(() => {
            this.setState({ copyText: `polla.com${this.props.location.pathname}`, style: { color: '#000'} });
        }, 1000);
    }

    render() {
        return (
            <div className="share-poll">
                <span>Share your poll!</span>
                <textarea readOnly rows="1" value={this.state.copyText} style={this.state.style}></textarea>
                <button onClick={() => this.copyToClipboard()}><CopyIcon /></button>
            </div>
        )
    }
}

export default SharePoll;