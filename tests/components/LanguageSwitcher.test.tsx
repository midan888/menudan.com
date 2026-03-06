// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../../tests/setup-dom';
import { LanguageSwitcher } from '@/components/menu/LanguageSwitcher';

const defaultProps = {
  enabledLanguages: ['en', 'fr', 'de'],
  currentLanguage: 'en',
  currentMenuId: 'menu-1',
};

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('LanguageSwitcher — rendering', () => {
  it('renders nothing when only one language is enabled', () => {
    const { container } = render(
      <LanguageSwitcher enabledLanguages={['en']} currentLanguage="en" currentMenuId="menu-1" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when zero languages are enabled', () => {
    const { container } = render(
      <LanguageSwitcher enabledLanguages={[]} currentLanguage="en" currentMenuId={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders language links when multiple languages are enabled', () => {
    render(<LanguageSwitcher {...defaultProps} />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });

  it('uses nativeName for display text', () => {
    render(
      <LanguageSwitcher enabledLanguages={['ar', 'ja']} currentLanguage="ar" currentMenuId={null} />
    );
    expect(screen.getByText('العربية')).toBeInTheDocument();
    expect(screen.getByText('日本語')).toBeInTheDocument();
  });
});

// ─── Links ────────────────────────────────────────────────────────────────────

describe('LanguageSwitcher — link hrefs', () => {
  it('builds href with menu id and lang param', () => {
    render(<LanguageSwitcher {...defaultProps} />);
    const frLink = screen.getByText('Français').closest('a');
    expect(frLink).toHaveAttribute('href', '?menu=menu-1&lang=fr');
  });

  it('builds href without menu id when currentMenuId is null', () => {
    render(
      <LanguageSwitcher enabledLanguages={['en', 'fr']} currentLanguage="en" currentMenuId={null} />
    );
    const frLink = screen.getByText('Français').closest('a');
    expect(frLink).toHaveAttribute('href', '?lang=fr');
  });
});

// ─── Active state ─────────────────────────────────────────────────────────────

describe('LanguageSwitcher — active state', () => {
  it('applies active style to the current language', () => {
    render(<LanguageSwitcher {...defaultProps} currentLanguage="fr" />);
    const frLink = screen.getByText('Français').closest('a');
    expect(frLink).toHaveClass('bg-black/10');
    expect(frLink).toHaveClass('opacity-100');
  });

  it('applies inactive style to non-current languages', () => {
    render(<LanguageSwitcher {...defaultProps} currentLanguage="en" />);
    const frLink = screen.getByText('Français').closest('a');
    expect(frLink).toHaveClass('opacity-40');
    expect(frLink).not.toHaveClass('bg-black/10');
  });

  it('only marks one language as active', () => {
    render(<LanguageSwitcher {...defaultProps} currentLanguage="de" />);
    const activeLinks = screen
      .getAllByRole('link')
      .filter(l => l.classList.contains('bg-black/10'));
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0]).toHaveTextContent('Deutsch');
  });
});

// ─── Filtering ────────────────────────────────────────────────────────────────

describe('LanguageSwitcher — filtering', () => {
  it('only renders languages that are in the enabled list', () => {
    render(
      <LanguageSwitcher enabledLanguages={['en', 'es']} currentLanguage="en" currentMenuId={null} />
    );
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.queryByText('Français')).not.toBeInTheDocument();
    expect(screen.queryByText('Deutsch')).not.toBeInTheDocument();
  });
});
