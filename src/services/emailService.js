import emailjs from '@emailjs/browser';

// Your EmailJS credentials
const SERVICE_ID = 'service_j0664cl';  // Your service ID
const TEMPLATE_ID = 'template_0uhjuz7';     // Your template ID
const PUBLIC_KEY = '3H9Ly3WS_3mJTf_wp';          // Your public key

export const sendWelcomeEmail = async (userName, userEmail) => {
    try {
        const templateParams = {
            name: userName,
            email: userEmail,
        };
        
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log('✅ Welcome email sent!', response.status, response.text);
        return true;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        return false;
    }
};