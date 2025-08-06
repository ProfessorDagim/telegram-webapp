"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, RefreshCw, MessageSquare } from "lucide-react"
import { apiService, Thread } from "@/lib/api"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  onThreadSelect: (threadId: number) => void
  currentThreadId?: number
}

export default function Sidebar({ isOpen, onClose, onNewChat, onThreadSelect, currentThreadId }: SidebarProps) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadThreads = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.getUserThreads(1) // Using web user ID 1
      
      if ("threads" in response) {
        setThreads(response.threads)
      } else {
        setError(response.error || "Failed to load threads")
        setThreads([])
      }
    } catch (err) {
      console.error("Failed to load threads:", err)
      setError("Network error")
      setThreads([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadThreads()
    }
  }, [isOpen])

  const handleNewChat = async () => {
    try {
      await apiService.createNewThread(1, "")
      onNewChat()
      onClose()
      // Reload threads after creating new chat
      setTimeout(() => {
        loadThreads()
      }, 500)
    } catch (error) {
      console.error("Failed to create new thread:", error)
      setError("Failed to create new chat")
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return "Unknown"
    }
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">DE OMNI</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-4 border-b border-gray-700">
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-blue-300">Web User</h3>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400">RECENT CHATS</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={loadThreads}
              className="text-gray-400 hover:text-blue-400"
              title="Refresh threads"
              aria-label="Refresh threads"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-300">Loading threads...</span>
            </div>
          )}
          
          {!loading && threads.length === 0 && !error && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No conversations yet</p>
              <p className="text-gray-600 text-xs mt-1">Start a new chat to begin</p>
            </div>
          )}
          
          <div className="space-y-2">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                  currentThreadId === thread.id
                    ? "bg-blue-600/20 border-blue-500/50 text-white"
                    : "bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50"
                }`}
                onClick={() => onThreadSelect(thread.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium truncate">
                        {thread.title || "Untitled"}
                      </h4>
                      {thread.active && (
                        <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {formatDate(thread.created_at)}
                    </p>
                    {thread.message_count > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {thread.message_count} message{thread.message_count !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
