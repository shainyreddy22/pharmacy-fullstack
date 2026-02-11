import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { addMedicine } from '../services/medicineService';
import AddMedicine from '../../src/pages/AddMedicine';

vi.mock('../services/medicineService', () => ({
  addMedicine: vi.fn()
}));

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});

const renderAddMedicine = () => render(
  <MemoryRouter>
    <AddMedicine />
  </MemoryRouter>
);

describe('AddMedicine Component', () => {
  it('renders form title', () => {
    renderAddMedicine();
    expect(screen.getByText('➕ Add New Medicine')).toBeInTheDocument();
  });

  it('updates name input on change', () => {
    renderAddMedicine();
    const nameInput = screen.getByPlaceholderText('Enter medicine name');
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Paracetamol' } });
    expect(nameInput).toHaveValue('Paracetamol');
  });

  it('shows validation errors on empty submit', async () => {
    renderAddMedicine();
    fireEvent.click(screen.getByRole('button', { name: /add medicine/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Medicine name is required')).toBeInTheDocument();
    });
  });

  it('shows loading state on submit', async () => {
    renderAddMedicine();
    
    // Fill all required fields using reliable selectors
    fireEvent.change(screen.getByPlaceholderText('Enter medicine name'), { target: { name: 'name', value: 'Test Medicine' } });
    fireEvent.change(screen.getByPlaceholderText('Enter company name'), { target: { name: 'company', value: 'TestCo' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { name: 'price', value: '10.00' } });
    fireEvent.change(screen.getByPlaceholderText('Enter quantity'), { target: { name: 'quantity', value: '100' } });
    fireEvent.change(screen.getByPlaceholderText('Enter batch number'), { target: { name: 'batchNumber', value: 'BATCH123' } });
    
    // ✅ FIXED: Direct querySelector for date input
    const dateInput = screen.getByDisplayValue('')?.closest('div')?.querySelector('input[type="date"]');
    if (dateInput) {
      fireEvent.change(dateInput, { target: { name: 'expiryDate', value: '2026-12-31' } });
    }
    
    fireEvent.click(screen.getByRole('button', { name: /add medicine/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Adding...')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('calls addMedicine API on valid submit', async () => {
    const mockAddMedicine = vi.mocked(addMedicine);
    renderAddMedicine();
    
    // Fill form completely
    fireEvent.change(screen.getByPlaceholderText('Enter medicine name'), { target: { name: 'name', value: 'Paracetamol' } });
    fireEvent.change(screen.getByPlaceholderText('Enter company name'), { target: { name: 'company', value: 'MediCorp' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { name: 'price', value: '5.99' } });
    fireEvent.change(screen.getByPlaceholderText('Enter quantity'), { target: { name: 'quantity', value: '150' } });
    fireEvent.change(screen.getByPlaceholderText('Enter batch number'), { target: { name: 'batchNumber', value: 'ABC123' } });
    
    // ✅ FIXED: Reliable date input selector
    const dateInputs = Array.from(document.querySelectorAll('input[type="date"]'));
    if (dateInputs.length > 0) {
      fireEvent.change(dateInputs[0], { target: { name: 'expiryDate', value: '2026-12-31' } });
    }
    
    fireEvent.click(screen.getByRole('button', { name: /add medicine/i }));
    
    await waitFor(() => {
      expect(mockAddMedicine).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Paracetamol',
        company: 'MediCorp'
      }));
    }, { timeout: 1000 });
  });

  it('has cancel button', () => {
    renderAddMedicine();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('has submit button', () => {
    renderAddMedicine();
    expect(screen.getByRole('button', { name: /add medicine/i })).toBeInTheDocument();
  });
});
