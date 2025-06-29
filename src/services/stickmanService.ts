import axios from 'axios'
import type { Stickman } from '@/types/Stickman'

const BASE_URL = import.meta.env.VITE_API_URL
const API_URL = `${BASE_URL}/api/stickmans`

export const stickmanService = {
  getStickmen: async (): Promise<Stickman[]> => {
    const response = await axios.get(API_URL)
    return response.data
  },

  saveStickman: async (stickman: Omit<Stickman, 'id'>): Promise<Stickman> => {
    const response = await axios.post(API_URL, stickman)
    return response.data
  },

  getStickmenByOwner: async (owner: string): Promise<Stickman[]> => {
    const response = await axios.get(`${API_URL}/owner/${owner}`)
    return response.data
  },

  testApi: async (): Promise<{ message: string }> => {
    const response = await axios.get(`${BASE_URL}/api/test`)
    return response.data
  }
}
