
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  removeTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  updateTask: (updatedTask: Task) => void;
  onAddTask: (task: Task) => void;
}
const TaskList = ({
  tasks,
  removeTask,
  toggleTaskCompletion,
  updateTask,
  onAddTask
}: TaskListProps) => {
  return (
    <div>
      {/* <h2>Task List</h2> */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <AddTaskForm onAddTask={onAddTask} />
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
    </div>
  );
};

export default TaskList;