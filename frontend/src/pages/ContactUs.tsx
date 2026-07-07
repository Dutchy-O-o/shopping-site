import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../Styles/App.css";

const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setStatusMessage(null);

        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
        };

        emailjs
            .send(
                "service_kfs76j1", 
                "template_49258et", 
                templateParams,
                "JtAXFc6oZAsXFq3si" 
            )
            .then(
                (response) => {
                    console.log("Message Sent:", response);
                    setStatusMessage("Your message has been sent!");
                },
                (error) => {
                    console.error("Failed to send message:", error);
                    setStatusMessage("Failed to send your message. Please try again.");
                }
            )
            .finally(() => {
                setLoading(false);
            });
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <p>Feel free to reach out to us with any questions or concerns!</p>
            <form className="contact-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />
                <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </form>
            {statusMessage && <p className="status-message">{statusMessage}</p>}
            <div className="contact-info">
                
                <p>📞 Phone: +90 544 622 42 16</p>
            </div>
        </div>
    );
};

export default ContactUs;
