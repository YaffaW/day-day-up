
import TaskCard from './TaskCard';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  removeTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  updateTask: (updatedTask: Task) => void;
}
const TaskList = ({
  tasks,
  removeTask,
  toggleTaskCompletion,
  updateTask
}: TaskListProps) => {
  return (
    <div>
      {/* <h2>Task List</h2> */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onRemove={removeTask}
            onToggleComplete={toggleTaskCompletion}
            onUpdateTask={updateTask}
          />
        ))}
      </div>
      {/* Add functionality to add tasks here */}
    </div>
  );
};

export default TaskList;