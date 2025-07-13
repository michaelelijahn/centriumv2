import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import { PageBreadcrumb } from '@/components';
import { useProjectGannt } from '../hooks';
import Project from './Project';
import { projects } from './data';

const GanttProject = () => {
	const { selectedProject, mode, modes, onSelectProject, changeMode } = useProjectGannt();

	return (
		<>
			<PageBreadcrumb title="Gantt" subName="Projects" />

			<Card>
				<Card.Body>
					<Row>
						<Col xxl={3} lg={4}>
							<div className="pe-xl-3">
								<h5 className="mt-0 mb-3">Projects</h5>
								<div className="app-search">
									<form>
										<div className="mb-2 position-relative w-100">
											<input
												type="text"
												className="form-control"
												placeholder="search by name..."
											/>
											<span className="mdi mdi-magnify search-icon"></span>
										</div>
									</form>
								</div>

								<Row>
									<Col>
										<SimpleBar style={{ maxHeight: '535px', width: '100%' }}>
											{projects.map((project, index) => {
												return (
													<Project
														project={project}
														key={index.toString()}
														selectedProject={selectedProject}
														onSelectProject={(p) => onSelectProject(p)}
													/>
												);
											})}
										</SimpleBar>
									</Col>
								</Row>
							</div>
						</Col>

						<Col xxl={9} lg={8} className="mt-4 mt-xl-0">
							<div className="ps-xl-3">
								<Row>
									<Col className="col-auto">
										<Link to="" className="btn btn-success btn-sm mb-2">
											Add New Task
										</Link>
									</Col>
									<Col className="text-sm-end">
										<ButtonGroup>
											{modes.map((m, index) => {
												return (
													<Button
														variant="primary"
														size={'sm'}
														key={index.toString()}
														onClick={() => changeMode(m)}
														active={mode === m}
													>
														{m}
													</Button>
												);
											})}
										</ButtonGroup>
									</Col>
								</Row>
								<Row>
									<Col className="mt-3">
										<svg id="tasks-gantt"></svg>
									</Col>
								</Row>
							</div>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</>
	);
};

export { GanttProject };
