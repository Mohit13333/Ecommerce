function Footer() {
  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl mx-auto text-white py-10 px-4">
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-semibold mb-3">Download our ClickShop App</h3>
          <p className="text-gray-400 mb-6">Buy what you want.</p>
          <div className="flex justify-center my-10 flex-wrap">
            <div className="flex items-center border border-gray-600 w-auto rounded-lg px-4 py-2 mx-2 hover:bg-gray-800 transition-colors">
              <img
                src="https://cdn-icons-png.flaticon.com/512/888/888857.png"
                className="w-7 md:w-8"
                alt="Google Play Store"
              />
              <div className="text-left ml-3">
                <p className="text-xs text-gray-200">Download on</p>
                <p className="text-sm md:text-base font-semibold">Google Play Store</p>
              </div>
            </div>
            <div className="flex items-center border border-gray-600 w-auto rounded-lg px-4 py-2 mx-2 hover:bg-gray-800 transition-colors">
              <img
                src="https://cdn-icons-png.flaticon.com/512/888/888841.png"
                className="w-7 md:w-8"
                alt="Apple Store"
              />
              <div className="text-left ml-3">
                <p className="text-xs text-gray-200">Download on</p>
                <p className="text-sm md:text-base font-semibold">Apple Store</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
          <p className="order-2 md:order-1 mt-8 md:mt-0">
            © Mohit Singh {new Date().getFullYear()}.
          </p>
          <div className="order-1 md:order-2 flex space-x-4">
            <span className="hover:text-gray-300 transition-colors cursor-pointer">About us</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Contact us</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
