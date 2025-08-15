"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Send, Bot, ArrowLeft, Loader2, Menu, Wifi, WifiOff, CameraIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { appSettings } from "@/lib/app-settings"
import { apiService, ThreadMessage } from "@/lib/api"
import Sidebar from "@/components/Sidebar"

import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  imageUrl?: string
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentThreadId, setCurrentThreadId] = useState<number | null>(null)
  const [sidebarKey, setSidebarKey] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [backendUrl, setBackendUrl] = useState("")
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Pending photo states
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null)
  const [pendingPhotoUrl, setPendingPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    setBackendUrl(appSettings.backendUrl)
    const checkConnection = async () => {
      try {
        const connected = await apiService.healthCheck()
        setIsConnected(connected)
        setConnectionError(null)
      } catch {
        setIsConnected(false)
        setConnectionError("Failed to connect to server")
      }
    }
    checkConnection()
    const interval = setInterval(checkConnection, 30000)
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
      setIsSidebarOpen(false)
    } catch {
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
    if ((!inputMessage.trim() && !pendingPhoto) || isLoading || !isConnected) return

    // Add user message (text)
    if (inputMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: "user",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
    }

    // Add pending photo to chat preview
    if (pendingPhotoUrl) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: inputMessage || "",
          sender: "user",
          timestamp: new Date(),
          imageUrl: pendingPhotoUrl
        }
      ])
    }

    setIsLoading(true)
    const formData = new FormData()
    if (pendingPhoto) formData.append("photo", pendingPhoto)
    formData.append("caption", inputMessage || "")
    if (currentThreadId) formData.append("thread_id", String(currentThreadId))

    setInputMessage("")
    setPendingPhoto(null)
    setPendingPhotoUrl(null)

    try {
      let botResponse
      if (pendingPhoto) {
        const res = await fetch(`${backendUrl}/webapp_upload`, { method: "POST", body: formData })
        if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`)
        botResponse = await res.json()
      } else {
        botResponse = await apiService.sendMessage({ message: inputMessage, thread_id: currentThreadId })
      }

      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: botResponse.response,
        sender: "bot",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      if (!currentThreadId) setSidebarKey(prev => prev + 1)
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "❌ Failed to send message/photo. Please try again.",
          sender: "bot",
          timestamp: new Date()
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Photo selection only (no immediate upload)
  const handlePhotoSelect = (file: File) => {
    if (!file || !isConnected) return
    setPendingPhoto(file)
    setPendingPhotoUrl(URL.createObjectURL(file))
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
    } catch {
      setIsConnected(false)
      setConnectionError("Connection failed")
    }
  }

  const renderMarkdown = (text: string) => (
    <ReactMarkdown rehypePlugins={[rehypeHighlight]}
      components={{
        p: ({ children }) => <p className="text-sm">{children}</p>,
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ children, href }) => (
          <a href={href} className="text-blue-400 underline" target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
        h1: ({ children }) => <h1 className="text-lg font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="text-md font-semibold">{children}</h2>,
        h3: ({ children }) => <h3 className="text-md font-semibold">{children}</h3>,
        li: ({ children }) => <li className="ml-4 list-disc">{children}</li>
      }}
    >
      {text}
    </ReactMarkdown>
  )

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border-b border-blue-400/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30">
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
            {isConnected ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
            <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            {!isConnected && (
              <Button variant="ghost" size="sm" onClick={retryConnection} className="text-xs text-blue-400 hover:text-blue-300">
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>

      {connectionError && (
        <div className="bg-red-900/20 border-b border-red-500/30 p-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{connectionError}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={retryConnection} className="text-xs text-blue-400 hover:text-blue-300">
            Retry Connection
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              message.sender === "user"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                : "bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600"
            }`}>
              <div className="flex flex-col space-y-2">
                {message.imageUrl && (
                  <img src={message.imageUrl} alt="Uploaded" className="max-w-xs rounded-lg border border-gray-500" />
                )}
                {message.text && (
                  <div className="text-sm whitespace-pre-wrap">
                    {message.sender === "bot" ? renderMarkdown(message.text) : message.text}
                  </div>
                )}
                <p className="text-xs opacity-60 mt-1">{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-2xl px-4 py-3 border border-gray-600 flex items-center space-x-2">
              <Bot className="w-4 h-4 text-blue-400" />
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-sm">DE OMNI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border-t border-blue-400/20 p-4 flex flex-col space-y-2">
        {/* Photo preview if selected */}
        {pendingPhotoUrl && (
          <div className="flex justify-start mb-2">
            <img src={pendingPhotoUrl} alt="Preview" className="max-w-xs rounded-lg border border-gray-500" />
          </div>
        )}

        <div className="flex space-x-3">
          {/* Photo button */}
          <label
            htmlFor="photo-upload"
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl px-4 py-3 flex items-center justify-center"
          >
            <CameraIcon className="w-4 h-4" />
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handlePhotoSelect(file)
                e.target.value = ""
              }
            }}
          />
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
            disabled={(!inputMessage.trim() && !pendingPhoto) || isLoading || !isConnected}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

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
