import React from 'react';

/** Text box for meme captions */
class MemeTextBox extends React.Component {
  /*
      TODO: complete this component
          Props: index, a number indicating which text box this is
                 handleMemeText, a function that updates 
                                 the state in MemeGeneratorWrapper when we 
                                 update the text
  */
  render() {
    return (
      <div>
        <h2>Text Box {this.props.index + 1}</h2>
        <textarea onChange={e => this.props.handleMemeText(this.props.index,e.target.value)}></textarea>
      </div>
    );
  }

}

export default MemeTextBox;