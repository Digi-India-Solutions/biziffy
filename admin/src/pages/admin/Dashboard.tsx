"use client";

import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import gradientClasses from "../data/gradientClasses";
import { getData } from "../../services/FetchNodeServices";

// Define your static dashboard card template list
const dashboardCardTemplates = [
  { key: "listings", title: "Business Listings", linkTo: "/admin/listings" },
   { key: "website-listings", title: "WebSite Listings", linkTo: "/admin/Website/listings" },
  { key: "advertisements", title: "Advertisements", linkTo: "/admin/advertisements" },
  { key: "users", title: "Users", linkTo: "/admin/users" },
  { key: "categories", title: "Categories", linkTo: "/admin/categories" },
  { key: "subcategories", title: "Subcategories", linkTo: "/admin/subcategories" },
  // { key: "child-categories", title: "Child Categories", linkTo: "/admin/child-categories" },
  { key: "contact-us", title: "Contact Messages", linkTo: "/admin/contact-us" },
  { key: "supports", title: "Support Tickets", linkTo: "/admin/supports" },
  { key: "enquiries", title: "Enquiries", linkTo: "/admin/enquiries" },
  { key: "blog", title: "Blog", linkTo: "/admin/blog" },
  { key: "faqs", title: "FAQs", linkTo: "/admin/faq" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<Record<string, number>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch dashboard data and convert array to object
  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        const endpoints = [
          "listings",
          "website-listings",
          "advertisements",
          "users",
          "categories",
          "subcategories",
          "child-categories",
          "contact-us",
          "supports",
          "enquiries",
          "reviews",
          "blog",
          "faqs"
        ];

        const responses = await Promise.all(
          endpoints.map((path) => getData(`admin/dashboard/${path}/count`))
        );

        console.log("responses:=>>>", responses);
        const formattedData: Record<string, number> = {};
        responses.forEach((item) => {
          if (item.path && typeof item.count === "number") {
            formattedData[item.path] = item.count;
          }
        });

        setDashboardData(formattedData);
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      }
    };

    fetchDashboardCounts();
  }, []);

  // Merge template + actual data
  const dashboardCards = dashboardCardTemplates.map((tpl) => ({
    ...tpl,
    count: dashboardData[tpl.key] ?? 0,
    linkText: "View",
  }));

  // Filter based on search
  const filteredCards = dashboardCards.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const cardsPerPage = isMobile ? 6 : 24;
  const totalPages = Math.ceil(filteredCards?.length / cardsPerPage);

  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <AdminLayout title="Dashboard" onSearch={handleSearch}>
      <div className="grid gap-4 grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {paginatedCards.map((card, idx) => (
          <Card
            key={idx}
            className={`admin-card h-[180px] sm:w-[250px] md:w-[300px] lg:w-[180px] rounded-2xl transform transition duration-300 hover:scale-105 text-white ${gradientClasses[(idx + (currentPage - 1) * cardsPerPage) % gradientClasses.length]
              }`}
          >
            <CardContent className="p-4 flex flex-col justify-between text-center h-full w-full">
              <div>
                <span className="text-2xl font-bold block">{card.count}</span>
                <h3 className="text-base font-semibold mt-2 truncate">{card.title}</h3>
              </div>
              <Link to={card.linkTo} className="w-full">
                <Button className="w-full bg-white text-black hover:bg-gray-200 font-semibold text-sm transition duration-200 mt-4">
                  {card.linkText}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              if (!isMobile) return true;
              return (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              );
            })
            .map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
