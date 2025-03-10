"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, HelpCircle } from 'lucide-react'

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10">
              Choose the right plan for your medical practice and enhance patient care with AI
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className={`mr-3 text-base ${billingPeriod === 'monthly' ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Monthly
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={billingPeriod === 'annual'}
                  onChange={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              <span className={`ml-3 text-base ${billingPeriod === 'annual' ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Annual <span className="text-green-500 text-sm font-medium">Save 20%</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">₹{billingPeriod === 'monthly' ? '199' : '159'}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">per month</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {billingPeriod === 'annual' && <span className="text-green-500 block mb-1">Billed annually (₹{150 * 12})</span>}
                  Perfect for small medical practices just getting started with AI
                </p>
                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300">
                  Get Started
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-8">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Includes:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Basic diagnostic assistance</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Up to 100 patient scans per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Basic medical imaging analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Standard documentation support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Email support</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Professional Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-blue-500 dark:border-blue-400 overflow-hidden transform md:scale-105 z-10"
            >
              <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                MOST POPULAR
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Professional</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">₹{billingPeriod === 'monthly' ? '399' : '319'}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">per month</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {billingPeriod === 'annual' && <span className="text-green-500 block mb-1">Billed annually (₹{319 * 12})</span>}
                  Ideal for medium-sized practices with growing patient needs
                </p>
                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300">
                  Get Started
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-8">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Everything in Basic, plus:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Advanced diagnostic assistance</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Up to 500 patient scans per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Advanced medical imaging analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Personalized treatment recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Priority email & phone support</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Enterprise Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Enterprise</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">₹{billingPeriod === 'monthly' ? '799' : '639'}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">per month</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {billingPeriod === 'annual' && <span className="text-green-500 block mb-1">Billed annually (₹{639 * 12})</span>}
                  For hospitals and large medical networks with complex needs
                </p>
                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300">
                  Contact Sales
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-8">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Everything in Professional, plus:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Unlimited patient scans</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Custom AI model training</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Advanced analytics dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">API access for system integration</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">24/7 dedicated support & account manager</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">Compare Plans</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Feature</th>
                    <th className="px-6 py-4 font-semibold text-center">Basic</th>
                    <th className="px-6 py-4 font-semibold text-center">Professional</th>
                    <th className="px-6 py-4 font-semibold text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium">Diagnostic Assistance</td>
                    <td className="px-6 py-4 text-center">Basic</td>
                    <td className="px-6 py-4 text-center">Advanced</td>
                    <td className="px-6 py-4 text-center">Enterprise-grade</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium">Patient Scans per Month</td>
                    <td className="px-6 py-4 text-center">100</td>
                    <td className="px-6 py-4 text-center">500</td>
                    <td className="px-6 py-4 text-center">Unlimited</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium">Imaging Analysis</td>
                    <td className="px-6 py-4 text-center">Basic</td>
                    <td className="px-6 py-4 text-center">Advanced</td>
                    <td className="px-6 py-4 text-center">Comprehensive</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium">Treatment Recommendations</td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium">Custom AI Training</td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-4 font-medium">Support</td>
                    <td className="px-6 py-4 text-center">Email</td>
                    <td className="px-6 py-4 text-center">Email & Phone</td>
                    <td className="px-6 py-4 text-center">24/7 Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              {
                question: "How does the billing cycle work?",
                answer: "Your subscription begins the day you sign up and will renew automatically either monthly or annually, depending on the plan you choose. You can cancel or change your subscription at any time."
              },
              {
                question: "Can I upgrade or downgrade my plan later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference for the remainder of your billing cycle. When downgrading, the new rate will apply at the start of your next billing cycle."
              },
              {
                question: "Is there a setup fee?",
                answer: "No, there are no setup fees for any of our plans. You only pay the advertised subscription price."
              },
              {
                question: "Do you offer a free trial?",
                answer: "Yes, we offer a 14-day free trial on all our plans. No credit card required to start your trial."
              },
              {
                question: "How secure is my patient data?",
                answer: "We take data security very seriously. All data is encrypted both in transit and at rest, and our platform is HIPAA compliant. We never use patient data for training our models without explicit consent."
              },
              {
                question: "What kind of support is available?",
                answer: "Support varies by plan. Basic includes email support during business hours. Professional adds phone support. Enterprise includes 24/7 dedicated support with a personal account manager."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-4 focus:outline-none"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to enhance your medical practice?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10">
              Start your 14-day free trial today and experience the benefits of our AI medical assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300">
                Get Started
              </button>
              <button className="bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20 font-medium py-3 px-8 rounded-lg transition duration-300">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Pricing