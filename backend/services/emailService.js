const sgMail = require('@sendgrid/mail');
const EmailLog = require('../models/EmailLog');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email sending status tracking
const EMAIL_STATUS = {
    PENDING: 'pending',
    SENT: 'sent',
    FAILED: 'failed'
};

class EmailService {
    static async sendRegistrationEmail(userEmail) {
        const status = {
            recipient: userEmail,
            type: 'registration',
            status: EMAIL_STATUS.PENDING,
            attempts: 0,
            timestamp: new Date(),
        };

        try {
            // Validate email format
            if (!this.isValidEmail(userEmail)) {
                throw new Error('Invalid email format');
            }

            const msg = {
                to: userEmail,
                from: {
                    email: process.env.SENDGRID_VERIFIED_SENDER,
                    name: 'Vid Cleaner'
                },
                subject: 'Welcome to Vid Cleaner - Registration Confirmation',
                templateId: process.env.SENDGRID_REGISTRATION_TEMPLATE_ID,
                dynamicTemplateData: {
                    userEmail: userEmail,
                    loginUrl: process.env.APP_URL + '/login',
                    supportEmail: process.env.SUPPORT_EMAIL,
                    currentYear: new Date().getFullYear()
                },
                trackingSettings: {
                    clickTracking: { enable: true },
                    openTracking: { enable: true }
                }
            };

            const response = await sgMail.send(msg);

            status.status = EMAIL_STATUS.SENT;
            status.messageId = response[0].headers['x-message-id'];
            await this.logEmailStatus(status);

            return { success: true, messageId: status.messageId };

        } catch (error) {
            status.status = EMAIL_STATUS.FAILED;
            status.error = error.message;
            status.attempts += 1;
            await this.logEmailStatus(status);

            console.error('Email sending failed:', {
                error: error.message,
                recipient: userEmail,
                timestamp: new Date().toISOString()
            });

            // Rethrow for handler
            throw new Error(`Failed to send registration email: ${error.message}`);
        }
    }

    static async retryFailedEmails() {
        try {
            const failedEmails = await this.getFailedEmails();
            console.log(`Attempting to retry ${failedEmails.length} failed emails`);

            for (const email of failedEmails) {
                if (email.attempts < 3) { // Maximum retry attempts
                    try {
                        console.log(`Retrying email for: ${email.recipient}, attempt ${email.attempts + 1}`);
                        await this.sendRegistrationEmail(email.recipient);
                        await EmailLog.updateOne(
                            { _id: email._id },
                            { $inc: { attempts: 1 } }
                        );
                    } catch (error) {
                        console.error(`Retry failed for ${email.recipient}:`, error);
                    }
                } else {
                    console.log(`Maximum retry attempts reached for ${email.recipient}`);
                    await this.markEmailAsFailed(email._id);
                }
            }
        } catch (error) {
            console.error('Error in retry process:', error);
            await this.alertMonitoring(error);
        }
    }

    static async getFailedEmails() {
        try {
            return await EmailLog.find({
                status: EMAIL_STATUS.FAILED,
                attempts: { $lt: 3 }
            }).sort({ timestamp: 1 });
        } catch (error) {
            console.error('Error fetching failed emails:', error);
            await this.alertMonitoring(error);
            return [];
        }
    }

    static async logEmailStatus(status) {
        try {
            await EmailLog.create(status);
        } catch (error) {
            console.error('Failed to log email status:', error);
            await this.alertMonitoring(error);
        }
    }

    static async markEmailAsFailed(emailId) {
        try {
            await EmailLog.updateOne(
                { _id: emailId },
                { 
                    $set: { 
                        status: EMAIL_STATUS.FAILED,
                        error: 'Maximum retry attempts reached'
                    }
                }
            );
        } catch (error) {
            console.error('Error marking email as failed:', error);
            await this.alertMonitoring(error);
        }
    }

    static async alertMonitoring(error) {
        if (process.env.NODE_ENV === 'production') {
            try {
                // Log to console in all environments
                console.error('Email Service Error:', {
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                });

                // Additional production monitoring
                if (process.env.DATADOG_API_KEY) {
                    const datadog = require('./monitoring/datadog');
                    await datadog.logError('email_service_error', error);
                }
            } catch (monitoringError) {
                console.error('Error in monitoring alert:', monitoringError);
            }
        }
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

module.exports = EmailService;