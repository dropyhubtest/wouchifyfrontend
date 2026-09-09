import React, { useState } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import './ExecutiveShared.css'

interface CreditCard {
  id: string
  cardName: string
  bank: string
  welcomeOffer: string
  annualFee: string
  imageUrl: string
  status: 'active' | 'inactive'
}

const mockCards: CreditCard[] = [
  { id: '1', cardName: 'SBI Cashback Card', bank: 'SBI', welcomeOffer: '5% Cashback on Online Spends', annualFee: '₹999', imageUrl: 'https://via.placeholder.com/60x38', status: 'active' },
  { id: '2', cardName: 'HDFC Millennia', bank: 'HDFC', welcomeOffer: '1000 CashPoints', annualFee: '₹1000', imageUrl: 'https://via.placeholder.com/60x38', status: 'active' },
  { id: '3', cardName: 'Axis Ace', bank: 'Axis Bank', welcomeOffer: 'Flat 5% on Bill Payments', annualFee: '₹499', imageUrl: 'https://via.placeholder.com/60x38', status: 'inactive' },
]

export const ExecutiveCreditCardsPage: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>(mockCards)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)

  const handleAddCard = () => {
    setEditingCard(null)
    setIsModalOpen(true)
  }

  const handleEditCard = (card: CreditCard) => {
    setEditingCard(card)
    setIsModalOpen(true)
  }

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this credit card?')) {
      setCards(cards.filter(c => c.id !== id))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCard(null)
  }

  const filteredCards = cards.filter(card => 
    card.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.bank.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ExecutiveLayout activeMenu="credit-cards">
      <div className="executive-crud-page">
        <div className="crud-header">
          <h2 className="crud-title">Manage Credit Cards</h2>
          <button className="crud-add-btn" onClick={handleAddCard}>
            <Plus size={18} /> Add New Card
          </button>
        </div>

        <div className="crud-filters">
          <div className="crud-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search cards by name or bank..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Card Image</th>
                <th>Card Name</th>
                <th>Bank</th>
                <th>Welcome Offer</th>
                <th>Annual Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <tr key={card.id}>
                  <td>
                    <img src={card.imageUrl} alt={card.cardName} style={{ width: '60px', height: '38px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{card.cardName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>ID: {card.id}</div>
                  </td>
                  <td>{card.bank}</td>
                  <td><span style={{ color: '#10b981', fontWeight: 600 }}>{card.welcomeOffer}</span></td>
                  <td>{card.annualFee}</td>
                  <td>
                    <span className={`status-badge ${card.status}`}>
                      {card.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleEditCard(card)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteCard(card.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCards.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No credit cards found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="crud-modal-overlay">
            <div className="crud-modal">
              <div className="modal-header">
                <h3 className="modal-title">{editingCard ? 'Edit Credit Card' : 'Add New Credit Card'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Card Name</label>
                    <input type="text" placeholder="e.g., SBI Cashback Card" defaultValue={editingCard?.cardName} />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input type="text" placeholder="e.g., SBI" defaultValue={editingCard?.bank} />
                    </div>
                    <div className="form-group">
                      <label>Annual Fee</label>
                      <input type="text" placeholder="e.g., ₹999" defaultValue={editingCard?.annualFee} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Welcome Offer / Highlight</label>
                    <input type="text" placeholder="e.g., 5% Cashback on Online Spends" defaultValue={editingCard?.welcomeOffer} />
                  </div>

                  <div className="form-group">
                    <label>Card Image URL</label>
                    <input type="url" placeholder="https://..." defaultValue={editingCard?.imageUrl} />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select defaultValue={editingCard?.status || 'active'}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn-save" onClick={closeModal}>Save Card</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
