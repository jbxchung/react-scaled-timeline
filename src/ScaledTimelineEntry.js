import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ScaledTimelineEntry extends Component {
  static defaultRenderer(data) {
    return (
      <div className="scaled-timeline-default-entry-card">
        {data.toString()}
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.getBarStyle = this.getBarStyle.bind(this);
  }

  getBarStyle() {
    const { barProperties } = this.props.orientation;
    return {
      background: this.props.barRenderConfig.color,
      [barProperties.startPosition]: `${this.props.barRenderConfig.startPosition}%`,
      [barProperties.length]: `${this.props.barRenderConfig.length}%`,
      [barProperties.alignSide1]: 0,
      [barProperties.alignSide2]: 0,
    };
  }

  getEntryCardPosition() {
    return {
      [this.props.entryPosition.offsetProperty]: `calc(100% + ${this.props.entryOffset})`,
    };
  }

  render() {
    return (
      <div
        className={`scaled-timeline-entry ${this.props.className}`}
        style={this.getBarStyle()}
      >
        <div className="scaled-timeline-entry-details-anchor">
          <div className="scaled-timeline-entry-details" style={this.getEntryCardPosition()}>
            {this.props.renderer(this.props.data)}
          </div>
        </div>
      </div>
    );
  }
}

ScaledTimelineEntry.propTypes = {
  barRenderConfig: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  orientation: PropTypes.object.isRequired,
  entryPosition: PropTypes.object.isRequired,
  entryOffset: PropTypes.string.isRequired,
  renderer: PropTypes.func.isRequired,
  className: PropTypes.string,
};

ScaledTimelineEntry.defaultProps = {
  className: '',
};

export default ScaledTimelineEntry;
