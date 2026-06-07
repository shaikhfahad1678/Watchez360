export default function Filters() {
  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">

        {/* Brand Filter */}
        <div className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-gray-300 transition">
          <select className="bg-transparent outline-none cursor-pointer">
            <option>Brand</option>
            <option>Fastrack</option>
            <option>Casio</option>
            <option>Titan</option>
            <option>Rolex</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-gray-300 transition">
          <select className="bg-transparent outline-none cursor-pointer">
            <option>Price</option>
            <option>$0 - $100</option>
            <option>$100 - $300</option>
            <option>$300 - $700</option>
            <option>$700+</option>
          </select>
        </div>

      </div>
    </div>
  );
}