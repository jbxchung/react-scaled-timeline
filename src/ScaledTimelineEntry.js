import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ScaledTimelineElement extends Component {
  static defaultRenderer(data) {
    return data.title;
  }

  constructor(props) {
    super(props);

    this.getBarStyle = this.getBarStyle.bind(this);
  }

  getBarStyle() {
    return {
      background: this.props.barRenderConfig.color,
      bottom: `${this.props.barRenderConfig.startPosition}%`,
      height: `${this.props.barRenderConfig.length}%`,
    };
  }

  render() {
    return (
      <div
        className={`scaled-timeline-entry ${this.props.className}`}
        style={this.getBarStyle()}
      >
        <div className="scaled-timeline-entry-details">
          {this.props.renderer(this.props.data)}
        </div>
      </div>
    );
  }
}

ScaledTimelineElement.propTypes = {
  barRenderConfig: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  renderer: PropTypes.func.isRequired,
  className: PropTypes.string,
};

ScaledTimelineElement.defaultProps = {
  className: '',
};

export default ScaledTimelineElement;
