export default function About() {
  return (
    <div className="min-h-screen bg-dark-6 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          About BUY
        </h1>
        <div className="space-y-3 text-gray-300">
          <p>
            BUY is a cutting-edge e-commerce platform dedicated to bringing you
            the latest in products and innovation. Founded in 2023, we've
            quickly become a go-to destination for enthusiasts and early
            adopters across multiple categories.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">Our Mission</h2>
          <p>
            Our mission is to make the latest technology accessible to everyone.
            We believe that innovation should be within reach, and we strive to
            offer a curated selection of high-quality products at competitive
            prices.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">
            What Sets Us Apart
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Curated Selection: We handpick every product in our store,
              ensuring only the best makes it to you.
            </li>
            <li>
              Expert Support: Our team of tech experts is always ready to assist
              you with any questions or concerns.
            </li>
            <li>
              Fast Shipping: We partner with top logistics providers to get your
              orders to you as quickly as possible.
            </li>
            <li>
              Secure Shopping: Your security is our priority. We use
              state-of-the-art encryption to protect your data.
            </li>
          </ul>
          <h2 className="text-xl font-semibold text-white mt-6">Contact Us</h2>
          <p>
            We're always here to help. If you have any questions, concerns, or
            just want to chat, don't hesitate to reach out to us at
            support@buy-demo.com or call us at 1-800-BUY-SHOP.
          </p>
          <p className="mt-8 text-sm text-gray-400">
            BUY - Bringing the Future to Your Doorstep
          </p>
        </div>
      </div>
    </div>
  );
}
