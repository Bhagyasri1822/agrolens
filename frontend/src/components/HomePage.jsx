import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { 
  Leaf, 
  CloudUpload, 
  BarChart3, 
  CheckCircle,
  Satellite,
  Droplets,
  Thermometer,
  Sparkles
} from 'lucide-react'

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-6">
              <Leaf className="h-12 w-12 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Agriculture with{' '}
              <span className="text-emerald-600">AgroLens</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              AI-powered crop recommendation platform that analyzes soil conditions, 
              climate data, and satellite imagery to optimize your farming decisions.
            </p>
            <button className="w-full bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-3 rounded-lg border-2 border-emerald-600 transition">
              Get Started →
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                <Satellite className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Satellite Analysis</h3>
              <p className="text-gray-600">Google Satellite API integration for comprehensive soil analysis</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                <CloudUpload className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Soil Image Upload</h3>
              <p className="text-gray-600">Upload soil images for instant AI-powered analysis</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                <Thermometer className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">pH & Nutrient Data</h3>
              <p className="text-gray-600">Multi-layer soil parameter analysis for accurate recommendations</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-amber-100 p-3 rounded-lg w-fit mb-4">
                <CheckCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Crop Suitability</h3>
              <p className="text-gray-600">Constraint-based recommendations for optimal crop selection</p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-emerald-900 rounded-2xl p-8 md:p-12 text-white mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-emerald-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Upload & Analyze</h3>
                <p className="text-emerald-200">Upload soil image or use satellite data for initial analysis</p>
              </div>
              
              <div className="text-center">
                <div className="bg-emerald-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Input Parameters</h3>
                <p className="text-emerald-200">Add pH values, nutrient levels, and other soil parameters</p>
              </div>
              
              <div className="text-center">
                <div className="bg-emerald-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Recommendations</h3>
                <p className="text-emerald-200">Receive AI-powered crop suitability analysis and insights</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-6">
              <Sparkles className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Optimize Your Farming?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers using AgroLens to make data-driven decisions 
              and maximize their crop yield.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-3 px-8 rounded-lg border-2 border-emerald-600 transition duration-300">
                Start Analysis
              </button>
              <button className="bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-3 px-8 rounded-lg border-2 border-emerald-600 transition duration-300">
                View Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage