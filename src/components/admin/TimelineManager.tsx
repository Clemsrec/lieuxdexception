'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import ImageInputField from './ImageInputField';

/**
 * Interface pour un événement de timeline
 */
interface TimelineEvent {
  id?: string;
  year: string;
  month?: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imagePosition: 'top' | 'bottom';
  isMajor?: boolean;
  venue?: string;
  venueName?: string;
  event?: string;
  category?: string;
  visible: boolean;
  order: number;
}

/**
 * Composant de gestion des événements de la timeline
 */
export default function TimelineManager() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Charger les événements au montage
  useEffect(() => {
    loadEvents();
  }, []);

  /**
   * Charger les événements depuis Firestore
   */
  const loadEvents = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/timeline-events');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des événements');
      }
      
      const data = await response.json();
      setEvents(data.sort((a: TimelineEvent, b: TimelineEvent) => a.order - b.order));
    } catch (error) {
      console.error('Erreur chargement:', error);
      setMessage({ type: 'error', text: 'Impossible de charger les événements' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sauvegarder un événement
   */
  const saveEvent = async (event: TimelineEvent) => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/timeline-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      setMessage({ type: 'success', text: 'Événement sauvegardé avec succès' });
      await loadEvents();
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Supprimer un événement
   */
  const deleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/timeline-events?id=${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setMessage({ type: 'success', text: 'Événement supprimé avec succès' });
      await loadEvents();
    } catch (error: any) {
      console.error('Erreur suppression:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Ajouter un nouvel événement
   */
  const addNewEvent = () => {
    const newEvent: TimelineEvent = {
      year: new Date().getFullYear().toString(),
      month: '',
      date: new Date().toISOString().split('T')[0],
      title: 'Nouveau lieu',
      subtitle: 'Événement',
      description: 'Description de l\'événement',
      image: '',
      imagePosition: 'bottom',
      isMajor: false,
      visible: true,
      order: events.length,
    };
    
    setEvents([...events, newEvent]);
    setExpandedEvent(`new-${events.length}`);
  };

  /**
   * Mettre à jour un événement localement
   */
  const updateEventField = (index: number, field: keyof TimelineEvent, value: any) => {
    const updatedEvents = [...events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setEvents(updatedEvents);
  };

  /**
   * Toggle visibilité
   */
  const toggleVisibility = async (index: number) => {
    const event = events[index];
    const updated = { ...event, visible: !event.visible };
    updateEventField(index, 'visible', !event.visible);
    if (event.id) {
      await saveEvent(updated);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-linear-to-r from-primary to-accent p-6">
          <h1 className="text-2xl font-display text-white">Gestion de la Timeline</h1>
          <p className="text-white/90 text-sm mt-1">Gérer les événements affichés sur la page Histoire</p>
        </div>

        {/* Messages de succès/erreur */}
        {message && (
          <div className={`p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="text-neutral-600 mt-4">Chargement des événements...</p>
          </div>
        )}

        {/* Liste des événements */}
        {!loading && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-primary">Événements ({events.length})</h2>
              <button
                onClick={addNewEvent}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
              >
                <Plus className="w-4 h-4" />
                Ajouter un événement
              </button>
            </div>

            <div className="space-y-4">
              {events.map((event, index) => (
                <div
                  key={event.id || `new-${index}`}
                  className="border border-neutral-200 rounded-lg overflow-hidden"
                >
                  {/* Header de l'événement */}
                  <div className="bg-neutral-50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => setExpandedEvent(expandedEvent === (event.id || `new-${index}`) ? null : (event.id || `new-${index}`))}
                        className="text-primary hover:text-accent transition"
                      >
                        {expandedEvent === (event.id || `new-${index}`) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary">
                          {event.year} {event.month && `- ${event.month}`} | {event.title}
                        </h3>
                        <p className="text-sm text-neutral-600">{event.subtitle}</p>
                      </div>
                      <button
                        onClick={() => toggleVisibility(index)}
                        className={`p-2 rounded-lg transition ${event.visible ? 'bg-green-100 text-green-600' : 'bg-neutral-200 text-neutral-500'}`}
                        title={event.visible ? 'Visible' : 'Masqué'}
                      >
                        {event.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Contenu éditable */}
                  {expandedEvent === (event.id || `new-${index}`) && (
                    <div className="p-6 bg-white space-y-4">
                      
                      {/* Ligne 1 : Année, Mois, Date */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Année *</label>
                          <input
                            type="text"
                            value={event.year}
                            onChange={(e) => updateEventField(index, 'year', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="2025"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Mois</label>
                          <input
                            type="text"
                            value={event.month || ''}
                            onChange={(e) => updateEventField(index, 'month', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="Décembre"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Date complète *</label>
                          <input
                            type="date"
                            value={event.date}
                            onChange={(e) => updateEventField(index, 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Ligne 2 : Titre, Sous-titre */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Titre *</label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => updateEventField(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="LE CHÂTEAU DE LA CORBE"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Sous-titre *</label>
                          <input
                            type="text"
                            value={event.subtitle}
                            onChange={(e) => updateEventField(index, 'subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="Acquisition"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Description *</label>
                        <textarea
                          value={event.description}
                          onChange={(e) => updateEventField(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder="Description de l&apos;événement..."
                        />
                      </div>

                      {/* Image */}
                      <ImageInputField
                        label="Image de l'événement *"
                        value={event.image}
                        onChange={(url) => updateEventField(index, 'image', url)}
                        placeholder="URL de l'image ou chemin Firebase Storage"
                      />

                      {/* Options */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Position image</label>
                          <select
                            value={event.imagePosition}
                            onChange={(e) => updateEventField(index, 'imagePosition', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          >
                            <option value="top">Haut</option>
                            <option value="bottom">Bas</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Ordre d&apos;affichage</label>
                          <input
                            type="number"
                            value={event.order}
                            onChange={(e) => updateEventField(index, 'order', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={event.isMajor || false}
                              onChange={(e) => updateEventField(index, 'isMajor', e.target.checked)}
                              className="w-4 h-4 text-accent focus:ring-accent border-neutral-300 rounded"
                            />
                            <span className="text-sm text-primary">Événement majeur</span>
                          </label>
                        </div>
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                        <button
                          onClick={() => deleteEvent(event.id!)}
                          disabled={!event.id || saving}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                        <button
                          onClick={() => saveEvent(event)}
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
