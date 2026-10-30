import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('combines class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('handles conditional classes properly', () => {
    const isPrimary = true;
    const isHidden = false;
    expect(cn('base-class', isPrimary && 'primary-class', isHidden && 'hidden-class')).toBe(
      'base-class primary-class'
    );
  });

  it('resolves conflicting tailwind classes with tailwind-merge', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});
