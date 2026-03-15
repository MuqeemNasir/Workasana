import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import { toast } from "react-toastify"
import { FaArrowLeft, FaPlus } from "react-icons/fa"
import AddMemberModal from "../components/modals/AddMemberModal"
import { getInitials } from "../utils/formatters"

const TeamDetails = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)

    const fetchTeamDetails = async() => {
        try{
            const {data} = await api.get(`/teams/${id}`)
            setTeam(data)
        }catch(error){
            console.error('Error: ', error)
            toast.error("Failed to load team details")
            navigate('/teams')
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTeamDetails()
    }, [id])

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary"></div></div>

    return(
        <div className="container-fluid px-4 py-5" style={{maxWidth: '800px', marginLeft: 0}}>
            <button className="btn btn-link text-primary p-0 text-decoration-none d-flex align-items-center gap-2 mb-4 fw-semibold" style={{fontSize: '0.85rem'}} onClick={() => navigate('/teams')}>
                <FaArrowLeft size={10} /> Back To Teams
            </button>

            <h3 className="fw-bold text-dark mb-5">{team?.name}</h3>

            <div className="mb-4">
                <p className="text-muted fw-bold mb-3" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>Members</p>
                <div className="d-flex flex-column gap-3 mb-4">
                    {team?.members && team.members.length > 0 ? (
                        team.members.map((member) => (
                            <div key={member._id} className="d-flex align-items-center gap-3">
                                <div className="avatar-circle d-flex align-items-center justify-content-center fw-semibold shadow-sm text-dark" style={{backgroundColor: '#fed7aa', width: '32px', height: '32px', fontSize: '12px'}}>
                                    {getInitials(member.name)}
                                </div>
                                <span className="text-dark small fw-medium">{member.name}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted small">No members assigned yet.</p>
                    )}
                </div>

                <button className="btn btn-primary btn-sm px-4 py-2 rounded shadow-sm d-flex align-items-center gap-2" style={{backgroundColor: '#4f46e5', border: 'none'}} onClick={() => setShowAddModal(true)}>
                    <FaPlus size={10} /> Member
                </button>
            </div>

            {showAddModal && (
                <AddMemberModal teamId={id} onClose={() => setShowAddModal(false)} onMemberAdded={fetchTeamDetails} />
            )}
        </div>
    )
}

export default TeamDetails