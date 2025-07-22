// COMMENTED OUT: Original complex ecommerce dashboard
/*
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CustomDatePicker } from '@/components';
import Statistics from './Statistics';
import PerformanceChart from './PerformanceChart';
import RevenueChart from './RevenueChart';
import RevenueByLocationChart from './RevenueByLocationChart';
import SalesChart from './SalesChart';
import Activity from './Activity';
import Products from './Products';

const EcommerceDashboard = () => {
	const [selectedDate, setSelectedDate] = useState(new Date());

	return (
		<>
			<Row>
				<Col xs={12}>
					<div className="page-title-box">
						<div className="page-title-right">
							<form className="d-flex">
								<div className="input-group">
									<CustomDatePicker
										value={selectedDate}
										inputClass="form-control-light"
										onChange={(date) => {
											setSelectedDate(date);
										}}
									/>
								</div>
								<Link to="" className="btn btn-primary ms-2">
									<i className="mdi mdi-autorenew"></i>
								</Link>
								<Link to="" className="btn btn-primary ms-1">
									<i className="mdi mdi-filter-variant"></i>
								</Link>
							</form>
						</div>
						<h4 className="page-title">Dashboard</h4>
					</div>
				</Col>
			</Row>

			<Row>
				<Col xl={5} lg={6}>
					<Statistics />
				</Col>

				<Col xl={7} lg={6}>
					<PerformanceChart />
				</Col>
			</Row>

			<Row>
				<Col lg={8}>
					<RevenueChart />
				</Col>
				<Col lg={4}>
					<RevenueByLocationChart />
				</Col>
			</Row>

			<Row>
				<Col xl={{ span: 6, order: 1 }} lg={{ span: 12, order: 2 }}>
					<Products />
				</Col>
				<Col xl={3} lg={{ span: 6, order: 1 }}>
					<SalesChart />
				</Col>
				<Col xl={3} lg={{ span: 6, order: 1 }}>
					<Activity />
				</Col>
			</Row>
		</>
	);
};

export { EcommerceDashboard };
*/

import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, InputGroup, Badge, ProgressBar } from 'react-bootstrap';
import { useAuthContext } from '@/common/context';
import { PageBreadcrumb } from '@/components';

