import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import ChatBot from '../ChatBot/ChatBot';

const Contact = () => {
    const [result, setResult] = useState(""); // State to store success/error messages
    const [isSubmitting, setIsSubmitting] = useState(false); // State to show loading indicator

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setResult("Sending...");

        const formData = new FormData(event.target);
        formData.append("access_key", "2d586edf-c773-4971-9263-e5ffcf221e42"); // Corrected key formatting

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setResult("Form Submitted Successfully ✅");
                event.target.reset(); // Clear form on success
            } else {
                setResult(`Error: ${data.message} ❌`);
            }
        } catch (error) {
            setResult("Submission failed. Please try again later ❌");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar />
            <section id="contact" className="contact">
                <div className="container">
                    <div className="section-header" style={{ paddingTop: '50px', textAlign: 'center' }}>
                        <h2><strong>CONTACT US</strong></h2>
                        <p>Reva University, Bangalore</p>
                    </div>
                </div>

                {/* Google Map */}
                <div className="map">
                    <div className="mapouter">
                        <div className="gmap_canvas container shadow">
                            <iframe
                                className="gmap_iframe"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=REVA UNIVERSITY&output=embed"
                                title="Reva University Map"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Contact Details & Form */}
                <div className="container">
                    <div className="row gy-5 gx-lg-5">
                        <div className="col-lg-4">
                            <div className="info">
                                <h3>Get in touch</h3>
                                <p>PLACEMENT CELL</p>
                                <div className="info-item d-flex">
                                    <i className="bi bi-geo-alt flex-shrink-0"></i>
                                    <div>
                                        <h4>Location:</h4>
                                        <p>REVA UNIVERSITY, Rukmini Knowledge Park, Yelahanka, Kattigenahalli, Bengaluru, Sathanur, Karnataka 560064</p>
                                    </div>
                                </div>
                                <div className="info-item d-flex">
                                    <i className="bi bi-envelope flex-shrink-0"></i>
                                    <div>
                                        <h4>Email:</h4>
                                        <p>
                                            <a href="mailto:placementhiring@reva-university.in">placement_Team@reva.edu.in</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="info-item d-flex">
                                    <i className="bi bi-phone flex-shrink-0"></i>
                                    <div>
                                        <h4>Call:</h4>
                                        <p>9999999999</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="col-lg-8">
                            <form onSubmit={onSubmit}>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <input type="text" name="name" className="form-control" placeholder="Your Name" required />
                                    </div>
                                    <div className="col-md-6 form-group mt-3 mt-md-0">
                                        <input type="email" className="form-control" name="email" placeholder="Your Email" required />
                                    </div>
                                </div>
                                <div className="form-group mt-3">
                                    <input type="text" className="form-control" name="subject" placeholder="Subject" required />
                                </div>
                                <div className="form-group mt-3">
                                    <textarea rows='7' className="form-control" name="message" placeholder="Message" required></textarea>
                                </div>

                                {/* Submission Status */}
                                {result && (
                                    <div className={`alert ${result.includes("✅") ? "alert-success" : "alert-danger"} mt-3`}>
                                        {result}
                                    </div>
                                )}

                                <div className="text-center mt-3">
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <ChatBot />
            <Footer />
        </div>
    );
};

export default Contact;
