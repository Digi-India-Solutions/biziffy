import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Interface for full listing response from backend
interface FullListingDetails {
  businessId: string;
  businessDetails?: {
    _id: string;
    businessName?: string;
    pinCode?: string;
    building?: string;
    street?: string;
    area?: string;
    landmark?: string;
    city?: string;
    state?: string;
    direction?: string;
    website?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    category?: string;
    userId?: string;
    publishedDate?: string;
    status?: string;
    businessStatus?: string;
    trustStatus?: string;
    phone?: string;
    hidePhoneNumber?: boolean;
    services?: string;
    viewCount?: number;
    description?: string;
    gstNo?: string;
    cin?: string;
    entity?: string;
  };
  timings: Record<string, string | number | boolean>;
  contact: Record<string, string | number | boolean>;
  upgrade: Record<string, string | number | boolean>;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
  };
}


const ListingDetails = () => {
  const location = useLocation()
  const data = location.state.listing
  // console.log("datadatadata", data)
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<FullListingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // console.log("XXXXXXXXXXXXXXXXXXXXXXXXx", id)

  useEffect(() => {
    setListing(data);
    setLoading(false);
  }, [id]);

  // Show loading UI
  if (loading) {
    return (
      <AdminLayout title="Listing Details">
        <div>Loading listing details...</div>
      </AdminLayout>
    );
  }

  // Show error if something went wrong
  if (error) {
    return (
      <AdminLayout title="Listing Details">
        <div className="text-red-500">Error: {error}</div>
      </AdminLayout>
    );
  }

  // If no data found
  if (!listing || !listing.businessDetails) {
    return (
      <AdminLayout title="Listing Details">
        <div>Listing not found.</div>
      </AdminLayout>
    );
  }

  const { businessDetails, businessTiming, contactPerson, upgradeListing, businessCategory } = listing;

  // console.log("businessDetails:-", listing).
  return (
    <AdminLayout title="Listing Details">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Business Details</h2>
        <Link to="/admin/listings">
          <Button className="bg-blue-500 hover:bg-blue-600">All Listings</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          {/* === BASIC INFO === */}

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="font-medium">Business Name:</p><p>{businessDetails.businessName || "N/A"}</p></div>
              <div><p className="font-medium">Category:</p><p>{businessCategory?.category?.name || "N/A"}</p></div>
              <div><p className="font-medium">Phone:</p><p>{contactPerson?.contactNumber || "N/A"}</p></div>
              {/* <div>
                <p className="font-medium">Hide Phone Number:</p>
                <input type="checkbox" checked={contactPerson.whatsappNumber || false} readOnly className="h-4 w-4" />
              </div> */}
              <div><strong>Published:</strong> {businessDetails.publishedDate || "N/A"}</div>
              <div><strong>Business Status:</strong> {businessDetails.status || "N/A"}</div>
              {/* <div><strong>Trust Status:</strong> {businessDetails.publishedDate || "N/A"}</div> */}
              {/* <div><strong>View Count:</strong> {businessDetails.viewCount || 0}</div> */}
              <div><strong>Created At:</strong> {listing?.createdAt ? new Date(listing?.createdAt).toLocaleDateString() : "N/A"}</div>
              {/* <div><strong>Updated At:</strong> {listing?.updatedAt ? new Date(listing?.updatedAt).toLocaleDateString() : "N/A"}</div> */}
              {/* <div><strong>Published Date:</strong> {listing?.createdAt ? new Date(listing?.createdAt).toLocaleDateString() : "N/A"}</div> */}
            </div>
          </div>

          {/* === ADDRESS INFO === */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Pin Code:</strong> {businessDetails.pinCode || "N/A"}</div>
              <div><strong>Building:</strong> {businessDetails.building || "N/A"}</div>
              <div><strong>Street:</strong> {businessDetails.street || "N/A"}</div>
              <div><strong>Area:</strong> {businessDetails.area || "N/A"}</div>
              <div><strong>Landmark:</strong> {businessDetails.landmark || "N/A"}</div>
              <div><strong>City:</strong> {businessDetails.city || "N/A"}</div>
              <div><strong>State:</strong> {businessDetails.state || "N/A"}</div>
              <div><strong>Country:</strong> India</div>
              {/* <div><strong>Direction:</strong>{""}
                <a
                  href={upgradeListing.direction}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >{upgradeListing.direction || "N/A"}
                </a>
              </div> */}
              {/* {upgradeListing.website && (
                <div>
                  <strong>Website:</strong>{" "}
                  <a
                    href={upgradeListing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {upgradeListing.website}
                  </a>
                </div>
              )} */}
            </div>
          </div>

          {/* === DESCRIPTION === */}
          {businessDetails.description && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p>{businessDetails.description}</p>
            </div>
          )}

          {/* === ADDITIONAL DETAILS === */}
          {/* <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Additional</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><strong>GST No:</strong> {businessDetails.gstNo || "N/A"}</div>
              <div><strong>CIN:</strong> {businessDetails.cin || "N/A"}</div>
              <div><strong>Entity:</strong> {businessDetails.entity || "N/A"}</div>
            </div>
          </div> */}

          {/* === USER INFO === */}
          {listing.user && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">User Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><strong>Name:</strong> {listing.user.name || "N/A"}</div>
                <div><strong>Email:</strong> {listing.user.email || "N/A"}</div>
                <div><strong>Phone:</strong> {listing.user.phone || "N/A"}</div>
                {listing.user.profileImage && (
                  <div>
                    <strong>Profile:</strong>
                    <img
                      src={listing.user.profileImage}
                      alt="User Profile"
                      className="w-24 h-24 mt-2 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === SERVICES === */}
          {businessCategory.keywords && businessCategory.keywords.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Services / Keywords</h3>
              <ul className="list-disc list-inside space-y-1">
                {businessCategory.keywords.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          {listing.contactPerson && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Contact Person</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Title:</strong> {listing.contactPerson.title || "N/A"}
                </div>
                <div>
                  <strong>Name:</strong>{" "}
                  {`${listing.contactPerson.firstName || ""} ${listing.contactPerson.lastName || ""
                    }`}
                </div>
                <div>
                  <strong>Phone:</strong> {listing.contactPerson.contactNumber || "N/A"}
                </div>
                <div>
                  <strong>WhatsApp:</strong> {listing.contactPerson.whatsappNumber || "N/A"}
                </div>
                <div>
                  <strong>Email:</strong> {listing.contactPerson.email || "N/A"}
                </div>
              </div>
            </div>
          )}

          {/* Timings */}
          {Array.isArray(listing.businessTiming) && listing.businessTiming.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Business Timings</h3>
              <table className="w-full border border-gray-200 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Day</th>
                    <th className="p-2 text-left">Open</th>
                    <th className="p-2 text-left">Close</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listing.businessTiming.map((timing, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{timing.day}</td>
                      <td className="p-2">
                        {timing.isOpen
                          ? `${timing.openTime} ${timing.openPeriod}`
                          : "—"}
                      </td>
                      <td className="p-2">
                        {timing.isOpen
                          ? `${timing.closeTime} ${timing.closePeriod}`
                          : "—"}
                      </td>
                      <td className="p-2">
                        {timing.isOpen ? (
                          <span className="text-green-600 font-medium">Open</span>
                        ) : (
                          <span className="text-red-500 font-medium">Closed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}


          {/* Upgrade */}
          {listing.upgradeListing && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Online Presence</h3>
              <div className="flex flex-wrap gap-4">
                {listing.upgradeListing.website && (
                  <a
                    href={listing.upgradeListing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    🌐 Website
                  </a>
                )}
                {listing.upgradeListing.facebook && (
                  <a
                    href={listing.upgradeListing.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    📘 Facebook
                  </a>
                )}
                {listing.upgradeListing.instagram && (
                  <a
                    href={listing.upgradeListing.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:underline"
                  >
                    📸 Instagram
                  </a>
                )}
                {listing.upgradeListing.linkedin && (
                  <a
                    href={listing.upgradeListing.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    💼 LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}

          {businessCategory?.businessImages?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Business Images</h3>
              <div className="flex space-x-4 overflow-x-auto">
                {businessCategory.businessImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Business Image ${index + 1}`}
                    className="w-48 h-32 object-cover rounded-md shadow"
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ListingDetails;
