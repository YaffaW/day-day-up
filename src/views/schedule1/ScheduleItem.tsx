export default function ScheduleItem(task) {
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#4f514bb8';
  }
  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#63d35db8';
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#63d35db8';
    const data = e.dataTransfer.getData("currentTask");
    if (data) {
      const task = JSON.parse(data);
      console.log('Dropped task:', task);
      // Here you can add logic to place the task in the schedule
    }
  }
  return (
    <div className="col schedule-item" style={{ backgroundColor: task && task.color }} onDrop={handleDrop} onDragEnter={handleDragOver} onDragLeave={handleDragLeave} onDragOver={(e) => e.preventDefault()}>
      {task && <span>{task.scheduleName}</span>}
    </div>
  );
}