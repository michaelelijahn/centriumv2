import { PageBreadcrumb } from '@/components';
import { Fragment } from 'react';
import { remixIconsList } from './data';
import { Card, Row } from 'react-bootstrap';

const RemixIcons = () => {
	const headings = [];
	headings.push(Object.keys(remixIconsList[0]));

	return (
		<>
			<PageBreadcrumb title="Remix Icons" subName="Icons" />

			<Row>
				{(headings[0] || []).map((heading, idx) => {
					return (
						<Card key={heading + idx}>
							<Card.Body>
								<h4 className="header-title">{heading}</h4>
								<p className="card-title-desc mb-2">
									Use <code>&lt;i class="ri-home-line"&gt;&lt;/i&gt;</code> or
									<code>&lt;i class="ri-home-fill"&gt;&lt;/i&gt;</code>
								</p>

								<Row className="icons-list-demo">
									{heading !== 'Editor'
										? remixIconsList[0][heading].map((icon, idx) => {
												return (
													<Fragment key={idx}>
														<div className="col-xl-3 col-lg-4 col-sm-6">
															<i className={`ri-${icon}-line`} />
															&nbsp;ri-{icon}-line
														</div>
														<div className="col-xl-3 col-lg-4 col-sm-6">
															<i className={`ri-${icon}-fill`} />
															&nbsp;ri-{icon}-fill
														</div>
													</Fragment>
												);
										  })
										: (remixIconsList[0]['Editor'] || []).map((icon, idx) => {
												return (
													<div
														key={idx}
														className="col-xl-3 col-lg-4 col-sm-6"
													>
														<i className={`ri-${icon}`} />
														&nbsp;ri-{icon}
													</div>
												);
										  })}
								</Row>
							</Card.Body>
						</Card>
					);
				})}
			</Row>
		</>
	);
};

export { RemixIcons };
