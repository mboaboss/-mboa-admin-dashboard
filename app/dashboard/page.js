'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  LogOut, 
  Filter, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  User,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
  Download
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DashboardPage() {
  const router = useRouter()
  
  // States
  const [kycList, setKycList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKyc, setSelectedKyc] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/')
    }
  }, [router])

  // Charger les KYC au montage du composant
  useEffect(() => {
    fetchKYCs()
  }, [])

  // Filtrer la liste quand les filtres changent
  useEffect(() => {
    filterKYCs()
  }, [kycList, filterStatus, searchTerm])

  // Fonction pour récupérer les KYC depuis l'API
  const fetchKYCs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/kyc/list')
      const result = await response.json()

      if (result.success) {
        setKycList(result.data)
        calculateStats(result.data)
      } else {
        alert('Erreur lors du chargement des KYC')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  // Calculer les statistiques
  const calculateStats = (data) => {
    setStats({
      total: data.length,
      pending: data.filter(k => k.status === 'pending').length,
      approved: data.filter(k => k.status === 'approved').length,
      rejected: data.filter(k => k.status === 'rejected').length
    })
  }

  // Filtrer les KYC selon les critères
  const filterKYCs = () => {
    let filtered = [...kycList]

    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(k => k.status === filterStatus)
    }

    // Filtre par recherche (nom ou wallet)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(k => 
        k.full_name?.toLowerCase().includes(search) ||
        k.wallet_address?.toLowerCase().includes(search) ||
        k.phone_number?.includes(search)
      )
    }

    setFilteredList(filtered)
  }

  // Approuver un KYC
  const handleApprove = async (kyc) => {
    if (!confirm(`Confirmer l'approbation du KYC de ${kyc.full_name} ?`)) {
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch('/api/kyc/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: kyc.id })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ KYC approuvé avec succès !')
        setShowModal(false)
        fetchKYCs() // Recharger la liste
      } else {
        alert('❌ Erreur: ' + result.error)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('❌ Erreur lors de l\'approbation')
    } finally {
      setActionLoading(false)
    }
  }

  // Rejeter un KYC
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('⚠️ Veuillez entrer un motif de rejet')
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch('/api/kyc/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: selectedKyc.id,
          reason: rejectReason 
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ KYC rejeté avec succès')
        setShowRejectModal(false)
        setShowModal(false)
        setRejectReason('')
        fetchKYCs()
      } else {
        alert('❌ Erreur: ' + result.error)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('❌ Erreur lors du rejet')
    } finally {
      setActionLoading(false)
    }
  }

  // Déconnexion
  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      localStorage.removeItem('admin_token')
      router.push('/')
    }
  }

  // Ouvrir le modal de détails
  const openModal = (kyc) => {
    setSelectedKyc(kyc)
    setShowModal(true)
  }

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: fr })
    } catch {
      return 'N/A'
    }
  }

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: <Clock className="w-4 h-4" />,
        text: 'En attente',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      },
      approved: {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Approuvé',
        className: 'bg-green-100 text-green-800 border-green-300'
      },
      rejected: {
        icon: <XCircle className="w-4 h-4" />,
        text: 'Rejeté',
        className: 'bg-red-100 text-red-800 border-red-300'
      }
    }

    const badge = badges[status] || badges.pending

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${badge.className}`}>
        {badge.icon}
        {badge.text}
      </span>
    )
  }

  // Render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                MBOA Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Gestion des vérifications KYC
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<User className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="En attente"
            value={stats.pending}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="Approuvés"
            value={stats.approved}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Rejetés"
            value={stats.rejected}
            icon={<XCircle className="w-6 h-6" />}
            color="red"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, wallet ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchKYCs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>

        {/* KYC Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Chargement des KYC...</p>
              </div>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Aucun KYC trouvé</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Essayez de modifier vos filtres'
                    : 'Aucune soumission KYC pour le moment'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wallet Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date soumission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredList.map((kyc) => (
                    <tr key={kyc.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {kyc.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {kyc.phone_number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">
                          {kyc.wallet_address?.substring(0, 6)}...{kyc.wallet_address?.substring(38)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(kyc.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(kyc.submitted_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => openModal(kyc)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de détails KYC */}
      {showModal && selectedKyc && (
        <KYCModal
          kyc={selectedKyc}
          onClose={() => setShowModal(false)}
          onApprove={() => handleApprove(selectedKyc)}
          onReject={() => setShowRejectModal(true)}
          actionLoading={actionLoading}
          formatDate={formatDate}
          getStatusBadge={getStatusBadge}
        />
      )}

      {/* Modal de rejet */}
      {showRejectModal && (
        <RejectModal
          kyc={selectedKyc}
          reason={rejectReason}
          onReasonChange={setRejectReason}
          onConfirm={handleReject}
          onCancel={() => {
            setShowRejectModal(false)
            setRejectReason('')
          }}
          loading={actionLoading}
        />
      )}
    </div>
  )
}

// Composant StatCard
function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// Composant KYCModal
function KYCModal({ kyc, onClose, onApprove, onReject, actionLoading, formatDate, getStatusBadge }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Détails du KYC</h2>
            <p className="text-sm text-gray-600 mt-1">
              Soumis le {formatDate(kyc.submitted_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Statut actuel */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut actuel
            </label>
            <div>{getStatusBadge(kyc.status)}</div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                icon={<User className="w-4 h-4" />}
                label="Nom complet"
                value={kyc.full_name}
              />
              <InfoField
                icon={<Calendar className="w-4 h-4" />}
                label="Date de naissance"
                value={kyc.birth_date}
              />
              <InfoField
                icon={<MapPin className="w-4 h-4" />}
                label="Nationalité"
                value={kyc.nationality}
              />
              <InfoField
                icon={<Phone className="w-4 h-4" />}
                label="Téléphone"
                value={kyc.phone_number}
              />
            </div>
            <div className="mt-4">
              <InfoField
                label="Wallet Address"
                value={kyc.wallet_address}
                mono
              />
            </div>
          </div>

          {/* Documents */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Documents téléchargés
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DocumentPreview
                title="Pièce d'identité (Recto)"
                url={kyc.id_photo_url}
              />
              <DocumentPreview
                title="Selfie"
                url={kyc.selfie_url}
              />
              <DocumentPreview
                title="Justificatif d'adresse"
                url={kyc.proof_address_url}
              />
            </div>
          </div>

          {/* Historique */}
          {kyc.reviewed_at && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Historique</h4>
              <p className="text-sm text-gray-600">
                Vérifié le {formatDate(kyc.reviewed_at)}
              </p>
            </div>
          )}

          {/* Motif de rejet si existe */}
          {kyc.rejection_reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Motif de rejet
              </h4>
              <p className="text-sm text-red-800">{kyc.rejection_reason}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {kyc.status === 'pending' && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onReject}
              disabled={actionLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition"
            >
              <XCircle className="w-5 h-5" />
              Rejeter
            </button>
            <button
              onClick={onApprove}
              disabled={actionLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition"
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Approuver
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant InfoField
function InfoField({ icon, label, value, mono = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
        {icon}
        {label}
      </label>
      <p className={`text-sm text-gray-900 ${mono ? 'font-mono break-all' : ''}`}>
        {value || 'N/A'}
      </p>
    </div>
  )
}

// Composant DocumentPreview
function DocumentPreview({ title, url }) {
  const [imageError, setImageError] = useState(false)

  if (!url) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xs text-gray-400 mt-2">Non disponible</p>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-700">{title}</p>
      </div>
      <div className="p-2">
        {imageError ? (
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <p className="text-xs text-gray-500">Erreur de chargement</p>
          </div>
        ) : (
          <img
            src={url}
            alt={title}
            className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-90 transition"
            onClick={() => window.open(url, '_blank')}
            onError={() => setImageError(true)}
          />
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm rounded transition"
        >
          <Download className="w-4 h-4" />
          Télécharger
        </a>
      </div>
    </div>
  )
}

// Composant RejectModal
function RejectModal({ kyc, reason, onReasonChange, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Rejeter le KYC
              </h3>
              <p className="text-sm text-gray-600">
                {kyc?.full_name}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif du rejet *
            </label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Ex: Documents illisibles, informations incohérentes..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Ce message sera visible par l'utilisateur
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || !reason.trim()}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                'Confirmer le rejet'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}