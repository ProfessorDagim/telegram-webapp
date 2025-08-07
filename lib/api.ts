import { appSettings } from "@/lib/app-settings"

export interface ChatRequest {
  message: string
  thread_id?: number | null
}

export interface ChatResponse {
  response: string
}

export interface Thread {
  id: number
  title: string
  created_at: string | null
  active: boolean
  message_count: number
}

export interface ThreadMessage {
  id: number
  text: string
  sender: string
  timestamp: string | null
}

export interface ThreadsResponse {
  threads: Thread[]
}

export interface MessagesResponse {
  messages: ThreadMessage[]
}

export interface NewThreadResponse {
  thread_id: number
  message: string
}

export class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = appSettings.backendUrl.replace(/\/$/, "") // Ensure no trailing slash
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
          const response = await fetch(`${this.baseUrl}${appSettings.endpoints.chat}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}${appSettings.endpoints.health}`)
      return response.ok
    } catch (error) {
      console.error("Health check failed:", error)
      return false
    }
  }

  async getUserThreads(userId: number = 1): Promise<ThreadsResponse | { error: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${appSettings.endpoints.threads}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        return { error: `HTTP error! status: ${response.status}` }
      }
      
      const data = await response.json()
      
      if (data.threads) {
        return data
      } else {
        return { error: 'Unexpected response format from server.' }
      }
    } catch (error) {
      console.error('API Service: Network error in getUserThreads', error)
      return { error: 'Network error. Could not fetch threads.' }
    }
  }

  async createNewThread(userId: number = 1, firstMessage: string = ""): Promise<NewThreadResponse> {
    const response = await fetch(`${this.baseUrl}/threads/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, first_message: firstMessage }),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async getThreadMessages(threadId: number): Promise<MessagesResponse> {
    const response = await fetch(`${this.baseUrl}/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async getUserThreadsFormatted(userId: number = 1): Promise<{ threads_formatted: string } | { error: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${appSettings.endpoints.threadsFormatted}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      if (response.ok && data.threads_formatted) {
        return data
      } else if (data.error) {
        return { error: data.error }
      } else {
        return { error: 'Unexpected response from server.' }
      }
    } catch (error) {
      return { error: 'Network error. Could not fetch threads.' }
    }
  }
}

export const apiService = new ApiService() 