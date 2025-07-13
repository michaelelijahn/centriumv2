import { Row, Col, Card, Button } from 'react-bootstrap';
import '@fullcalendar/react';
import FullCalendarWidget from './FullCalendarWidget';
import AddEditEvent from './AddEditEvent';
import { useCalendar } from './hooks';
import SidePanel from './SidePanel';
import { PageBreadcrumb } from '@/components';

const CalendarApp = () => {
	const {
		isOpen,
		onOpenModal,
		onCloseModal,
		isEditable,
		eventData,
		events,
		onDateClick,
		onEventClick,
		onDrop,
		onEventDrop,
		onUpdateEvent,
		onRemoveEvent,
		onAddEvent,
	} = useCalendar();

	return (
		<>
			<PageBreadcrumb title="Calendar" subName="Apps" />

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Row>
								<Col xl={3}>
									<div className="d-grid">
										{/* add events */}
										<Button
											className="btn btn-lg font-16 btn-danger"
											id="btn-new-event"
											onClick={onOpenModal}
										>
											<i className="mdi mdi-plus-circle-outline"></i> Create
											New Event
										</Button>
									</div>

									<SidePanel />
								</Col>
								<Col xl={9}>
									{/* fullcalendar control */}
									<FullCalendarWidget
										onDateClick={onDateClick}
										onEventClick={onEventClick}
										onDrop={onDrop}
										onEventDrop={onEventDrop}
										events={events}
									/>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* add new event modal */}
			{isOpen ? (
				<AddEditEvent
					isOpen={isOpen}
					onClose={onCloseModal}
					isEditable={isEditable}
					eventData={eventData}
					onUpdateEvent={onUpdateEvent}
					onRemoveEvent={onRemoveEvent}
					onAddEvent={onAddEvent}
				/>
			) : null}
		</>
	);
};

export { CalendarApp };
