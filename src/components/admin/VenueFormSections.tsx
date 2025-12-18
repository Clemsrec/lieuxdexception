/**
 * Composants de Formulaire Réutilisables - Admin Venues
 * 
 * Composants pour édition complète des lieux avec organisation
 * par sections thématiques.
 */

'use client';

import { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

// ===========================================
// SECTION WRAPPER
// ===========================================

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

/**
 * Section de formulaire collapsible avec accordéon
 */
export function FormSection({ 
  title, 
  description, 
  children, 
  defaultOpen = true,
  badge 
}: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-heading font-bold text-charcoal-900">
            {title}
          </h2>
          {badge && (
            <span className="px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-secondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-secondary" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6">
          {description && (
            <p className="text-sm text-secondary mb-4">{description}</p>
          )}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================
// INPUTS DE BASE
// ===========================================

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  help?: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  maxLength?: number;
}

export function TextInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required, 
  help,
  type = 'text',
  maxLength
}: TextInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
      />
      {help && <p className="text-xs text-secondary mt-1">{help}</p>}
      {maxLength && (
        <p className="text-xs text-secondary mt-1 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  help?: string;
  rows?: number;
  maxLength?: number;
}

export function TextArea({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required, 
  help,
  rows = 4,
  maxLength
}: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors resize-y"
      />
      {help && <p className="text-xs text-secondary mt-1">{help}</p>}
      {maxLength && (
        <p className="text-xs text-secondary mt-1 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  required?: boolean;
  help?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export function NumberInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required, 
  help,
  min,
  max,
  step = 1,
  unit
}: NumberInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === '' ? undefined : parseFloat(val));
          }}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors ${
            unit ? 'pr-16' : ''
          }`}
        />
        {unit && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-sm font-medium text-secondary bg-stone-50 px-2 py-1 rounded">
              {unit}
            </span>
          </div>
        )}
      </div>
      {help && <p className="text-xs text-secondary mt-1">{help}</p>}
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  help?: string;
}

export function Select({ 
  label, 
  value, 
  onChange, 
  options, 
  required, 
  help 
}: SelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {help && <p className="text-xs text-secondary mt-1">{help}</p>}
    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  help?: string;
}

export function Checkbox({ label, checked, onChange, help }: CheckboxProps) {
  return (
    <div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 text-accent rounded focus:ring-accent"
        />
        <span className="text-sm font-medium">{label}</span>
      </label>
      {help && <p className="text-xs text-secondary mt-1 ml-6">{help}</p>}
    </div>
  );
}

// ===========================================
// INPUTS AVANCÉS
// ===========================================

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  help?: string;
  suggestions?: string[];
}

/**
 * Input pour gérer des tags (amenities, services, keywords, etc.)
 */
export function TagInput({ 
  label, 
  tags, 
  onChange, 
  placeholder = 'Ajouter un tag...', 
  help,
  suggestions = []
}: TagInputProps) {
  const [input, setInput] = useState('');
  
  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };
  
  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      {/* Tags existants */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="group inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-accent/15 to-accent/10 hover:from-accent/20 hover:to-accent/15 text-accent border border-accent/20 rounded-lg text-sm font-medium transition-all"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-accent/20 transition-colors"
                aria-label={`Supprimer ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      
      {/* Input ajout */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addTag(input);
          }
        }}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
      />
      
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-secondary">Suggestions :</span>
          {suggestions
            .filter(s => !tags.includes(s))
            .slice(0, 5)
            .map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="px-2 py-1 text-xs bg-stone-100 hover:bg-stone-200 rounded transition-colors"
              >
                + {suggestion}
              </button>
            ))}
        </div>
      )}
      
      {help && <p className="text-xs text-secondary mt-1">{help}</p>}
    </div>
  );
}

interface CheckboxGroupProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  help?: string;
  columns?: 1 | 2 | 3 | 4;
}

/**
 * Groupe de checkboxes (pour eventTypes, amenities, etc.)
 */
export function CheckboxGroup({ 
  label, 
  options, 
  selected, 
  onChange, 
  help,
  columns = 2 
}: CheckboxGroupProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => toggle(option.value)}
              className="w-4 h-4 text-accent rounded focus:ring-accent"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
      {help && <p className="text-xs text-secondary mt-1">{help}</p>}
    </div>
  );
}

// ===========================================
// LAYOUT HELPERS
// ===========================================

interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 4 | 6 | 8;
}

/**
 * Grille responsive pour layouts de formulaire
 */
export function Grid({ children, cols = 2, gap = 4 }: GridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-${gap}`}>
      {children}
    </div>
  );
}
