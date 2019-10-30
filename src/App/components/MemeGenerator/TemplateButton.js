import React from 'react';
/** Component for selecting meme template */
class TemplateButton extends React.Component {
  /* 
      TODO: complete this component
           Props: meme, an object containing information about the meme.
                        You'll need the id and url properties.                       
                  reselectMeme, a function that changes the meme template on the left 
                                when the image is clicked.
                  changeText, a function that changes the name of the meme template when
                              hovering over different templates.
                  resetText, a function that resets the displayed name to the current
                             template when the mouse leaves the buttons.
  */

  render() {
    return (
        <img src={this.props.meme.url} width="50" height="50" alt="meme thumbnail" 
        onClick={this.props.reselectMeme} onMouseLeave={this.props.resetText} 
        onMouseOver={this.props.changeText}/>
    );
  }
}
export default TemplateButton;