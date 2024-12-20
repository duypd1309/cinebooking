import { useState } from 'react';
import Register from '../components/Register';
import Login from '../components/Login';

const VerifyUser = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
            <div className="flex justify-center space-x-4 my-4">
                <button
                    className={`px-4 py-2 rounded ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </button>
                <button
                    className={`px-4 py-2 rounded ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setIsLogin(false)}
                >
                    Register
                </button>
            </div>
            {isLogin ? <Login /> : <Register />}
        </>
    );
};

export default VerifyUser;