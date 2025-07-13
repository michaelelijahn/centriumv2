import React, { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function useTask(task) {
	const [completed, setCompleted] = useState(task.stage === 'Done');

	const [editorState, setEditorState] = useState(`
  <h3>This is a simple editable area.</h3>
  <p><br></p>
  <ul>
      <li>
          Select a text to reveal the toolbar.
      </li>
      <li>
          Edit rich document on-the-fly, so elastic!
      </li>
  </ul>
  <p><br></p>
  <p>
      End of simple area
  </p>
  `);

	/**
	 * On editor body change
	 */
	const onEditorStateChange = (editorStates) => {
		setEditorState(editorStates);
	};

	/*
	 * mark completd on selected task
	 */
	const markCompleted = (e, callback) => {
		setCompleted(e.target.checked);
		if (callback) callback(task);
	};

	return {
		completed,
		editorState,
		onEditorStateChange,
		markCompleted,
	};
}
