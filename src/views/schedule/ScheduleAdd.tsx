import "./ScheduleAdd.css"
import { useState } from "react";
import { taskApi } from "../../api";

interface ScheduleAddProps {
  onClose: () => void;
  onAdd?: () => void; // 添加后刷新数据的回调函数
}

function ScheduleAdd({ onClose, onAdd }: ScheduleAddProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'regular', // 'regular', 'progress', 'recurring'
    themeColor: '#3498db',
    startDate: '',
    endDate: '',
    repeatWeekdays: '1,2,3,4,5', // 默认周一到周五
    startTime: '',
    endTime: '',
    progress: 0,
    isCompleted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value;
    setFormData(prev => {
      const currentDays = prev.repeatWeekdays ? prev.repeatWeekdays.split(',') : [];
      let newDays;
      
      if (e.target.checked) {
        newDays = [...new Set([...currentDays, day])].sort((a, b) => parseInt(a) - parseInt(b));
      } else {
        newDays = currentDays.filter(d => d !== day);
      }
      
      return {
        ...prev,
        repeatWeekdays: newDays.join(',')
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newTask = {
        type: formData.type,
        theme_color: formData.themeColor,
        title: formData.title,
        progress: formData.type === 'progress' ? formData.progress : 0,
        description: formData.description,
        is_completed: formData.isCompleted,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        repeat_weekdays: formData.repeatWeekdays || null,
        start_time: formData.startTime || null,
        end_time: formData.endTime || null
      };
      
      await taskApi.create(newTask);
      
      if (onAdd) {
        onAdd(); // 刷新数据
      }
      onClose();
    } catch (error) {
      console.error('添加任务失败:', error);
    }
  };

  return (
    <div className="mask">
      <div className="wrapper schedule-add">
        <h2>添加新任务</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">标题:</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">描述:</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">任务类型:</label>
            <select 
              id="type" 
              name="type" 
              value={formData.type}
              onChange={handleChange}
            >
              <option value="regular">普通任务</option>
              <option value="progress">进度型任务</option>
              <option value="recurring">定期型任务</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="themeColor">主题颜色:</label>
            <input 
              type="color" 
              id="themeColor" 
              name="themeColor" 
              value={formData.themeColor}
              onChange={handleChange}
            />
          </div>
          
          {(formData.type === 'progress' || formData.type === 'recurring') && (
            <>
              <div className="form-group">
                <label htmlFor="repeatWeekdays">重复日期:</label>
                <div className="repeat-options">
                  <label><input 
                    type="checkbox" 
                    value="1" 
                    checked={formData.repeatWeekdays.includes('1')}
                    onChange={handleRepeatChange}
                  /> 一</label>
                  <label><input 
                    type="checkbox" 
                    value="2" 
                    checked={formData.repeatWeekdays.includes('2')}
                    onChange={handleRepeatChange}
                  /> 二</label>
                  <label><input 
                    type="checkbox" 
                    value="3" 
                    checked={formData.repeatWeekdays.includes('3')}
                    onChange={handleRepeatChange}
                  /> 三</label>
                  <label><input 
                    type="checkbox" 
                    value="4" 
                    checked={formData.repeatWeekdays.includes('4')}
                    onChange={handleRepeatChange}
                  /> 四</label>
                  <label><input 
                    type="checkbox" 
                    value="5" 
                    checked={formData.repeatWeekdays.includes('5')}
                    onChange={handleRepeatChange}
                  /> 五</label>
                  <label><input 
                    type="checkbox" 
                    value="6" 
                    checked={formData.repeatWeekdays.includes('6')}
                    onChange={handleRepeatChange}
                  /> 六</label>
                  <label><input 
                    type="checkbox" 
                    value="0" 
                    checked={formData.repeatWeekdays.includes('0')}
                    onChange={handleRepeatChange}
                  /> 日</label>
                </div>
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="startDate">开始日期:</label>
            <input 
              type="date" 
              id="startDate" 
              name="startDate" 
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">结束日期:</label>
            <input 
              type="date" 
              id="endDate" 
              name="endDate" 
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="startTime">开始时间:</label>
            <input 
              type="time" 
              id="startTime" 
              name="startTime" 
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endTime">结束时间:</label>
            <input 
              type="time" 
              id="endTime" 
              name="endTime" 
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
          
          {formData.type === 'progress' && (
            <div className="form-group">
              <label htmlFor="progress">当前进度 (%):</label>
              <input 
                type="number" 
                id="progress" 
                name="progress" 
                min="0" 
                max="100"
                value={formData.progress}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="isCompleted"
                checked={formData.isCompleted}
                onChange={(e) => setFormData({...formData, isCompleted: e.target.checked})}
              />
              已完成
            </label>
          </div>
          
          <div className="form-button">
            <button type="button" onClick={onClose}>取消</button>
            <button type="submit" className="button-add">添加任务</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ScheduleAdd;