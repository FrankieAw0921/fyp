import React from 'react';
import { Clock, Users, BarChart as ChartBar, Stethoscope } from 'lucide-react';
import NavBar from './NavBar';
import Footer from './Footer';

function About() {
  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Queue Updates",
      description: "Get accurate waiting times and queue positions updated in real-time"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Patient Management",
      description: "Efficiently manage patient flow and reduce waiting times"
    },
    {
      icon: <ChartBar className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics to optimize hospital operations"
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Department Integration",
      description: "Seamless integration across all hospital departments"
    }
  ];

  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      image: ""
    },
    {
      name: "Dr. Aarav Mehta",
      role: "Head of Emergency Medicine",
      image: ""
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Director of Patient Care",
      image: ""
    },
    {
      name: "Dr. Vincent Yeap",
      role: "Specialist in Cardiology",
      image: ""
    },
    {
      name: "Dr.  James Anderson",
      role: "Specialist in Orthopedics",
      image: ""
    },
    {
      name: "Dr. Faris Rahman",
      role: "Director of Pediatrics",
      image: ""
    },
    {
      name: "Dr. Mei Ling Tan",
      role: "Head of General Practice",
      image: ""
    },
    {
      name: "Dr. Sayaka Makoto",
      role: "Head of Pharmacist",
      image: ""
    },
    {
      name: "Dr. Daniel Wong",
      role: "Head of Medical Intern",
      image: ""
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="relative bg-gradient-to-r from-blue-600 to-blue-800">
        <NavBar />
      </header>
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About QueueCare</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            QueueCare is revolutionizing hospital queue management through smart technology,
            ensuring efficient patient flow and reduced waiting times. As for right now, we only launch this web services on hospital located at 123 Healthcare Avenue, Medical District, NY 10001

          </p>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Medical Leadership</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img/>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}



export default About;