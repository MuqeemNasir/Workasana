import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const CreateTeamModal = ({ onClose, onTeamCreated }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const {data} = await api.get('/users')
        setUsers(data || [])
      }catch(error){
        toast.error('Could not load users list')
      }
    }
    fetchUsers()
  }, [])

  const addMember = (e) => {
    const userId = e.target.value
    if(userId && !selectedMembers.includes(userId)) {
      setSelectedMembers([...selectedMembers, userId])
    }
  }

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(id => id !== userId))
  }

  const getUserName = (id) => {
    const user = users.find(u => u._id === id)
    return user ? user.name : 'Unknown'
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.warning("Team name is required");

    setLoading(true);
    try {
      await api.post('/teams', { name, members: selectedMembers });
      toast.success("Team created successfully!");
      onTeamCreated(); 
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-dialog-centered" style={{maxWidth: '450px'}}>
        <div className="modal-content custom-modal-content">
          <div className="custom-modal-header d-flex justify-content-between align-items-center">
            <h5 className="custom-modal-title mb-0">New Team</h5>
            <button type="button" className="btn-close" onClick={onClose} style={{fontSize: '0.75rem'}}></button>
          </div>
          <div className="custom-modal-body">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label className="custom-label">Team Name</label>
                <input 
                  type="text" className="form-control custom-input" 
                  placeholder="e.g. Marketing Squad"
                  value={name} onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="custom-label">Add Members</label>
                <select className="form-select custom-input mb-2" onChange={addMember} value="">
                  <option value="" disabled>Member Name...</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id} disabled={selectedMembers.includes(u._id)}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <div className="d-flex flex-column gap-2 mt-2">
                  {selectedMembers.map(id => (
                    <div key={id} className="custom-input bg-light d-flex justify-content-between align-items-center py-2 text-muted">
                      <span>{getUserName(id)}</span>
                      <button type='button' className='btn btn-link text-muted p-0 border-0' onClick={() => removeMember(id)}>
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="d-flex justify-content-end gap-2 mt-5">
                <button type="button" className="btn btn-light fw-semibold text-secondary px-4 py-2" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary fw-semibold px-4 py-2" style={{backgroundColor: '#4f46e5', border: 'none'}} disabled={loading}>
                  {loading ? '...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;