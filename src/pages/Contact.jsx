import React from 'react';
import bannerImage from '../assets/Photo.jpg';

const Contact = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md flex flex-col md:flex-row">
            <div className="w-full p-6">
                <img src={bannerImage} alt="Banner" className="w-full h-auto rounded-md shadow-md" />
            </div>
            <div className="w-full p-6 flex justify-center items-center">
                <div className="w-full">
                    <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                            <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                            <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
                            <textarea id="message" name="message" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;