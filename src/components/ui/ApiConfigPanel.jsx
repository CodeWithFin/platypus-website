import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Cog6ToothIcon, 
  WifiIcon, 
  XMarkIcon,
  CloudIcon,
  CpuChipIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { APIConfig } from '../../services/apiService'
import toast from 'react-hot-toast'

const ApiConfigPanel = ({ isOpen, onClose }) => {
  const [useMockData, setUseMockData] = useState(APIConfig.useMockData)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [apiStatus, setApiStatus] = useState(null)
  const [isCheckingApi, setIsCheckingApi] = useState(false)

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  const checkApiStatus = async () => {
    setIsCheckingApi(true)
    try {
      const status = await APIConfig.getApiStatus()
      setApiStatus(status)
      
      if (status) {
        toast.success('API server is online and responding')
      } else {
        toast.error('API server is not responding')
      }
    } catch (error) {
      setApiStatus(false)
      toast.error('Failed to check API status')
    } finally {
      setIsCheckingApi(false)
    }
  }

  const toggleMockData = () => {
    const newValue = !useMockData
    setUseMockData(newValue)
    
    // Update environment variable (for development)
    localStorage.setItem('platypus-use-mock', newValue.toString())
    
    toast.success(`Switched to ${newValue ? 'Mock Data' : 'Real API'} mode. Refreshing...`, {
      duration: 2000
    })
    
    // Refresh the page to apply changes
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Connection Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Connection Status</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Internet Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <WifiIcon className={`h-6 w-6 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
                  <div>
                    <p className="font-medium text-gray-900">Internet</p>
                    <p className="text-sm text-gray-600">
                      {isOnline ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isOnline 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isOnline ? 'Online' : 'Offline'}
                </div>
              </div>

              {/* API Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CloudIcon className={`h-6 w-6 ${
                    apiStatus === null ? 'text-gray-400' : 
                    apiStatus ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">API Server</p>
                    <p className="text-sm text-gray-600">
                      {apiStatus === null ? 'Unknown' : 
                       apiStatus ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={checkApiStatus}
                  disabled={isCheckingApi}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                  {isCheckingApi ? 'Checking...' : 'Check'}
                </button>
              </div>
            </div>
          </div>

          {/* Data Source Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Data Source</h3>
            
            <div className="space-y-3">
              {/* Mock Data Option */}
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                useMockData 
                  ? 'border-yellow-500 bg-yellow-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => setUseMockData(true)}>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    useMockData 
                      ? 'border-yellow-500 bg-yellow-500' 
                      : 'border-gray-300'
                  }`}>
                    {useMockData && (
                      <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                    )}
                  </div>
                  <CpuChipIcon className="h-6 w-6 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Mock Data Mode</p>
                    <p className="text-sm text-gray-600">
                      Use simulated data for development and testing
                    </p>
                  </div>
                </div>
                {useMockData && (
                  <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <BoltIcon className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <p className="text-xs text-yellow-800">
                        Fast responses, works offline, perfect for development
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Real API Option */}
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                !useMockData 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => setUseMockData(false)}>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    !useMockData 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {!useMockData && (
                      <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                    )}
                  </div>
                  <CloudIcon className="h-6 w-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Real API Mode</p>
                    <p className="text-sm text-gray-600">
                      Connect to live backend server
                    </p>
                  </div>
                </div>
                {!useMockData && (
                  <div className="mt-3 p-3 bg-green-100 rounded-lg">
                    <div className="flex items-start space-x-2">
                      {apiStatus ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5" />
                      ) : (
                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 mt-0.5" />
                      )}
                      <p className="text-xs text-green-800">
                        {apiStatus ? 
                          'Real-time data, live transactions, production ready' :
                          'Ensure API server is running and accessible'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={toggleMockData}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-yellow-700 hover:to-orange-700 transition-all transform hover:scale-105"
            >
              Apply Changes & Restart
            </button>
          </div>

          {/* Environment Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Environment Info</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Current Mode: <span className="font-medium">{useMockData ? 'Mock Data' : 'Real API'}</span></p>
              <p>API URL: <span className="font-mono text-xs">{import.meta.env.VITE_API_URL || 'http://localhost:8000'}</span></p>
              <p>Version: <span className="font-medium">{import.meta.env.VITE_APP_VERSION || '1.0.0'}</span></p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ApiConfigPanel
