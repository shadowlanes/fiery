import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-8 overflow-y-auto text-slate-300 space-y-6 leading-relaxed">
                    {children}
                </div>
                <div className="p-6 border-t border-white/5 flex justify-end bg-slate-900/50">
                    <Button onClick={onClose} className="rounded-full px-8">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const PrivacyPolicyModal = ({ isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
        <div className="space-y-4">
            <section>
                <h3 className="text-lg font-semibold text-white mb-2">1. Data Collection</h3>
                <p>
                    Vantage collects information you provide when you sign in via Google, including your name, email address, and profile picture. We also store financial projection inputs and "check-in" data that you explicitly save to your account.
                </p>
            </section>
            <section>
                <h3 className="text-lg font-semibold text-white mb-2">2. Use of Data</h3>
                <p>
                    The collected data is used solely to provide and improve the Vantage dashboard services, allowing you to track your progress towards Financial Independence and Retire Early (FIRE) goals.
                </p>
            </section>
            <section>
                <h3 className="text-lg font-semibold text-white mb-2">3. Third-Party Services</h3>
                <p>
                    We use Google for authentication. Your use of the authentication service is subject to Google's Privacy Policy. We do not sell or share your personal data with third parties for marketing purposes.
                </p>
            </section>
            <section>
                <h3 className="text-lg font-semibold text-white mb-2">4. Security</h3>
                <p>
                    We implement industry-standard security measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure.
                </p>
            </section>
        </div>
    </Modal>
);

export const TermsOfServiceModal = ({ isOpen, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service">
        <div className="space-y-4">
            <section>
                <h3 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h3>
                <p>
                    By using Vantage, you agree to these Terms of Service. If you do not agree, please do not use the application.
                </p>
            </section>
            <section>
                <h3 className="text-lg font-semibold text-white mb-2">2. Disclaimer of Warranties</h3>
                <p>
                    Vantage is provided on an "as is" and "as available" basis. We make no warranties regarding the accuracy of the financial projections or the continuous availability of the service. Projections are for informational purposes only.
                </p>
            </section>
            <section>
                <h3 className="text-lg font-semibold text-white mb-2">3. User Responsibility</h3>
                <p>
                    You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. Financial decisions should be made based on your own research and/or consultation with professionals.
                </p>
            </section>
            <section>
                <h3 className="text-lg font-semibold text-white mb-2">4. Limitation of Liability</h3>
                <p>
                    To the maximum extent permitted by law, Vantage shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service.
                </p>
            </section>
        </div>
    </Modal>
);
