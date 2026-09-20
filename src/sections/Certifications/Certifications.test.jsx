import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import certificates from '../../data/certificates';
import Certifications from './Certifications';

const mockDesktop = (matches) => {
  window.matchMedia = (query) => ({
    matches: query.includes('min-width: 900px') ? matches : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
};

describe('Certifications', () => {
  afterEach(() => mockDesktop(false));

  it('builds certificates from the existing data with centralised asset slots', () => {
    expect(certificates).toHaveLength(4);
    expect(certificates[0]).toMatchObject({
      id: 'java-programming-certification', issuer: 'NPTEL', date: '2026', image: null, href: null,
    });
  });

  it('renders every certificate with title, issuer and year', () => {
    render(<Certifications />);
    certificates.forEach(({ title, issuer }) => {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
      expect(screen.getAllByText(issuer).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('2023')).toHaveLength(1);
  });

  it('marks only the centre card as available to assistive tech', () => {
    render(<Certifications />);
    const slides = screen.getAllByRole('group', { hidden: true });
    expect(slides[0]).not.toHaveAttribute('aria-hidden');
    expect(slides[1]).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows a disabled "View Certificate" until a file is provided', () => {
    render(<Certifications />);
    const button = screen.getAllByRole('button', { name: /view certificate/i, hidden: true })[0];
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('moves with the dots, arrow buttons and keyboard', () => {
    render(<Certifications />);
    const region = screen.getByRole('region', { name: 'Certifications' });
    const dots = within(region).getAllByRole('button', { name: /go to certificate/i });
    expect(dots[0]).toHaveAttribute('aria-current', 'true');

    fireEvent.click(within(region).getByRole('button', { name: 'Next certificate' }));
    expect(dots[1]).toHaveAttribute('aria-current', 'true');

    fireEvent.keyDown(dots[1], { key: 'End' });
    expect(dots[3]).toHaveAttribute('aria-current', 'true');
    expect(within(region).getByRole('button', { name: 'Next certificate' })).toBeDisabled();

    fireEvent.keyDown(dots[3], { key: 'ArrowLeft' });
    expect(dots[2]).toHaveAttribute('aria-current', 'true');

    fireEvent.click(dots[0]);
    expect(dots[0]).toHaveAttribute('aria-current', 'true');
  });

  it('brings a clicked side card to the centre (desktop arc)', () => {
    mockDesktop(true);
    render(<Certifications />);
    fireEvent.click(screen.getByRole('button', { name: `Show ${certificates[2].title}`, hidden: true }));
    const dots = screen.getAllByRole('button', { name: /go to certificate/i });
    expect(dots[2]).toHaveAttribute('aria-current', 'true');
    expect(screen.getByText(/Certificate 3 of 4/)).toBeInTheDocument();
  });
});
