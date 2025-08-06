"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, RefreshCw } from "lucide-react"
import { apiService } from "@/lib/api"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  onThreadSelect: (threadId: number) => void
  currentThreadId?: number
}

interface ThreadItem {
  title: string
  active: boolean
}

export default function Sidebar({ isOpen, onClose, onNewChat, onThreadSelect, currentThreadId }: SidebarProps) {
  const [threads, setThreads] = useState<ThreadItem[]>([])
  const [loading, setLoading] = useState(false)

  const loadThreadsFormatted = async () => {
    setLoading(true)
    try {
      const response = await apiService.getUserThreadsFormatted(1)
      if ("threads_formatted" in response) {
        const lines = (response.threads_formatted || "").trim().split("\n")
        const parsedThreads = lines.map((line) => {
          const [titlePart, statusPart] = line.split("|").map((s) => s.trim())
          return {
            title: titlePart,
            active: statusPart === "🟢 Active",
          }
        })
        setThreads(parsedThreads)
      } else {
        setThreads([])
      }
    } catch (err) {
      console.error("Failed to load threads:", err)
      setThreads([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadThreadsFormatted()
    }
  }, [isOpen])

  const handleNewChat = async () => {
    await apiService.createNewThread(1, "")
    onNewChat()
    onClose()
    loadThreadsFormatted()
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
            <h3 className="text-base font-semibold text-blue-300">web User</h3>
          </div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400">RECENT CHATS</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={loadThreadsFormatted}
              className="text-gray-400 hover:text-blue-400"
              title="Refresh threads"
              aria-label="Refresh threads"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          {loading && <p className="text-gray-300">Loading...</p>}
          {!loading && threads.length === 0 && <p className="text-gray-500 text-sm">No threads available</p>}
          <ul>
            {threads.map((thread, idx) => (
              <li
                key={idx}
                className={`cursor-pointer p-2 rounded mb-1 ${
                  thread.active ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
                } hover:bg-green-500`}
                onClick={() => onThreadSelect && onThreadSelect(idx)} // Or thread id if you have it
              >
                {thread.title} {thread.active ? "🟢" : "⚪"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
