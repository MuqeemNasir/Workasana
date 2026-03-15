import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaPlus, FaUserAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getInitials } from '../utils/formatters';

import CreateTeamModal from '../components/modals/CreateTeamModal';
import { useNavigate } from 'react-router-dom';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/teams');
      setTeams(data || []);
    } catch (error) {
      console.error("Failed to fetch teams", error);
      toast.error("Failed to load teams data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid px-3 px-md-5 py-4">

      <div className="d-flex justify-content-between align-items-center mb-4 mt-md-4">
        <h3 className="fw-bold text-dark mb-0">Teams</h3>
        <button 
          className="btn btn-primary btn-sm px-4 py-2 rounded shadow-sm d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <FaPlus size={10} /> <span className="fw-semibold">New Team</span>
        </button>
      </div>

      <div className="row g-4 pb-5">
        {teams.map((team) => (
          <div className="col-12 col-md-6 col-lg-4" key={team._id}>
            <div 
              className="d-flex flex-column h-100 p-4 transition-all"
              style={{
                backgroundColor: '#f8f9fa', 
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/teams/${team._id}`)}
            >
              <h6 className="fw-bold text-dark mb-4">{team.name}</h6>
              
              <div className="mt-auto">
                <div className="avatar-group d-flex align-items-center flex-wrap" style={{rowGap: '8px'}}>
                  <div className="avatar-circle shadow-sm d-flex align-items-center justify-content-center" style={{backgroundColor: '#e5e7eb', color: '#9ca3af', border: '2px solid #f8f9fa', width: '30px', height: '30px', zIndex: 100}}>
                    <FaUserAlt size={12} />
                  </div>
                    { team.members && team.members.map((member, i) => (
                      <div 
                        key={member._id}
                        className="avatar-circle text-white shadow-sm d-flex align-items-center justify-content-center"
                        style={{
                          width: '30px', height: '30px', fontSize: '11px',
                          marginLeft: '-8px',
                          border: '2px solid #f8f9fa', 
                          backgroundColor: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#06b6d4'][i % 2],
                          zIndex: 99 - i
                        }}
                        title={member.name}
                      >
                        {getInitials(member.name)}
                      </div>
                    )
                  )}
                </div>
              </div>
              
            </div>

          </div>
        ))}

        {teams.length === 0 && (
          <div className="col-12 text-center py-5 text-muted">
            No teams found.
          </div>
        )}
      </div>

      {showModal && <CreateTeamModal onClose={() => setShowModal(false)} onTeamCreated={fetchTeams} />}
    </div>
  );
};

export default Teams;