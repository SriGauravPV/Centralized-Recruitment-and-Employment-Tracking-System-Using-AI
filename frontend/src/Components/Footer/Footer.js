import React from 'react';

const Footer = () => {
    return (
        <div>
            <footer id="footer" className="footer">
                <div className="footer-legal text-center">
                    <div className="container d-flex flex-column flex-lg-row justify-content-center justify-content-lg-between align-items-center">

                        <div className="d-flex flex-column align-items-center align-items-lg-start">
                            <div className="copyright">
                                2025 &copy; Copyright <strong><span>Placements @Reva University</span></strong>. All Rights Reserved
                            </div>
                            <div className="credits">
                                <a href="#">PlacementCell@Reva University</a>
                            </div>
                        </div>

                        <div className="social-links order-first order-lg-last mb-3 mb-lg-0">
                            <a href="https://twitter.com/REVAUniversity" className="twitter" target="_blank" rel="noopener noreferrer">
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="https://www.facebook.com/p/REVA-University-Bangalore-100054242540296/" className="facebook" target="_blank" rel="noopener noreferrer">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="https://www.instagram.com/revauniversity_official/" className="instagram" target="_blank" rel="noopener noreferrer">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="https://www.linkedin.com/school/reva-university/" className="linkedin" target="_blank" rel="noopener noreferrer">
                                <i className="bi bi-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            <a href="#" className="scroll-top d-flex align-items-center justify-content-center">
                <i className="material-icons">arrow_upward</i>
            </a>
        </div>
    );
};

export default Footer;
