export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-dark-6 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Terms and Conditions
        </h1>
        <div className="space-y-3 text-gray-300">
          <p>
            Welcome to ACME Store. By accessing our website and making a
            purchase, you agree to these Terms and Conditions.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Use of the Website
          </h2>
          <p>
            You may use our website for lawful purposes only. You must not use
            our website in any way that causes, or may cause, damage to the
            website or impairment of the availability or accessibility of the
            website.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Product Information
          </h2>
          <p>
            We strive to provide accurate product information, but we do not
            warrant that product descriptions or other content is accurate,
            complete, reliable, current, or error-free.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            Pricing and Availability
          </h2>
          <p>
            All prices are subject to change without notice. We reserve the
            right to modify or discontinue any product without notice. We shall
            not be liable to you or any third party for any modification, price
            change, or discontinuance of any product.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            User Accounts
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account and password and for restricting access to your computer.
            You agree to accept responsibility for all activities that occur
            under your account or password.
          </p>
          <p className="mt-8 text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
