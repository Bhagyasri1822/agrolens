import React, { useState } from 'react'
import { 
  Upload, 
  Image as ImageIcon, 
  Satellite, 
  Thermometer, 
  Droplets, 
  Leaf,
  X,
  Cloud,
  BarChart3,
  ChevronRight,
  CheckCircle,
  Globe,
  CloudRain,
  Calendar,
  Droplet,
  Map,
  DollarSign
} from 'lucide-react'
import { Link } from 'react-router-dom'

function UploadPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [useSatellite, setUseSatellite] = useState(false)
  
  // Updated state with new constraint categories
  const [soilConstraints, setSoilConstraints] = useState({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    soilType: ''
  })
  
  const [climateConstraints, setClimateConstraints] = useState({
    temperatureRange: '',
    rainfall: '',
    season: ''
  })
  
  const [farmerConstraints, setFarmerConstraints] = useState({
    irrigationType: '',
    landSize: '',
    budgetLevel: ''
  })

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedImage(URL.createObjectURL(file))
    }
  }

  const handleSoilConstraintChange = (e) => {
    setSoilConstraints({
      ...soilConstraints,
      [e.target.name]: e.target.value
    })
  }

  const handleClimateConstraintChange = (e) => {
    setClimateConstraints({
      ...climateConstraints,
      [e.target.name]: e.target.value
    })
  }

  const handleFarmerConstraintChange = (e) => {
    setFarmerConstraints({
      ...farmerConstraints,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Upload data:', { 
      uploadedImage, 
      soilConstraints, 
      climateConstraints, 
      farmerConstraints, 
      useSatellite 
    })
    // Handle upload and analysis logic here
  }

  const steps = [
    { id: 1, name: 'Upload Method', description: 'Choose how to analyze soil' },
    { id: 2, name: 'Enter Constraints', description: 'Add soil, climate & field details' },
    { id: 3, name: 'Analysis', description: 'Get crop recommendations' }
  ]

  const soilTypes = ['Sandy', 'Loamy', 'Clay', 'Silty', 'Peaty', 'Chalky']
  const seasons = ['Kharif', 'Rabi', 'Zaid', 'All Season']
  const irrigationTypes = ['Rainfed', 'Irrigated', 'Drip', 'Sprinkler', 'Flood']
  const budgetLevels = ['Low', 'Medium', 'High']

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AgroLens</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-emerald-600">Dashboard</Link>
              <button className="text-gray-600 hover:text-emerald-600 bg-transparent p-0">
                My Analyses
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            {steps.map((step, index) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  activeStep >= step.id 
                    ? 'bg-emerald-600 border-emerald-600 text-white' 
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
                    activeStep >= step.id ? 'text-emerald-600' : 'text-gray-500'
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
          {/* Left Panel - Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Crop Recommendation Analysis</h2>
              
              {activeStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Analysis Method</h3>
                    <p className="text-gray-600 mb-6">Select how you want to analyze your soil</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Image Upload Card */}
                      <div 
                        className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                          !useSatellite 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => setUseSatellite(false)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="p-3 bg-blue-100 rounded-full mb-4">
                            <ImageIcon className="h-10 w-10 text-blue-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Soil Image</h4>
                          <p className="text-gray-600 mb-4">Upload a clear picture of your soil sample</p>
                          
                          {!useSatellite && (
                            <div className="w-full">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition">
                                <div className="text-center">
                                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                  <p className="text-sm text-gray-600 mb-2">
                                    Drag & drop or click to upload
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
                                  />
                                  <label
                                    htmlFor="image-upload"
                                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg cursor-pointer"
                                  >
                                    Browse Files
                                  </label>
                                </div>
                              </div>
                              
                              {uploadedImage && (
                                <div className="mt-4 relative">
                                  <img
                                    src={uploadedImage}
                                    alt="Uploaded soil"
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setUploadedImage(null)
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Satellite Analysis Card */}
                      <div 
                        className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                          useSatellite 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => setUseSatellite(true)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="p-3 bg-purple-100 rounded-full mb-4">
                            <Satellite className="h-10 w-10 text-purple-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Satellite Analysis</h4>
                          <p className="text-gray-600 mb-4">Use Google Satellite API for comprehensive analysis</p>
                          <div className="p-4 bg-gray-50 rounded-lg w-full">
                            <div className="flex items-center justify-center space-x-2 text-gray-600">
                              <Cloud className="h-5 w-5" />
                              <span className="text-sm">Powered by Google Earth Engine</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-3 px-8 rounded-lg border-2 border-emerald-600 transition duration-300"
                      disabled={!uploadedImage && !useSatellite}
                    >
                      Continue
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-8">
                  {/* Soil Constraints Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-emerald-600" />
                      Soil Constraints
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { name: 'ph', label: 'pH Level', icon: Thermometer, min: 0, max: 14, step: 0.1 },
                        { name: 'nitrogen', label: 'Nitrogen (N)', icon: Droplets, unit: 'mg/kg' },
                        { name: 'phosphorus', label: 'Phosphorus (P)', icon: Droplets, unit: 'mg/kg' },
                        { name: 'potassium', label: 'Potassium (K)', icon: Droplets, unit: 'mg/kg' },
                      ].map((param) => (
                        <div key={param.name}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                              <param.icon className="h-4 w-4 mr-2 text-gray-400" />
                              {param.label}
                            </div>
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              name={param.name}
                              value={soilConstraints[param.name]}
                              onChange={handleSoilConstraintChange}
                              min={param.min}
                              max={param.max}
                              step={param.step || 1}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                              placeholder={`Enter ${param.label.toLowerCase()}`}
                            />
                            {param.unit && (
                              <span className="ml-3 text-gray-500 whitespace-nowrap">{param.unit}</span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Soil Type Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Map className="h-4 w-4 mr-2 text-gray-400" />
                            Soil Type
                          </div>
                        </label>
                        <select
                          name="soilType"
                          value={soilConstraints.soilType}
                          onChange={handleSoilConstraintChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        >
                          <option value="">Select soil type</option>
                          {soilTypes.map((type) => (
                            <option key={type} value={type.toLowerCase()}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Climate Constraints Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-blue-600" />
                      Climate Constraints
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Thermometer className="h-4 w-4 mr-2 text-gray-400" />
                            Temperature Range (°C)
                          </div>
                        </label>
                        <input
                          type="text"
                          name="temperatureRange"
                          value={climateConstraints.temperatureRange}
                          onChange={handleClimateConstraintChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          placeholder="e.g., 20-30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <CloudRain className="h-4 w-4 mr-2 text-gray-400" />
                            Rainfall/Water Availability (mm)
                          </div>
                        </label>
                        <input
                          type="number"
                          name="rainfall"
                          value={climateConstraints.rainfall}
                          onChange={handleClimateConstraintChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          placeholder="Enter annual rainfall"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            Season
                          </div>
                        </label>
                        <select
                          name="season"
                          value={climateConstraints.season}
                          onChange={handleClimateConstraintChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        >
                          <option value="">Select season</option>
                          {seasons.map((season) => (
                            <option key={season} value={season.toLowerCase()}>
                              {season}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Farmer/Field Constraints Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Map className="h-5 w-5 mr-2 text-purple-600" />
                      Farmer/Field Constraints
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Droplet className="h-4 w-4 mr-2 text-gray-400" />
                            Irrigation Type
                          </div>
                        </label>
                        <select
                          name="irrigationType"
                          value={farmerConstraints.irrigationType}
                          onChange={handleFarmerConstraintChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        >
                          <option value="">Select irrigation type</option>
                          {irrigationTypes.map((type) => (
                            <option key={type} value={type.toLowerCase()}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Map className="h-4 w-4 mr-2 text-gray-400" />
                            Land Size (acres)
                          </div>
                        </label>
                        <input
                          type="number"
                          name="landSize"
                          value={farmerConstraints.landSize}
                          onChange={handleFarmerConstraintChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          placeholder="Enter land size"
                          min="0"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                            Budget Level
                          </div>
                        </label>
                        <select
                          name="budgetLevel"
                          value={farmerConstraints.budgetLevel}
                          onChange={handleFarmerConstraintChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        >
                          <option value="">Select budget level</option>
                          {budgetLevels.map((level) => (
                            <option key={level} value={level.toLowerCase()}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setActiveStep(3)}
                      className="w-full bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-3 rounded-lg border-2 border-emerald-600 transition"
                    >
                      Analyze & Get Recommendations
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-6">
                    <BarChart3 className="h-16 w-16 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Analysis in Progress</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We're analyzing your constraints data and generating crop recommendations. This may take a few moments.
                  </p>
                  
                  {/* Loading Animation */}
                  <div className="w-full max-w-md mx-auto mb-8">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {['Processing Soil Constraints', 'Analyzing Climate Data', 'Generating Recommendations'].map((step, index) => (
                      <div key={step} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-gray-700">{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-3 rounded-lg border-2 border-emerald-600 transition"
                  >
                    View Complete Analysis
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Info & Preview */}
          <div className="space-y-6">
            {/* Current Analysis Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Preview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium">
                    {useSatellite ? 'Satellite API' : 'Image Upload'}
                  </span>
                </div>
                {uploadedImage && !useSatellite && (
                  <div>
                    <div className="text-gray-600 mb-2">Uploaded Image</div>
                    <img
                      src={uploadedImage}
                      alt="Soil preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Soil Constraints Preview */}
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Soil Constraints</h4>
                  {Object.entries(soilConstraints).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-1">
                        <span className="text-gray-600 capitalize">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    )
                  ))}
                </div>

                {/* Climate Constraints Preview */}
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Climate Constraints</h4>
                  {Object.entries(climateConstraints).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-1">
                        <span className="text-gray-600 capitalize">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    )
                  ))}
                </div>

                {/* Farmer Constraints Preview */}
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Farmer Constraints</h4>
                  {Object.entries(farmerConstraints).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-1">
                        <span className="text-gray-600 capitalize">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-emerald-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-3">Tips for Better Results</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-800 text-sm">Provide accurate soil pH and nutrient values</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-800 text-sm">Select the correct soil type for your region</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-800 text-sm">Enter realistic budget and land size for accurate recommendations</span>
                </li>
              </ul>
            </div>

            {/* Recent Analyses */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
              <div className="space-y-3">
                {[
                  { date: 'Today', crop: 'Wheat', suitability: 'High', constraints: 'Loamy, Rabi' },
                  { date: 'Yesterday', crop: 'Corn', suitability: 'Medium', constraints: 'Sandy, Kharif' },
                  { date: '2 days ago', crop: 'Soybean', suitability: 'Low', constraints: 'Clay, Zaid' }
                ].map((analysis, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-gray-900">{analysis.crop}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        analysis.suitability === 'High' 
                          ? 'bg-green-100 text-green-800' 
                          : analysis.suitability === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {analysis.suitability}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-1">{analysis.date}</div>
                    <div className="text-xs text-gray-600">Constraints: {analysis.constraints}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UploadPage