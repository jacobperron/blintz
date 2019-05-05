import React from 'react';

function Avatar(props) {
  if (typeof props.url === "undefined") {
    // TODO(jacobperron): Replace with anonymous avatar
    return 'unkown';
  }

  return <img src={props.url} alt="" className="avatar" />;
}

export default Avatar
