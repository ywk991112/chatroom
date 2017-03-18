import React from 'react';
import '../css/MobileTearSheet.scss';

export default class MobileTearSheet extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rootClass = (this.props.left)? "float-left" : "root";
    console.log(rootClass);
    return (
      <div className={rootClass}>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
};

