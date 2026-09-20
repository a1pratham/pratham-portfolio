import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Contact from './Contact';

describe('Contact', () => {
  afterEach(() => vi.restoreAllMocks());

  it('links to the real email, profiles and resume', () => {
    render(<Contact />);
    expect(screen.getByRole('link', { name: /email me/i }))
      .toHaveAttribute('href', 'mailto:prathamukey3@gmail.com?subject=Portfolio%20Contact');
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', 'https://linkedin.com/in/justpratham');
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/a1pratham');
    expect(screen.getByRole('link', { name: /Resume/ })).toHaveAttribute('href', '/resume/Pratham_Ukey_Resume.pdf');
  });

  it('opens external profiles safely in a new tab', () => {
    render(<Contact />);
    const github = screen.getByRole('link', { name: /GitHub/ });
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('copies the email address and announces it', async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: /copy email address/i }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Email address copied'));
    expect(writeText).toHaveBeenCalledWith('prathamukey3@gmail.com');
  });

  it('reports a failed copy instead of pretending it worked', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) }, configurable: true,
    });
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: /copy email address/i }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/could not copy/i));
  });
});
