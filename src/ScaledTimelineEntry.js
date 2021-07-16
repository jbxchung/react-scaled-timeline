import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ScaledTimelineEntry extends Component {
  static defaultRenderer(dataEntry) {
    return (
      <div className="scaled-timeline-default-entry-card">
        {dataEntry.data.toString()}
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
      [barProperties.length]: this.props.barRenderConfig.length === 0 ? '1px' : `${this.props.barRenderConfig.length}%`,
      [barProperties.alignSide1]: 0,
      [barProperties.alignSide2]: 0,
    };
  }

  getEntryCardPosition(displayMode) {
    return displayMode === 'popout' ? {
      [this.props.entryPosition.offsetProperty]: `calc(100% + ${this.props.entryOffset})`,
    } : {};
  }

  render() {
    const { className, dataEntry, displayMode } = this.props;
    return (
      <div
        className={`scaled-timeline-entry ${className} ${displayMode}`}
        ref={this.props.forwardedRef}
        style={this.getBarStyle()}
      >
        <div className="scaled-timeline-entry-details-anchor">
          <div className={`scaled-timeline-entry-details ${displayMode}`} style={this.getEntryCardPosition(displayMode)}>
            {this.props.renderer(dataEntry)}
          </div>
        </div>
      </div>
    );
  }
}

ScaledTimelineEntry.propTypes = {
  barRenderConfig: PropTypes.object.isRequired,
  dataEntry: PropTypes.any.isRequired,
  displayMode: PropTypes.string.isRequired,
  entryPosition: PropTypes.object.isRequired,
  entryOffset: PropTypes.string.isRequired,
  orientation: PropTypes.object.isRequired,
  forwardedRef: PropTypes.object.isRequired,
  renderer: PropTypes.func.isRequired,
  className: PropTypes.string,
};

ScaledTimelineEntry.defaultProps = {
  className: '',
};

export default React.forwardRef((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ScaledTimelineEntry {...props} forwardedRef={ref} />
));
