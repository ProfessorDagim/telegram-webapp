"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, ArrowLeft, Loader2, Menu, Wifi, WifiOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { appSettings } from "@/lib/app-settings"
import { apiService, ThreadMessage } from "@/lib/api"
import Sidebar from "@/components/Sidebar"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentThreadId, setCurrentThreadId] = useState<number | null>(null)
  const [sidebarKey, setSidebarKey] = useState(0) // Force sidebar reload
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [backendUrl, setBackendUrl] = useState("")
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    // Get backend URL from config
    setBackendUrl(appSettings.backendUrl)
    
    // Check backend connection
    const checkConnection = async () => {
      try {
        const connected = await apiService.healthCheck()
        setIsConnected(connected)
        setConnectionError(null)
      } catch (error) {
        setIsConnected(false)
        setConnectionError("Failed to connect to server")
      }
    }
    
    checkConnection()
    
    // Set up periodic connection check
    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds
    
    // Initialize with welcome message
    setMessages([
      {
        id: "1",
        text: "Hello! I'm DE OMNI, your AI assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date()
      }
    ])
    
    return () => clearInterval(interval)
  }, [])

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hello! I'm DE OMNI, your AI assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date()
      }
    ])
    setCurrentThreadId(null)
    // Force sidebar to reload threads when it opens next time
    setSidebarKey(prev => prev + 1)
  }

  const handleThreadSelect = async (threadId: number) => {
    try {
      const response = await apiService.getThreadMessages(threadId)
      const threadMessages: Message[] = response.messages.map((msg: ThreadMessage) => ({
        id: msg.id.toString(),
        text: msg.text,
        sender: msg.sender as "user" | "bot",
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
      }))
      
      setMessages(threadMessages)
      setCurrentThreadId(threadId)
      setIsSidebarOpen(false) // Close sidebar after selection
    } catch (error) {
      console.error("Error loading thread messages:", error)
      // Show error message
      setMessages([
        {
          id: Date.now().toString(),
          text: "Sorry, I couldn't load the conversation. Please try again.",
          sender: "bot",
          timestamp: new Date()
        }
      ])
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isConnected) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      console.log('Sending message to:', appSettings.backendUrl + appSettings.endpoints.chat)
      const data = await apiService.sendMessage({
        message: inputMessage,
        thread_id: currentThreadId // Use current thread ID if available
      })
      console.log('Received response:', data)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "bot",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      
      // If this was the first message in a new thread, reload the sidebar threads
      if (!currentThreadId) {
        // Force sidebar to reload threads when opened next time
        setSidebarKey(prev => prev + 1)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to the server. Please check your connection and try again.",
        sender: "bot",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const retryConnection = async () => {
    try {
      const connected = await apiService.healthCheck()
      setIsConnected(connected)
      setConnectionError(null)
    } catch (error) {
      setIsConnected(false)
      setConnectionError("Connection failed")
    }
  }

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border-b border-blue-400/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">DE OMNI</h1>
                <p className="text-xs text-blue-300">AI Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {!isConnected && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={retryConnection}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connection Error Banner */}
      {connectionError && (
        <div className="bg-red-900/20 border-b border-red-500/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">{connectionError}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={retryConnection}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Retry Connection
            </Button>
          </div>
        </div>
      )}



      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                  : "bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600"
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === "bot" && (
                  <Bot className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.sender === "user" && (
                  <User className="w-4 h-4 text-white mt-1 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-2xl px-4 py-3 border border-gray-600">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-400" />
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-sm">DE OMNI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border-t border-blue-400/20 p-4">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "Type your message..." : "Disconnected - cannot send messages"}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
              rows={1}
              style={{ minHeight: "48px", maxHeight: "120px" }}
              disabled={!isConnected}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading || !isConnected}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        key={sidebarKey}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onThreadSelect={handleThreadSelect}
        currentThreadId={currentThreadId || undefined}
      />
    </div>
  )
} 