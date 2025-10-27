
import TaskCard from './TaskCard';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  removeTask: (taskId: string) => void;
  toggleTaskCompletion?: (taskId: string, completed: boolean) => void;
}
const TaskList = ({
  tasks,
  removeTask,
  toggleTaskCompletion
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
            onToggleCompletion={toggleTaskCompletion}
          />
        ))}
      </div>
      {/* Add functionality to add tasks here */}
    </div>
  );
};

export default TaskList;