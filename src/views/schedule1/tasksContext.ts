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