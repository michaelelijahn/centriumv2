import React, { useState, useEffect } from 'react';
import { ProgressBar, Alert } from 'react-bootstrap';
import zxcvbn from 'zxcvbn';

const STRENGTH_LABELS = {
    0: { label: 'Very Weak', variant: 'danger' },
    1: { label: 'Weak', variant: 'warning' },
    2: { label: 'Fair', variant: 'info' },
    3: { label: 'Good', variant: 'primary' },
    4: { label: 'Strong', variant: 'success' }
};

const PasswordStrengthMeter = ({ password }) => {
    const [strength, setStrength] = useState(0);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (!password) {
            setStrength(0);
            setFeedback('');
            return;
        }

        const result = zxcvbn(password);
        setStrength(result.score);
        setFeedback(result.feedback.warning || result.feedback.suggestions[0] || '');
    }, [password]);

    if (!password) return null;

    const strengthInfo = STRENGTH_LABELS[strength];

    return (
        <div className="mb-3">
            <div className="d-flex align-items-center mb-1">
                <ProgressBar 
                    now={(strength + 1) * 20} 
                    variant={strengthInfo.variant}
                    className="flex-grow-1"
                    style={{ height: '0.5rem' }}
                />
                <span className="ms-2 text-muted small">
                    {strengthInfo.label}
                </span>
            </div>
            
            {feedback && (
                <Alert variant="warning" className="py-2 px-3 mb-0 small">
                    {feedback}
                </Alert>
            )}
        </div>
    );
};

export default PasswordStrengthMeter;