import React, { useState } from 'react';
import { Mail, MessageSquare, User } from 'lucide-react';
import NavBar from './NavBar';
import emailjs from 'emailjs-com';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFormSubmitted(false);
        setError(null);

        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
        };

        // Send the email using EmailJS
        emailjs.send(
            'service_51h47bb',  // Replace with your EmailJS service ID
            'template_n8krznn', // Replace with your EmailJS template ID
            templateParams,
            'YisnUhAn3r8syNEZI'      // Replace with your EmailJS user ID
        )
        .then(
            () => {
                setLoading(false);
                setFormSubmitted(true);
            },
            (error) => {
                setLoading(false);
                setError('Something went wrong. Please try again later.');
                console.error(error);
            }
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="relative bg-gradient-to-r from-blue-600 to-blue-800">
                <NavBar />
            </header>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
                    <p className="text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                                <User className="w-4 h-4 mr-2" />
                                Your Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                                <Mail className="w-4 h-4 mr-2" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Your Message
                            </label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>

                    {formSubmitted && (
                        <div className="mt-6 text-center text-green-600">
                            <p>Your message has been sent successfully. Thank you!</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 text-center text-red-600">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Ways to Reach Us</h3>
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                <strong>Email:</strong> queuecareinfo@gmail.com
                            </p>
                            <p className="text-gray-600">
                                <strong>Phone:</strong> +60 11 7305 9803
                            </p>
                            <p className="text-gray-600">
                                <strong>Address:</strong> 123 Healthcare Avenue, Medical District, NY 100010
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;