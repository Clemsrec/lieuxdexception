'use client';

import { useEffect, useState } from 'react';
import { 
  Users, UserPlus, Mail, Lock, Edit, Trash2, Search, 
  Shield, User, X, CheckCircle, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

/**
 * Page de gestion des utilisateurs
 * - Liste complète des users
 * - Ajout/Modification/Suppression
 * - Gestion des rôles (admin/user)
 * - Reset mot de passe
 */

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'admin' | 'user';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
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
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate(),
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
      // Validation
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
        throw new Error('Tous les champs sont obligatoires');
      }

      if (formData.password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Vérifier si email existe déjà
      if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Appel API pour créer user dans Firebase Auth + Firestore
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      setFormSuccess('Utilisateur créé avec succès');
      setTimeout(() => {
        setShowAddModal(false);
        resetForm();
        loadUsers();
      }, 1500);
    } catch (error: any) {
      setFormError(error.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      // Validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error('Tous les champs sont obligatoires');
      }

      // Vérifier si email existe déjà (sauf pour l'user actuel)
      if (users.some(u => u.id !== selectedUser.id && u.email.toLowerCase() === formData.email.toLowerCase())) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Appel API pour modifier user dans Firebase Auth + Firestore
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          email: formData.email,
          password: formData.password || undefined,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la modification');
      }

      setFormSuccess('Utilisateur modifié avec succès');
      setTimeout(() => {
        setShowEditModal(false);
        resetForm();
        loadUsers();
      }, 1500);
    } catch (error: any) {
      setFormError(error.message || 'Erreur lors de la modification');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      // Appel API pour supprimer user de Firebase Auth + Firestore
      const response = await fetch(`/api/admin/users?userId=${selectedUser.id}`, {
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
      console.error('Erreur suppression user:', error);
      alert(error.message || 'Erreur lors de la suppression');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '',
      role: user.role,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'user',
    });
    setFormError('');
    setFormSuccess('');
    setShowPassword(false);
  };

  // Filtrage
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query)
    );
  });

  const statsCards = [
    { label: 'Total utilisateurs', value: users.length, color: 'bg-charcoal-800' },
    { label: 'Administrateurs', value: users.filter(u => u.role === 'admin').length, color: 'bg-accent' },
    { label: 'Utilisateurs', value: users.filter(u => u.role === 'user').length, color: 'bg-success' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-charcoal-900 mb-2">
            Gestion des utilisateurs
          </h1>
          <p className="text-secondary">
            Gérer les comptes utilisateurs et leurs permissions
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
            <p className="text-sm text-secondary mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-charcoal-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-secondary">
            Chargement...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-3 text-secondary" />
            <p className="text-secondary">
              {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                        Créé le
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-secondary uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-charcoal-800/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-charcoal-900" />
                            </div>
                            <div>
                              <p className="font-medium text-charcoal-900">
                                {user.firstName} {user.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-secondary">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-accent/10 text-accent'
                                : 'bg-neutral-200 text-secondary'
                            }`}
                          >
                            {user.role === 'admin' ? (
                              <Shield className="w-3 h-3" />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                            {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-secondary">
                          {user.createdAt.toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 text-charcoal-900 hover:bg-charcoal-800/10 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
          </table>
        </div>
      )}
    </div>

      {/* Modal Ajout */}
      {showAddModal && (
          <Modal
            title="Ajouter un utilisateur"
            onClose={() => {
              setShowAddModal(false);
              resetForm();
            }}
          >
            <form onSubmit={handleAddUser} className="space-y-4">
              {formError && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <p className="text-sm text-danger">{formError}</p>
                </div>
              )}

              {formSuccess && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-success">{formSuccess}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-900 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-900 mb-2">
                  Mot de passe * (min. 6 caractères)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-charcoal-900"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-900 mb-2">
                  Rôle *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary flex-1"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Création...' : 'Créer l\'utilisateur'}
                </button>
              </div>
            </form>
          </Modal>
        )}

      {/* Modal Édition */}
      {showEditModal && selectedUser && (
          <Modal
            title="Modifier l'utilisateur"
            onClose={() => {
              setShowEditModal(false);
              resetForm();
            }}
          >
            <form onSubmit={handleEditUser} className="space-y-4">
              {formError && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <p className="text-sm text-danger">{formError}</p>
                </div>
              )}

              {formSuccess && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-success">{formSuccess}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-900 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-900 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-900 mb-2">
                  Nouveau mot de passe (optionnel, min. 6 caractères)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    minLength={6}
                    placeholder="Laisser vide pour ne pas modifier"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-charcoal-900"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-900 mb-2">
                  Rôle *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary flex-1"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Modification...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </Modal>
        )}

      {/* Modal Suppression */}
      {showDeleteModal && selectedUser && (
          <Modal
            title="Supprimer l'utilisateur"
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedUser(null);
            }}
          >
            <div className="space-y-4">
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-danger shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-danger mb-1">
                      Attention : Action irréversible
                    </p>
                    <p className="text-sm text-secondary">
                      Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{' '}
                      <strong className="text-charcoal-900">
                        {selectedUser?.firstName} {selectedUser?.lastName}
                      </strong>{' '}
                      ({selectedUser?.email}) ?
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="btn btn-secondary flex-1"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="btn bg-danger hover:bg-danger/90 text-white flex-1"
                  disabled={submitting}
              >
                {submitting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </Modal>
        )}
      </div>
  );
}

// Composant Modal réutilisable
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold text-charcoal-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
