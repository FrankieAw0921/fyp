import { Clock, Users, Hospital, ArrowRight, Activity, Calendar } from 'lucide-react';

export default function Footer() {
    return <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Hospital className="h-6 w-6" />
            <span className="text-xl font-bold">Queue Care</span>
          </div>
          <p className="text-gray-400">
            Making healthcare more accessible through smart queue management.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition">Features</a></li>
            <li><a href="#" className="hover:text-white transition">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition">Case Studies</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition">About</a></li>
            <li><a href="#" className="hover:text-white transition">Blog</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-400">
            <li>contact@queuecare.com</li>
            <li>+1 (555) 123-4567</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
}