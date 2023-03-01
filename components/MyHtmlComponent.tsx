import React from 'react';

const MyHtmlComponent = (props) => {
  return React.createElement('div', { dangerouslySetInnerHTML: { __html: props.htmlString } });
};

export default MyHtmlComponent;