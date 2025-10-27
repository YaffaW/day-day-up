import { useState } from "react";
import "./Home.css";
import Schedule from "./Schedule";
import ScheduleAdd from "./ScheduleAdd";
function ScheduleHome() {
  const [isAdding, setIsAdding] = useState(false);
  return (
    <div className="schedule-home">
      <Schedule />
      {isAdding && <ScheduleAdd onClose={() => setIsAdding(false)} />}
      <div className="add" onClick={() => setIsAdding(true)}>+</div>
    </div>
  );
}

export default ScheduleHome;