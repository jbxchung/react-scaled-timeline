import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ScaledTimeline extends Component {
  render() {
    return <div>{this.props.testProp}</div>;
  }
}

ScaledTimeline.propTypes = {
  testProp: PropTypes.object,
};

ScaledTimeline.defaultProps = {
  testProp: 'test',
};

export default ScaledTimeline;
