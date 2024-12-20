import { useState } from 'react';
import imageList from '../assets/index';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Booking from './Booking'; // Import the Booking component

const Slideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBooking, setShowBooking] = useState(false); // State to control the display of Booking

    const banners = imageList.map((image, index) => ({
        id: index + 1,
        image: image,
        title: `Banner ${index + 1}`,
        buttons: [
            { label: `More Info ${index + 1}`, action: () => alert(`More Info ${index + 1}`) },
            { label: `Get Ticket ${index + 1}`, action: () => setShowBooking(true) }, // Show Booking on click
        ],
    }));

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const handlePrev = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
        );
    };

    const handleCloseBooking = () => {
        setShowBooking(false);
    };

    return (
        <div className="relative w-full mx-auto flex">
            {/* Overlay for Booking */}
            {showBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg relative">
                        <button
                            onClick={handleCloseBooking}
                            className="absolute top-2 right-2 text-black">
                            X
                        </button>
                        <Booking />
                    </div>
                </div>
            )}
            {/* Banner */}
            <div className="relative">
                <img
                    src={banners[currentIndex].image}
                    alt={banners[currentIndex].title}
                    className="w-full h-auto rounded-lg"
                />
                <div className="absolute bottom-5 left-5 text-white">
                    <h2 className="text-2xl font-bold">{banners[currentIndex].title}</h2>
                </div>
            </div>
            {/* Buttons on Banner */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white flex gap-4 font-space-grotesk">
                {banners[currentIndex].buttons.map((button, index) => (
                    <button
                        key={index}
                        onClick={button.action}
                        className={`py-2 px-4 font-semibold font-space rounded ${index === 0 ? 'bg-white text-black hover:bg-orange-500 hover:text-white' : 'bg-orange-500 text-white hover:bg-white hover:text-black'}`}>
                        {button.label}
                    </button>
                ))}
            </div>

            {/* Navigation */}
            <button
                onClick={handlePrev}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full">
                <FaArrowLeft />
            </button>
            <button
                onClick={handleNext}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
            >
                <FaArrowRight />
            </button>
        </div>
    );
};

export default Slideshow;
