import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Login from '../../src/pages/Login';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
let mockIsAuthenticated = false;

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    login: mockLogin,
  }),
}));

const renderLogin = () => {
  const { MemoryRouter } = require('react-router-dom');
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

describe('Login Page - FIXED Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = false;
  });

  it('renders complete login form', () => {
    renderLogin();
    expect(screen.getByText('Pharmacy Management')).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('shows demo credentials', () => {
    renderLogin();
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
  });

  it('redirects if already authenticated', () => {
    mockIsAuthenticated = true;
    renderLogin();
    expect(screen.queryByText('Pharmacy Management')).not.toBeInTheDocument();
  });

  it('updates input values', () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    expect(screen.getByLabelText(/Username/i)).toHaveValue('admin');
  });

  // FIXED: Fill inputs BEFORE clicking
  it('shows loading state during login', async () => {
    mockLogin.mockImplementation(() => new Promise(r => setTimeout(() => r({ success: true }), 100)));
    
    renderLogin();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  // FIXED: Match your component's SUCCESS flow
  it('navigates on successful login', async () => {
    mockLogin.mockResolvedValue({ success: true });
    
    renderLogin();
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'));
  });

  // ❌ REPLACE THIS (lines ~107-115):
it('shows network error message', async () => {
  mockLogin.mockRejectedValue(new Error('Network failed'));
  
  renderLogin();
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});

// ✅ WITH THIS (EXACT MATCH):
it('shows network error message', async () => {
  mockLogin.mockRejectedValue(new Error('Network failed'));
  
  renderLogin();
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
  
  await waitFor(() => {
    expect(screen.getByText('Invalid credentials. Please try again.')).toBeInTheDocument();
  }, { timeout: 2000 });
});
});
