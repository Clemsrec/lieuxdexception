'use client';

import { useState, FormEvent } from 'react';
import type { B2BForm, WeddingForm } from '@/lib/validation';

/**
 * Hook personnalisé pour gérer la soumission des formulaires de contact
 * Gère : validation, soumission API, états loading/success/error
 */
export function useContactForm(type: 'b2b' | 'mariage') {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (formData: Partial<B2BForm | WeddingForm>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setSuccess(true);
      return { success: true, data };

    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      return { success: false, error: errorMessage };

    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setSuccess(false);
    setError(null);
  };

  return {
    loading,
    success,
    error,
    submitForm,
    reset,
  };
}

/**
 * Composant Message de succès après soumission
 */
export function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Demande envoyée avec succès !
          </h3>
          <p className="text-green-700 mb-4">
            Merci pour votre intérêt. Notre équipe vous contactera dans les <strong>24-48 heures</strong>.
          </p>
          <p className="text-sm text-green-600 mb-4">
            📧 Un email de confirmation vous a été envoyé.<br />
            🔔 Nos administrateurs ont été notifiés en temps réel.
          </p>
          <button
            onClick={onReset}
            className="text-sm text-green-700 hover:text-green-900 underline"
          >
            Envoyer une nouvelle demande
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant Message d'erreur
 */
export function ErrorMessage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ❌ Erreur lors de l&apos;envoi
          </h3>
          <p className="text-red-700 mb-4">
            {error}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onRetry}
              className="text-sm text-red-700 hover:text-red-900 underline font-medium"
            >
              Réessayer
            </button>
            <a
              href="mailto:contact@lieuxdexception.fr"
              className="text-sm text-red-700 hover:text-red-900 underline"
            >
              Nous contacter par email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Bouton de soumission avec état loading
 */
export function SubmitButton({ loading, disabled, children }: { 
  loading: boolean; 
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="btn btn-primary w-full text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Envoi en cours...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Champ de formulaire avec validation inline
 */
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  rows?: number;
}

export function FormField({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  error,
  value,
  onChange,
  disabled,
  min,
  max,
  rows,
}: FormFieldProps) {
  const isTextarea = type === 'textarea';
  const hasError = !!error;

  const inputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none ${
    hasError 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-neutral-300'
  } ${disabled ? 'bg-neutral-100 cursor-not-allowed' : ''}`;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-primary mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows || 4}
          className={inputClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={inputClasses}
        />
      )}

      {hasError && (
        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
