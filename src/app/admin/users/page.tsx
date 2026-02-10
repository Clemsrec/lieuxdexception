'use client';

import { useEffect, useState } from 'react';
import { Users, UserPlus, Trash2, Shield, RefreshCw } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

/**
 * Page de gestion des utilisateurs simplifiée
 * - Liste simple des admins
 * - Ajout d'admin (email seulement)
 * - Suppression d'admin
 */

interface User {
  id: string;
  email: string;
  role: 'admin';
  createdAt: Date;
}

interface UserFormData {
  email: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({ email: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!db) return;
    
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as User[];
      
      setUsers(usersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('Erreur chargement users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      // Validation simple
      if (!formData.email) {
        throw new Error('Email obligatoire');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Format email invalide');
      }

      // Vérifier si email existe déjà
      if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Appel API pour créer admin
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          role: 'admin',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      setFormSuccess('Admin créé avec succès');
      setTimeout(() => {
        setShowAddModal(false);
        setFormData({ email: '' });
        loadUsers();
      }, 1500);
    } catch (error: any) {
      setFormError(error.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      setShowDeleteModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      setFormError(error.message || 'Erreur lors de la suppression');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              Gestion des Utilisateurs
            </h1>
            <p className="text-secondary">
              Gérer les comptes administrateurs qui peuvent accéder au dashboard
            </p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Ajouter Admin
          </button>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
                <Users className="w-5 h-5" />
                Administrateurs ({users.length})
              </h2>
              <button
                onClick={loadUsers}
                className="btn-ghost btn-sm flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
          </div>

          <div className="divide-y divide-neutral-200">
            {loading ? (
              <div className="p-8 text-center text-secondary">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                Chargement...
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-secondary">
                Aucun utilisateur trouvé
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">{user.email}</h3>
                        <p className="text-sm text-secondary">
                          Admin depuis le {user.createdAt.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      className="btn-ghost btn-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Ajout */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Ajouter un Administrateur
              </h3>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleAddUser}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ email: e.target.value })}
                    className="form-input w-full"
                    placeholder="admin@example.com"
                    disabled={submitting}
                    required
                  />
                  <p className="text-xs text-secondary mt-1">
                    Cet email sera invité comme administrateur
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ email: '' });
                      setFormError('');
                      setFormSuccess('');
                    }}
                    className="btn-ghost"
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Création...' : 'Créer Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Suppression */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Supprimer l'Administrateur
              </h3>
              
              <p className="text-secondary mb-6">
                Êtes-vous sûr de vouloir supprimer l'administrateur{' '}
                <strong>{selectedUser.email}</strong> ? Cette action est irréversible.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="btn-ghost"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                  disabled={submitting}
                >
                  {submitting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}