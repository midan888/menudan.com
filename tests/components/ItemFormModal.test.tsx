// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../tests/setup-dom';
import { ItemFormModal } from '@/components/dashboard/ItemFormModal';

const onSave = vi.fn();
const onClose = vi.fn();

const defaultProps = {
  item: null,
  onSave,
  onClose,
  defaultCurrency: 'USD',
  enabledCurrencies: ['USD'],
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('ItemFormModal — rendering', () => {
  it('shows "Add Item" title when no item is provided', () => {
    render(<ItemFormModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Add Item' })).toBeInTheDocument();
  });

  it('shows "Edit Item" title when an item is provided', () => {
    render(<ItemFormModal {...defaultProps} item={{ id: '1', name: 'Pizza', price: '10', currency: 'USD' } as never} />);
    expect(screen.getByRole('heading', { name: 'Edit Item' })).toBeInTheDocument();
  });

  it('pre-fills name field when editing', () => {
    render(<ItemFormModal {...defaultProps} item={{ id: '1', name: 'Burger', price: '8', currency: 'USD' } as never} />);
    expect(screen.getByLabelText(/name/i)).toHaveValue('Burger');
  });

  it('renders all badge options', () => {
    render(<ItemFormModal {...defaultProps} />);
    expect(screen.getByText('vegan')).toBeInTheDocument();
    expect(screen.getByText('vegetarian')).toBeInTheDocument();
    expect(screen.getByText('spicy')).toBeInTheDocument();
  });

  it('renders all allergen options', () => {
    render(<ItemFormModal {...defaultProps} />);
    expect(screen.getByText('gluten')).toBeInTheDocument();
    expect(screen.getByText('dairy')).toBeInTheDocument();
    expect(screen.getByText('nuts')).toBeInTheDocument();
  });
});

// ─── Validation ───────────────────────────────────────────────────────────────

describe('ItemFormModal — validation', () => {
  it('shows error and does not call onSave when name is empty', async () => {
    render(<ItemFormModal {...defaultProps} />);
    fireEvent.submit(document.querySelector('form')!);
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows error when primary currency price is missing', async () => {
    const user = userEvent.setup();
    render(<ItemFormModal {...defaultProps} />);
    await user.type(screen.getByLabelText(/name/i), 'Pasta');
    fireEvent.submit(document.querySelector('form')!);
    await waitFor(() => {
      expect(screen.getByText(/price in USD is required/i)).toBeInTheDocument();
    });
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows error when price is negative', async () => {
    const user = userEvent.setup();
    render(<ItemFormModal {...defaultProps} />);
    await user.type(screen.getByLabelText(/name/i), 'Pasta');
    const priceInput = screen.getByPlaceholderText('12.50');
    await user.type(priceInput, '-5');
    fireEvent.submit(document.querySelector('form')!);
    await waitFor(() => {
      expect(screen.getByText(/price in USD is required/i)).toBeInTheDocument();
    });
    expect(onSave).not.toHaveBeenCalled();
  });
});

// ─── Submission ───────────────────────────────────────────────────────────────

describe('ItemFormModal — submission', () => {
  it('calls onSave with correct data on valid submit', async () => {
    const user = userEvent.setup();
    onSave.mockResolvedValue(undefined);
    render(<ItemFormModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/name/i), 'Margherita');
    await user.type(screen.getByPlaceholderText('12.50'), '12.50');
    fireEvent.submit(document.querySelector('form')!);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Margherita',
          currency: 'USD',
          price: '12.5', // number input strips trailing zero
        })
      );
    });
  });

  it('trims whitespace from name before saving', async () => {
    const user = userEvent.setup();
    onSave.mockResolvedValue(undefined);
    render(<ItemFormModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/name/i), '  Pasta  ');
    await user.type(screen.getByPlaceholderText('12.50'), '9');
    fireEvent.submit(document.querySelector('form')!);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Pasta' })
      );
    });
  });

  it('shows error message when onSave throws', async () => {
    const user = userEvent.setup();
    onSave.mockRejectedValue(new Error('Network error'));
    render(<ItemFormModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/name/i), 'Pizza');
    await user.type(screen.getByPlaceholderText('12.50'), '10');
    fireEvent.submit(document.querySelector('form')!);

    await waitFor(() => {
      expect(screen.getByText('Save failed')).toBeInTheDocument();
    });
  });
});

// ─── Badges & Allergens ───────────────────────────────────────────────────────

describe('ItemFormModal — badges and allergens', () => {
  it('toggles a badge on and off', async () => {
    const user = userEvent.setup();
    render(<ItemFormModal {...defaultProps} />);

    const veganBtn = screen.getByRole('button', { name: 'vegan' });
    await user.click(veganBtn);
    expect(veganBtn).toHaveClass('bg-gray-900');

    await user.click(veganBtn);
    expect(veganBtn).not.toHaveClass('bg-gray-900');
  });

  it('toggles an allergen on and off', async () => {
    const user = userEvent.setup();
    render(<ItemFormModal {...defaultProps} />);

    const glutenBtn = screen.getByRole('button', { name: 'gluten' });
    await user.click(glutenBtn);
    expect(glutenBtn).toHaveClass('bg-orange-600');

    await user.click(glutenBtn);
    expect(glutenBtn).not.toHaveClass('bg-orange-600');
  });

  it('pre-selects badges from existing item', () => {
    render(<ItemFormModal {...defaultProps} item={{ id: '1', name: 'Salad', price: '8', currency: 'USD', badges: ['vegan', 'spicy'] } as never} />);
    expect(screen.getByRole('button', { name: 'vegan' })).toHaveClass('bg-gray-900');
    expect(screen.getByRole('button', { name: 'spicy' })).toHaveClass('bg-gray-900');
    expect(screen.getByRole('button', { name: 'vegetarian' })).not.toHaveClass('bg-gray-900');
  });

  it('includes selected badges in onSave payload', async () => {
    const user = userEvent.setup();
    onSave.mockResolvedValue(undefined);
    render(<ItemFormModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/name/i), 'Salad');
    await user.type(screen.getByPlaceholderText('12.50'), '9');
    await user.click(screen.getByRole('button', { name: 'vegan' }));
    await user.click(screen.getByRole('button', { name: 'gluten free' }));
    fireEvent.submit(document.querySelector('form')!);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ badges: expect.arrayContaining(['vegan', 'gluten-free']) })
      );
    });
  });
});

// ─── Close ────────────────────────────────────────────────────────────────────

describe('ItemFormModal — close', () => {
  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ItemFormModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup();
    render(<ItemFormModal {...defaultProps} />);
    // The X button is the close SVG button in the header
    const buttons = screen.getAllByRole('button');
    const closeBtn = buttons.find(b => b.querySelector('svg') && !b.textContent);
    await user.click(closeBtn!);
    expect(onClose).toHaveBeenCalled();
  });
});
