import React, { useState } from 'react';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FormStepper from '../FormStepper';

const MultiStepFormWrapper = ({ 
    accountType, 
    steps, 
    actualSteps,
    getProgressStep,
    children, 
    onStepChange,
    onSubmit,
    onStepValidation,
    canProceed = true,
    isLastStep = false 
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleNext = () => {
        const stepsLength = actualSteps ? actualSteps.length : steps.length;
        
        // Validate current step before proceeding
        if (onStepValidation) {
            const currentStepData = formData[`step_${currentStep}`] || {};
            const isValid = onStepValidation(currentStep, currentStepData, formData);
            
            if (!isValid) {
                return; // Don't proceed if validation fails
            }
        }
        
        if (currentStep < stepsLength - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            if (onStepChange) {
                onStepChange(nextStep, formData);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            if (onStepChange) {
                onStepChange(prevStep, formData);
            }
        }
    };

    const handleCancel = () => {
        navigate('/dashboard/accounts');
    };

    const handleSubmit = () => {
        // Validate final step before submitting
        if (onStepValidation) {
            const currentStepData = formData[`step_${currentStep}`] || {};
            const isValid = onStepValidation(currentStep, currentStepData, formData);
            
            if (!isValid) {
                return; // Don't submit if validation fails
            }
        }
        
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const updateFormData = (stepData) => {
        setFormData(prev => ({
            ...prev,
            [`step_${currentStep}`]: stepData
        }));
    };

    const clearErrors = () => {
        setErrors({});
    };

    return (
        <>
            <div className="row">
                <div className="col-sm-12">
                    <div className="page-title-box d-flex justify-content-between align-items-center">
                        <h3 className="page-title mb-0">KYC Registration</h3>
                        <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                                <li className="breadcrumb-item"><a href="/dashboard/live-account-request">Live Account Request</a></li>
                                <li className="breadcrumb-item active">{accountType}</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <Row>
                <Col xl={10} lg={12} className="mx-auto">
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                           
                            <FormStepper 
                                steps={steps} 
                                currentStep={getProgressStep ? getProgressStep(currentStep) : currentStep} 
                                accountType={accountType}
                            />

                   
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="danger" className="mb-4">
                                    <h6 className="mb-2">Please fix the following errors:</h6>
                                    <ul className="mb-0">
                                        {Object.values(errors).map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </Alert>
                            )}

                      
                            {/* Current Step Content */}
                            <div className="step-content mb-4">
                                {React.isValidElement(children) ? React.cloneElement(children, {
                                    currentStep,
                                    formData: formData[`step_${currentStep}`] || {},
                                    updateFormData,
                                    clearErrors,
                                    allFormData: formData
                                }) : (
                                    typeof children === 'function' ? children({
                                        currentStep,
                                        formData: formData[`step_${currentStep}`] || {},
                                        updateFormData,
                                        clearErrors,
                                        allFormData: formData
                                    }) : children
                                )}
                            </div>

                       
                            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                <div>
                                    <Button 
                                        variant="outline-secondary"
                                        onClick={handleCancel}
                                        className="me-2 fs-5"
                                    >
                                        <i className="mdi mdi-close me-1"></i>
                                        Cancel
                                    </Button>
                                    
                                    {currentStep > 0 && (
                                        <Button 
                                            variant="outline-primary"
                                            onClick={handlePrevious}
                                            className="fs-5"
                                        >
                                            <i className="mdi mdi-chevron-left me-1"></i>
                                            Previous
                                        </Button>
                                    )}
                                </div>
                                
                                <div>
                                    {currentStep < (actualSteps ? actualSteps.length : steps.length) - 1 ? (
                                        <Button 
                                            variant="primary"
                                            onClick={handleNext}
                                            disabled={!canProceed}
                                            className="fs-5"
                                        >
                                            Next
                                            <i className="mdi mdi-chevron-right ms-1"></i>
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="success"
                                            onClick={handleSubmit}
                                            disabled={!canProceed}
                                            className="fs-5"
                                        >
                                            <i className="mdi mdi-check me-1"></i>
                                            Submit Application
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default MultiStepFormWrapper; 