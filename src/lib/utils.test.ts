import { cn } from './utils';

describe('cn() - Class Name Utility', () => {
  it('merges simple class names', () => {
    const result = cn('px-2', 'py-1');
    expect(result).toBe('px-2 py-1');
  });

  it('handles conditional classes with falsy values', () => {
    const isFalse = false;
    const isUndefined = undefined;
    const result = cn('px-2', isFalse && 'py-1', isUndefined && 'text-red-500');
    expect(result).toBe('px-2');
  });

  it('handles conditional classes with truthy values', () => {
    const result = cn('px-2', true && 'py-1', 'text-blue-500');
    expect(result).toBe('px-2 py-1 text-blue-500');
  });

  it('deduplicates conflicting Tailwind classes', () => {
    // When two classes conflict (e.g., px-2 and px-4), twMerge keeps the last one
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('deduplicates padding classes', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });

  it('handles arrays of class names', () => {
    const result = cn(['px-2', 'py-1'], 'text-sm');
    expect(result).toBe('px-2 py-1 text-sm');
  });

  it('handles objects with boolean values', () => {
    const result = cn({
      'px-2': true,
      'py-1': false,
      'text-sm': true,
    });
    expect(result).toBe('px-2 text-sm');
  });

  it('combines multiple input types', () => {
    const result = cn(
      'px-2',
      ['py-1', 'text-sm'],
      { 'font-bold': true, 'italic': false },
      'bg-white'
    );
    expect(result).toBe('px-2 py-1 text-sm font-bold bg-white');
  });

  it('handles empty strings and null values', () => {
    const result = cn('px-2', '', null, 'py-1');
    expect(result).toBe('px-2 py-1');
  });

  it('resolves conflicting Tailwind utilities correctly', () => {
    // bg-red-500 should override bg-blue-500
    const result = cn('bg-blue-500', 'bg-red-500');
    expect(result).toBe('bg-red-500');
  });

  it('handles responsive Tailwind classes', () => {
    const result = cn('md:px-4', 'lg:px-8', 'px-2');
    expect(result).toContain('px-2');
    expect(result).toContain('md:px-4');
    expect(result).toContain('lg:px-8');
  });
});
