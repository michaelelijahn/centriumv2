import { useState } from 'react';
import { emails as mails } from '../data';

export default function useInbox() {
	const [emails, setEmails] = useState(mails.slice(0, 20));
	const [page, setPage] = useState(1);
	const [startIndex, setStartIndex] = useState(1);
	const [endIndex, setEndIndex] = useState(20);
	const totalEmails = mails.length;
	const pageSize = 20;
	const totalPages = mails.length / 20;
	const totalUnreadEmails = mails.filter((e) => e.is_read === false).length;

	/**
	 * Gets the next page
	 */
	const getNextPage = () => {
		var nextPage = page + 1;
		if (nextPage > totalEmails / pageSize) {
			nextPage = totalEmails / pageSize;
		}
		var startIdx = nextPage * pageSize - pageSize + 1;
		var endIdx = nextPage * pageSize;
		setPage(nextPage);
		setStartIndex(startIdx);
		setEndIndex(endIdx);
		setEmails(mails.slice(startIdx, endIdx));
	};

	/**
	 * Gets the prev page
	 */
	const getPrevPage = () => {
		var prevPage = page - 1;
		if (prevPage === 0) prevPage = 1;
		var startIdx = prevPage * pageSize - pageSize + 1;
		var endIdx = prevPage * pageSize;
		setPage(prevPage);
		setStartIndex(startIdx);
		setEndIndex(endIndex);
		setEmails(mails.slice(startIdx, endIdx));
	};

	/**
	 * Shows the starred emails only
	 */
	const showAllEmails = () => {
		setEmails(mails.slice(0, 20));
	};

	/**
	 * Shows the starred emails only
	 */
	const showStarredEmails = () => {
		setEmails(mails.filter((e) => e.is_important).slice(0, 20));
	};

	return {
		emails,
		totalEmails,
		startIndex,
		endIndex,
		page,
		totalPages,
		totalUnreadEmails,
		getPrevPage,
		getNextPage,
		showAllEmails,
		showStarredEmails,
	};
}
