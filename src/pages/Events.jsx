const Events = () => {
    const events = [
        { id: 1, name: 'Event 1', date: '2023-10-01', description: 'Description for event 1' },
        { id: 2, name: 'Event 2', date: '2023-10-05', description: 'Description for event 2' },
        { id: 3, name: 'Event 3', date: '2023-10-10', description: 'Description for event 3' },
        // Add more events as needed
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {events.map(event => (
                <div key={event.id} className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                    <p className="text-gray-600 mb-2">{event.date}</p>
                    <p className="text-gray-800">{event.description}</p>
                </div>
            ))}
        </div>
    );
};

export default Events;