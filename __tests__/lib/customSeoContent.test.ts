import { getCustomSeo } from '../../lib/customSeoContent'

describe('getCustomSeo', () => {
  it('should return correct CustomSeoData for valid tool and variant', () => {
    const result = getCustomSeo('compress-image', 'to-14kb')
    expect(result).not.toBeNull()
    expect(result?.metaTitle).toBe('14 KB Photo Size: Compress Image to 14KB Online Free')
    expect(result?.h1).toBe('14 KB Photo Size: Compress Image to 14KB')
    expect(result?.faqs.length).toBeGreaterThan(0)
  })

  it('should return null for non-existent tool', () => {
    const result = getCustomSeo('non-existent-tool', 'to-14kb')
    expect(result).toBeNull()
  })

  it('should return null for non-existent variant', () => {
    const result = getCustomSeo('compress-image', 'non-existent-variant')
    expect(result).toBeNull()
  })

  it('should return null for empty tool and variant', () => {
    const result = getCustomSeo('', '')
    expect(result).toBeNull()
  })

  it('should handle undefined values gracefully (if typescript permits)', () => {
    // testing edge case where values might be cast to any/undefined at runtime
    const result = getCustomSeo(undefined as any, undefined as any)
    expect(result).toBeNull()
  })
})
