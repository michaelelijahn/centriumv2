import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, Dropdown, Row, Col } from 'react-bootstrap';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';
import { Form, TextInput } from '@/components';
import { useChatArea } from './hooks';
import { chatSchema } from './hooks/useChatArea';

const UserMessage = ({ message, toUser }) => {
	return (
		<li className={classnames('clearfix', { odd: message.from.id === toUser.id })}>
			<div className="chat-avatar">
				<img src={message.from.avatar} className="rounded" alt="" />
				<i>{message.sendOn}</i>
			</div>

			<div className="conversation-text">
				<div className="ctext-wrap">
					<i>{message.from.name}</i>
					{message.message.type === 'text' && <p>{message.message.value.text}</p>}
				</div>
				{message.message.type === 'file' && (
					<Card className="mt-2 mb-1 shadow-none border text-start">
						<div className="p-2">
							<Row className="align-items-center">
								<Col className="col-auto">
									<div className="avatar-sm">
										<span className="avatar-title rounded">
											<i className="uil uil-file-upload-alt font-20"></i>
										</span>
									</div>
								</Col>
								<Col className="ps-0">
									<Link to="" className="text-muted fw-bold">
										{message.message.value.file}
									</Link>
									<p className="mb-0">{message.message.value.size}</p>
								</Col>
								<Col className="col-auto">
									<Link to="" className="btn btn-link btn-lg text-muted">
										<i className="ri-download-2-line"></i>
									</Link>
								</Col>
							</Row>
						</div>
					</Card>
				)}
			</div>

			<Dropdown className="conversation-actions" align="end">
				<Dropdown.Toggle
					variant="link"
					className="btn btn-sm btn-link arrow-none shadow-none"
				>
					<i className="uil uil-ellipsis-v"></i>
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item>Copy Messaget</Dropdown.Item>
					<Dropdown.Item>Edit</Dropdown.Item>
					<Dropdown.Item>Delete</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</li>
	);
};

const AlwaysScrollToBottom = () => {
	const elementRef = useRef(null);
	useEffect(() => {
		if (elementRef && elementRef.current && elementRef.current.scrollIntoView) {
			elementRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	});
	return <div ref={elementRef} />;
};

const ChatArea = ({ selectedUser }) => {
	const { toUser, userMessages, sendChatMessage } = useChatArea(selectedUser);

	return (
		<Card>
			<Card.Body className="position-relative px-0 pb-0">
				<SimpleBar style={{ height: '538px', width: '100%' }}>
					<ul className="conversation-list px-3">
						{userMessages.map((message, index) => {
							return (
								<UserMessage
									key={index.toString()}
									message={message}
									toUser={toUser}
								/>
							);
						})}
						<AlwaysScrollToBottom />
					</ul>
				</SimpleBar>

				<Row className="px-3 pb-3">
					<Col>
						<div className="mt-2 bg-light p-3 rounded">
							<Form
								name="chat-form"
								id="chat-form"
								onSubmit={sendChatMessage}
								schema={chatSchema}
							>
								<Row>
									<div className="col mb-2 mb-sm-0">
										<TextInput
											type="text"
											name="newMessage"
											className="border-0"
											placeholder="Enter your text"
											key="newMessage"
										/>
									</div>
									<div className="col-sm-auto">
										<div className="btn-group">
											<Link to="" className="btn btn-light">
												<i className="uil uil-paperclip"></i>
											</Link>
											<Link to="" className="btn btn-light">
												<i className="uil uil-smile"></i>
											</Link>
											<button
												type="submit"
												className="btn btn-success chat-send btn-block"
											>
												<i className="uil uil-message"></i>
											</button>
										</div>
									</div>
								</Row>
							</Form>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default ChatArea;
