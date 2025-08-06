"use client"

import { useState } from "react"
import { appSettings } from "@/lib/app-settings"

export default function DebugPage() {
  const [backendUrl, setBackendUrl] = useState(appSettings.backendUrl)
  const [testResult, setTestResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testBackend = async () => {
    setLoading(true)
    setTestResult("Testing...")
    
    try {
      // Test health endpoint
      const healthResponse = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!healthResponse.ok) {
        setTestResult(`❌ Health check failed: ${healthResponse.status}`)
        return
      }
      
      const healthData = await healthResponse.json()
      setTestResult(`✅ Health check passed: ${JSON.stringify(healthData)}`)
      
      // Test threads endpoint
      const threadsResponse = await fetch(`${backendUrl}/threads/1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!threadsResponse.ok) {
        setTestResult(prev => prev + `\n❌ Threads check failed: ${threadsResponse.status}`)
        return
      }
      
      const threadsData = await threadsResponse.json()
      setTestResult(prev => prev + `\n✅ Threads check passed: Found ${threadsData.threads?.length || 0} threads`)
      
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = () => {
    // This will show you what to update in the config file
    setTestResult(`📝 Update this URL in telegram-webapp/lib/app-settings.ts:\n\nbackendUrl: "${backendUrl}"`)
  }

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Backend URL Debug</h1>
      
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
          <li>1. Get your current ngrok URL (run ngrok in your backend directory)</li>
          <li>2. Enter the URL above and click "Test Backend"</li>
          <li>3. If it works, click "Show Config Update"</li>
          <li>4. Update the URL in telegram-webapp/lib/app-settings.ts</li>
          <li>5. Restart the frontend development server</li>
        </ol>
      </div>
    </div>
  )
} 