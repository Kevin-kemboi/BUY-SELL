export default function ShippingReturnPolicy() {
    return (
      <div className="min-h-screen bg-dark-6 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Shipping & Return Policy</h1>
          <div className="space-y-6 text-gray-300">
            <h2 className="text-xl font-semibold text-white">Shipping Policy</h2>
            <p className="text-md">
              We offer free standard shipping on all orders over $50. For orders under $50, a flat rate of $5.99 will be applied. Standard shipping typically takes 3-5 business days.
            </p>
            <p className="text-md">
              Expedited shipping options are available at checkout for an additional fee. International shipping is available to select countries.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6">Return Policy</h2>
            <p className="text-md">
              We offer a 30-day return policy for most items. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
            </p>
            <p className="text-md">
              To initiate a return, please contact our customer service team or log into your account to access the return portal. Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
            </p>
            <p className="text-md">
              If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
            </p>
            <p className="mt-8 text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    )
  }