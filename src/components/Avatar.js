import React from 'react';

function Avatar(props) {
  if (props.url === null) {
    // TODO(jacobperron): Replace with anonymous avatar
    return 'unknown';
  }

  return <img src={props.url} alt="" className="avatar" />;
}

export default Avatar
