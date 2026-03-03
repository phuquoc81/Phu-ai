import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ── Helpers ────────────────────────────────────────────────────────────────

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const Wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

// ── Component imports ──────────────────────────────────────────────────────

import PricingCard from '../components/PricingCard';
import CreditsDisplay from '../components/CreditsDisplay';
import TeamMemberList from '../components/TeamMemberList';
import Footer from '../components/Footer';

// ── Tests ──────────────────────────────────────────────────────────────────

describe('PricingCard', () => {
  it('renders plan name and price', () => {
    render(
      <Wrapper>
        <PricingCard name="Pro" price="$99" features={['Feature A', 'Feature B']} />
      </Wrapper>
    );
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
  });

  it('renders all features', () => {
    const features = ['Feature A', 'Feature B', 'Feature C'];
    render(
      <Wrapper>
        <PricingCard name="Starter" price="$29" features={features} />
      </Wrapper>
    );
    features.forEach((f) => expect(screen.getByText(f)).toBeInTheDocument());
  });

  it('shows "Most popular" badge when highlighted', () => {
    render(
      <Wrapper>
        <PricingCard name="Pro" price="$99" features={[]} highlighted />
      </Wrapper>
    );
    expect(screen.getByText('Most popular')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    render(
      <Wrapper>
        <PricingCard name="Pro" price="$99" features={[]} loading />
      </Wrapper>
    );
    expect(screen.getByText('Processing…')).toBeInTheDocument();
  });

  it('calls onSelect when button is clicked', () => {
    const onSelect = jest.fn();
    render(
      <Wrapper>
        <PricingCard name="Pro" price="$99" features={[]} onSelect={onSelect} cta="Get started" />
      </Wrapper>
    );
    screen.getByText('Get started').click();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe('CreditsDisplay', () => {
  it('renders remaining credits', () => {
    render(<Wrapper><CreditsDisplay used={20000} total={50000} /></Wrapper>);
    expect(screen.getByText('30,000')).toBeInTheDocument();
  });

  it('shows 0 remaining when over limit', () => {
    render(<Wrapper><CreditsDisplay used={60000} total={50000} /></Wrapper>);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows warning when usage >= 80%', () => {
    render(<Wrapper><CreditsDisplay used={45000} total={50000} /></Wrapper>);
    expect(screen.getByText(/Running low/i)).toBeInTheDocument();
  });

  it('renders loading skeleton', () => {
    const { container } = render(<Wrapper><CreditsDisplay loading /></Wrapper>);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders top-up button when onTopUp is provided', () => {
    const onTopUp = jest.fn();
    render(<Wrapper><CreditsDisplay used={0} total={1000} onTopUp={onTopUp} /></Wrapper>);
    expect(screen.getByText(/Top up/i)).toBeInTheDocument();
  });
});

describe('TeamMemberList', () => {
  const members = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'admin' },
    { id: '2', name: 'Bob Jones', email: 'bob@example.com', role: 'member' },
  ];

  it('renders member names', () => {
    render(<Wrapper><TeamMemberList members={members} /></Wrapper>);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('renders role badges', () => {
    render(<Wrapper><TeamMemberList members={members} /></Wrapper>);
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('member')).toBeInTheDocument();
  });

  it('shows "you" label for current user', () => {
    render(<Wrapper><TeamMemberList members={members} currentUserId="1" /></Wrapper>);
    expect(screen.getByText('(you)')).toBeInTheDocument();
  });

  it('shows empty state when no members', () => {
    render(<Wrapper><TeamMemberList members={[]} /></Wrapper>);
    expect(screen.getByText(/No team members yet/i)).toBeInTheDocument();
  });

  it('renders loading skeleton', () => {
    const { container } = render(<Wrapper><TeamMemberList loading /></Wrapper>);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders brand name', () => {
    render(<Wrapper><Footer /></Wrapper>);
    expect(screen.getByText(/Phu-AI/i)).toBeInTheDocument();
  });

  it('renders navigation sections', () => {
    render(<Wrapper><Footer /></Wrapper>);
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Wrapper><Footer /></Wrapper>);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});
