export default function VirtualScroll() {
  const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, text: `Item ${i + 1}` }));

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Virtual Scrolling List</h1>
        <p className="text-gray-300 mb-4">Placeholder: Virtual scrolling with 1000+ items</p>
        <div className="bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="p-3 border-b border-gray-700 text-white">
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
