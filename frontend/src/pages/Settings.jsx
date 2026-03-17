import { useEffect, useState } from "react"
import useAuthStore from "../stores/useAuthStore"
import { toast } from "react-toastify"
import { FaLock, FaSave, FaShieldAlt, FaUser } from "react-icons/fa"
import { getInitials } from "../utils/formatters"

const Settings = () => {
    const {user} = useAuthStore()

    const [activeTab, setActiveTab] = useState('profile')
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const handleProfileUpdate = async(e) => {
        e.preventDefault()
        if(!name.trim()) return toast.warning("Name cannot be empty")

        setLoading(true)
        setTimeout(() => {
            toast.info("Profile update endpoint needed in backend.")
            setLoading(false)
        }, 800)
    }

    const handlePasswordUpdate = async(e) => {
        e.preventDefault()
        if(!currentPassword || !newPassword || !confirmPassword){
            return toast.warning("Please fill all password fields.")
        }
        if(newPassword.length < 8){
            return toast.warning("New password must be at least 8 characters")
        }

        if(newPassword !== confirmPassword) {
            return toast.warning("New passwords do not match.")
        }

        setLoading(true)

        setTimeout(() => {
            toast.info("Password update endpoint needed in backend.")
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setLoading(false)
        }, 800)
    }

    useEffect(() => {
        if(user){
            setName(user.name || "")
            setEmail(user.email || "")
        }
    }, [user])

    return(
        <div className="container-fluid px-3 px-md-4 py-4" style={{maxWidth: '1000px', marginLeft: 0}}>
            <div className="mb-5">
                <h2 className="fw-bold text-dark mb-1">Settings</h2>
                <p className="text-muted small mb-0">Manage your account preference and security.</p>
            </div>

            <div className="row g-4">
                <div className="col-12 col-md-4 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div className="list-group list-group-flush border-0">
                            <button className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-3 fw-semibold transition-all ${activeTab === 'profile' ? 'bg-primary bg-opacity-10 text-primary border-start border-4 border-primary' : 'text-secondary hover-bg-light border-start border-4 border-transparent'}`} onClick={() => setActiveTab('profile')}>
                                <FaUser size={14} /> My Profile
                            </button>
                            
                            <button className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-3 fw-semibold transition-all ${activeTab === 'security' ? 'bg-primary bg-opacity-10 text-primary border-start border-4 border-primary' : 'text-secondary hover-bg-light border-start border-4 border-transparent'}`} onClick={() => setActiveTab('security')}>
                                <FaShieldAlt size={14} /> Security
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-8 col-lg-9">
                    {activeTab === 'profile' && (
                        <div className="card border-0 shadow-sm rounded-4 bg-white">
                            <div className="card-header bg-white border-bottom p-4">
                                <h5 className="fw-bold text-dark mb-0">Profile Information</h5>
                            </div>

                            <div className="card-body p-4 p-md-5">
                                <div className="d-flex align-items-center gap-4 mb-5 pb-4 border-bottom">
                                    <div className="avatar-circle shadow-sm d-flex align-items-center justify-content-center text-white fw-bold" style={{width: '80px', height: '80px', fontSize: '24px', background: 'linear-gradient(135deg, #6366f1, #a855f7)'}}>
                                        {getInitials(user?.name)}
                                    </div>

                                    <div>
                                        <h5 className="fw-bold text-dark mb-1">{user?.name}</h5>
                                        <p className="text-muted small mb-2">{user?.email}</p>
                                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">Active Account</span>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate}>
                                    <div className="row g-4 mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted tracking-wide">Full Name</label>
                                            <input type="text" className="form-control bg-light border-0 py-2 px-3" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted tracking-wide">Email Address</label>
                                            <input type="email" className="form-control bg-light border-0 py-2 px-3" value={email} disabled title="Email cannot be changed directly" />
                                            <small className="text-muted" style={{fontSize: '0.7rem'}}>Contact an administrator to change your email.</small>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mt-5">
                                        <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2 fw-semibold" disabled={loading}>
                                            <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="card border-0 shadow-sm rounded-4 bg-white">
                            <div className="card-header bg-white border-bottom p-4">
                                <h5 className="fw-bold text-dark mb-0">Change Password</h5>
                            </div>

                            <div className="card-body p-4 p-md-5">
                                <form onSubmit={handlePasswordUpdate}>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted tracking-wide">Current Password</label>
                                        <input type="password" className="form-control bg-light border-0 py-2 px-3" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                    </div>

                                    <hr className="my-4 border-light" />

                                    <div className="row g-4 mb-5">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted tracking-wide">New Password</label>
                                            <input type="password" className="form-control bg-light border-0 py-2 px-3" placeholder="Minimum 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted tracking-wide">Confirm New Password</label>
                                            <input type="password" className="form-control bg-light border-0 py-2 px-3" placeholder="Retype new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2 fw-semibold" disabled={loading}>
                                            <FaLock /> {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                     </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>  
        </div>
    )

}

export default Settings