import "./Tasks.css";
import { useReducer, useState } from "react";

const tasks = [
  {
    scheduleId: 1,
    startTime: "2025-07-24 08:00",
    endTime: "2025-07-24 10:00",
    scheduleName: "《Linked》精读",
    des: "",
    repeat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    isProgress: true,
    progress: 0,
    hasDone: false,
    color: "#FF5733", // Example color for the task
    schedules: [
      {
        time: ["2025-07-24 08:00", "2025-07-24 10:00"],
        hasDone: false
      }
    ]
  },
  {
    scheduleId: 2,
    startTime: "",
    endTime: "",
    scheduleName: "个人网站",
    des: "做「Yaffa的个人网站」",
    repeat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    isProgress: true,
    progress: 0,
    hasDone: true,
    color: "#33FF57" // Example color for the task
  },
  {
    scheduleId: 3,
    startTime: "",
    endTime: "",
    scheduleName: "「罗马城项目」",
    des: "",
    repeat: ["Sat", "Sun"],
    isProgressBased: true,
    progress: 0,
    hasDone: false,
    color: "#3357FF" // Example color for the task
  }
]

function tasksReducer(list, action) {
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
function Tasks() {
  const [showModel, setShowModel] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(0);
  const [list, dispatch] = useReducer(tasksReducer, tasks);
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
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const taskIndex = e.currentTarget.getAttribute('data-index') || -1;
    console.log('------', taskIndex, list[taskIndex]);
    e.dataTransfer.setData("currentTask", JSON.stringify(list[taskIndex]));
    // e.dataTransfer.effectAllowed = "move";
  };
  return (
    <div className="tasks">
      {
        list.map((task, index) => {
          return (
            <div draggable onDragStart={handleDrag} data-index={index} key={task.scheduleId} className="task-item" style={{ backgroundColor: task.color }}>
              <div className="task-title">
                <div className="task-name">{task.scheduleName}</div>
                <div className="task-done" onClick={() => handleDone(index)}>
                  <span className="iconfont" style={{ color: task.hasDone ? '#FFC107' : '#FFFFFF80' }}>&#xe7a7;</span>
                </div>
              </div>
              <div className="task-des">{task.des}</div>
              {
                task.isProgressBased && (
                  <progress value={task.progress} max={100}></progress>
                )
              }
              <div className="task-period">
                {
                  task.startTime && task.endTime &&
                  <span className="time">
                    {new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(task.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          <div className="wrapper task-change">
            <div className="button-close" onClick={handleProgressDone}><span className="iconfont">&#xe614;</span></div>
            <div className="title"><span>填写当前完成进度</span></div>
            <input type="number" value={list[currentSchedule].progress} onChange={handleProgress} />
          </div>
        </div>
      }
    </div>
  );
}

export default Tasks;