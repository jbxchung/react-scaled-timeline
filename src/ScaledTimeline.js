/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { debounce } from 'debounce';

import * as propDefinitions from './constants/propDefinitions';
import * as barUtils from './utils/barUtils';
import hashCode from './utils/hashCode';

import './ScaledTimeline.scss';
import ScaledTimelineEntry from './ScaledTimelineEntry';

class ScaledTimeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      className: this.props.className,
      dataEntries: this.preProcess(this.props.timelineData),
      // props.orientation is the key, set state.orientation to the object itself
      orientation: propDefinitions.orientation[this.props.orientation],
      overflowStyle: { height: '100%' },
    };

    this.entryRefs = [];
    this.state.dataEntries.forEach((d, i) => {
      this.entryRefs[i] = React.createRef();
    });

    this.preProcess = this.preProcess.bind(this);
    this.handleEntryCollision = debounce(this.handleEntryCollision.bind(this), 10);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleEntryCollision);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleEntryCollision);
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
        ...dataEntry,
        renderKey: hashCode(JSON.stringify(dataEntry)),
      };

      preProcessedData.push(entry);
    });

    // calculate the position and length of the bar in percentages, and assign a color
    preProcessedData.forEach((entry, index) => {
      const { start, end } = entry.dateRange;
      /* eslint-disable no-param-reassign */
      entry.barRenderConfig = {
        color: this.props.colorCycle[index % this.props.colorCycle.length],
        length: barUtils.calculateLength(start, end, timelineStart, timelineEnd, this.props.scaleType),
        startPosition: barUtils.calculatePosition(start, timelineStart, timelineEnd, this.props.scaleType),
      };

      // use entry card placement props if specified, fallback on parent (this) props by default
      if (this.props.entryPosition === propDefinitions.entryPosition.alternate.id) {
        const validEntryPositions = propDefinitions.orientation[this.props.orientation].entryPositions;
        const entryIndex = this.props.reverseAlternation ? index + 1 : index;
        entry.entryPosition = validEntryPositions[entryIndex % validEntryPositions.length];
      } else {
        const entryPositionKey = entry.entryPosition || this.props.entryPosition;
        entry.entryPosition = propDefinitions.entryPosition[entryPositionKey];
      }
      entry.entryOffset = entry.entryOffset || this.props.entryOffset;
      // eslint-enable no-param-reassign
    });

    return preProcessedData;
  }

  handleEntryCollision() {
    // only matters for inline mode
    if (this.props.displayMode === 'popout') {
      return;
    }

    const overflowStyle = { ...this.state.overflowStyle };
    // check each that each entry is not overflowing
    for (let i = 0; i < this.entryRefs.length - 1; i++) {
      const thisEntryDiv = this.entryRefs[i].current;
      if (!thisEntryDiv) {
        // not rendered yet
        return;
      }
      const nextEntryDiv = this.entryRefs[i + 1].current;

      const thisEntryBottom = thisEntryDiv.offsetTop + thisEntryDiv.scrollHeight;
      if (thisEntryBottom > nextEntryDiv.offsetTop) {
        const currentTimelineHeightPercent = Number.parseInt(overflowStyle.height, 10);

        this.setState({
          overflowStyle: {
            height: `${currentTimelineHeightPercent + 1}%`,
          },
        });
        break;
      }
    }
  }

  render() {
    this.handleEntryCollision();

    return (
      <div className={`scaled-timeline-container ${this.state.orientation.className} ${this.state.className} ${this.props.displayMode}`}>
        <div className="scaled-timeline" style={this.state.overflowStyle}>
          {this.state.dataEntries.map((entry, index) => (
            <ScaledTimelineEntry
              barRenderConfig={entry.barRenderConfig}
              dataEntry={entry}
              displayMode={this.props.displayMode}
              entryPosition={entry.entryPosition}
              entryOffset={entry.entryOffset}
              key={entry.renderKey}
              orientation={this.state.orientation}
              ref={this.entryRefs[index]}
              renderer={entry.renderer || this.props.entryRenderer}
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
  displayMode: PropTypes.oneOf(Object.keys(propDefinitions.displayMode)),
  entryOffset: PropTypes.string,
  entryPosition: PropTypes.oneOf(Object.keys(propDefinitions.entryPosition)),
  entryRenderer: PropTypes.func,
  orientation: PropTypes.oneOf(Object.keys(propDefinitions.orientation)),
  reverseAlternation: PropTypes.bool,
  scaleType: PropTypes.oneOf(Object.keys(propDefinitions.scaleType)),
};

ScaledTimeline.defaultProps = {
  className: '',
  colorCycle: propDefinitions.defaultColorCycle,
  displayMode: propDefinitions.displayMode.inline.id,
  entryOffset: propDefinitions.defaultEntryOffset,
  entryPosition: propDefinitions.entryPosition.alternate.id,
  entryRenderer: ScaledTimelineEntry.defaultRenderer,
  orientation: propDefinitions.orientation.vertical.id,
  reverseAlternation: false,
  scaleType: propDefinitions.scaleType.linear,
};

export default ScaledTimeline;
