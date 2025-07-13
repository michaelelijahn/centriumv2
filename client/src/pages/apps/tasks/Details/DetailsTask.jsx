import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import Task from './Task';
import Comments from './Comments';
import Attachments from './Attachments';
import { Tasks } from './data';

const DetailsTask = () => {
	const [selectedTask] = useState(Tasks[0]);

	return (
		<>
			<PageBreadcrumb title="Task Detail" subName="Tasks" />
			<Row>
				<Col xxl={8} xl={7}>
					<Task task={selectedTask} />
					<Comments />
				</Col>
				<Col xxl={4} xl={5}>
					<Attachments />
				</Col>
			</Row>
		</>
	);
};

export { DetailsTask };
