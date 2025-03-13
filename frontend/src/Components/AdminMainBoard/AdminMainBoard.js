import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Spinner, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import ChatBot from "../ChatBot/ChatBot";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrendingUp, TrendingDown, Users, Briefcase, Award, HelpCircle } from "lucide-react";

const AdminMainBoard = () => {
  const [dashboardData, setDashboardData] = useState({
    students: 0,
    companies: 0,
    placedStudents: 0,
    other: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartView, setChartView] = useState("bar"); // "bar" or "pie"

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get token from session storage
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        // Configure axios with auth token
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        
        // Fetch dashboard statistics
        const response = await axios.get('/api/admin/dashboard-stats', config);
        
        // Update state with the fetched data
        setDashboardData({
          students: response.data.studentCount || 0,
          companies: response.data.companyCount || 0,
          placedStudents: response.data.placedStudentCount || 0,
          other: response.data.otherCount || 0
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardData = [
    { 
      title: "No. of Students", 
      count: dashboardData.students, 
      color: "primary",
      icon: <Users size={36} />,
      trend: 5.2,
      trendDirection: "up"
    },
    { 
      title: "No. of Companies", 
      count: dashboardData.companies, 
      color: "success",
      icon: <Briefcase size={36} />,
      trend: 3.7,
      trendDirection: "up" 
    },
    { 
      title: "Placed Students", 
      count: dashboardData.placedStudents, 
      color: "warning",
      icon: <Award size={36} />,
      trend: 8.1,
      trendDirection: "up" 
    },
    { 
      title: "Other", 
      count: dashboardData.other, 
      color: "danger",
      icon: <HelpCircle size={36} />,
      trend: 1.3,
      trendDirection: "down" 
    },
  ];

  // Prepare chart data - modified for bar chart visibility
  const barChartData = [
    { 
      name: "Students", 
      students: dashboardData.students, 
      companies: 0,
      placed: 0,
      other: 0
    },
    { 
      name: "Companies", 
      students: 0,
      companies: dashboardData.companies, 
      placed: 0,
      other: 0
    },
    { 
      name: "Placed", 
      students: 0,
      companies: 0,
      placed: dashboardData.placedStudents, 
      other: 0
    },
    { 
      name: "Other", 
      students: 0,
      companies: 0,
      placed: 0,
      other: dashboardData.other
    }
  ];

  // Prepare pie chart data
  const pieChartData = [
    { name: "Students", value: dashboardData.students, color: "#0d6efd" },
    { name: "Companies", value: dashboardData.companies, color: "#198754" },
    { name: "Placed", value: dashboardData.placedStudents, color: "#ffc107" },
    { name: "Other", value: dashboardData.other, color: "#dc3545" }
  ];

  const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545"];
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary" style={{ width: "4rem", height: "4rem" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <h4 className="mt-3 text-primary">Loading Dashboard Data...</h4>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-danger shadow-lg border-0"
          role="alert"
        >
          <h4 className="alert-heading">Error Loading Dashboard</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Please try refreshing the page or contact support if the issue persists.</p>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pb-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Admin Dashboard</h2>
          <div className="btn-group shadow-sm">
            <button 
              className={`btn ${chartView === 'bar' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setChartView('bar')}
            >
              Bar Chart
            </button>
            <button 
              className={`btn ${chartView === 'pie' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setChartView('pie')}
            >
              Pie Chart
            </button>
          </div>
        </div>
      </motion.div>

      <Row className="g-4 mb-5">
        {cardData.map((item, index) => (
          <Col key={index} md={6} lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="shadow-lg border-0 custom-card h-100">
                <Card.Body className="p-4">
                  <div className={`icon-circle bg-${item.color}-subtle float-end mb-2`}>
                    <div className={`text-${item.color}`}>
                      {item.icon}
                    </div>
                  </div>
                  <h5 className="fw-bold text-secondary">{item.title}</h5>
                  <h2 className={`fw-bold text-${item.color} mb-3`}>
                    {item.count.toLocaleString()}
                  </h2>
                  <div className="d-flex align-items-center">
                    <Badge bg={item.trendDirection === "up" ? "success" : "danger"} className="d-flex align-items-center p-2 me-2">
                      {item.trendDirection === "up" ? 
                        <TrendingUp size={14} className="me-1" /> : 
                        <TrendingDown size={14} className="me-1" />
                      }
                      {item.trend}%
                    </Badge>
                    <small className="text-muted">from last month</small>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="card shadow-lg border-0 mb-5"
      >
        <div className="card-body p-4">
          <h4 className="fw-bold mb-4">Data Visualization</h4>
          <ResponsiveContainer width="100%" height={350}>
            {chartView === 'bar' ? (
              <BarChart 
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => value.toLocaleString()}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="students" name="Students" fill="#0d6efd" />
                <Bar dataKey="companies" name="Companies" fill="#198754" />
                <Bar dataKey="placed" name="Placed Students" fill="#ffc107" />
                <Bar dataKey="other" name="Other" fill="#dc3545" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={800}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <ChatBot />
      </motion.div>

      {/* Enhanced CSS */}
      <style>
        {`
          .custom-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-radius: 12px;
            overflow: hidden;
          }
          
          .custom-card:hover {
            transform: translateY(-15px) scale(1.02);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15) !important;
          }
          
          .icon-circle {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          
          .custom-card:hover .icon-circle {
            transform: scale(1.1) rotate(10deg);
          }
          
          .bg-primary-subtle {
            background-color: rgba(13, 110, 253, 0.15);
          }
          
          .bg-success-subtle {
            background-color: rgba(25, 135, 84, 0.15);
          }
          
          .bg-warning-subtle {
            background-color: rgba(255, 193, 7, 0.15);
          }
          
          .bg-danger-subtle {
            background-color: rgba(220, 53, 69, 0.15);
          }
          
          /* Add a subtle pulse animation to the cards */
          @keyframes subtle-pulse {
            0% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
            50% { box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2); }
            100% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
          }
          
          .card {
            border-radius: 12px;
            animation: subtle-pulse 3s infinite ease-in-out;
          }
        `}
      </style>
    </Container>
  );
};

export default AdminMainBoard;