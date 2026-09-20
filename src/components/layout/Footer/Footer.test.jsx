import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders footer navigation from the given links, a back-to-top link and socials', () => {
    render(<Footer links={[{ id: 'about', label: 'About' }, { id: 'contact', label: 'Contact' }]} />);
    const nav = within(screen.getByRole('navigation', { name: 'Footer' }));
    expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#top');
    expect(within(screen.getByRole('list', { name: 'Footer social links' })).getAllByRole('link')).toHaveLength(3);
  });

  it('omits the nav when there are no links', () => {
    render(<Footer />);
    expect(screen.queryByRole('navigation', { name: 'Footer' })).not.toBeInTheDocument();
  });
});
