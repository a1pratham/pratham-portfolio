import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the hero heading, primary nav and skip link', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Pratham Ukey');
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });

  it('links out to the real GitHub profile and resume', () => {
    render(<App />);
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toContain('https://github.com/a1pratham');
    expect(hrefs).toContain('/resume/Pratham_Ukey_Resume.pdf');
  });

  it('shows the About section from the real data and links to it in the nav', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 2, name: /building systems/i })).toBeInTheDocument();
    expect(within(document.getElementById('about')).getByText(/Master of Computer Applications/)).toBeInTheDocument();
    expect(within(document.getElementById('about')).queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'About' })[0]).toHaveAttribute('href', '#about');
  });

  it('lists the primary technologies from the data', () => {
    render(<App />);
    const list = screen.getByRole('list', { name: 'Primary technologies' });
    expect(list).toHaveTextContent('Spring Boot');
  });

  it('lists both projects with their real GitHub links and tech tags', () => {
    render(<App />);
    const feedbook = screen.getByRole('article', { name: 'FeedBook' });
    expect(within(feedbook).getByRole('link', { name: 'FeedBook on GitHub' }))
      .toHaveAttribute('href', 'https://github.com/a1pratham/FeedBook');
    expect(within(feedbook).getByRole('list', { name: 'FeedBook technologies' })).toHaveTextContent('Spring Boot 3.5');
    const manganest = screen.getByRole('article', { name: 'MangaNest' });
    expect(within(manganest).getByRole('link', { name: 'MangaNest on GitHub' }))
      .toHaveAttribute('href', 'https://github.com/a1pratham/MangaNest');
  });

  it('expands and collapses project key features', () => {
    render(<App />);
    const toggle = within(screen.getByRole('article', { name: 'FeedBook' }))
      .getByRole('button', { name: /key features/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('groups skills and shows which projects use them', () => {
    render(<App />);
    ['Languages & Databases', 'Frameworks & Technologies', 'Tools & Platforms'].forEach((name) => {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument();
    });
    expect(screen.getByText('Android Studio')).toBeInTheDocument();
    expect(screen.getAllByText(/Used in FeedBook/).length).toBeGreaterThan(0);
  });

  it('links Projects and Skills from the nav and the hero CTA', () => {
    render(<App />);
    const nav = within(screen.getByRole('navigation', { name: 'Primary' }));
    expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects');
    expect(nav.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills');
    expect(screen.getByRole('link', { name: /view projects/i })).toHaveAttribute('href', '#projects');
  });
});
