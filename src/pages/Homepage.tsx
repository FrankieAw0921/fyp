import React from 'react';
import { Clock, Users, Hospital, ArrowRight, Activity, Calendar, BarChart as ChartBar, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import NavBar from './NavBar';
function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-blue-600 to-blue-800">
        <NavBar />

        <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in">
                Smart Queue Management for Modern Healthcare
              </h1>
              <p className="text-xl text-blue-100 animate-fade-in-delay">
                Streamline your patient flow and reduce waiting times with our intelligent queuing system.
              </p>
              <div className="flex space-x-4 animate-fade-in-delay-2">
                <Link to="/login" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/about" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80"
                alt="Hospital Reception"
                className="rounded-lg shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">Why Choose Queue Care?</h2>
          <div className="grid md:grid-cols-4 gap-12">
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-blue-600" />}
              title="Real-time Updates"
              description="Get accurate waiting times and queue positions updated in real-time."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-600" />}
              title="Patient Management"
              description="Efficiently manage patient flow and reduce waiting times"
            />
            <FeatureCard
              icon={<ChartBar className="h-8 w-8 text-blue-600" />}
              title="Analytics Dashboard"
              description="Make data-driven decisions with comprehensive queue analytics."
            />
            <FeatureCard
              icon={<Stethoscope className="h-8 w-8 text-blue-600" />}
              title="Department Integration"
              description="Seamless integration across all hospital departments"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Step number={1} title="Register on Arrival" />
              <Step number={2} title="Receive Queue Number" />
              <Step number={3} title="Monitor Status" />
              <Step number={4} title="Get Notified" />
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                alt="Doctor with patient"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-8 rounded-lg shadow-xl">
                <div className="text-4xl font-bold">95%</div>
                <div className="text-sm">Patient Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to Transform Your Queue Management?</h2>
          <Link to="/login" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      
    </div>
  );
}

function FeatureCard({ icon, title, description }: {icon: React.ReactNode, title: string, description: string}) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition group">
      <div className="mb-4 transform group-hover:scale-110 transition">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title }: {number: number, title: string}) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="text-xl font-semibold text-gray-800">{title}</div>
    </div>
  );
}

export default HomePage;