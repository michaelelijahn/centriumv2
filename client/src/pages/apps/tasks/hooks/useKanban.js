import { useState } from 'react';
import * as yup from 'yup';
import { tasks } from '../Kanban/data';
import defaultAvatar from '@/assets/images/users/avatar-1.jpg';

/*
 * Form validation schema
 */
export const kanbanTaskSchema = yup.object().shape({
	project: yup.string().required().notOneOf(['-1'], 'Select Project'),
	title: yup.string().required(),
	priority: yup.string().required('Select priority').notOneOf(['-1'], 'Select Priority'),
	description: yup.string().required(),
	user: yup.string().required(),
});

export default function useKanban() {
	const [state, setState] = useState({
		todoTasks: tasks.filter((t) => t.status === 'Pending'),
		inprogressTasks: tasks.filter((t) => t.status === 'Inprogress'),
		reviewTasks: tasks.filter((t) => t.status === 'Review'),
		doneTasks: tasks.filter((t) => t.status === 'Done'),
		totalTasks: tasks.length,
		newTaskModal: false,
		newTask: null,
	});

	/**
	 * Toggles the new task modal
	 */
	const toggleNewTaskModal = () => {
		setState({
			...state,
			newTaskModal: !state.newTaskModal,
		});
	};

	/**
	 * Creates new empty task with given status
	 */
	const newTask = (status, queue) => {
		setState({
			...state,
			newTask: {
				dueDate: new Date(),
				userAvatar: defaultAvatar,
				status: status,
				queue: queue,
			},
			newTaskModal: true,
		});
	};

	/**
	 * When date changes
	 * @param {} date
	 */
	const handleDateChange = (date) => {
		if (state.newTask) {
			setState({
				...state,
				newTask: { ...state.newTask, dueDate: date },
			});
		}
	};

	/*
	 * reordering the result
	 */
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	/**
	 * Moves an item from one list to another list.
	 */
	const move = (source, destination, droppableSource, droppableDestination) => {
		const sourceClone = Array.from(source);
		const destClone = Array.from(destination);
		const [removed] = sourceClone.splice(droppableSource.index, 1);
		destClone.splice(droppableDestination.index, 0, removed);
		const result = {};
		result[droppableSource.droppableId] = sourceClone;
		result[droppableDestination.droppableId] = destClone;

		return result;
	};

	/**
	 * Gets the list
	 */
	const getList = (id) => {
		const modifiedState = { ...state };
		const stateTasks = modifiedState[id] && modifiedState[id];
		return stateTasks;
	};

	/**
	 * On drag end
	 */
	const onDragEnd = (result) => {
		const { source, destination } = result;

		// dropped outside the list
		if (!destination) {
			return;
		}
		if (source.droppableId === destination.droppableId) {
			const items = reorder(getList(source.droppableId), source.index, destination.index);
			let localState = { ...state };
			localState[source.droppableId] = items;
			setState(localState);
		} else {
			const result = move(
				getList(source.droppableId),
				getList(destination.droppableId),
				source,
				destination
			);
			const localState = { ...state, ...result };
			setState(localState);
		}
	};

	/**
	 * Handles the new task form submission
	 */
	const handleNewTask = (values) => {
		const formData = {
			project: values['project'],
			title: values['title'],
			priority: values['priority'],
			description: values['description'],
			user: values['user'],
		};
		const newTask = {
			...state.newTask,
			...formData,
			id: state.totalTasks + 1,
			dueDate: state.newTask.dueDate.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			}),
			totalComments: 0,
			totalSubTasks: 0,
		};

		var localState = { ...state };

		if (newTask) {
			var tasks = localState[newTask.queue];
			tasks.push(newTask);
			localState[newTask.queue] = tasks;
			localState['newTask'] = null;
			localState['newTaskModal'] = false;
			localState['totalTasks'] = localState.totalTasks + 1;
			setState(localState);
		}
	};

	return {
		state,
		toggleNewTaskModal,
		newTask,
		onDragEnd,
		handleDateChange,
		handleNewTask,
	};
}
