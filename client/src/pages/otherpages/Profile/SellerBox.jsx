import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SellerBox = ({ fullName, email, phone }) => {
	const navigate = useNavigate();
	return (
		<Card>
			<Card.Body>
				<h4 className="header-title mt-0 mb-3">Account Information</h4>
				{/* <p className="text-muted font-13">
					Hye, I’m Michael Franklin residing in this beautiful world. I create websites
					and mobile apps with great UX and UI design. I have done work with big companies
					like Nokia, Google and Yahoo. Meet me or Contact me for any queries. One Extra
					line for filling space. Fill as many you want.
				</p> */}

				<hr />

				<div className="text-start">
					<div className="d-flex justify-content-between align-items-center mb-2">
						<p className="text-muted mb-1">
							<strong>Full Name :</strong>
							<span className="ms-2">{fullName}</span>
						</p>
					</div>

					<div className="d-flex justify-content-between align-items-center mb-2">
						<p className="text-muted mb-1">
							<strong>Phone :</strong>
							<span className="ms-2">{phone}</span>
						</p>
						{/* <button className="btn btn-sm btn-light" style={{ width: '120px' }}>Change Phone</button> */}
					</div>

					<div className="d-flex justify-content-between align-items-center mb-2">
						<p className="text-muted mb-1">
							<strong>Email :</strong>
							<span className="ms-2">{email}</span>
						</p>
						{/* <button className="btn btn-sm btn-light" style={{ width: '120px' }}>Change Email</button> */}
					</div>

					<div className="d-flex justify-content-between align-items-center mb-1">
						<button className="btn btn-sm btn-light" style={{ width: '150px' }} onClick={() => navigate('/account/change-password')}>Change Password</button>
					</div>

					{/* <p className="text-muted">
						<strong>Location :</strong> <span className="ms-2">USA</span>
					</p>

					<p className="text-muted">
						<strong>Languages :</strong>
						<span className="ms-2"> English, German, Spanish </span>
					</p>
					<p className="text-muted mb-0">
						<strong>Elsewhere :</strong>
						<Link className="d-inline-block ms-2 text-muted" to="">
							<i className="mdi mdi-facebook"></i>
						</Link>
						<Link className="d-inline-block ms-2 text-muted" to="">
							<i className="mdi mdi-twitter"></i>
						</Link>
						<Link className="d-inline-block ms-2 text-muted" to="">
							<i className="mdi mdi-skype"></i>
						</Link>
					</p> */}
				</div>
			</Card.Body>
		</Card>
	);
};

export default SellerBox;
