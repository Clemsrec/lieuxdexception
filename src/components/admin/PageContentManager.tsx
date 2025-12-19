'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ImageInputField from './ImageInputField';

// Types des pages disponibles
const PAGES = [
  { id: 'homepage', name: 'Page d\'Accueil' },
  { id: 'contact', name: 'Contact' },
  { id: 'mariages', name: 'Mariages' },
  { id: 'b2b', name: 'Événements B2B' },
  { id: 'histoire', name: 'Histoire' },
];

// Locales disponibles
const LOCALES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
];

/**
 * Composant principal de gestion des contenus de pages
 */
export default function PageContentManager() {
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [selectedLocale, setSelectedLocale] = useState('fr');
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Charger le contenu au changement de page/locale
  useEffect(() => {
    loadContent();
  }, [selectedPage, selectedLocale]);

  /**
   * Charger le contenu depuis Firestore
   */
  const loadContent = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch(`/api/admin/page-contents?pageId=${selectedPage}&locale=${selectedLocale}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du contenu');
      }
      
      const data = await response.json();
      setContent(data || getDefaultContent());
    } catch (error) {
      console.error('Erreur chargement contenu:', error);
      setMessage({ type: 'error', text: 'Impossible de charger le contenu' });
      setContent(getDefaultContent());
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sauvegarder le contenu
   */
  const saveContent = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      console.log('[Client] Envoi des données:', { 
        pageId: selectedPage, 
        locale: selectedLocale, 
        content: {
          hero: content.hero,
          sectionsCount: content.sections?.length,
          featuresCount: content.features?.length
        }
      });

      const response = await fetch('/api/admin/page-contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: selectedPage,
          locale: selectedLocale,
          content,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        console.error('Erreur API:', response.status, errorData);
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }
      
      setMessage({ type: 'success', text: 'Contenu enregistré avec succès' });
      
      // Masquer le message après 3 secondes
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      const errorMessage = error instanceof Error ? error.message : 'Impossible de sauvegarder le contenu';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Obtenir un contenu par défaut vide
   */
  const getDefaultContent = () => ({
    id: selectedPage,
    pageName: PAGES.find(p => p.id === selectedPage)?.name || selectedPage,
    locale: selectedLocale,
    hero: {
      title: '',
      subtitle: '',
      description: '',
      backgroundImage: '',
      ctaText: '',
      ctaLink: '',
    },
    sections: [],
    blocks: [],
    featureCards: [],
    contactInfo: [],
    finalCta: null,
  });

  /**
   * Mettre à jour le hero
   */
  const updateHero = (field: string, value: string) => {
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value },
    });
  };

  /**
   * Ajouter une section
   */
  const addSection = () => {
    const newSection = {
      id: `section_${Date.now()}`,
      title: 'Nouvelle Section',
      content: '',
      order: content.sections.length,
      visible: true,
    };
    
    setContent({
      ...content,
      sections: [...content.sections, newSection],
    });
  };

  /**
   * Mettre à jour une section
   */
  const updateSection = (index: number, field: string, value: any) => {
    const updatedSections = [...content.sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setContent({ ...content, sections: updatedSections });
  };

  /**
   * Supprimer une section
   */
  const deleteSection = (index: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette section ?')) return;
    
    const updatedSections = content.sections.filter((_: any, i: number) => i !== index);
    setContent({ ...content, sections: updatedSections });
  };

  /**
   * Ajouter une feature card
   */
  const addFeatureCard = () => {
    const newCard = {
      id: `card_${Date.now()}`,
      number: `0${content.featureCards.length + 1}`,
      title: 'Nouvelle Fonctionnalité',
      content: '',
      order: content.featureCards.length,
      visible: true,
    };
    
    setContent({
      ...content,
      featureCards: [...content.featureCards, newCard],
    });
  };

  /**
   * Mettre à jour une feature card
   */
  const updateFeatureCard = (index: number, field: string, value: any) => {
    const updatedCards = [...content.featureCards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setContent({ ...content, featureCards: updatedCards });
  };

  /**
   * Supprimer une feature card
   */
  const deleteFeatureCard = (index: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette carte ?')) return;
    
    const updatedCards = content.featureCards.filter((_: any, i: number) => i !== index);
    setContent({ ...content, featureCards: updatedCards });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-secondary text-lg">Chargement du contenu...</div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="space-y-6">
      {/* Sélecteurs de page et locale */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sélection de la page */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Page à éditer
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {PAGES.map(page => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection de la locale */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Langue
            </label>
            <select
              value={selectedLocale}
              onChange={(e) => setSelectedLocale(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {LOCALES.map(locale => (
                <option key={locale.code} value={locale.code}>
                  {locale.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Messages de succès/erreur */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Section Hero */}
      <HeroSection hero={content.hero} updateHero={updateHero} />

      {/* Sections de contenu */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Sections de Contenu</h2>
          <button
            onClick={addSection}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une section
          </button>
        </div>

        <div className="space-y-4">
          {content.sections.map((section: any, index: number) => (
            <SectionEditor
              key={section.id}
              section={section}
              index={index}
              updateSection={updateSection}
              deleteSection={deleteSection}
            />
          ))}
          
          {content.sections.length === 0 && (
            <p className="text-secondary text-center py-8">Aucune section pour le moment</p>
          )}
        </div>
      </div>

      {/* Feature Cards (pour homepage) */}
      {selectedPage === 'homepage' && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary">Cartes de Fonctionnalités</h2>
            <button
              onClick={addFeatureCard}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter une carte
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.featureCards.map((card: any, index: number) => (
              <FeatureCardEditor
                key={card.id}
                card={card}
                index={index}
                updateCard={updateFeatureCard}
                deleteCard={deleteFeatureCard}
              />
            ))}
          </div>
          
          {content.featureCards.length === 0 && (
            <p className="text-secondary text-center py-8">Aucune carte pour le moment</p>
          )}
        </div>
      )}

      {/* Bouton de sauvegarde fixe en bas */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-200 shadow-lg rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">
            {content.version ? `Version ${content.version}` : 'Nouveau contenu'}
            {content.updatedBy && ` • Dernière modification par ${content.updatedBy}`}
          </p>
          <button
            onClick={saveContent}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant pour éditer la section Hero
 */
function HeroSection({ hero, updateHero }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <h2 className="text-xl font-semibold text-primary mb-4">Section Hero</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Titre</label>
          <input
            type="text"
            value={hero.title}
            onChange={(e) => updateHero('title', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Titre principal de la page"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">Sous-titre</label>
          <input
            type="text"
            value={hero.subtitle}
            onChange={(e) => updateHero('subtitle', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Sous-titre accrocheur"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">Description</label>
          <RichTextEditor
            content={hero.description}
            onChange={(html) => updateHero('description', html)}
            placeholder="Description courte..."
            minHeight="150px"
          />
        </div>

        <div>
          <ImageInputField
            label="Image de fond Hero"
            value={hero.backgroundImage}
            onChange={(url) => updateHero('backgroundImage', url)}
            placeholder="/images/hero.jpg"
            helpText="Image de fond pour la section Hero (format recommandé: WebP, 1920x1080px)"
            initialPickerPath="images"
            previewSize={300}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Texte du bouton CTA</label>
            <input
              type="text"
              value={hero.ctaText}
              onChange={(e) => updateHero('ctaText', e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Contactez-nous"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">Lien du bouton CTA</label>
          <input
            type="text"
            value={hero.ctaLink}
            onChange={(e) => updateHero('ctaLink', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="/contact"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Composant pour éditer une section
 */
function SectionEditor({ section, index, updateSection, deleteSection }: any) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-neutral-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-secondary hover:text-primary transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <h3 className="font-medium text-primary">{section.title || 'Section sans titre'}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => updateSection(index, 'visible', !section.visible)}
            className={`p-2 rounded ${section.visible ? 'text-green-600 hover:bg-green-50' : 'text-neutral-400 hover:bg-neutral-100'}`}
            title={section.visible ? 'Visible' : 'Masqué'}
          >
            {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => deleteSection(index)}
            className="p-2 rounded text-red-600 hover:bg-red-50"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Titre de la section</label>
            <RichTextEditor
              content={section.title}
              onChange={(html) => updateSection(index, 'title', html)}
              placeholder="Titre de la section..."
              minHeight="80px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Contenu</label>
            <RichTextEditor
              content={section.content}
              onChange={(html) => updateSection(index, 'content', html)}
              placeholder="Saisissez le contenu de la section..."
              minHeight="250px"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Composant pour éditer une feature card
 */
function FeatureCardEditor({ card, index, updateCard, deleteCard }: any) {
  return (
    <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-accent">{card.number}</span>
          <input
            type="text"
            value={card.title}
            onChange={(e) => updateCard(index, 'title', e.target.value)}
            className="flex-1 px-3 py-1 border border-neutral-300 rounded focus:ring-2 focus:ring-accent focus:border-transparent font-medium"
            placeholder="Titre de la carte"
          />
        </div>
        <button
          onClick={() => deleteCard(index)}
          className="p-1 rounded text-red-600 hover:bg-red-50"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <RichTextEditor
        content={card.content}
        onChange={(html) => updateCard(index, 'content', html)}
        placeholder="Contenu de la carte..."
        minHeight="120px"
      />

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={card.visible}
            onChange={(e) => updateCard(index, 'visible', e.target.checked)}
            className="rounded border-neutral-300 text-accent focus:ring-accent"
          />
          <span className="text-secondary">Visible</span>
        </label>
      </div>
    </div>
  );
}
