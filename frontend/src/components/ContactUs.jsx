import React, { useState } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', formData)
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: ['jbhagyasri31@gmail.com', 'harshikakankatala2@gmail.com', 'vinayakula345@gmail.com'],
      color: 'emerald'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91 9703614429', '+91 9703562284', '+91 9052323336'],
      color: 'blue'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: ['Narsapur, 534280', 'West Godavari, AP', 'India'],
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: ['Monday - Friday: 9am - 6pm', 'Saturday: 10am - 4pm', 'Sunday: Closed'],
      color: 'amber'
    }
  ]

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'sales', label: 'Sales & Partnership' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'press', label: 'Press & Media' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              We're here to help you with any questions about AgroLens. Reach out and 
              let's grow together.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className={`inline-flex items-center justify-center p-3 bg-${info.color}-100 rounded-full mb-4`}>
                    <info.icon className={`h-6 w-6 text-${info.color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* FAQ Preview */}
              <div className="bg-emerald-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-900 mb-4">Quick Help</h3>
                <div className="space-y-3">
                  {[
                    'How accurate are crop recommendations?',
                    'What satellite data do you use?',
                    'Can I try before subscribing?',
                    'How do I upload soil images?'
                  ].map((question, index) => (
                    <div key={index} className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-emerald-800">{question}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/faq"
                  className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View all FAQs →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-8">
                    Thank you for contacting us. We've received your message and will 
                    get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Bhagyasri"
                      />
                      {errors.name && (
                        <div className="flex items-center mt-2 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="jbhagyasri31@gmail.com"
                      />
                      {errors.email && (
                        <div className="flex items-center mt-2 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {inquiryTypes.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                            formData.inquiryType === type.value
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-300 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="inquiryType"
                            value={type.value}
                            checked={formData.inquiryType === type.value}
                            onChange={handleChange}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            {type.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                        errors.subject ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="How can we help you?"
                    />
                    {errors.subject && (
                      <div className="flex items-center mt-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.subject}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none ${
                        errors.message ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Tell us about your project or question..."
                    />
                    {errors.message && (
                      <div className="flex items-center mt-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.message}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        required
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="text-gray-700">
                        I agree to receive communications from AgroLens regarding my inquiry
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-3 px-8 rounded-lg border-2 border-emerald-600 transition duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map & Additional Info */}
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Visit Our Office</h3>
                <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.164181386337!2d81.6919049756418!3d17.409258202658712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37456e55b6196f%3A0x848789e8d37c33e6!2sSwarnandhra%20College%20Of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1706433334059!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SCET College Location"
                    className="rounded-lg"
                  ></iframe>
                </div>
                <p className="text-gray-300">
                  Schedule a visit to our headquarters to see our technology in action
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-900 mb-4">Response Time</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800">General Inquiries</span>
                    <span className="font-semibold text-emerald-900">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800">Technical Support</span>
                    <span className="font-semibold text-emerald-900">Within 2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800">Urgent Matters</span>
                    <span className="font-semibold text-emerald-900">Immediate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Contact