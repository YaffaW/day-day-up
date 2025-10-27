import "./ScheduleAdd.css"

function ScheduleAdd({
  onClose
}) {
  const addSchedule = (formData) => {
    console.log(formData)
    // Logic to handle adding a new schedule
    console.log("Schedule added", formData);
  };
  return (
    <div className="mask">
      <div className="wrapper schedule-add">
        <h2>Add New Schedule</h2>
        <form action={addSchedule}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" required />
          </div>
          <div className="form-group">
            <label htmlFor="start-date">Start Time:</label>
            <input type="datetime-local" id="start-date" name="start-date" required />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End Time:</label>
            <input type="datetime-local" id="end-date" name="end-date" required />
          </div>
          <div className="form-group">
            <label htmlFor="repeat">Repeat:</label>
            <select id="repeat" name="repeat">
              <option value="none">No Repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="hasProgress">Progress:</label>
            <input type="radio" id="hasProgress" name="hasProgress" value="yes" />
            <span>Yes</span>
            <input type="radio" id="hasProgress" name="hasProgress" value="no" />
            <span>No</span>
          </div>
          <div className="form-group">
            <label htmlFor="currentProgress"></label>
            <input type="number" id="currentProgress" name="currentProgress" min="0" max="100" placeholder="Current Progress (%)" />
          </div>
          <div className="form-button">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="button-add">Add Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ScheduleAdd;