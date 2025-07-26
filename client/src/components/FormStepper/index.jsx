import React from 'react';
import { Row, Col } from 'react-bootstrap';

const FormStepper = ({ steps, currentStep, accountType }) => {
    const getStepIcon = (stepIndex) => {
        if (stepIndex < currentStep) {
            return 'mdi mdi-check-circle text-success';
        } else if (stepIndex === currentStep) {
            return 'mdi mdi-circle-outline text-primary';
        } else {
            return 'mdi mdi-circle-outline text-muted';
        }
    };

    const getStepClass = (stepIndex) => {
        if (stepIndex < currentStep) {
            return 'text-success';
        } else if (stepIndex === currentStep) {
            return 'text-primary fw-bold';
        } else {
            return 'text-muted';
        }
    };

    return (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0 text-primary">{accountType} Registration</h3>
                <span className="badge bg-light text-primary fs-6">
                    Step {currentStep + 1} of {steps.length}
                </span>
            </div>
            
            <Row>
                {steps.map((step, index) => (
                    <Col key={index} className="text-center">
                        <div className="d-flex flex-column align-items-center">
                            <div className="d-flex align-items-center mb-2 w-100">
                                <div className="flex-shrink-0">
                                    <i className={`${getStepIcon(index)} fs-2`}></i>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-grow-1 mx-2 border-top border-2 ${
                                        index < currentStep ? 'border-success' : 'border-light'
                                    }`}></div>
                                )}
                            </div>
                            <h5 className={`mb-0 ${getStepClass(index)}`}>
                                {step.title}
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
                                {step.description}
                            </p>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default FormStepper; 