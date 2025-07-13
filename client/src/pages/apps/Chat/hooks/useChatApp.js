import { useState } from 'react';
import { users } from '../data';

export default function useChatApp() {
	const [selectedUser, setSelectedUser] = useState(users[1]);

	/**
	 * On user change
	 */
	const onUserChange = (user) => {
		setSelectedUser(user);
	};

	return { selectedUser, onUserChange };
}
