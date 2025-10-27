import { useState } from "react";

function DateControls() {
  const [dates, setDates] = useState([]);
  return (
    <div className="date-controls">
      <button className="prev-day">Previous Day</button>
      <button className="next-day">Next Day</button>
    </div>
  );
}
export default DateControls;