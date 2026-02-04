import React, { useState } from 'react'
import {
  Upload,
  Camera,
  MapPin,
  Leaf,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  Shield,
  Brain,
  BarChart3,
  Clock,
  Database,
  Globe,
  Image as ImageIcon,
  X
} from 'lucide-react'
import axios from 'axios'

function UploadPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [formData, setFormData] = useState({
    soil_image: '',
    lat: '',
    long: ''
  })
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [recommendationMode, setRecommendationMode] = useState('ai') // Default to AI mode

  const steps = [
    { id: 1, name: 'Select Mode', description: 'Choose analysis approach' },
    { id: 2, name: 'Upload Data', description: 'Add soil image & location' },
    { id: 3, name: 'Analysis', description: 'Get AI recommendations' }
  ]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setFormData(prev => ({
          ...prev,
          soil_image: base64String.split(',')[1] // Get only base64 data
        }))
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLocationChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude.toFixed(6),
            long: position.coords.longitude.toFixed(6)
          }))
          setLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setError('Failed to get current location. Please enter manually.')
          setLoading(false)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.soil_image) {
      setError('Please upload a soil image')
      return
    }

    setLoading(true)
    setError('')

    try {
      const username = localStorage.getItem('useremail')
      const password = localStorage.getItem('password')

      if (!username || !password) {
        setError('Please login first')
        setLoading(false)
        return
      }

      // Determine endpoint based on mode
      const endpoint = recommendationMode === 'ai' 
        ? 'http://localhost:8000/ask/ai'
        : 'http://localhost:8000/chat'

      const requestData = recommendationMode === 'ai'
        ? {
            soil_image: formData.soil_image,
            lat: formData.lat || null,
            long: formData.long || null
          }
        : {
            user_message: "Analyze this soil image" + (formData.lat ? ` from location: lat=${formData.lat}, long=${formData.long}` : ''),
            soil_image: formData.soil_image,
            lat: formData.lat || null,
            long: formData.long || null
          }

      const response = await axios.post(endpoint, {
        ...requestData,
        username,
        password
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        console.log(response.data)
        setResults({
          ...response.data,
          mode: recommendationMode,
          timestamp: new Date().toISOString()
        })
        setActiveStep(3)
      }

    } catch (error) {
      console.error('Error:', error)
      setError(error.response?.data?.detail || 'An error occurred during analysis')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      soil_image: '',
      lat: '',
      long: ''
    })
    setImagePreview('')
    setImageFile(null)
    setResults(null)
    setError('')
    setActiveStep(1)
  }

  const handleModeSelect = (mode) => {
    setRecommendationMode(mode)
    setActiveStep(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Soil Analysis AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-green-600">Dashboard</button>
              <button className="text-gray-600 hover:text-green-600">History</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  activeStep >= step.id 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {activeStep > step.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    activeStep >= step.id ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              
              {/* STEP 1: MODE SELECTION */}
              {activeStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Soil Analysis Mode</h2>
                    <p className="text-gray-600 mb-6">Choose how you want to analyze your soil</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* AI Soil Analysis */}
                    <div 
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        recommendationMode === 'ai' 
                          ? 'border-green-500 bg-green-50 shadow-lg' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => handleModeSelect('ai')}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="p-4 bg-green-100 rounded-full mb-4">
                          <Brain className="h-12 w-12 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">AI Soil Analysis</h3>
                        <p className="text-gray-600 mb-4">
                          Upload soil image for comprehensive AI analysis and recommendations.
                        </p>
                        <div className="w-full space-y-2">
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Detailed soil analysis</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Crop recommendations</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">With location context</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Chat */}
                    <div 
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        recommendationMode === 'chat' 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleModeSelect('chat')}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                          <BarChart3 className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">AI Chat Analysis</h3>
                        <p className="text-gray-600 mb-4">
                          Chat with AI about your soil image for expert advice and insights.
                        </p>
                        <div className="w-full space-y-2">
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm">Interactive chat</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm">Expert soil advice</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm">Context-aware responses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <p className="text-gray-600 mb-4">
                      {recommendationMode === 'ai' 
                        ? 'Selected: AI Soil Analysis (Comprehensive analysis with recommendations)' 
                        : recommendationMode === 'chat' 
                        ? 'Selected: AI Chat Analysis (Interactive expert advice)'
                        : 'Select a mode to continue'}
                    </p>
                    {recommendationMode && (
                      <button
                        onClick={() => setActiveStep(2)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center"
                      >
                        Continue to Upload Data
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: UPLOAD DATA */}
              {activeStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Soil Data</h2>
                    <p className="text-gray-600 mb-2">
                      {recommendationMode === 'ai' ? 'AI Soil Analysis' : 'AI Chat Analysis'}
                    </p>
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        recommendationMode === 'ai'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {recommendationMode === 'ai' ? 'Comprehensive Analysis' : 'Expert Chat'}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Image Upload Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Camera className="h-5 w-5 mr-2 text-green-600" />
                        Soil Image Upload
                        <span className="text-red-500 ml-1">*</span>
                      </h3>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-500 transition">
                        <div className="text-center">
                          <div className="p-3 bg-green-100 rounded-full inline-flex mb-4">
                            <ImageIcon className="h-10 w-10 text-green-600" />
                          </div>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 mb-2">
                            Drag & drop or click to upload soil image
                          </p>
                          <p className="text-xs text-gray-500 mb-4">
                            JPG, PNG up to 10MB
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            required
                          />
                          <label
                            htmlFor="image-upload"
                            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg cursor-pointer"
                          >
                            Browse Files
                          </label>
                        </div>
                      </div>
                      
                      {imagePreview && (
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Image</h4>
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Uploaded soil"
                              className="w-full h-64 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview('')
                                setImageFile(null)
                                setFormData(prev => ({ ...prev, soil_image: '' }))
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Location Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                        Location Data (Optional)
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-gray-400" />
                              Latitude
                            </div>
                          </label>
                          <input
                            type="number"
                            name="lat"
                            value={formData.lat}
                            onChange={handleLocationChange}
                            step="0.000001"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="e.g., 28.6139"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-gray-400" />
                              Longitude
                            </div>
                          </label>
                          <input
                            type="number"
                            name="long"
                            value={formData.long}
                            onChange={handleLocationChange}
                            step="0.000001"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="e.g., 77.2090"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleGetCurrentLocation}
                          disabled={loading}
                          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          {loading ? 'Getting Location...' : 'Use Current Location'}
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          Location data helps provide more accurate regional recommendations
                        </p>
                      </div>
                    </div>

                    {/* Mode Info */}
                    <div className={`rounded-lg p-4 mb-6 ${
                      recommendationMode === 'ai'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium mb-1">
                            {recommendationMode === 'ai' ? 'AI Soil Analysis' : 'AI Chat Analysis'}
                          </p>
                          <p className="text-sm opacity-90">
                            {recommendationMode === 'ai'
                              ? 'Comprehensive soil analysis with crop recommendations based on your soil image and location.'
                              : 'Interactive chat with AI expert about your soil conditions and get personalized advice.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-red-700">{error}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Back to Mode Selection
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !formData.soil_image}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            {recommendationMode === 'ai' ? 'Analyze Soil' : 'Start AI Chat'}
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: RESULTS */}
              {activeStep === 3 && results && (
                <div className="space-y-8">
                  {/* Results Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                      <div className="flex items-center mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          results.mode === 'ai'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {results.mode === 'ai' ? 'AI Soil Analysis' : 'AI Chat Analysis'}
                        </span>
                        <span className="ml-3 text-sm text-gray-500">
                          {new Date(results.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      New Analysis
                    </button>
                  </div>

                  {/* Results Content */}
                  <div className="space-y-6">
                    {/* AI Response */}
                    {results.ai_response && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-green-600" />
                          AI Analysis
                        </h3>
                        <div className="prose prose-sm max-w-none">
                          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-lg">
                            {results.ai_response}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {/* {results.recommendations && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Leaf className="h-5 w-5 mr-2 text-green-600" />
                          Recommendations
                        </h3>
                        <div className="space-y-3">
                          {Array.isArray(results.recommendations) ? (
                            results.recommendations.suitable_crops.map((rec, idx) => (
                              <div key={idx} className="bg-white p-3 rounded-lg">
                                <p className="text-gray-700">{rec}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-700">Error to iterate the list</p>
                          )}
                        </div>
                      </div>
                    )} */}

                    {/* Analysis Details */}
                    {results.analysis && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                          Analysis Details
                        </h3>
                        

                         <div className="grid md:grid-cols-2 gap-4">
                       
                              <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 capitalize">1. Colour Profile</p>
                              <p className="text-gray-600">{results.analysis.image_analysis.color_profile}</p>
                            </div>
                      
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                       
                              <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 capitalize">2. Moisture Level</p>
                              <p className="text-gray-600">{results.analysis.image_analysis.moisture_level}</p>
                            </div>
                      
                        </div>
                        
                      </div>
                    )}

                    {/* Uploaded Data Summary */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Data</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                            <ImageIcon className="h-4 w-4 mr-2 text-green-600" />
                            Soil Image
                          </h5>
                          <p className="text-sm text-gray-600">
                            {imageFile ? imageFile.name : 'Image uploaded'}
                          </p>
                        </div>

                        {formData.lat && formData.long && (
                          <>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                                Location
                              </h5>
                              <div className="text-sm text-gray-600">
                                <p>Lat: {formData.lat}</p>
                                <p>Long: {formData.long}</p>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                            <Database className="h-4 w-4 mr-2 text-purple-600" />
                            Analysis ID
                          </h5>
                          <p className="text-sm text-gray-600">
                            {results.user_id?.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Info & Preview */}
          <div className="space-y-6">
            {/* Current Step Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {activeStep === 1 && 'Select Mode'}
                {activeStep === 2 && 'Upload Data'}
                {activeStep === 3 && 'Results'}
              </h3>
              <div className="space-y-4">
                {/* Mode Info */}
                {recommendationMode && (
                  <div className={`p-3 rounded-lg ${
                    recommendationMode === 'ai' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-center">
                      {recommendationMode === 'ai' ? (
                        <Brain className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                      )}
                      <div>
                        <p className="font-medium">
                          {recommendationMode === 'ai' ? 'AI Soil Analysis' : 'AI Chat Analysis'}
                        </p>
                        <p className="text-xs mt-1">
                          {recommendationMode === 'ai' 
                            ? 'Comprehensive soil analysis'
                            : 'Interactive expert chat'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div>
                    <div className="text-gray-600 mb-2">Soil Image</div>
                    <img
                      src={imagePreview}
                      alt="Soil preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Location Preview */}
                {(formData.lat || formData.long) && (
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Location</div>
                    <div className="space-y-1">
                      {formData.lat && (
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">Latitude</span>
                          <span className="font-medium">{formData.lat}</span>
                        </div>
                      )}
                      {formData.long && (
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">Longitude</span>
                          <span className="font-medium">{formData.long}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Results Summary */}
                {activeStep === 3 && results && (
                  <div className="pt-2">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Analysis Summary</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Mode</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          results.mode === 'ai'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {results.mode === 'ai' ? 'Soil Analysis' : 'Chat'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium text-green-600">Completed</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium">{results.processing_time || 'N/A'}s</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                {activeStep === 1 && 'Mode Selection Tips'}
                {activeStep === 2 && 'Upload Tips'}
                {activeStep === 3 && 'Result Tips'}
              </h3>
              <ul className="space-y-2">
                {activeStep === 1 && (
                  <>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 text-sm">AI Soil Analysis: For comprehensive soil analysis and recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 text-sm">AI Chat: For interactive discussions with soil experts</span>
                    </li>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 text-sm">Upload clear, well-lit soil images for best results</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 text-sm">Location data improves regional recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 text-sm">Image upload is mandatory for analysis</span>
                    </li>
                  </>
                )}
                {activeStep === 3 && (
                  <>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 text-sm">Save results for future reference</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 text-sm">Try different modes for varied insights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-800 text-sm">Check history for previous analyses</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Next Steps */}
            {activeStep < 3 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h3>
                <div className="space-y-3">
                  {steps.slice(activeStep).map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{step.name}</p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default UploadPage