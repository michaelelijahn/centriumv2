import { Row, Col, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTaskList } from '../hooks';
import TaskSection from './Section';
import Task from './Task';

const ListTask = () => {
	const { todayTask, upcomingTask, otherTask, selectedTask, selectTask } = useTaskList();
	return (
		<Row>
			<Col xxl={8}>
				<div className="page-title-box">
					<div className="page-title-right">
						<form>
							<InputGroup>
								<FormControl type="text" placeholder="Search..." />
								<Dropdown>
									<Dropdown.Toggle
										className="input-group-text btn btn-secondary"
										type="button"
										data-bs-toggle="dropdown"
										aria-haspopup="true"
										aria-expanded="false"
									>
										<i className="uil uil-sort-amount-down" />
									</Dropdown.Toggle>
									<Dropdown.Menu align={'end'}>
										<Dropdown.Item>Due Date</Dropdown.Item>
										<Dropdown.Item>Added Date</Dropdown.Item>
										<Dropdown.Item>Assignee</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</InputGroup>
						</form>
					</div>
					<h4 className="page-title">
						Tasks
						<Link to="" className="btn btn-success btn-sm ms-3">
							Add New
						</Link>
					</h4>
				</div>

				{/* tasks */}
				<div className="mt-2">
					<TaskSection title="Today" tasks={todayTask} selectTask={selectTask} />
				</div>
				<div className="mt-4">
					<TaskSection title="Upcoming" tasks={upcomingTask} selectTask={selectTask} />
				</div>
				<div className="mt-4 mb-4">
					<TaskSection title="Other" tasks={otherTask} selectTask={selectTask} />
				</div>
			</Col>

			<Col>
				<Task {...selectedTask} />
			</Col>
		</Row>
	);
};

export { ListTask };
