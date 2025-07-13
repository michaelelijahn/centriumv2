import { Row, Col } from 'react-bootstrap';
import { TodoList, PageBreadcrumb } from '@/components';
import Statistics from './Statistics';
import CampaignsChart from './CampaignsChart';
import RevenueChart from './RevenueChart';
import Performers from './Performers';
import Leads from './Leads';
import CampaignWidget from './CampaignWidget';
import { topPerformanceData, recentLeads } from './data';

const CRMDashboard = () => {
	return (
		<>
			<PageBreadcrumb title="CRM" subName="Dashboard" />

			<Statistics />

			<Row>
				<Col lg={5}>
					<CampaignsChart />
				</Col>
				<Col lg={7}>
					<RevenueChart />
				</Col>
			</Row>

			<Row>
				<Col xl={4} lg={12}>
					<Performers topPerformanceData={topPerformanceData} />
				</Col>
				<Col xl={4} lg={6}>
					<Leads recentLeads={recentLeads} />
				</Col>
				<Col xl={4} lg={6}>
					<CampaignWidget />
					<TodoList height="220px" />
				</Col>
			</Row>
		</>
	);
};

export { CRMDashboard };
