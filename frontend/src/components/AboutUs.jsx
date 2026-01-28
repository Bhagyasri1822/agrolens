import React from 'react'
import { 
  Leaf, 
  Target, 
  BarChart3, 
  Globe, 
  Shield,
  Heart
} from 'lucide-react'
import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 to-green-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Leaf className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Transforming Agriculture with AI</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            AgroLens combines satellite imagery, AI analysis, and soil science to provide 
            data-driven crop recommendations for sustainable farming.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-6">
                <Target className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                To democratize access to advanced agricultural technology, enabling farmers 
                worldwide to make informed decisions that increase yield, reduce costs, and 
                promote sustainable farming practices.
              </p>
              <p className="text-gray-600">
                We believe that every farmer, regardless of scale, should have access to 
                cutting-edge agricultural insights.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-6">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 mb-4">
                To create a global network of data-driven farms that optimize resource usage, 
                minimize environmental impact, and ensure food security for future generations.
              </p>
              <p className="text-gray-600">
                We envision a world where technology and traditional farming wisdom work 
                together to create sustainable agricultural ecosystems.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Technology</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Leveraging cutting-edge technologies to provide accurate agricultural insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'AI & Machine Learning',
                description: 'Advanced algorithms analyze soil characteristics and predict optimal crops',
                color: 'blue'
              },
              {
                icon: Globe,
                title: 'Satellite Imagery',
                description: 'Google Earth Engine integration for comprehensive land analysis',
                color: 'purple'
              },
              {
                icon: Shield,
                title: 'Data Security',
                description: 'Enterprise-grade security protecting your agricultural data',
                color: 'amber'
              }
            ].map((tech, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`p-3 bg-${tech.color}-100 rounded-full w-fit mb-4`}>
                  <tech.icon className={`h-8 w-8 text-${tech.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{tech.title}</h3>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-6">
            <Heart className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Mission</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Be part of the agricultural revolution. Whether you're a small-scale farmer or 
            an agricultural enterprise, AgroLens has the tools to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Start Free Analysis
            </Link>
            <Link
              to="/contact"
              className="bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-3 px-8 rounded-lg border-2 border-emerald-600 transition duration-300"
            >
              Contact Our Team
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default About