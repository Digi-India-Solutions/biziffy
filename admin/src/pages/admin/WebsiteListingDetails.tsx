import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, Link, useLocation } from "react-router-dom";

const WebsiteListingDetails = () => {
    const location = useLocation();
    const data = location.state?.listing;
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            setListing(data);
            setLoading(false);
        } else {
            setError("No listing data found.");
            setLoading(false);
        }
    }, [id, data]);

    if (loading) {
        return (
            <AdminLayout title="Listing Details">
                <div>Loading listing details...</div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout title="Listing Details">
                <div className="text-red-500">Error: {error}</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Listing Details">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold">Website Listing Details</h2>
                <Link to="/admin/Website/listings">
                    <Button className="bg-blue-500 hover:bg-blue-600">All Listings</Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-6">
                    {/* Basic Info */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><strong>Company Name:</strong> {listing.companyName || "N/A"}</div>
                            <div><strong>Website:</strong> <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{listing.website}</a></div>
                            <div><strong>Status:</strong> {listing.status || "N/A"}</div>
                            <div><strong>Created At:</strong> {new Date(listing.createdAt).toLocaleDateString()}</div>
                            <div><strong>Updated At:</strong> {new Date(listing.updatedAt).toLocaleDateString()}</div>
                            <div><strong>Short Description:</strong> {listing.shortDescription || "N/A"}</div>
                            <div><strong>About Business:</strong> {listing.aboutBusiness || "N/A"}</div>
                            <div><strong>Area:</strong> {listing.area || "N/A"}</div>
                            <div><strong>Service Area:</strong> {listing.serviceArea || "N/A"}</div>
                            <div>
                                <strong>Services:</strong>
                                <ul className="list-disc list-inside ml-4">
                                    {(listing.service || []).map((srv: string, index: number) => (
                                        <li key={index}>{srv}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Category & Subcategory */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">Category Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><strong>Category:</strong> {listing?.category?.name || "N/A"}</div>
                            <div><strong>Subcategory:</strong> {listing?.subCategory?.name || "N/A"}</div>
                        </div>
                    </div>

                    {/* Logo */}
                    {listing.logo && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3">Company Logo</h3>
                            <img src={listing.logo} alt="Company Logo" className="w-32 h-32 object-cover rounded" />
                        </div>
                    )}

                    {/* Business Photos */}
                    {listing.businessPhotos?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3">Business Photos</h3>
                            <div className="flex gap-4 flex-wrap">
                                {listing.businessPhotos.map((photo: string, index: number) => (
                                    <img key={index} src={photo} alt={`Business Photo ${index + 1}`} className="w-32 h-32 object-cover rounded" />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default WebsiteListingDetails;
