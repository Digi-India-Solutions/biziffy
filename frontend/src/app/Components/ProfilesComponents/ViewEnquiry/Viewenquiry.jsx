import React from 'react';
import './ViewEnquiry.css';

const enquiries = [
  {
    id: 1,
    email: 'user1@example.com',
    message: 'I need help with my account setup. Please respond quickly.',
    date: '2025-06-16',
    status: 'Pending',
  },
  {
    id: 2,
    email: 'user2@example.com',
    message: 'I am unable to log in with my credentials.',
    date: '2025-06-15',
    status: 'Completed',
  },
  {
    id: 3,
    email: 'user3@example.com',
    message: 'My payment did not go through, please check.',
    date: '2025-06-14',
    status: 'Open',
  },
  {
    id: 4,
    email: 'user1@example.com',
    message: 'I need help with my account setup. Please respond quickly.',
    date: '2025-06-16',
    status: 'Pending',
  },
  {
    id: 5,
    email: 'user2@example.com',
    message: 'I am unable to log in with my credentials.',
    date: '2025-06-15',
    status: 'Completed',
  },
  {
    id: 6,
    email: 'user3@example.com',
    message: 'My payment did not go through, please check.',
    date: '2025-06-14',
    status: 'Open',
  },
];

const getStatusBadge = (status) => {
  let color = '';
  let icon = 'bi-circle-fill';
  switch (status) {
    case 'Pending':
      color = 'text-warning';
      break;
    case 'Completed':
      color = 'text-success';
      break;
    case 'Open':
      color = 'text-primary';
      break;
    default:
      color = 'text-secondary';
  }
  return (
    <span className={`enquiry-status badge ${color} d-inline-flex align-items-center gap-1`}>
      <i className={`bi ${icon}`}></i> {status}
    </span>
  );
};

const ViewEnquiry = () => {
  return (
    <div className="enquiry-container">
      <h2 className="enquiry-title">
        <i className="bi bi-envelope-paper"></i> Support Enquiries
      </h2>
      <div className="enquiry-list">
        {enquiries.map((item) => (
          <div className="enquiry-card" key={item.id}>
            <div className="enquiry-header d-flex justify-content-between align-items-center">
              <div className="enquiry-user">
                <i className="bi bi-person-circle me-2"></i>
                <span className="enquiry-email">{item.email}</span>
              </div>
              <div className="enquiry-date">
                <i className="bi bi-clock me-1"></i>{item.date}
              </div>
            </div>
            <div className="enquiry-body mt-2">
              <i className="bi bi-chat-left-text-fill me-2"></i>
              <p className="enquiry-message d-inline">{item.message}</p>
            </div>
            <div className="enquiry-footer mt-2 d-flex justify-content-end">
              {getStatusBadge(item.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewEnquiry;
