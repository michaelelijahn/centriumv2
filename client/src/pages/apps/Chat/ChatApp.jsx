import { PageBreadcrumb } from '@/components';
import { Row, Col } from 'react-bootstrap';
import ChatUsers from './ChatUsers';
import ChatArea from './ChatArea';
import ChatProfile from './ChatProfile';
import { useChatApp } from './hooks';

const ChatApp = () => {
	const { selectedUser, onUserChange } = useChatApp();

	return (
		<>
			<PageBreadcrumb title="Chat" subName="Apps" />

			<Row>
				<Col xxl={3} xl={{ span: 6, order: 1 }}>
					<ChatUsers onUserSelect={onUserChange} />
				</Col>

				<Col xxl={6} xl={{ span: 12, order: 2 }}>
					<ChatArea selectedUser={selectedUser} />
				</Col>

				<Col xxl={{ span: 3, order: 2 }} xl={{ span: 6, order: 1 }}>
					<ChatProfile selectedUser={selectedUser} />
				</Col>
			</Row>
		</>
	);
};

export { ChatApp };
