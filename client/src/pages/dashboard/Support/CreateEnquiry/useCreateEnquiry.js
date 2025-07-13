import { useState } from "react";
import { useNotificationContext, authApi } from "@/common";

export default function useCreateEnquiry() {
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotificationContext();

    const createEnquiry = async (formData) => {
        try {
            setLoading(true);
            
            if (!formData.get('subject')) throw new Error('Subject is required');
            if (!formData.get('description')) throw new Error('Description is required');

            const response = await authApi.makeEnquiry(formData);
            
            showNotification({
                message: 'Enquiry submitted successfully',
                type: 'success'
            });
            
            return response.data;
        } catch (error) {
            // Parse backend validation errors for better user feedback
            let errorMessage = 'Failed to submit enquiry';
            
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                // Backend validation errors - show specific field errors
                const fieldErrors = error.response.data.errors.map(err => {
                    switch (err.field) {
                        case 'subject':
                            return `• Subject: ${err.message}`;
                        case 'description':
                            return `• Description: ${err.message}`;
                        default:
                            return `• ${err.message}`;
                    }
                }).join('\n');
                
                errorMessage = `Please fix the following:\n${fieldErrors}`;
            } else if (error.response?.data?.message) {
                // Backend error message
                errorMessage = error.response.data.message;
            } else if (error.message) {
                // General error message
                errorMessage = error.message;
            }
            
            showNotification({ 
                message: errorMessage, 
                type: 'error' 
            });
            
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createEnquiry
    };
}