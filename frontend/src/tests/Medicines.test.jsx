import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Medicines from '../../src/pages/Medicines';

const renderMedicines = () => render(
  <MemoryRouter>
    <Medicines />
  </MemoryRouter>
);

describe('Medicines Component', () => {
  it('renders loading spinner', () => {
    renderMedicines();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows loading text', () => {
    renderMedicines();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('has correct loading container structure', () => {
    renderMedicines();
    const spinner = screen.getByRole('status');
    const container = spinner.parentElement;
    expect(container).toHaveClass('d-flex');
    expect(container).toHaveStyle({ height: '400px' });
  });
});
