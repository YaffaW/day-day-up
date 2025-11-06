import { useState } from "react";
import "./Home.css";
import Schedule from "./Schedule";
import ScheduleAdd from "./ScheduleAdd";

function ScheduleHome() {
  const [isAdding, setIsAdding] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleAdd = () => {
    setRefreshTrigger(prev => prev + 1); // 触发刷新
  };

  return (
    <div className="schedule-home">
      <Schedule key={refreshTrigger} /> {/* 使用key来强制重新渲染组件 */}
      {isAdding && <ScheduleAdd onClose={() => setIsAdding(false)} onAdd={handleAdd} />}
      <div className="add" onClick={() => setIsAdding(true)}>+</div>
    </div>
  );
}

export default ScheduleHome;