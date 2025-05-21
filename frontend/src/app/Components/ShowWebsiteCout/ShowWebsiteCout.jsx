import React from 'react';

export default function ShowWebsiteCout({ websiteVijiter }) {
  const users = Array.isArray(websiteVijiter)
    ? websiteVijiter
    : Array.isArray(websiteVijiter?.user)
    ? websiteVijiter.user
    : [];

  if (users.length === 0) {
    return <div className="text-red-500 text-center mt-4">No user data found.</div>;
  }

  return (
    <div className="overflow-x-auto mt-6 px-4">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr className="text-left text-sm text-gray-600">
            <th className="p-3">#</th>
            <th className="p-3">Profile</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">WhatsApp</th>
            <th className="p-3">Address</th>
            <th className="p-3">City</th>
            <th className="p-3">State</th>
            {/* <th className="p-3">Status</th>
            <th className="p-3">Joined</th>
            <th className="p-3">Updated</th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user?._id || index} className="border-t hover:bg-gray-50 text-sm">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">
                <img
                  src={user?.profileImage || 'https://via.placeholder.com/40'}
                  alt={user?.fullName || 'User'}
                  style={{width:100,height:100}}
                  className="rounded-full object-cover border"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
                />
              </td>
              <td className="p-3">{user?.fullName || '-'}</td>
              <td className="p-3">{user?.email || '-'}</td>
              <td className="p-3">{user?.phone || '-'}</td>
              <td className="p-3">{user?.whatsappNumber || '-'}</td>
              <td className="p-3">{user?.address || '-'}</td>
              <td className="p-3">{user?.city || '-'}</td>
              <td className="p-3">{user?.state || '-'}</td>
              {/* <td className="p-3">
                <span
                  className={`font-semibold ${
                    user?.status === 'Active' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {user?.status || 'Inactive'}
                </span>
              </td> */}
              {/* <td className="p-3">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </td>
              <td className="p-3">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
