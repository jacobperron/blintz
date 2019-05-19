import React from 'react';
import PropTypes from 'prop-types';

function Avatar(props) {
  if (props.url === null) {
    // TODO(jacobperron): Replace with anonymous avatar
    return 'unknown';
  }

  return <img src={props.url} alt="" className="avatar" />;
}

Avatar.propTypes = {
  url: PropTypes.string
}

export default Avatar
