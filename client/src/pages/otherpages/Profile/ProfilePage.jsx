import { Row, Col, Card } from 'react-bootstrap';
import { PageBreadcrumb, Messages } from '@/components';
import UserBox from './UserBox';
import SellerBox from './SellerBox';
import BarChart from './BarChart';
import Statistics from './Statistics';
import Products from './Products';
import { useAuthContext } from '@/common';

const ProfilePage = () => {
	const { user } = useAuthContext();

	if (!user) {
		return <Loader/>
	}

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || '';

	return (
		<>
			<PageBreadcrumb title="Profile" subName="Pages" />

			<Row>
				<Col sm={12}>
					{/* User information */}
					<UserBox fullName={fullName} />
				</Col>
			</Row>

			<Row>
				<Col xl={4}>
					{/* User's seller information */}
					<SellerBox fullName={fullName} email={user.email} phone={user.phone} />

					{/* Contact information */}
					<Card className="text-white bg-info overflow-hidden">
						<Card.Body>
							<div className="toll-free-box text-center">
								<h4>
									<i className="mdi mdi-deskphone"></i> Toll Free : 1-234-567-8901
								</h4>
							</div>
						</Card.Body>
					</Card>

					{/* User's recent messages */}
					<Messages />
				</Col>

				<Col xl={8}>
					{/* User's performance */}
					<BarChart />

					{/* Some statistics */}
					<Statistics />

					{/* Products */}
					<Products />
				</Col>
			</Row>
		</>
	);
};

export { ProfilePage };
