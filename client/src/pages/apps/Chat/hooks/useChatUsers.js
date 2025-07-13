import { useState } from 'react';
import { users } from '../data';

export default function useChatUsers(onUserSelect) {
	const [user, setUser] = useState([...users]);
	const [selectedUser, setSelectedUser] = useState(users[1]);
	const [selectedGroup, setSelectedGroup] = useState('All');

	/**
	 * Filter users
	 */
	const filterUsers = (group) => {
		setSelectedGroup(group);
		setUser(
			group !== 'All'
				? [...users].filter((u) => u.groups.toLowerCase().indexOf(group.toLowerCase()) >= 0)
				: [...users]
		);
	};

	/**
	 * Search the user
	 * @param {*} text
	 */
	const search = (text) => {
		setUser(
			text
				? [...users].filter((u) => u.name.toLowerCase().indexOf(text.toLowerCase()) >= 0)
				: [...users]
		);
	};

	/**
	 * Activates the user
	 * @param {*} user
	 */
	const activateUser = (user) => {
		setSelectedUser(user);
		if (onUserSelect) {
			onUserSelect(user);
		}
	};

	return {
		user,
		selectedUser,
		selectedGroup,
		filterUsers,
		search,
		activateUser,
	};
}
