import { scaleType } from '../constants/propDefinitions';

// get the position of a point as a percentage of the full timeline length
export function calculatePosition(point, timelineStart, timelineEnd, scale) {
  if (scale === scaleType.linear) {
    const timeFromStart = point - timelineStart;
    const totalTime = timelineEnd - timelineStart;

    return (timeFromStart / totalTime) * 100;
  }

  // todo: handle logarithmic scale
  return 0;
}

// get the length of a bar as a percentage of the full timeline length
export function calculateLength(pointStart, pointEnd, timelineStart, timelineEnd, scale) {
  // no end point, so this will have no length (just show a point on the timeline)
  if (!pointEnd) {
    return 0;
  }

  if (scale === scaleType.linear) {
    const timelineLength = timelineEnd - timelineStart;
    const barLength = pointEnd - pointStart;

    return (barLength / timelineLength) * 100;
  }

  // todo: handle logarithmic scale
  return 0;
}
