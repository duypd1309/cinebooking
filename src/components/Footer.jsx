import { Link } from 'react-router-dom';

const Footer = () => {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative text-white justify-center bg-[#0d0720] mb-4"   >
            <div className="grid grid-cols-4 gap-4 mt-4 ml-20">
                <div className="flex items-start flex-col font-bold">
                    <p className="w-[250px] text-xl font-space" > Buy movie tickets easily with our systems </p>
                    <button
                        onClick={scrollToTop}
                        className="bg-white text-orange-500 border w-[150px] min-h-[50px] mt-4">
                        Get Your Ticket
                    </button>
                </div>
                <div>
                    <h3 className="font-bold">Support</h3>
                    <ul>
                        <li><Link to="/">Help Center</Link></li>
                        <li><Link to="/">Safety Center</Link></li>
                        <li><Link to="/">Community Guidelines</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold">Legal</h3>
                    <ul>
                        <li><Link to="/">Cookies Policy</Link></li>
                        <li><Link to="/">Privacy Policy</Link></li>
                        <li><Link to="/">Terms of Service</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold">Follow Us</h3>
                    <ul>
                        <li><Link to="/">Facebook</Link></li>
                        <li><Link to="/">Twitter</Link></li>
                        <li><Link to="/">Instagram</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;