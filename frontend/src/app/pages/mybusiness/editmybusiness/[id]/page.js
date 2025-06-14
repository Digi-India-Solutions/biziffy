"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditBusinessProfile from "../../../../Components/ProfilesComponents/Edit-business-profile/Edit-business-profile";
import { getData } from "../../../../services/FetchNodeServices"; // Adjust path if needed

const EditBusinessPage = () => {
    const { id } = useParams();
    const [userId, setUserId] = useState(null);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    // Step 1: Get user ID from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("biziffyUser");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUserId(parsed?._id || null);
        }
    }, []);

    // Step 2: Fetch listings and find one with matching ID
    useEffect(() => {
        const fetchBusinessListing = async () => {
            if (!userId || !id) return;

            try {
                const res = await getData(`get-all-listings-by-user-id/${userId}`);
                if (res?.status && res?.data?.length > 0) {
                    console.log("Business Listings", res.data.filter((item) => item?._id == id), id);
                    const found = res?.data?.filter((item) => item?._id == id);
                    setListing(found[0] || null);
                }
            } catch (error) {
                console.error("Error fetching business listing:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessListing();
    }, [userId, id]);

    return (
        <div className="container py-5">
            <div className="row">
                {loading ? (
                    <p>Loading business details...</p>
                ) : listing ? (
                    <EditBusinessProfile listingId={listing} />
                ) : (
                    <p className="text-danger">Business not found or access denied.</p>
                )}
            </div>
        </div>
    );
};

export default EditBusinessPage;
