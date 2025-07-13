import { PageBreadcrumb } from '@/components';
import { Col, Row } from 'react-bootstrap';
import ClientDetails from './ClientDetails';
import { clients } from './data';

const ClientCRM = () => {
	return (
		<>
			<PageBreadcrumb title="Clients List" subName="CRM" />

			<Row>
				<ClientDetails clientsData={clients} />
			</Row>
			<Row>
				<Col xs={12} className="text-center">
					<i className="mdi mdi-dots-circle mdi-spin font-24 text-muted"></i>
				</Col>
			</Row>
		</>
	);
};

export { ClientCRM };
