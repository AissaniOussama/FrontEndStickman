import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import StickmanList from '@/components/StickmanList.vue'
import { stickmanService } from '@/services/stickmanService'
import type { Stickman } from '@/types/Stickman'

// 👇 Service mocken
vi.mock('@/services/stickmanService', () => ({
  stickmanService: {
    testApi: vi.fn(),
    getStickmen: vi.fn()
  }
}))

describe('StickmanList.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    const wrapper = mount(StickmanList)
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders stickmen after successful API call', async () => {
    const mockData: Stickman[] = [
      { id: 1, name: 'Cool Guy', hat: 'Hat1.png', top: 'Top2.png', bot: 'Bot3.png' }
    ]
    vi.mocked(stickmanService.testApi).mockResolvedValueOnce({ message: 'OK' })
    vi.mocked(stickmanService.getStickmen).mockResolvedValueOnce(mockData)

    const wrapper = mount(StickmanList)
    await flushPromises()

    expect(wrapper.text()).toContain('Cool Guy')
    expect(wrapper.findAll('.stickman-card').length).toBe(1)
  })

  it('shows error message on API failure', async () => {
    vi.mocked(stickmanService.testApi).mockRejectedValueOnce(new Error('API down'))
    vi.mocked(stickmanService.getStickmen).mockRejectedValueOnce(new Error('API down'))

    const wrapper = mount(StickmanList)
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load stickmen')
    expect(wrapper.findAll('.stickman-card').length).toBe(0)
  })
})
