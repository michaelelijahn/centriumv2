import { useState } from 'react';
import { Row, Col, Card, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Form as RHForm } from '@/components';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
	PageBreadcrumb,
	CustomDatePicker,
	FileUploader,
	TextInput,
	TextAreaInput,
} from '@/components';
import { Link } from 'react-router-dom';
import { useProjectForm } from '../hooks';

const CreateProject = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	const { teamMembers, selectedTeamMembers, schema, handleValidSubmit, selectTeamMembers } =
		useProjectForm();

	return (
		<>
			<PageBreadcrumb title="Create Project" subName="Projects" />

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Row>
								<Col>
									<RHForm onSubmit={handleValidSubmit} schema={schema}>
										<Row>
											<Col xl={6}>
												<TextInput
													type="text"
													name="name"
													label="Name"
													placeholder="Enter project name"
													containerClass={'mb-3'}
													key="name"
												/>

												<TextAreaInput
													name="overview"
													label="Overview"
													placeholder="Enter some brief about project.."
													rows={5}
													containerClass={'mb-3'}
													key="overview"
												/>

												<Form.Group className="mb-3 position-relative">
													<Form.Label>Start Date</Form.Label>
													<CustomDatePicker
														className="form-control"
														value={startDate}
														onChange={(date) => setStartDate(date)}
													/>
												</Form.Group>

												<TextInput
													name="budget"
													label="Budget"
													placeholder="Enter project budget"
													type="number"
													containerClass={'mb-3'}
													key="budget"
												/>

												<Form.Group className="mb-3">
													<Form.Label>Team Members</Form.Label>
													<Typeahead
														id="select3"
														labelKey="name"
														multiple={false}
														options={teamMembers}
														placeholder="select Team Member..."
														onChange={() => selectTeamMembers}
													/>
													<div className="mt-2">
														{selectedTeamMembers.map(
															(member, index) => {
																return (
																	<OverlayTrigger
																		key={index.toString()}
																		placement="top"
																		overlay={
																			<Tooltip>
																				{member.name}
																			</Tooltip>
																		}
																	>
																		<Link
																			to=""
																			title={member.name}
																			data-original-title="James Anderson"
																			className="d-inline-block me-1"
																		>
																			<img
																				src={member.image}
																				className="rounded-circle avatar-xs"
																				alt="friend"
																			/>
																		</Link>
																	</OverlayTrigger>
																);
															}
														)}
													</div>
												</Form.Group>
											</Col>
											<Col xl={6}>
												<Form.Group className="mb-3 mt-3 mt-xl-0">
													<Form.Label>Avatar</Form.Label>
													<p className="text-muted font-14">
														Recommended thumbnail size 800x400 (px).
													</p>
													<FileUploader />
												</Form.Group>

												<Form.Group className="mb-3">
													<Form.Label>Due Date</Form.Label>
													<CustomDatePicker
														className="form-control"
														value={endDate}
														onChange={(date) => setEndDate(date)}
													/>
												</Form.Group>
											</Col>
										</Row>

										<Row className="mt-2">
											<Col>
												<Button type="submit" variant="success">
													Submit
												</Button>
											</Col>
										</Row>
									</RHForm>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { CreateProject };
