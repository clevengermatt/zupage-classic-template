import React, { Component } from "react";
import "./App.css";
import zupage from "zupage";
import { Container, Image } from "semantic-ui-react";
import Gallery from "react-photo-gallery";
import Lightbox from "react-images";
import MediaBody from "react-media-body";

class App extends Component {
  state = {
    body: "",
    creator: {},
    colorPalette: [],
    date: "",
    photos: [],
    paragraphs: [],
    title: ""
  };

  async componentDidMount() {
    const postResponse = await zupage.getCurrentPost();

    const date = new Date(
      postResponse.published_time * 1000
    ).toLocaleDateString("en-US");

    this.setState({
      body: postResponse.body,
      creator: postResponse.creator,
      colorPalette: postResponse.page.color_palette,
      date: date,
      photos: this.formatPhotos(postResponse.images)
    });
  }

  formatPhotos = images => {
    let photoArray = [];

    let index = 0;

    images.forEach(function(image) {
      photoArray.push({
        id: image.id,
        index: index,
        caption: image.caption,
        src: image.url,
        width: image.width,
        height: image.height
      });
      index++;
    });

    return photoArray;
  };

  openLightbox = (event, obj) => {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true
    });
  };

  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    });
  };

  gotoPrevious = () => {
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  };

  gotoNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  };

  renderHeader = () => {
    const { creator, date } = this.state;
    return (
      <div className="Header">
        <Image
          className="Author-Image"
          src={creator.profile_image_url}
          avatar
        />
        <span className="Author-Text">{creator.name}</span>
        <div className="Date">
          <p>{date}</p>
        </div>
      </div>
    );
  };

  render() {
    const { body, photos } = this.state;
    return (
      <div className="Template">
        <Container text>
          {this.renderHeader()}
          <MediaBody className="Body-Text" mediaWidth="100%">
            {body}
          </MediaBody>
          <Gallery photos={photos} onClick={this.openLightbox} />
        </Container>
        <Lightbox
          className="Lightbox"
          images={photos}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={this.state.currentImage}
          isOpen={this.state.lightboxIsOpen}
        />
      </div>
    );
  }
}

export default App;
