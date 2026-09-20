import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Education from './Education';

describe('Education', () => {
  it('lists both degrees in order from the real data', () => {
    render(<Education />);
    expect(screen.getByRole('heading', { level: 2, name: /studied/i })).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByRole('heading', { level: 3 })).toHaveTextContent('Master of Computer Applications');
    expect(within(items[1]).getByRole('heading', { level: 3 })).toHaveTextContent('B.Sc. Information Technology');
  });

  it('shows institutions, affiliation and location', () => {
    render(<Education />);
    expect(screen.getByText("Bharati Vidyapeeth's IMIT")).toBeInTheDocument();
    expect(screen.getByText(/Affiliated with Mumbai University · Navi Mumbai/)).toBeInTheDocument();
    expect(screen.getByText(/Affiliated with Gondwana University · Chandrapur/)).toBeInTheDocument();
  });

  it('marks only the ongoing degree as in progress', () => {
    render(<Education />);
    expect(screen.getAllByText('In progress')).toHaveLength(1);
    expect(screen.getByText('2025 - Expected 2027')).toBeInTheDocument();
    expect(screen.getByText('2021 - 2024')).toBeInTheDocument();
  });

  it('renders the grades as labelled scores', () => {
    render(<Education />);
    expect(screen.getByText('GPA · Semester I').nextSibling).toHaveTextContent('7.79');
    expect(screen.getByText('GPA · Semester II').nextSibling).toHaveTextContent('7.34');
    expect(screen.getByText('CGPA · Overall').nextSibling).toHaveTextContent('7.76 / 10');
  });
});
