import { useEffect, useState } from 'react';
import '../style/staff.css';

function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://146.19.215.186:1044/staff')
      .then((res) => res.json())
      .then((data) => {
        setStaff(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Errore nel fetch:', err);
        setError("Errore nel caricamento dello staff");
        setLoading(false);
      });
  }, []);

  const groupStaffByRole = () => {
    return staff.reduce((groups, member) => {
      const role = Array.isArray(member.roles) ? member.roles[member.roles.length-1] : (member.roles || "Staff Member");
      
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
  
  const roleOrder = ["Owner", "Manager", "Admin", "Mod", "Trial-Mod"];
  const sortedRoles = Object.keys(staffByRole).sort((a, b) => {
    return roleOrder.indexOf(a) - roleOrder.indexOf(b);
  });

  return (  
    <div className="staff-container">
      <h2 className="staff-title">STAFF DEL SERVER</h2>
      
      {sortedRoles.map((role) => (
        <div key={role} className="role-group">
          <h3 className="role-title">{role}</h3>
          <ul className="staff-list">
            {staffByRole[role].map((member, idx) => (
              <li key={idx} className="staff-member">
                <img
                  src={member.avatar}
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