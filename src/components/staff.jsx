import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/staff.css';

function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const roleOrder = ["Owner", "Amministratore", "Developer", "Moderatore", "Builder"];

  useEffect(() => {
    const fetchStaffByRoles = async () => {
      try {
        const allStaff = [];
        for (const role of roleOrder) {
          const res = await fetch(`https://ximipvp-backend-production.up.railway.app/users/by-role?role=${encodeURIComponent(role)}`);
          const data = await res.json();
          const membersWithRole = data.map(member => ({ ...member, role }));
          allStaff.push(...membersWithRole);
        }
        setStaff(allStaff);
        setLoading(false);
      } catch (err) {
        setError("Staff non disponibile");
        setLoading(false);
      }
    };

    fetchStaffByRoles();
  }, []);

  const groupStaffByRole = () => {
    return staff.reduce((groups, member) => {
      const role = member.role || "Staff Member";
      if (!groups[role]) {
        groups[role] = [];
      }
      groups[role].push(member);
      return groups;
    }, {});
  };

  if (loading) return <p className="loading-text">Caricamento staff...</p>;
  if (error) return <p className="error-text">{error}</p>;

  const staffByRole = groupStaffByRole();
  const sortedRoles = roleOrder.filter(role => staffByRole[role]);

  return (
    <div className="staff-container">
      <h2 className="staff-title">STAFF DEL SERVER</h2>

      {sortedRoles.map((role) => (
        <div key={role} className="role-group">
          <h3 className={`role-title ${role}`}>{role}</h3>
          <ul className="staff-list">
            {staffByRole[role].map((member, idx) => (
              <li
                key={idx}
                className="staff-member"
                onClick={() => navigate(`/profile/${member.username}`)} 
              >
                <img
                  src={member.pfp}      
                  alt={member.username} 
                  className="staff-avatar"
                />
                <div className="staff-info">
                  <span className="staff-username">{member.username}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default StaffList;
