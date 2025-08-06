import { config } from "@/config"

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
    this.baseUrl = config.backendUrl
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    console.log('API Service: Sending request to', `${this.baseUrl}${config.endpoints.chat}`)
    console.log('API Service: Request body', request)
    
    const response = await fetch(`${this.baseUrl}${config.endpoints.chat}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    console.log('API Service: Response status', response.status)
    console.log('API Service: Response headers', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Service: Error response', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('API Service: Response data', data)
    return data
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      // Accept both JSON and HTML responses as valid
      return response.ok
    } catch (error) {
      console.error("Health check failed:", error)
      return false
    }
  }

  async getUserThreads(userId: number = 1): Promise<ThreadsResponse | { error: string }> {
    console.log('API Service: Getting threads for user', userId)
    try {
      const response = await fetch(`${this.baseUrl}/threads/${userId}`)
      console.log('API Service: Threads response status', response.status)
      const text = await response.text()
      try {
        const data = JSON.parse(text)
        if (response.ok && data.threads) {
          console.log('API Service: Threads data', data)
          return data
        } else if (data.error) {
          console.error('API Service: Threads error', data.error)
          return { error: data.error }
        } else {
          console.error('API Service: Unexpected response', data)
          return { error: 'Unexpected response from server.' }
        }
      } catch (jsonErr) {
        console.error('API Service: Failed to parse JSON', jsonErr, text)
        return { error: 'Invalid response from server.' }
      }
    } catch (error) {
      console.error('API Service: Network or fetch error', error)
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
    const response = await fetch(`${this.baseUrl}/threads/${threadId}/messages`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  async getUserThreadsFormatted(userId: number = 1): Promise<{ threads_formatted: string } | { error: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/threads_formatted/${userId}`)
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