"use client";

import React, { useState } from "react";
import { MapPin, Phone, Clock, Navigation, Star } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const StoreFinder = () => {
    const [selectedStore, setSelectedStore] = useState(0);

    const stores = [
        {
            id: 1,
            name: "Azmain Fashion Store",
            address: "Font Side, 2nd Floor, Shadin Bangla Super Market, Mirpur-1, (Opposite of KFC or Sony CINEPLEX)",
            city: "Dhaka, Bangladesh",
            phone: "+8801721665758",
            rating: 4.8,
            latitude: 23.80045285116627,
            longitude: 90.35547202966696,
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
            hours: "10:00 AM - 8:00 PM",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100 md:mt-0 mt-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary to-primary text-white">
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Our Store</h1>
                    <p className="text-xl text-indigo-100">Locate the nearest store and get directions</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Store Selection Tabs */}
                <div className="flex flex-wrap justify-center mb-8 gap-2">
                    {stores.map((store, index) => (
                        <button
                            key={store.id}
                            onClick={() => setSelectedStore(index)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${selectedStore === index
                                ? "bg-primary text-white shadow-lg scale-105"
                                : "bg-white text-gray-700 hover:bg-indigo-50 shadow-md"
                                }`}
                        >
                            {store.name}
                        </button>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Store Information Side */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={stores[selectedStore].image}
                                alt={stores[selectedStore].name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm font-semibold">{stores[selectedStore].rating}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{stores[selectedStore].name}</h2>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="bg-pink-100 p-2 rounded-full">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                                        <p className="text-gray-700">{stores[selectedStore].address}</p>
                                        <p className="text-gray-700">{stores[selectedStore].city}</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <Phone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                        <p className="text-gray-700">{stores[selectedStore].phone}</p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
                                        <p className="text-gray-700">{stores[selectedStore].hours}</p>
                                    </div>
                                </div>

                                {/* Coordinates */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Coordinates</h3>
                                        <p className="text-gray-700 font-mono">
                                            {stores[selectedStore].latitude}° N, {stores[selectedStore].longitude}° E
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-8">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${stores[selectedStore].latitude},${stores[selectedStore].longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-secondary hover:bg-primary text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <Navigation className="w-5 h-5" />
                                    Get Directions
                                </a>
                                <a
                                    href={`tel:${stores[selectedStore].phone}`}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    Call Store
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Map Side */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-full min-h-[600px] relative">
                            {/* Map Header */}
                            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-secondary text-white p-4 z-10">
                                <h3 className="font-semibold text-lg">Store Location</h3>
                                <p className="text-indigo-100 text-sm">{stores[selectedStore].city}</p>
                            </div>

                            {/* Interactive Map */}
                            <MapContainer
                                center={[stores[selectedStore].latitude, stores[selectedStore].longitude]}
                                zoom={15}
                                style={{ height: "100%", width: "100%", zIndex: 0 }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[stores[selectedStore].latitude, stores[selectedStore].longitude]}>
                                    <Popup>{stores[selectedStore].name}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </div>

                {/* Additional Features */}
                <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl p-6 shadow-md text-center">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Easy to Find</h4>
                        <p className="text-gray-600 text-sm">Located in prime locations with ample parking</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md text-center">
                        <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Expert Support</h4>
                        <p className="text-gray-600 text-sm">Knowledgeable staff ready to assist you</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md text-center">
                        <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Extended Hours</h4>
                        <p className="text-gray-600 text-sm">Open when you need us most</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreFinder;