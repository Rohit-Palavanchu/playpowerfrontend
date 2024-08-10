import React, { Component } from 'react';
import Select from 'react-select'; // Make sure to import Select
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import TimeRoute from './TimeRoute';
import { DateTime } from 'luxon';
import '../styles/index.css';

const timezones = [
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
    { value: 'Europe/London', label: 'Europe/London' },
    { value: 'Europe/Paris', label: 'Europe/Paris' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata' },
    // Add more timezones as needed
  ];
  
  const ItemTypes = {
    TIME_ROUTE: 'timeRoute',
  };
  
  const DraggableTimeRoute = ({ id, timezone, timeInMinutes, onTimeChange, onDelete, index, moveTimeRoute }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.TIME_ROUTE,
      item: { id, index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
  
    const [, drop] = useDrop({
      accept: ItemTypes.TIME_ROUTE,
      hover: (item) => {
        if (item.index !== index) {
          moveTimeRoute(item.index, index);
          item.index = index;
        }
      },
    });
  
    return (
      <div
        ref={(node) => drag(drop(node))}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className='draggable-item'
      >
        <TimeRoute
          id={id}
          timezone={timezone}
          initialTimeInMinutes={timeInMinutes}
          onTimeChange={onTimeChange}
          onDelete={onDelete}
        />
      </div>
    );
  };
  
  class Home extends Component {
    state = {
      selectedTimezone: null,
      currentTimesList: [],
    };
  
    handleChange = (selectedOption) => {
      this.setState({ selectedTimezone: selectedOption });
    };
  
    onAddTimeZone = () => {
      const { selectedTimezone } = this.state;
      if (selectedTimezone) {
        const now = DateTime.now().setZone(selectedTimezone.value);
        const currentTimeInMinutes = now.hour * 60 + now.minute;
  
        this.setState((prevState) => ({
          currentTimesList: [
            ...prevState.currentTimesList,
            {
              id: uuidv4(),
              value: selectedTimezone.value,
              timeInMinutes: currentTimeInMinutes,
            },
          ],
          selectedTimezone: null,
        }));
      }
    };
  
    handleTimeChange = (id, newTimeInMinutes) => {
      this.setState((prevState) => ({
        currentTimesList: prevState.currentTimesList.map((rt) =>
          rt.id === id ? { ...rt, timeInMinutes: newTimeInMinutes } : rt
        ),
      }));
    };
  
    handleDelete = (id) => {
      this.setState((prevState) => ({
        currentTimesList: prevState.currentTimesList.filter((rt) => rt.id !== id),
      }));
    };
  
    moveTimeRoute = (fromIndex, toIndex) => {
      const reorderedList = Array.from(this.state.currentTimesList);
      const [movedItem] = reorderedList.splice(fromIndex, 1);
      reorderedList.splice(toIndex, 0, movedItem);
      this.setState({ currentTimesList: reorderedList });
    };
  
    render() {
      const { selectedTimezone, currentTimesList } = this.state;
  
      return (
        <DndProvider backend={HTML5Backend}>
          <div className='home-container'>
            <Select
              options={timezones}
              onChange={this.handleChange}
              value={selectedTimezone}
              placeholder="Select a timezone..."
              isSearchable
              className='select-tag'
            />
            <button onClick={this.onAddTimeZone} className='add-time-zone'>Add</button>
          </div>
          <div className='time-route-container'>
            {currentTimesList.map((item, index) => (
              <DraggableTimeRoute
                key={item.id}
                id={item.id}
                timezone={item.value}
                timeInMinutes={item.timeInMinutes}
                onTimeChange={this.handleTimeChange}
                onDelete={this.handleDelete}
                index={index}
                moveTimeRoute={this.moveTimeRoute}
              />
            ))}
          </div>
        </DndProvider>
      );
    }
  }
  
  export default Home;
