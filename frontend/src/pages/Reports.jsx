import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaCheckCircle, FaClock, FaTasks } from "react-icons/fa";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler} from 'chart.js'
import {Bar, Doughnut, Line, Pie} from 'react-chartjs-2'

ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler
)

const Reports = () => {
    const [completedLastWeek, setCompletedLastWeek] = useState(0)
    const [pendingDays, setPendingDays] = useState(0)
    const [pendingTasksCount, setPendingTasksCount] = useState(0)
    const [teamStats, setTeamStats] = useState({})
    const [ownerStats, setOwnerStats] = useState({})

    const [loading, setLoading] = useState()

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true)
            try{
                const [lastWeekRes, pendingRes, teamStatsRes, ownerStatsRes] = await Promise.all([
                    api.get('/reports/last-week'),
                    api.get('/reports/pending'),
                    api.get('/reports/closed-by-team'),
                    api.get('/reports/closed-by-owner'),
                ])

                setCompletedLastWeek(lastWeekRes.data.count || 0)
                setPendingDays(pendingRes.data.totalDaysPending || 0)
                setPendingTasksCount(pendingRes.data.totalTasks || 0)
                setTeamStats(teamStatsRes.data || {})
                setOwnerStats(ownerStatsRes.data || {})
            }catch(error){
                console.error("Reports Fetch Error: ", error)
                toast.error('Failed to load report data')
            }finally{
                setLoading(false)
            }
        }
        fetchReports()
    }, [])

    const c1Data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Tasks Completed',
                data: [0, 0, Math.floor(completedLastWeek/2), 0, 0, 0, Math.ceil(completedLastWeek/2)],
                backgroundColor: '#6366f1',
                borderRadius: 4,
            }
        ]
    }

    const c2Data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Current'],
        datasets: [{
            label: 'Estimated Days Pending',
            data: [Math.max(pendingDays - 5, 0), Math.max(pendingDays - 2, 0), pendingDays + 1, pendingDays],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            tension: 0.4,
            fill: true,
        }]
    }

    const teamLabels = Object.keys(teamStats)
    const teamValues = Object.values(teamStats)
    const c3Data = {
        labels: teamLabels.length > 0 ? teamLabels : ['No Data'], 
        datasets: [{
            data: teamValues.length > 0 ? teamValues : [1],
            backgroundColor: teamValues.length > 0 ? ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'] : ['#e5e7eb'],
            borderWidth: 0,
        }]
    }

    const ownerLabels = Object.keys(ownerStats)
    const ownerValues = Object.values(ownerStats)
    const c4Data = {
        labels: ownerLabels.length > 0 ? ownerLabels : ['No Data'],
        datasets: [{
            data: ownerValues.length > 0 ? ownerValues : [1],
            backgroundColor: ownerValues.length > 0 ? ['#3b82f6', '#ef4444', '#14b8a6', '#f97316'] : ['#e5e7eb'],
            borderWidth: 0,
        }]
    }

    const optionsBarLine = { responsive: true, maintainAspectRatio: false, plugins: {legend: {display: false }}}
    const optionsPie = { responsive: true, maintainAspectRatio: false, plugins: {legend: {display: 'right' }}}

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary"></div></div>

    return(
        <div className="container-fluid px-3 px-md-4 py-4">
            <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">Workasana Reports</h2>
                <p className="text-muted small mb-0">Track productivity and pending workload.</p>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-row align-items-center gap-3">
                        <div className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center flex-shrink-0" style={{width: 48, height: 48}}>
                            <FaCheckCircle size={20} />
                        </div>

                        <div>
                            <p className="text-muted fw-bold small mb-0 tracking-wide text-uppercase" style={{fontSize: '0.7rem'}}>Done Last 7 Days</p>
                            <h3 className="fw-bold text-dark mb-0">
                                {completedLastWeek} <span className="fs-6 text-muted fw-normal">Tasks</span>
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-row align-items-center gap-3">
                        <div className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center flex-shrink-0" style={{width: 48, height: 48}}>
                            <FaClock size={20} />
                        </div>

                        <div>
                            <p className="text-muted fw-bold small mb-0 tracking-wide text-uppercase" style={{fontSize: '0.7rem'}}>Pending Work</p>
                            <h3 className="fw-bold text-dark mb-0">
                                {pendingDays} <span className="fs-6 text-muted fw-normal">Days Est.</span>
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-row align-items-center gap-3">
                        <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{width: 48, height: 48}}>
                            <FaTasks size={20} />
                        </div>

                        <div>
                            <p className="text-muted fw-bold small mb-0 tracking-wide text-uppercase" style={{fontSize: '0.7rem'}}>Active Tasks</p>
                            <h3 className="fw-bold text-dark mb-0">
                                {pendingTasksCount} <span className="fs-6 text-muted fw-normal">Total</span>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 pb-5">
                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                        <h6 className="fw-bold text-dark mb-4">Total Work Done Last Week</h6>
                        <div className="d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                            {completedLastWeek > 0 ? <  Bar data={c1Data} options={optionsBarLine} /> : <p className="text-muted small">No tasks completed recently.</p> }
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                        <h6 className="fw-bold text-dark mb-4">Total Days of Work Pending</h6>
                        <div className="d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                            <Line data={c2Data} options={optionsBarLine} /> 
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                        <h6 className="fw-bold text-dark mb-4">Tasks Closed by Team</h6>
                        <div className="d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                            {teamValues.length > 0 ? <Doughnut data={c3Data} options={optionsPie} /> : <p className="text-muted small">No team data available.</p> }
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                        <h6 className="fw-bold text-dark mb-4">Tasks Closed by Owner</h6>
                        <div className="d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                            {ownerValues.length > 0 ? <Pie data={c4Data} options={optionsPie} /> : <p className="text-muted small">No owner data available.</p> }
                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    )
};

export default Reports;
