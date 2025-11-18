import { useState, useEffect } from 'react';

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: 'restaurant' | 'hotel' | 'attraction' | 'store';
}

export default function MapIntegration() {
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 }); // NYC
  console.log('Map center:', center); // Use center for debugging
  const [zoom, setZoom] = useState(12);
  const [locations] = useState<Location[]>([
    { id: 1, name: 'Central Park', lat: 40.785091, lng: -73.968285, type: 'attraction' },
    { id: 2, name: 'Times Square', lat: 40.758896, lng: -73.98513, type: 'attraction' },
    { id: 3, name: 'Empire State Building', lat: 40.748817, lng: -73.985428, type: 'attraction' },
    { id: 4, name: 'Brooklyn Bridge', lat: 40.706086, lng: -73.996864, type: 'attraction' },
    { id: 5, name: 'Grand Central', lat: 40.752726, lng: -73.977229, type: 'store' },
  ]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [filterType, setFilterType] = useState<Location['type'] | 'all'>('all');

  useEffect(() => {
    // Simulate getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setCenter({ lat: location.lat, lng: location.lng });
    setZoom(15);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 1, 18));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 1, 3));

  const handleCenterOnUser = () => {
    if (userLocation) {
      setCenter(userLocation);
      setZoom(14);
    }
  };

  const getMarkerColor = (type: Location['type']) => {
    switch (type) {
      case 'restaurant':
        return 'bg-red-500';
      case 'hotel':
        return 'bg-blue-500';
      case 'attraction':
        return 'bg-green-500';
      case 'store':
        return 'bg-purple-500';
    }
  };

  const filteredLocations =
    filterType === 'all' ? locations : locations.filter((loc) => loc.type === filterType);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Map Integration</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="md:col-span-2">
          <div
            className="relative bg-gray-200 rounded-lg overflow-hidden"
            style={{ height: '600px' }}
          >
            {/* Simulated Map Canvas */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"
              data-testid="map-canvas"
            >
              {/* Grid lines to simulate map tiles */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-gray-400"></div>
                ))}
              </div>

              {/* Location Markers */}
              {filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationClick(location)}
                  className={`absolute w-8 h-8 ${getMarkerColor(location.type)} rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition ${
                    selectedLocation?.id === location.id ? 'ring-4 ring-indigo-500' : ''
                  }`}
                  style={{
                    left: `${((location.lng + 74.006) / 0.3) * 100}%`,
                    top: `${((40.8 - location.lat) / 0.12) * 100}%`,
                  }}
                  data-testid={`marker-${location.id}`}
                >
                  <span className="sr-only">{location.name}</span>
                </button>
              ))}

              {/* User Location */}
              {userLocation && (
                <div
                  className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"
                  style={{
                    left: `${((userLocation.lng + 74.006) / 0.3) * 100}%`,
                    top: `${((40.8 - userLocation.lat) / 0.12) * 100}%`,
                  }}
                  data-testid="user-marker"
                ></div>
              )}

              {/* Route Line */}
              {showRoute && selectedLocation && userLocation && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1={`${((userLocation.lng + 74.006) / 0.3) * 100}%`}
                    y1={`${((40.8 - userLocation.lat) / 0.12) * 100}%`}
                    x2={`${((selectedLocation.lng + 74.006) / 0.3) * 100}%`}
                    y2={`${((40.8 - selectedLocation.lat) / 0.12) * 100}%`}
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                  />
                </svg>
              )}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md shadow-lg"
                data-testid="zoom-in"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                </svg>
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md shadow-lg"
                data-testid="zoom-out"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
                </svg>
              </button>
              <button
                onClick={handleCenterOnUser}
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md shadow-lg"
                data-testid="center-on-user"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                </svg>
              </button>
            </div>

            {/* Zoom Level Display */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-md shadow-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300" data-testid="zoom-level">
                Zoom: {zoom}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Filter */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Filter Locations</h3>
            <div className="space-y-2">
              {['all', 'restaurant', 'hotel', 'attraction', 'store'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="filter"
                    value={type}
                    checked={filterType === type}
                    onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                    className="text-indigo-600"
                    data-testid={`filter-${type}`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Locations List */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Locations</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationClick(location)}
                  className={`w-full text-left p-3 rounded-md border transition ${
                    selectedLocation?.id === location.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  data-testid={`location-${location.id}`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-3 h-3 ${getMarkerColor(location.type)} rounded-full mt-1`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{location.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{location.type}</p>
                      {userLocation && (
                        <p className="text-xs text-gray-500 mt-1">
                          {calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            location.lat,
                            location.lng
                          ).toFixed(1)}{' '}
                          km away
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Location Details */}
          {selectedLocation && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Selected Location</h3>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{selectedLocation.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 capitalize">{selectedLocation.type}</p>
              <div className="space-y-2">
                <button
                  onClick={() => setShowRoute(!showRoute)}
                  className={`w-full py-2 px-3 rounded-md text-sm ${
                    showRoute
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  data-testid="toggle-route"
                >
                  {showRoute ? 'Hide Route' : 'Show Route'}
                </button>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded-md text-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
