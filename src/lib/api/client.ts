import type { ApiError } from '@/types/common'

type RequestConfig = {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  private buildURL = (url: string, params?: Record<string, unknown>): string => {
    const fullURL = new URL(url, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fullURL.searchParams.append(key, String(value))
        }
      })
    }
    
    return fullURL.toString()
  }

  private handleResponse = async <T>(response: Response): Promise<T> => {
    if (response.status === 401) {
      this.handleUnauthorized()
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error: ApiError = {
        message: errorData.message || 'Request failed',
        error: errorData.error || 'HTTP Error',
        statusCode: response.status
      }
      throw error
    }

    return response.json()
  }

  private handleUnauthorized = () => {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
  }

  setToken = (token: string | null): void => {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken = (): string | null => {
    if (this.token) return this.token
    
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        this.token = storedToken
        return storedToken
      }
    }
    
    return null
  }

  get = async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'GET',
      headers: this.getHeaders(config?.headers)
    })
    return this.handleResponse<T>(response)
  }

  post = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'POST',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  patch = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'PATCH',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  put = async <T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'PUT',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data)
    })
    return this.handleResponse<T>(response)
  }

  delete = async <T = unknown>(url: string, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const response = await fetch(fullURL, {
      method: 'DELETE',
      headers: this.getHeaders(config?.headers)
    })
    return this.handleResponse<T>(response)
  }

  upload = async <T = unknown>(url: string, formData: FormData, config?: RequestConfig): Promise<T> => {
    const fullURL = this.buildURL(url, config?.params)
    const headers = { ...config?.headers }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    delete headers['Content-Type']
    
    const response = await fetch(fullURL, {
      method: 'POST',
      headers,
      body: formData
    })
    return this.handleResponse<T>(response)
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export const apiClient = new ApiClient(API_BASE_URL)

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token')
  if (token) {
    apiClient.setToken(token)
  }
}