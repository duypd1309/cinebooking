import { useState } from 'react';

const cities = {
    Hanoi: ['Ba Dinh', 'Hoan Kiem', 'Hai Ba Trung'],
    HCM: ['District 1', 'District 3', 'District 5'],
};

const showtimes = {
    '2023-10-05': {
        'Ba Dinh': ['10:00', '13:00', '16:00'],
        'Hoan Kiem': ['11:00', '14:00', '17:00'],
        'Hai Ba Trung': ['12:00', '15:00', '18:00'],
        'District 1': ['10:30', '13:30', '16:30'],
        'District 3': ['11:30', '14:30', '17:30'],
        'District 5': ['12:30', '15:30', '18:30'],
    },
    // Add more dates and showtimes as needed up to '2023-10-18'
};

const formatDate = (dateString) => {
    const options = { month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const Booking = () => {
    const [selectedCity, setSelectedCity] = useState('Hanoi');
    const [selectedDistrict, setSelectedDistrict] = useState(cities['Hanoi'][0]);
    const [selectedType, setSelectedType] = useState('3D');
    const [selectedDate, setSelectedDate] = useState('2023-10-05');
    const [selectedTime, setSelectedTime] = useState('');

    const handleCityChange = (city) => {
        setSelectedCity(city);
        setSelectedDistrict(cities[city][0]);
        setSelectedType('3D');
        setSelectedTime('');
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTime('');
    };

    const handleDistrictChange = (district) => {
        setSelectedDistrict(district);
        setSelectedTime('');
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        const bookingInfo = {
            city: selectedCity,
            district: selectedDistrict,
            type: selectedType,
            date: selectedDate,
            time: time,
        };
        const queryString = new URLSearchParams(bookingInfo).toString();
        window.location.href = `/cart-movies/?${queryString}`;
    };

    return (
        <div className="p-4">
            <div className="flex justify-center mb-4">
                {Object.keys(showtimes).map((date) => (
                    <button
                        key={date}
                        onClick={() => handleDateChange(date)}
                        className={`mx-2 p-2 rounded ${selectedDate === date ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {formatDate(date)}
                    </button>
                ))}
            </div>
            <div className="flex justify-center mb-4">
                {Object.keys(cities).map((city) => (
                    <button
                        key={city}
                        onClick={() => handleCityChange(city)}
                        className={`mx-2 p-2 rounded ${selectedCity === city ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {city}
                    </button>
                ))}
            </div>
            <div className="flex justify-center mb-4">
                {cities[selectedCity].map((district) => (
                    <button
                        key={district}
                        onClick={() => handleDistrictChange(district)}
                        className={`mx-2 p-2 rounded ${selectedDistrict === district ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {district}
                    </button>
                ))}
            </div>
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setSelectedType('3D')}
                    className={`mx-2 p-2 rounded ${selectedType === '3D' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    3D
                </button>
                <button
                    onClick={() => setSelectedType('2D')}
                    className={`mx-2 p-2 rounded ${selectedType === '2D' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    2D
                </button>
            </div>
            <div>
                <h4 className="text-lg font-semibold mb-2">{selectedDistrict}</h4>
                <div className="flex justify-center mb-4">
                    {showtimes[selectedDate] && showtimes[selectedDate][selectedDistrict] ? (
                        showtimes[selectedDate][selectedDistrict].map((time) => (
                            <button
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                className={`mx-2 p-2 rounded ${selectedTime === time ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {time}
                            </button>
                        ))
                    ) : (
                        <span className="mx-2 p-2 bg-gray-200 rounded">No showtimes available</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Booking;
