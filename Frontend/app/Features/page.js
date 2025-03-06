"use client"

import React from 'react'
import { motion } from 'framer-motion'

const Features = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Advanced Medical AI Features
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10">
              Discover how our AI-powered platform is transforming healthcare delivery and patient outcomes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded-full mb-6">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Diagnostic Assistance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes patient symptoms, medical history, and test results to suggest potential diagnoses with up to 93% accuracy, helping physicians make informed decisions.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 flex items-center justify-center rounded-full mb-6">
                <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Medical Imaging Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Instantly analyze X-rays, MRIs, and CT scans to detect anomalies that might be missed by the human eye, providing faster and more reliable diagnostic support.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center rounded-full mb-6">
                <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Personalized Treatment Plans</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate customized treatment recommendations based on patient data, medical history, genetic information, and the latest clinical research.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center rounded-full mb-6">
                <svg className="w-7 h-7 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Real-time Patient Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor patient vitals and health metrics in real-time, with intelligent alerts for concerning changes or potential complications.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 flex items-center justify-center rounded-full mb-6">
                <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Automated Documentation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Reduce administrative burden with AI that transcribes and summarizes patient encounters, automatically generating clinical notes and documentation.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center rounded-full mb-6">
                <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Research Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stay up-to-date with the latest medical research relevant to your patients, with AI that continuously scans and summarizes new studies and clinical trials.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">Trusted by Healthcare Professionals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-200">JD</div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Dr. Sahil Tiwari</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cardiologist</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The diagnostic assistance feature has significantly improved my ability to identify rare cardiac conditions. It's like having a second expert opinion available 24/7."
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-xl font-bold text-green-600 dark:text-green-200">SL</div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Dr.Preet Panchal</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Radiologist</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The medical imaging analysis has become an indispensable tool in my practice. It catches subtle abnormalities that even experienced radiologists might miss."
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-xl font-bold text-purple-600 dark:text-purple-200">MP</div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Dr.Soumya Ranjan Parida</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Oncologist</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The personalized treatment planning feature has revolutionized how I develop care plans for cancer patients. It's helping us move toward truly individualized medicine."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl overflow-hidden shadow-xl"
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-12 md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your medical practice?</h2>
                <p className="text-xl text-blue-100 mb-8">
                  Join thousands of healthcare providers already using our AI platform to improve patient outcomes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition duration-300">
                    Request Demo
                  </button>
                  <button className="bg-transparent text-white border-2 border-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg transition duration-300">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="md:w-1/3 p-12">
                <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
                  <h3 className="text-white text-xl font-bold mb-4">Get Started Today</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-blue-100">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Free 14-day trial
                    </li>
                    <li className="flex items-center text-blue-100">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      No credit card required
                    </li>
                    <li className="flex items-center text-blue-100">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Full feature access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Features