"use client"

import { useState } from "react"

export default function BackendTestPage() {
  const [backendUrl, setBackendUrl] = useState("")
  const [testResult, setTestResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testBackend = async () => {
    if (!backendUrl.trim()) {
      setTestResult("Please enter a backend URL")
      return
    }

    setLoading(true)
    setTestResult("Testing...")

    try {
      // Test health endpoint
      const healthResponse = await fetch(`${backendUrl}/health`)
      const healthText = await healthResponse.text()
      
      let result = `Health Check (${healthResponse.status}): ${healthText}\n\n`
      
      // Test threads endpoint
      const threadsResponse = await fetch(`${backendUrl}/threads/1`)
      const threadsText = await threadsResponse.text()
      
      result += `Threads Check (${threadsResponse.status}): ${threadsText.substring(0, 200)}...`
      
      setTestResult(result)
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = () => {
    if (!backendUrl.trim()) {
      setTestResult("Please enter a backend URL first")
      return
    }
    
    setTestResult(`📝 To update the backend URL, edit this file:\n\ntelegram-webapp/lib/app-settings.ts\n\nChange this line:\nbackendUrl: "${backendUrl}"`)
  }

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Backend URL Test</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Backend URL:</label>
          <input
            type="text"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="https://your-ngrok-url.ngrok-free.app"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={testBackend}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Backend"}
          </button>
          
          <button
            onClick={updateConfig}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Show Config Update
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Test Result:</h2>
        <pre className="text-sm whitespace-pre-wrap">{testResult || "No test run yet"}</pre>
      </div>
      
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded">
        <h3 className="text-md font-semibold mb-2">Instructions:</h3>
        <ol className="text-sm space-y-1">
          <li>1. Start your backend server (python bot.py or docker-compose up)</li>
          <li>2. Start ngrok: ngrok http 8000</li>
          <li>3. Copy the HTTPS URL from ngrok</li>
          <li>4. Paste it above and click "Test Backend"</li>
          <li>5. If it works, click "Show Config Update"</li>
          <li>6. Update the URL in telegram-webapp/lib/app-settings.ts</li>
        </ol>
      </div>
    </div>
  )
} 