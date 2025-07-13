import { useState } from 'react';
import avatar3 from '@/assets/images/users/avatar-1.jpg';

export default function useFeeds() {
	const [user] = useState({ id: 1, avatar: avatar3 });

	/*
	 * toggle like on post
	 */
	const toggleLike = (post) => {
		post.isLiked = !post.isLiked;
	};

	/*
	 * toggle like on comment
	 */
	const toggleLikeOnComment = (comment) => {
		comment.isLiked = !comment.isLiked;
	};

	return {
		user,
		toggleLike,
		toggleLikeOnComment,
	};
}
