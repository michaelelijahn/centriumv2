import { Col, Row } from 'react-bootstrap';
import ProjectOverview from './ProjectOverview';

const Projects = ({ projectsData }) => {
	return (
		<Row>
			{(projectsData || []).map((project, index) => {
				return (
					<Col md={6} key={index.toString()}>
						<ProjectOverview project={project} />
					</Col>
				);
			})}
		</Row>
	);
};

export { Projects };
