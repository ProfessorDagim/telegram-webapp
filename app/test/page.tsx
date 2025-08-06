"use client"

import { useState } from "react"
import { apiService } from "@/lib/api"
import { appSettings } from "@/lib/app-settings"

export default function TestPage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testHealth = async () => {
    setLoading(true)
    try {
      const health = await apiService.healthCheck()
      setResult(`Health check: ${health ? 'SUCCESS' : 'FAILED'}`)
    } catch (error) {
      setResult(`Health check error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testThreads = async () => {
    setLoading(true)
    try {
      const threads = await apiService.getUserThreads(1)
      setResult(`Threads test: ${JSON.stringify(threads, null, 2)}`)
    } catch (error) {
      setResult(`Threads error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testDirectFetch = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${appSettings.backendUrl}/threads/1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      })
      
      const text = await response.text()
      setResult(`Direct fetch: Status ${response.status}, Content-Type: ${response.headers.get('content-type')}\nResponse: ${text.substring(0, 500)}`)
    } catch (error) {
      setResult(`Direct fetch error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testHealth}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Test Health Check
        </button>
        
        <button 
          onClick={testThreads}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 ml-2"
        >
          Test Threads API
        </button>
        
        <button 
          onClick={testDirectFetch}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50 ml-2"
        >
          Test Direct Fetch
        </button>
      </div>
      
      {loading && <div className="text-blue-400">Loading...</div>}
      
      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Result:</h2>
        <pre className="text-sm whitespace-pre-wrap">{result || "No test run yet"}</pre>
      </div>
    </div>
  )
} 