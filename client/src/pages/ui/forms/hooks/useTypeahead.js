import { useState } from 'react';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default function useTypeahead() {
	const [singleSelections, setSingleSelections] = useState([]);
	const [multiSelections, setMultiSelections] = useState([]);

	const options = [
		{ id: 1, value: 'chocolate', label: 'Chocolate' },
		{ id: 2, value: 'strawberry', label: 'Strawberry' },
		{ id: 3, value: 'vanilla', label: 'Vanilla' },
	];

	const onChangeSingleSelection = (selected) => {
		setSingleSelections(selected);
	};

	const onChangeMultipleSelection = (selected) => {
		setMultiSelections(selected);
	};

	return {
		options,
		singleSelections,
		multiSelections,
		onChangeSingleSelection,
		onChangeMultipleSelection,
	};
}
