import "./Schedule.css";
import { useReducer, useState } from "react";

import { debounce } from "../../utils/index.ts";

const schedules = [
  {
    scheduleId: 1,
    startTime: "2025-07-24 08:00",
    endTime: "2025-07-24 10:00",
    scheduleName: "《Linked》精读",
    repeat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    isProgress: true,
    progress: 0,
    hasDone: false
  },
  {
    scheduleId: 2,
    startTime: "",
    endTime: "",
    scheduleName: "做「Yaffa的个人网站」",
    repeat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    isProgress: true,
    progress: 0,
    hasDone: true
  },
  {
    scheduleId: 3,
    startTime: "",
    endTime: "",
    scheduleName: "周末做「罗马城项目」",
    repeat: ["Sat", "Sun"],
    isProgressBased: true,
    progress: 0,
    hasDone: false
  }
]

function schedulesReducer(list, action) {
  switch (action.type) {
    case 'ADD_SCHEDULE':
      return [...list, action.payload];
    case 'TOGGLE_DONE':
      return list.map((item, index) =>
        index === action.index ? { ...item, hasDone: !item.hasDone } : item
      );
    case 'CHANGE_PROGRESS':
      return list.map((item, index) =>
        index === action.index ? { ...item, progress: action.progress } : item
      );
    default:
      return list;
  }
}
function Schedule() {
  const [showModel, setShowModel] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(0);
  const [list, dispatch] = useReducer(schedulesReducer, schedules);
  const handleDone = (index: number) => {
    if (list[index].isProgressBased && !list[index].hasDone) {
      setCurrentSchedule(index);
      setShowModel(true);
      return;
    }
    dispatch({ type: 'TOGGLE_DONE', index });
  }
  const handleProgress = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    dispatch({ type: "CHANGE_PROGRESS", index: currentSchedule, progress: e.target.value })
  };
  const handleProgressDone = () => {
    dispatch({ type: 'TOGGLE_DONE', index: currentSchedule });
    setShowModel(false);
  }
  return (
    <div className="schedule">
      {
        list.map((schedule, index) => {
          return (
            <div key={schedule.scheduleId} className="schedule-item">
              <div className="schedule-title">
                <div className="schedule-name">{schedule.scheduleName}</div>
                <div className="schedule-done" onClick={() => handleDone(index)}>
                  <span className="iconfont" style={{ color: schedule.hasDone ? '#FFC107' : '#FFFFFF80' }}>&#xe7a7;</span>
                </div>
              </div>
              {
                schedule.isProgressBased && (
                  <progress value={schedule.progress} max={100}></progress>
                )
              }
              <div className="schedule-period">
                {
                  schedule.startTime && schedule.endTime &&
                  <span className="time">
                    {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                }
              </div>
            </div>
          )
        })
      }
      {
        showModel &&
        <div className="mask">
          <div className="wrapper schedule-change">
            <div className="button-close" onClick={handleProgressDone}><span className="iconfont">&#xe614;</span></div>
            <div className="title"><span>填写当前完成进度</span></div>
            <input type="number" value={list[currentSchedule].progress} onChange={handleProgress} />
          </div>
        </div>
      }
    </div>
  );
}

export default Schedule;