const SimpleDashboard = () => {
	const { user } = useAuthContext();
	const [globalSearch, setGlobalSearch] = useState('');
	const [activeTab, setActiveTab] = useState('live'); // 'live' or 'demo'

	const userName = user?.first_name ? `${user.first_name} ${user.last_name?.charAt(0) || ''}!` : 'User!';
	const userInitials = user?.first_name ? `${user.first_name.charAt(0)}${user.last_name?.charAt(0) || ''}` : 'U';

	// Mock statistics for visual appeal
	const stats = {
		totalAccounts: 0,
		pendingLive: 0,
		pendingDemo: 0,
		completionRate: 0
	};

	const QuickActionCard = ({ icon, title, description, buttonText, variant = "primary", onClick }) => (
		<Card className="border-0 shadow-sm hover-shadow-lg transition-all">
			<Card.Body className="text-center p-2">
				<div className={`bg-${variant}-subtle rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center`} style={{ width: '32px', height: '32px' }}>
					<i className={`${icon} text-${variant}`} style={{ fontSize: '1rem' }}></i>
				</div>
				<h6 className="fw-bold mb-0" style={{ fontSize: '0.8rem' }}>{title}</h6>
				<p className="text-muted mb-1" style={{ fontSize: '0.65rem', lineHeight: '1.2' }}>{description}</p>
				<Button variant={`outline-${variant}`} size="sm" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={onClick}>
					{buttonText}
				</Button>
			</Card.Body>
		</Card>
	);

	const AccountTabContent = ({ type, searchPlaceholder }) => (
		<div className="px-3 pt-1 pb-3">
			<Row className="align-items-center mb-2">
				<Col md={6}>
					<InputGroup>
						<InputGroup.Text className="bg-white border-end-0">
							<i className="mdi mdi-magnify text-muted"></i>
						</InputGroup.Text>
						<Form.Control
							type="text"
							placeholder={searchPlaceholder}
							value={globalSearch}
							onChange={(e) => setGlobalSearch(e.target.value)}
							className="border-start-0"
						/>
					</InputGroup>
				</Col>
				<Col md={6} className="text-md-end mt-2 mt-md-0">
					<Button variant="outline-primary" size="sm" className="me-2">
						<i className="mdi mdi-filter-variant me-1"></i>
						Filters
					</Button>
					<Button variant="primary" size="sm">
						<i className="mdi mdi-plus me-1"></i>
						New Request
					</Button>
				</Col>
			</Row>

			<div className="text-center py-3" style={{ minHeight: '200px' }}>
				<div className="mb-2">
					<div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
						<i className="mdi mdi-account-search text-muted" style={{ fontSize: '2rem' }}></i>
					</div>
				</div>
				<h6 className="text-muted mb-2">No {type} accounts yet</h6>
				<p className="text-muted mb-3 small">
					{type === 'live' 
						? 'Your live trading account requests will appear here once submitted.' 
						: 'Demo account requests for practice trading will be shown here.'}
				</p>
				<Button variant="outline-primary" className="me-2" size="sm">
					<i className="mdi mdi-information-outline me-1"></i>
					Learn More
				</Button>
				<Button variant="primary" size="sm">
					<i className="mdi mdi-plus me-1"></i>
					Request {type === 'live' ? 'Live' : 'Demo'} Account
				</Button>
			</div>

			<div className="d-flex justify-content-between align-items-center pt-2 border-top">
				<div className="text-muted small">
					Showing <strong>0</strong> of <strong>0</strong> results
				</div>
				<div>
					<Button variant="outline-secondary" size="sm" disabled className="me-2">
						<i className="mdi mdi-chevron-left me-1"></i>
						Previous
					</Button>
					<Button variant="outline-secondary" size="sm" disabled>
						Next
						<i className="mdi mdi-chevron-right ms-1"></i>
					</Button>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<PageBreadcrumb title="Dashboard" subName="Trading" />

			{/* Quick Actions */}
			<Row className="g-3 mb-3">
				<Col sm={6} lg={3}>
					<QuickActionCard
						icon="mdi mdi-account-plus"
						title="Request Live Account"
						description="Start trading with real money"
						buttonText="Get Started"
						variant="success"
					/>
				</Col>
				<Col sm={6} lg={3}>
					<QuickActionCard
						icon="mdi mdi-school"
						title="Try Demo Account"
						description="Practice with virtual funds"
						buttonText="Start Demo"
						variant="info"
					/>
				</Col>
				<Col sm={6} lg={3}>
					<QuickActionCard
						icon="mdi mdi-help-circle"
						title="Need Help?"
						description="Contact our support team"
						buttonText="Get Support"
						variant="warning"
					/>
				</Col>
				<Col sm={6} lg={3}>
					<QuickActionCard
						icon="mdi mdi-book-open"
						title="Learning Center"
						description="Trading guides and tutorials"
						buttonText="Learn More"
						variant="primary"
					/>
				</Col>
			</Row>

			{/* Account Management Section */}
			<Row>
				<Col xs={12}>
					<Card className="border-0 shadow-sm">
						<Card.Header className="bg-white border-bottom-0 p-3 pb-1">
							<div className="d-flex justify-content-between align-items-center">
								<h5 className="fw-bold mb-0">Account Management</h5>
								<div className="d-flex">
									<Button
										variant={activeTab === 'live' ? 'primary' : 'outline-primary'}
										size="sm"
										className="me-2"
										onClick={() => setActiveTab('live')}
									>
										<i className="mdi mdi-account-clock me-1"></i>
										Live Accounts ({stats.pendingLive})
									</Button>
									<Button
										variant={activeTab === 'demo' ? 'primary' : 'outline-primary'}
										size="sm"
										onClick={() => setActiveTab('demo')}
									>
										<i className="mdi mdi-account-outline me-1"></i>
										Demo Accounts ({stats.pendingDemo})
									</Button>
								</div>
							</div>
						</Card.Header>
						<Card.Body className="pt-2">
							{activeTab === 'live' && (
								<AccountTabContent 
									type="live" 
									searchPlaceholder="Search live account requests..."
								/>
							)}
							{activeTab === 'demo' && (
								<AccountTabContent 
									type="demo" 
									searchPlaceholder="Search demo account requests..."
								/>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { SimpleDashboard as EcommerceDashboard };
