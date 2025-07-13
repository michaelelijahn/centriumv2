import { Modal, Row, Col, Button } from 'react-bootstrap';
import { Form, SelectInput, TextInput } from '@/components';
import { useAddEditEvent } from './hooks';

const AddEditEvent = ({
	isOpen,
	onClose,
	isEditable,
	eventData,
	onRemoveEvent,
	onUpdateEvent,
	onAddEvent,
}) => {
	const { event, onSubmitEvent, schema } = useAddEditEvent(
		eventData,
		isEditable,
		onUpdateEvent,
		onAddEvent
	);
	return (
		<Modal show={isOpen} onHide={onClose} backdrop="static" keyboard={false}>
			<Modal.Header className="pb-2 px-4 border-bottom-0" closeButton>
				<Modal.Title>
					<h5> {isEditable ? 'Edit Event' : 'Add New Event'} </h5>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="px-4 pb-4 pt-0">
				<Form onSubmit={onSubmitEvent} schema={schema} defaultValues={event}>
					<Row>
						<Col sm={12}>
							<TextInput
								containerClass="mb-3"
								type="text"
								label="Event Name"
								name="title"
								placeholder="Insert Event Name"
								key="title"
							/>
						</Col>
						<Col sm={12}>
							<SelectInput label="Category" name="className" containerClass="mb-3">
								<option value="bg-danger" defaultChecked>
									Danger
								</option>
								<option value="bg-success">Success</option>
								<option value="bg-primary">Primary</option>
								<option value="bg-info">Info</option>
								<option value="bg-dark">Dark</option>
								<option value="bg-warning">Warning</option>
							</SelectInput>
						</Col>
					</Row>

					<Row>
						<Col xs={4}>
							{isEditable ? (
								<Button variant="danger" onClick={onRemoveEvent}>
									Delete
								</Button>
							) : null}
						</Col>
						<Col xs={8} className="text-end">
							<Button className="btn btn-light me-1" onClick={onClose}>
								Close
							</Button>
							<Button variant="success" type="submit" className="btn btn-success">
								Save
							</Button>
						</Col>
					</Row>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default AddEditEvent;
