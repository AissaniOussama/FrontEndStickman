import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { stickmanService } from './stickmanService'
import flushPromises from 'flush-promises'

vi.mock('axios')

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
}


describe('stickmanService', () => {
  it('should fetch stickmen', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [{ name: 'Testy' }] })

    const result = await stickmanService.getStickmen()
    await flushPromises()
    expect(result).toEqual([{ name: 'Testy' }])
  })

  it('should save a stickman', async () => {
    const dummy = {
      name: 'Savey',
      hat: 'Hat3.png',
      top: 'Top2.png',
      bot: 'Bot1.png'
    }

    mockedAxios.post.mockResolvedValueOnce({
      data: { ...dummy, id: 99 }
    })

    const result = await stickmanService.saveStickman(dummy)
    await flushPromises()

    expect(result).toEqual({ ...dummy, id: 99 })
    expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), dummy)
  })

  // ✅ 3. Fehler beim Speichern behandeln
  it('should throw an error if saving stickman fails', async () => {
    const dummy = {
      name: 'Failman',
      hat: 'Hat0.png',
      top: 'Top0.png',
      bot: 'Bot0.png'
    }

    mockedAxios.post.mockRejectedValueOnce(new Error('Server Error'))

    await expect(stickmanService.saveStickman(dummy)).rejects.toThrow('Server Error')
    await flushPromises()
  })

  it('should return message from testApi', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { message: 'Hallo von der API' } })

    const result = await stickmanService.testApi()
    await flushPromises()

    expect(result).toEqual({ message: 'Hallo von der API' })
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/test'))
  })

})
