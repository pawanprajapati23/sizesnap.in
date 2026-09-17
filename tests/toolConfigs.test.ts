import { getToolAndVariant, tools } from '../lib/toolConfigs';

describe('getToolAndVariant', () => {
  it('returns the tool and variant when both slugs are valid', () => {
    const result = getToolAndVariant('resize-image', 'to-50kb');
    expect(result).not.toBeNull();
    expect(result?.tool.slug).toBe('resize-image');
    expect(result?.variant.slug).toBe('to-50kb');
  });

  it('returns null when the tool slug is invalid', () => {
    const result = getToolAndVariant('invalid-tool-slug-123', 'to-50kb');
    expect(result).toBeNull();
  });

  it('returns null when the variant slug is invalid', () => {
    const result = getToolAndVariant('resize-image', 'invalid-variant-slug-123');
    expect(result).toBeNull();
  });
});
