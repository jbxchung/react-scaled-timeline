import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as propDefinitions from './constants/propDefinitions';

import './ScaledTimeline.scss';
import ScaledTimelineEntry from './ScaledTimelineEntry';

class ScaledTimeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      className: this.props.className,
      dataEntries: this.preProcess(this.props.timelineData),
      scaleType: this.props.scaleType,
    };

    // todo: handle logarithmic
    console.log(this.state.scaleType);
    console.log(this.state.dataEntries);

    this.preProcess = this.preProcess.bind(this);
    this.calculatePosition = this.calculatePosition.bind(this);
    this.calculateLength = this.calculateLength.bind(this);
  }

  hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // eslint-disable-line no-bitwise
    }
    return hash;
  }

  preProcess(data) {
    const preProcessedData = [];

    let timelineStart = Infinity;
    let timelineEnd = -Infinity;

    data.forEach((dataEntry) => {
      // validate
      if (!dataEntry.dateRange) {
        throw new Error('Each data entry must have a dateRange property.');
      } else if (!dataEntry.dateRange.start) {
        throw new Error('Each dateRange must have a startDate.');
      }

      // get minimum value to be the beginning of the timeline
      timelineStart = Math.min(timelineStart, dataEntry.dateRange.start);
      timelineEnd = Math.max(timelineEnd, dataEntry.dateRange.end || timelineEnd);

      const entry = {
        data: dataEntry,
        reactKey: this.hash(JSON.stringify(dataEntry)),
      };

      preProcessedData.push(entry);
    });

    // calculate the position and length of the bar in percentages, and assign a color
    preProcessedData.forEach((entry, index) => {
      const { start, end } = entry.data.dateRange;
      // eslint-disable-next-line no-param-reassign
      entry.barRenderConfig = {
        color: this.props.colorCycle[index % this.props.colorCycle.length],
        length: this.calculateLength(start, end, timelineStart, timelineEnd),
        startPosition: this.calculatePosition(start, timelineStart, timelineEnd),
      };
    });

    return preProcessedData;
  }

  // get the position of a point as a percentage of the full timeline length
  calculatePosition(point, timelineStart, timelineEnd) {
    if (this.props.scaleType === propDefinitions.scaleType.linear) {
      const timeFromStart = point - timelineStart;
      const totalTime = timelineEnd - timelineStart;

      return (timeFromStart / totalTime) * 100;
    }

    // todo: handle logarithmic scale
    return 0;
  }

  // get the length of a bar as a percentage of the full timeline length
  calculateLength(pointStart, pointEnd, timelineStart, timelineEnd) {
    // no end point, so this will have no length (just show a point on the timeline)
    if (!pointEnd) {
      return 0;
    }

    const timelineLength = timelineEnd - timelineStart;
    const barLength = pointEnd - pointStart;

    return (barLength / timelineLength) * 100;
  }

  render() {
    return (
      <div className={`scaled-timeline-container ${propDefinitions.orientation[this.props.orientation]} ${this.state.className}`}>
        <div className="scaled-timeline">
          {this.state.dataEntries.map((entry) => (
            <ScaledTimelineEntry
              data={entry.data}
              key={entry.reactKey}
              barRenderConfig={entry.barRenderConfig}
              orientation={this.props.orientation}
              renderer={entry.renderer || this.props.defaultRenderer}
            />
          ))}
        </div>
      </div>
    );
  }
}

ScaledTimeline.propTypes = {
  timelineData: PropTypes.array.isRequired,
  className: PropTypes.string,
  colorCycle: PropTypes.arrayOf(PropTypes.string),
  defaultRenderer: PropTypes.func,
  orientation: PropTypes.oneOf(Object.keys(propDefinitions.orientation)),
  scaleType: PropTypes.oneOf(Object.keys(propDefinitions.scaleType)),
};

ScaledTimeline.defaultProps = {
  className: '',
  colorCycle: propDefinitions.defaultColorCycle,
  defaultRenderer: ScaledTimelineEntry.defaultRenderer,
  orientation: propDefinitions.orientation.vertical,
  scaleType: propDefinitions.scaleType.linear,
};

export default ScaledTimeline;
