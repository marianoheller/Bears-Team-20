import React from 'react';
import { connect } from 'react-redux';
import { Typography, Button, Avatar, Input } from 'material-ui';
import PropTypes from 'prop-types';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import './ChangePicture.css';

class ChangePictureComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      url: props.profilePic
    }

    this.handleUploadPicture = this.handleUploadPicture.bind(this);
    this.handleInnerLocalChange = this.handleInnerLocalChange.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleEditClick() {
    this.setState({editing: true});
  }

  handleInnerLocalChange(newUrl) {
    this.setState({ url: newUrl });
  }

  handleUploadPicture() {
    const { changePicture } = this.props;
    this.setState({editing: false});
    changePicture(this.state.url);
  }

  render() {
    const { username, profilePic } = this.props;
    return (
      <div id="change-pic-container">

        <Typography
        id="change-pic-title"
        variant="title"
        color="primary"
        >
          <strong>Profile picture</strong>
        </Typography>

        <div id="change-pic-content-container">

          <div id="change-pic-avatar-container">
            <Avatar
              alt={username}
              src={profilePic}
            />
          </div>

          <Input
          id="change-pic-url-input"
          disabled={!this.state.editing}
          value={this.state.url}
          onChange={ (e) => this.handleInnerLocalChange(e.target.value) }
          />

          <div id="change-pic-controls-container">
            <Button
              id="edit-pic-button"
              disabled={this.state.editing}
              color="primary"
              onClick={this.handleEditClick}
            >
              Modify url
            </Button>
            <Button
              id="change-pic-button"
              disabled={!this.state.editing}
              color="primary"
              onClick={this.handleUploadPicture}
            >
              Confirm changes!
            </Button>
          </div>
        </div>
      </div>
    );
  }
}


ChangePictureComponent.propTypes = {
  username: PropTypes.string,
  profilePic: PropTypes.string,
  changePicture: PropTypes.func,
};

ChangePictureComponent.defaultProps = {
  username: '',
  profilePic: '',
  changePicture: () => {},
};


const mapStateToProps = ({ user }) => ({
  profilePic: user.profilePic,
  username: user.username,
});

const mapDispatchToProps = () => ({
  changePicture: (url) => {
    console.log('CHANGING to', url);
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(ChangePictureComponent);
