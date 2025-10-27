import "./Schedule.css"
import ScheduleItem from "./ScheduleItem";
import { getDay } from "../../utils/index";

function toTime(time: number) {
  return time + ":00";
}

export default function Schedule() {
  const startTime = 9; // Start time of the schedule
  const endTime = 22; // End time of the schedule
  const timeScale = 1; // Time scale in hours
  const times = new Array(endTime - startTime).fill(null);
  const dates = new Array(7).fill(null);

  const getTask = (index) => {
    return null;
  }
  return (
    <div className="schedule">
      <div className="row">
        <div className="col index"></div>
        {
          times.map((item, index) => (<div className="col" key={index}>{toTime(startTime + index * timeScale)}-{toTime(startTime + 1 + index * timeScale)}</div>))
        }
      </div>
      {
        dates.map((val, index) => {
          return (
            <div className="row" key={index}>
              <div className="col index">{getDay(index)}</div>
              {times.map(index => <ScheduleItem task={getTask(index)} />)}
            </div>
          )
        })
      }
    </div >
  )
}