import { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { messages } from '../data';
import avatar from '@/assets/images/users/avatar-1.jpg';

/*
 * form validation schema
 */
export const chatSchema = yup.object().shape({
	newMessage: yup.string().required('Please enter your messsage'),
});

export default function useChatArea(selectedUser) {
	const [userMessages, setUserMessages] = useState([]);
	const [toUser] = useState({
		id: 9,
		name: 'Shreyu N',
		avatar: avatar,
		email: 'support@coderthemes.com',
		phone: '+1 456 9595 9594',
		location: 'California, USA',
		languages: 'English, German, Spanish',
		groups: 'Work, Friends',
	});

	/*
	 *  Fetches the messages for selected user
	 */
	const getMessagesForUser = useCallback(() => {
		if (selectedUser) {
			setUserMessages([
				...messages.filter(
					(m) =>
						(m.to.id === toUser.id && m.from.id === selectedUser.id) ||
						(toUser.id === m.from.id && m.to.id === selectedUser.id)
				),
			]);
		}
	}, [selectedUser, toUser]);

	useEffect(() => {
		getMessagesForUser();
	}, [getMessagesForUser]);

	/**
	 * sends the chat message
	 */
	const sendChatMessage = (value) => {
		let newUserMessages = [...userMessages];
		newUserMessages.push({
			id: userMessages.length + 1,
			from: toUser,
			to: selectedUser,
			message: { type: 'text', value: { text: value.newMessage } },
			sendOn: new Date().getHours() + ':' + new Date().getMinutes(),
		});
		setTimeout(() => {
			let otherNewMessages = [...newUserMessages];
			otherNewMessages.push({
				id: userMessages.length + 1,
				from: selectedUser,
				to: toUser,
				message: { type: 'text', value: { text: value.newMessage } },
				sendOn: new Date().getHours() + ':' + new Date().getMinutes(),
			});
			setUserMessages(otherNewMessages);
		}, 1000);
		setUserMessages(newUserMessages);
	};
	return {
		toUser,
		userMessages,
		sendChatMessage,
	};
}
