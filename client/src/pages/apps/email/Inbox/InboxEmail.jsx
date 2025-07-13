import {
	Row,
	Col,
	Card,
	Dropdown,
	ButtonGroup,
	Button,
	OverlayTrigger,
	Tooltip,
} from 'react-bootstrap';
import { useToggle } from '@/hooks';
import { PageBreadcrumb } from '@/components';
import { LeftSide, ComposeMail } from '../components';
import { useInbox } from '../hooks';
import EmailsList from './EmailsList';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const InboxEmail = () => {
	// handle compose modal
	const [isModalOpen, toggleComposeModal] = useToggle();
	const {
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
	} = useInbox();

	return (
		<>
			<PageBreadcrumb title="Inbox" subName="Email" />

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<div className="page-aside-left">
								<LeftSide
									totalUnreadEmails={totalUnreadEmails}
									showAllEmails={showAllEmails}
									showStarredEmails={showStarredEmails}
									toggleComposeModal={toggleComposeModal}
								/>
							</div>
							<div className="page-aside-right">
								<ButtonGroup className="me-1 my-1">
									<OverlayTrigger
										placement="bottom"
										overlay={<Tooltip>Archived</Tooltip>}
									>
										<Button variant="secondary">
											<i className="mdi mdi-archive font-16"></i>
										</Button>
									</OverlayTrigger>
									<OverlayTrigger
										placement="bottom"
										overlay={<Tooltip>Spam</Tooltip>}
									>
										<Button variant="secondary">
											<i className="mdi mdi-alert-octagon font-16"></i>
										</Button>
									</OverlayTrigger>
									<OverlayTrigger
										key="bottm"
										placement="bottom"
										overlay={<Tooltip>Delete</Tooltip>}
									>
										<Button variant="secondary">
											<i className="mdi mdi-delete-variant font-16"></i>
										</Button>
									</OverlayTrigger>
								</ButtonGroup>

								<ButtonGroup as={Dropdown} className="d-inline-block me-1 my-1">
									<Dropdown.Toggle variant="secondary" className="arrow-none">
										<i className="mdi mdi-folder font-16"></i>
										<i className="mdi mdi-chevron-down"></i>
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<span className="dropdown-header">Move to:</span>
										<Dropdown.Item>Social</Dropdown.Item>
										<Dropdown.Item>Promotions</Dropdown.Item>
										<Dropdown.Item>Updates</Dropdown.Item>
										<Dropdown.Item>Forums</Dropdown.Item>
									</Dropdown.Menu>
								</ButtonGroup>

								<ButtonGroup as={Dropdown} className="d-inline-block me-1 my-1">
									<Dropdown.Toggle variant="secondary" className="arrow-none">
										<i className="mdi mdi-label font-16"></i>
										<i className="mdi mdi-chevron-down"></i>
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<span className="dropdown-header">Label as:</span>
										<Dropdown.Item>Social</Dropdown.Item>
										<Dropdown.Item>Promotions</Dropdown.Item>
										<Dropdown.Item>Updates</Dropdown.Item>
										<Dropdown.Item>Forums</Dropdown.Item>
									</Dropdown.Menu>
								</ButtonGroup>

								<ButtonGroup as={Dropdown} className="d-inline-block me-1 my-1">
									<Dropdown.Toggle variant="secondary" className="arrow-none">
										<i className="mdi mdi-dots-horizontal font-16"></i> More
										<i className="mdi mdi-chevron-down"></i>
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<span className="dropdown-header">More Options :</span>
										<Dropdown.Item>Mark as Unread</Dropdown.Item>
										<Dropdown.Item>Add to Tasks</Dropdown.Item>
										<Dropdown.Item>Add Star</Dropdown.Item>
										<Dropdown.Item>Mute</Dropdown.Item>
									</Dropdown.Menu>
								</ButtonGroup>

								<div className="mt-3">
									<EmailsList emails={emails} />
								</div>

								<Row>
									<Col sm={7} className="mt-1">
										Showing {startIndex} - {endIndex} of {totalEmails}
									</Col>
									<Col sm={5}>
										<ButtonGroup className="float-end">
											{page === 1 ? (
												<Button variant="light" className="btn-sm" disabled>
													<i className="mdi mdi-chevron-left"></i>
												</Button>
											) : (
												<Button
													variant="info"
													className="btn-sm"
													onClick={getPrevPage}
												>
													<i className="mdi mdi-chevron-left"></i>
												</Button>
											)}

											{page < totalPages ? (
												<Button
													variant="info"
													className="btn-sm"
													onClick={getNextPage}
												>
													<i className="mdi mdi-chevron-right"></i>
												</Button>
											) : (
												<Button variant="light" className="btn-sm" disabled>
													<i className="mdi mdi-chevron-right"></i>
												</Button>
											)}
										</ButtonGroup>
									</Col>
								</Row>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<ComposeMail isModalOpen={isModalOpen} toggleComposeModal={toggleComposeModal} />
		</>
	);
};

export { InboxEmail };
