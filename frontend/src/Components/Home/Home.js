import React from "react";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import '../../assets/css/main.css';
import '../../assets/css/chat.css';
import '../../assets/css/variables.css';
import '../../assets/css/_all-skins.min.css';
import '../../assets/css/AdminLTE.min.css';
import '../../assets/css/custom.css';
import '../../assets/css/style.css';
import img1 from '../../assets/img/companies/accenture.png';
import img2 from '../../assets/img/companies/amazon.png';
import img3 from '../../assets/img/companies/google.png';
import img4 from '../../assets/img/companies/microsoft.png';
import img5 from '../../assets/img/companies/TCS.png';
import img6 from '../../assets/img/companies/wipro.png';
import img7 from '../../assets/img/companies/Infosys.png';
import img8 from '../../assets/img/companies/meta.png';
import img9 from '../../assets/img/companies/wallmart.png';
import img10 from '../../assets/img/companies/capgemini.png';
import img11 from '../../assets/img/companies/goldman.png';
import img12 from '../../assets/img/hero-carousel/college.png';
import img13 from '../../assets/img/feature-7.jpg';
import img14 from '../../assets/img/features-1.svg';
import Footer from "../Footer/Footer";
import ChatBot from "../ChatBot/ChatBot";
import { Link } from "react-router-dom";
const Home = () => {


  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero-animated" className="hero-animated d-flex align-items-center">
        <div className="container d-flex flex-column justify-content-center align-items-center text-center position-relative">
          <img src={img12} className="img-fluid animated" alt="Hero" />
          <h2>Welcome to <span>Reva University Placement Cell</span></h2>
          <p>We Will Support You In Your Entire Placement Journey.</p>
          <div className="d-flex">
            <Link to="/student" className="btn-get-started scrollto">Get Started</Link>
          </div>
        </div>
      </section>

      <main id="main">
        {/* CTA Section */}
        <section id="cta" className="cta">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-8 col-md-6 content d-flex flex-column justify-content-center order-last order-md-first">
                <h3>Placement <em>Portal</em></h3>
                <p>
                  The Placement Cell plays a crucial role in locating job opportunities for under graduates and post graduates passing out from the college by keeping in touch with reputed firms and industrial establishments.
                </p>
                <p>The placement cell operates round the year to facilitate contacts between companies and graduates. The number of students placed through the campus interviews is continuously rising.</p>
                <Link className="cta-btn align-self-start" to="/student">Get Started</Link>
              </div>
              <div className="col-lg-4 col-md-6 order-first order-md-last d-flex align-items-center">
                <div className="">
                  <img src={img13} style={{width:"400px",height:"350px"}} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section id="clients" className="clients">
          <div className="container ">
            <marquee behavior="scroll" direction="left" style={{ display: "flex" , justifyContant:"center",flexDirection:"row"}}>
              <img src={img1} className="img-fluid" alt="Accenture" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={img2} className="img-fluid" alt="Amazon" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={img10} className="img-fluid" alt="Capgemini" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={img11} className="img-fluid" alt="Goldman Sachs" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={img7} className="img-fluid" alt="Infosys" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={img5} className="img-fluid" alt="LTI Mindtree" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={img8} className="img-fluid" alt="Meta" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={img4} className="img-fluid" alt="Microsoft" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={img6} className="img-fluid" alt="TCS" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={img9} className="img-fluid" alt="Walmart" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={img3} className="img-fluid" alt="Wipro" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </marquee>
          </div>
        </section>

        {/* Objectives Section */}
        <section id="objectives" className="features" >
          <div className="container" style={{ backgroundColor: "rgba(72, 86, 100, 0.1)", padding: "80px 60px", borderRadius: "10px" }}>
            <div className="d-flex  justify-content-center align-items-center gap-5">
              <div>
                <h3 style={{ color: "#485664", fontWeight: "bold", fontSize: "40px", marginLeft: "30px", marginBottom: "5px",borderBottom: "2px solid #1ec3e0" }}>Objectives</h3>
                &nbsp;
                <p style={{ color: "#485664", fontSize: "18px", marginLeft: "30px", fontWeight: "bold" }}>The Placement Cell of Reva University is committed to:</p>
                <ul style={{ color: "#485664", listStyleType: "none" }}>
                  <li style={{ color: "#485664", fontWeight: "bold", fontSize: "15px" }}><i class="bi bi-check-circle-fill"></i> Developing the students to meet the Industries recruitment process.</li>
                  <li style={{ color: "#485664", fontWeight: "bold", fontSize: "15px" }}><i class="bi bi-check-circle-fill"></i> To motivate students to develop technical knowledge and soft skills.</li>
                  <li style={{ color: "#485664", fontWeight: "bold", fontSize: "15px" }}><i class="bi bi-check-circle-fill"></i> To produce world-class professionals with excellent skills.</li>
                </ul>
              </div>
              <img src={img14} className="img-fluid" alt="Hero" style={{ float: "right", height: "300px", width: "600px" }} />
            </div></div>
        </section>

        {/* Statistics Section */}
        <section id="statistics" className="content-header">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-xs-6">
                <div className="small-box bg-aqua">
                  <div className="inner">
                    <h3>50</h3>
                    <p>Total Drives</p>
                  </div>
                  <div class="icon">
                    <i class="material-icons" style={{fontSize:"80px",marginTop:"25px"}}>article</i>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-xs-6">
                <div className="small-box bg-green">
                  <div className="inner">
                    <h3>120</h3>
                    <p>Job Offers</p>
                  </div>
                  <div class="icon">
                  <i class="material-icons" style={{fontSize:"80px",marginTop:"25px"}}>shopping_bag</i>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-xs-6">
                <div className="small-box bg-yellow">
                  <div className="inner">
                    <h3>80</h3>
                    <p>CV'S/Resume</p>
                  </div>
                  <div class="icon">
                  <i class="material-icons" style={{fontSize:"80px",marginTop:"25px"}}>description</i>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-xs-6">
                <div className="small-box bg-red">
                  <div className="inner">
                    <h3>200</h3>
                    <p>Daily Users</p>
                  </div>
                  <div class="icon">
                  <i class="material-icons" style={{fontSize:"80px",marginTop:"25px"}}>people</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ChatBot />
      <Footer />
    </div>
  );
};

export default Home;
