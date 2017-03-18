import React from 'react';

export default class MobileTearSheet extends React.Component {

  render() {

    let styles = {
      root: {
        float: 'left',
        width: '34%',
        borderRight: 'solid 1px #d9d9d9',
      },

      container: {
        borderBottom: 'none',
        height: 'calc(100vh - 112px)',
        overflowY: 'scroll'
      },
    };

    return (
      <div style={styles.root}>
        <div style={styles.container}>
          {this.props.children}
        </div>
      </div>
    );
  }
};

