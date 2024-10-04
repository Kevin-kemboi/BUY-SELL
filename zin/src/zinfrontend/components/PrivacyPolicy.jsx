export default function PrivacyPolicy() {
    return (
      <div className="min-h-screen bg-dark-6 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy</h1>
          <div className="text-gray-300">
            <p className="text-md">
              At ACME Store, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6">Information We Collect</h2>
            <p className="text-md">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our customer service. This may include your name, email address, postal address, phone number, and payment information.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6">How We Use Your Information</h2>
            <p className="text-md">
              We use your information to process your orders, provide customer service, send you promotional communications (if you've opted in), and improve our services.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6">Data Security</h2>
            <p className="text-md">
              We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6">Your Rights</h2>
            <p className="text-md">
              You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data. To exercise these rights, please contact us.
            </p>
            <p className="mt-8 text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    )
  }