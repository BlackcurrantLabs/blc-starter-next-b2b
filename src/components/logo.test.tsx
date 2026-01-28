import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from './logo';

describe('Logo Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Logo />);
    expect(container).toBeInTheDocument();
  });

  it('renders an SVG element', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct SVG dimensions', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '124');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('has correct viewBox attribute', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 124 32');
  });

  it('has logo id attribute', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('id', 'logo-7');
  });

  it('renders path elements with fill-foreground class', () => {
    const { container } = render(<Logo />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
    paths.forEach((path) => {
      expect(path).toHaveClass('fill-foreground');
    });
  });

  it('is accessible with proper SVG semantics', () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    expect(svg).toHaveAttribute('fill', 'none');
  });
});
