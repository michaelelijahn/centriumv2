import { useState } from 'react';
import { todayTasks, upcomingTasks, otherTasks } from '../List/data';

export default function useTaskList() {
	const [todayTask] = useState([...todayTasks]);
	const [upcomingTask] = useState([...upcomingTasks]);
	const [otherTask] = useState([...otherTasks]);
	const [selectedTask, setSelectedTask] = useState(todayTasks[0]);

	/**
	 * Selects the task
	 * @param {*} taks
	 */
	const selectTask = (task) => {
		setSelectedTask(task);
	};

	return {
		todayTask,
		upcomingTask,
		otherTask,
		selectedTask,
		selectTask,
	};
}
