import React from 'react';
import MemeModel from './MemeModel';
import Axios from 'axios';
require('../../style/meme.css');

/** Component that handles the overall meme gallery page.*/
class MemeGallery extends React.Component {
  constructor() {
    super();
    Axios.get('/getmemes')
    .then(response => {
      this.setState({
        memeArray: response.data,
      })
    });
    this.state = {
      memeArray: null,
    };
  }

  render() {
    console.log(this.state.memeArray);
    const ourFavorites = this.state.memeArray ? this.state.memeArray.map ((meme) =>
      <MemeModel
        key={meme._id}
        id={meme._id}
        photoURL={meme.photoURL}
        topText={meme.topText}
        bottomText={meme.bottomText}
        user={meme.user}
        likes={meme.likes}
        isBolded={meme.isBolded}
      />
    ) : null;
    return(
      // example of inline style
      <div>
        <h2 className="title">Meme Gallery</h2>
        {ourFavorites}
      </div>
    );
  }
}



export default MemeGallery;
