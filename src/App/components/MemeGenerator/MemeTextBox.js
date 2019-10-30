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
      <div className = "asdf">
        <p>Text Box {this.props.index}</p>
        <input type="text" onClick={this.props.handleMemeText}/>
      </div>
    );
  }

}

export default MemeTextBox;