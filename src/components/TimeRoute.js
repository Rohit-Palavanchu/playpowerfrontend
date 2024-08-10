import React, { Component } from 'react';
import Slider from '@mui/material/Slider';
import { DateTime } from 'luxon';
import '../styles/TimeRoute.css';

const roundToNearest5 = (minutes) => Math.round(minutes / 5) * 5;

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return DateTime.fromObject({ hour: hours, minute: mins }).toLocaleString(DateTime.TIME_SIMPLE);
};

const getMinutesSinceMidnight = (dateTime) => {
  return dateTime.hour * 60 + dateTime.minute;
};

class TimeRoute extends Component {
  constructor(props) {
    super(props);
    const now = DateTime.now().setZone(props.timezone);
    const initialSliderValue = getMinutesSinceMidnight(now);
    this.state = {
      sliderValue: roundToNearest5(initialSliderValue),
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.timeInMinutes !== this.props.timeInMinutes) {
      this.setState({ sliderValue: this.props.timeInMinutes });
    }
  }

  handleChange = (event, newValue) => {
    const roundedValue = roundToNearest5(newValue);
    this.setState({ sliderValue: roundedValue });
    this.props.onTimeChange(this.props.id, roundedValue);
  };

  handleDelete = () => {
    this.props.onDelete(this.props.id);
  };

  render() {
    const { timezone } = this.props;
    const { sliderValue } = this.state;
    const now = DateTime.now().setZone(timezone);
    const gmtOffset = now.offset / 60; // Offset in hours
    const formattedTime = now.toLocaleString(DateTime.TIME_SIMPLE);

    return (
      <div className="time-route">
        <h3>{timezone}</h3>
        <Slider
          value={sliderValue}
          min={0}
          max={24 * 60} // Total minutes in a day
          step={5}
          onChange={this.handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatTime(value)}
          aria-labelledby="time-slider"
        />
        <p>Selected Time: {formatTime(sliderValue)}</p>
        <p>Current Time: {formattedTime} (GMT {gmtOffset >= 0 ? '+' : ''}{gmtOffset})</p>
        <button onClick={this.handleDelete}>Delete</button>
      </div>
    );
  }
}

export default TimeRoute;
