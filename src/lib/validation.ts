/**
 * Schémas de Validation Zod - Lieux d'Exception
 * 
 * Validation stricte des données pour tous les formulaires
 * et endpoints API du site.
 */

import { z } from 'zod';

// ===========================================
// SCHÉMAS DE BASE
// ===========================================

/**
 * Email valide
 */
export const emailSchema = z
  .string()
  .email('Email invalide')
  .min(5, 'Email trop court')
  .max(100, 'Email trop long')
  .toLowerCase()
  .trim();

/**
 * Téléphone français (formats variés acceptés)
 */
export const phoneSchema = z
  .string()
  .regex(
    /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
    'Numéro de téléphone français invalide'
  )
  .transform(val => val.replace(/[\s.-]/g, '')); // Normalise le format

/**
 * Nom/Prénom (lettres, espaces, tirets, accents)
 */
export const nameSchema = z
  .string()
  .min(2, 'Minimum 2 caractères')
  .max(50, 'Maximum 50 caractères')
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    'Seules les lettres, espaces, tirets et apostrophes sont autorisés'
  )
  .trim();

/**
 * Message texte (commentaire, description)
 */
export const messageSchema = z
  .string()
  .min(10, 'Message trop court (minimum 10 caractères)')
  .max(2000, 'Message trop long (maximum 2000 caractères)')
  .trim();

/**
 * URL valide
 */
export const urlSchema = z
  .string()
  .url('URL invalide')
  .max(500, 'URL trop longue');

/**
 * Date future (pour événements)
 */
export const futureDateSchema = z
  .string()
  .or(z.date())
  .refine(
    (val) => {
      const date = typeof val === 'string' ? new Date(val) : val;
      return date > new Date();
    },
    { message: 'La date doit être dans le futur' }
  );

// ===========================================
// SCHÉMAS POUR LES LEADS (Prospects)
// ===========================================

/**
 * Type d'événement
 */
export const eventTypeSchema = z.enum(['b2b', 'wedding'], {
  errorMap: () => ({ message: 'Type d\'événement invalide' }),
});

/**
 * Informations de contact
 */
export const contactInfoSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().max(100).optional(),
  position: z.string().max(100).optional(),
});

/**
 * Détails de l'événement
 */
export const eventDetailsSchema = z.object({
  type: eventTypeSchema,
  date: futureDateSchema.optional(),
  guestCount: z
    .number()
    .int('Le nombre doit être un entier')
    .min(10, 'Minimum 10 invités')
    .max(500, 'Maximum 500 invités')
    .optional(),
  budget: z
    .number()
    .min(0, 'Le budget doit être positif')
    .optional(),
  description: messageSchema.optional(),
  venueId: z.string().optional(),
});

/**
 * Lead complet (prospect)
 */
export const leadSchema = z.object({
  type: eventTypeSchema,
  contactInfo: contactInfoSchema,
  eventDetails: eventDetailsSchema,
  source: z.string().max(100).default('website'),
  status: z
    .enum(['new', 'contacted', 'qualified', 'converted', 'lost'])
    .default('new'),
  notes: z.string().max(5000).optional(),
});

// ===========================================
// SCHÉMAS POUR LES FORMULAIRES
// ===========================================

/**
 * Formulaire de contact rapide
 */
export const quickContactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  message: messageSchema,
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({
      message: 'Vous devez accepter la politique de confidentialité',
    }),
  }),
});

/**
 * Formulaire B2B
 */
export const b2bFormSchema = z.object({
  // Informations de contact
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().min(2).max(100),
  position: z.string().max(100).optional(),
  
  // Détails de l'événement
  eventType: z.enum(['seminar', 'conference', 'team_building', 'corporate']),
  eventDate: futureDateSchema.optional(),
  guestCount: z.number().int().min(10).max(500),
  budget: z.number().min(0).optional(),
  requirements: messageSchema.optional(),
  
  // Lieu souhaité
  venueId: z.string().optional(),
  
  // Consentement
  acceptPrivacy: z.literal(true),
  acceptMarketing: z.boolean().default(false),
});

/**
 * Formulaire Mariage
 */
export const weddingFormSchema = z.object({
  // Couple
  bride: z.object({
    firstName: nameSchema,
    lastName: nameSchema,
  }),
  groom: z.object({
    firstName: nameSchema,
    lastName: nameSchema,
  }),
  
  // Contact
  email: emailSchema,
  phone: phoneSchema,
  
  // Événement
  weddingDate: futureDateSchema.optional(),
  guestCount: z.number().int().min(20).max(500),
  budget: z.number().min(0).optional(),
  requirements: messageSchema.optional(),
  
  // Lieu souhaité
  venueId: z.string().optional(),
  
  // Consentement
  acceptPrivacy: z.literal(true),
  acceptMarketing: z.boolean().default(false),
});

// ===========================================
// SCHÉMAS POUR LES VENUES (Lieux)
// ===========================================

/**
 * Création/Mise à jour d'un lieu
 */
export const venueSchema = z.object({
  name: z.string().min(3).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug invalide (minuscules, chiffres, tirets uniquement)'),
  location: z.string().min(5).max(200),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide'),
    country: z.string().default('France'),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }).optional(),
  }),
  capacity: z.number().int().min(10).max(1000),
  description: z.string().min(50).max(2000),
  features: z.array(z.string()).min(1).max(20),
  images: z.array(urlSchema).min(1).max(20),
  pricing: z.object({
    b2b_half_day: z.number().min(0),
    b2b_full_day: z.number().min(0),
    wedding_weekend: z.number().min(0),
  }),
  isActive: z.boolean().default(true),
});

// ===========================================
// TYPES TYPESCRIPT (inférés depuis les schémas)
// ===========================================

export type Lead = z.infer<typeof leadSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type EventDetails = z.infer<typeof eventDetailsSchema>;
export type QuickContact = z.infer<typeof quickContactSchema>;
export type B2BForm = z.infer<typeof b2bFormSchema>;
export type WeddingForm = z.infer<typeof weddingFormSchema>;
export type Venue = z.infer<typeof venueSchema>;

// ===========================================
// UTILITAIRES DE VALIDATION
// ===========================================

/**
 * Valide des données et retourne les erreurs formatées
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true as const, data: result.data };
  }
  
  return {
    success: false as const,
    errors: result.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  };
}

/**
 * Sanitize une chaîne pour éviter les injections XSS
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Supprime les balises HTML
    .replace(/javascript:/gi, '') // Supprime javascript:
    .replace(/on\w+=/gi, '') // Supprime les event handlers
    .trim();
}

/**
 * Valide et sanitize un email
 */
export function sanitizeEmail(email: string): string {
  const sanitized = email.toLowerCase().trim();
  const result = emailSchema.safeParse(sanitized);
  return result.success ? result.data : '';
}
