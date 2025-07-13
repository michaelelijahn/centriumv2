import { Row, Col, Card, Button } from 'react-bootstrap';
import { EnquiriesTable, PageBreadcrumb } from '@/components';
import { columns, sizePerPageList } from './ColumnsSet';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useGetEnquiries from './useGetEnquiries';

const Support = () => {
	const [enquiries, setEnquiries] = useState([]);
	const [loading, setLoading] = useState(true);
	const { getEnquiries } = useGetEnquiries();
	
	useEffect(() => {
		const fetchEnquiries = async () => {
			try {
				setLoading(true);
					// Customer gets only their own tickets
				const data = await getEnquiries();
				setEnquiries(data);
			} catch (error) {
				console.error("Error fetching enquiries:", error);
				setEnquiries([]);
			} finally {
				setLoading(false);
			}
		};
		
		fetchEnquiries();
	}, [getEnquiries]);

	return (
		<>
			<PageBreadcrumb title="Help & Support" subName="Pages" />

            <Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
                            <Row className="mb-2">
								<Col sm={5}>
                                    <Link to="/dashboard/support/new-enquiry" className="btn btn-success mb-2">
                                        <i className="mdi mdi-plus-circle me-2"></i> Add Enquiry
                                    </Link>
								</Col>
							</Row>

							{loading ? (
								<div className="text-center p-4">Loading enquiries...</div>
							) : (
								<EnquiriesTable
									columns={columns}
									data={enquiries}
									pageSize={5}
									sizePerPageList={sizePerPageList}
									isSortable={true}
									pagination={true}
									isSearchable={true}
									theadClass="table-light"
									searchBoxClass="mb-2"
								/>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default Support;