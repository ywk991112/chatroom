let React = require('react');


let MobileTearSheet = React.createClass({

  render() {

    let styles = {
      root: {
        float: 'left',
        width: '35%',
        minHeight: '100%',
        borderRight: 'solid 1px #d9d9d9',
      },

      container: {
        borderBottom: 'none',
        overflow: 'hidden'
      },

      bottomTear: {
        display: 'block',
        position: 'relative',
        marginTop: -10,
        width: 360
      }
    };

    return (
      <div style={styles.root}>
        <div style={styles.container}>
          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports = MobileTearSheet;
