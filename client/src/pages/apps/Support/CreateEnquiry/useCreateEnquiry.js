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

            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                if (key === 'files') {
                    console.log(`${key}:`, value.name, `(${value.type}, ${value.size} bytes)`);
                } else {
                    console.log(`${key}:`, value);
                }
            }

            const response = await authApi.makeEnquiry(formData);
            console.log(response)
            
            showNotification({
                message: 'Enquiry submitted successfully',
                type: 'success'
            });
            
            return response.data;
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            
            showNotification({ 
                message: error.message || 'Failed to submit enquiry', 
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