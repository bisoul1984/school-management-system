import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                We take your privacy seriously. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our school management system.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <p className="text-gray-600">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Personal identification information (Name, email address, phone number)</li>
                  <li>Educational records and academic performance data</li>
                  <li>Attendance records</li>
                  <li>Payment information</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate security measures to protect your personal information.
                All data is encrypted and stored securely.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <div className="text-gray-600">
                <p>If you have any questions about our Privacy Policy, please contact us:</p>
                <div className="mt-4">
                  <p>Email: fikertetadesse1403@gmail.com</p>
                  <p>Phone: +251967044111</p>
                </div>
              </div>
            </section>
          </div>

          {/* Last Updated */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 