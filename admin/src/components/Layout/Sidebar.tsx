import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MessageSquare,
  PanelLeft,
  Link as LinkIcon,
  Star,
  FolderTree,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  // Settings
  Building2,
  MapPin,
  Book,
  Gift
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const location = useLocation();

  const [openCategories, setOpenCategories] = useState(false);
  const [openSubcategories, setOpenSubcategories] = useState(false);
  const [openChildCategories, setOpenChildCategories] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openUserManage, setOpenUserManage] = useState(false);
  const [openListingManage, setOpenListingManage] = useState(false);
  const [openAdvertisementsManage, setOpenAdvertisementsManage] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCitiesManage, setOpenCitiesManage] = useState(false);
  const [openPopularCities, setOpenPopularCities] = useState(false);
  const [openCollections, setOpenCollections] = useState(false);
  const [openDeals, setOpenDeals] = useState(false);


  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div style={{ height: "100vh", overflowY: "scroll" }}>
        {/* Mobile Menu Button - always on top */}
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>


        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}


        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r overflow-y-auto transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0 lg:static"
          )}
        >
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-end p-2">
            <button
              className="text-gray-500 hover:text-red-500"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Logo */}
          <div className="p-0 border-b">
            <div className="flex  justify-center">
              <img src="/images/profile-icon.png" alt="Logo" className="h-20" />
            </div>
          </div>

          {/* Search input */}
          {/* <div className="p-2">
          <input
            type="text"
            placeholder="Search here"
            className="w-full px-4 py-2 border rounded-md text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}

          {/* Nav links */}

          <nav className="p-2">
            <ul className="space-y-1">


              <li>
                <Link
                  to="/admin/dashboard"
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    isActive("/admin/dashboard") && "bg-blue-50 text-blue-600"
                  )}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
              </li>

              <li>
                <button
                  onClick={() => setOpenListingManage(!openListingManage)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    openListingManage && "bg-blue-50 text-blue-600"
                  )}
                >
                  <div className="flex items-center">
                    <ClipboardList className="h-5 w-5 mr-3" />
                    <span>Listing Manage</span>
                  </div>
                  {openListingManage ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openListingManage && (
                  <ul className="ml-6 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/admin/listings"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/listings") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        All Business Listings
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/admin/Website/listings"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/Website/listings") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        All Website Listings
                      </Link>
                    </li>
                  </ul>
                )}
              </li>



              <li>
                <button
                  onClick={() => setOpenAdvertisementsManage(!openAdvertisementsManage)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    openAdvertisementsManage && "bg-blue-50 text-blue-600"
                  )}
                >
                  <div className="flex items-center">
                    <PanelLeft className="h-5 w-5 mr-3" />
                    <span>Advertis Manage</span>
                  </div>
                  {openAdvertisementsManage ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openAdvertisementsManage && (
                  <ul className="ml-6 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/admin/advertisements"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/advertisements") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        All Advertise
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/advertisements/new"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/advertisements/new") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        Add NewAdvertise
                      </Link>
                    </li>
                  </ul>
                )}
              </li>



              <li>
                <button
                  onClick={() => setOpenUserManage(!openUserManage)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    openUserManage && "bg-blue-50 text-blue-600"
                  )}
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3" />
                    <span>User Manage</span>
                  </div>
                  {openUserManage ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openUserManage && (
                  <ul className="ml-6 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/admin/users"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/users") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        All Users
                      </Link>
                    </li>
                    {/* <li>
                  <Link 
                    to="/admin/users/deactivated" 
                    className={cn(
                      "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                      isActive("/admin/users/deactivated") && "bg-blue-50 text-blue-600"
                    )}
                  >
                    Deactivated Users
                  </Link>
                </li> */}
                  </ul>
                )}
              </li>

              <li>
                <button
                  onClick={() => setOpenCategories(!openCategories)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    openCategories && "bg-blue-50 text-blue-600"
                  )}
                >
                  <div className="flex items-center">
                    <FolderTree className="h-5 w-5 mr-3" />
                    <span>Categories</span>
                  </div>
                  {openCategories ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openCategories && (
                  <ul className="ml-6 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/admin/categories"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/categories") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        All Categories
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/categories/add"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/categories/add") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        Add NewCategory
                      </Link>
                    </li>
                  </ul>
                )}
              </li>



              <li>
                <button
                  onClick={() => setOpenSubcategories(!openSubcategories)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    openSubcategories && "bg-blue-50 text-blue-600"
                  )}
                >
                  <div className="flex items-center">
                    <FolderPlus className="h-5 w-5 mr-3" />
                    <span>Subcategories</span>
                  </div>
                  {openSubcategories ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openSubcategories && (
                  <ul className="ml-6 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/admin/subcategories"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/subcategories") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        All Subcategories
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/subcategories/add"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/subcategories/add") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        Add NewSubcategory
                      </Link>
                    </li>
                  </ul>
                )}
              </li>



              {/* <li>
            <button 
              onClick={() => setOpenChildCategories(!openChildCategories)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                openChildCategories && "bg-blue-50 text-blue-600"
              )}
            >
              <div className="flex items-center">
                <FolderPlus className="h-5 w-5 mr-3" />
                <span>Child Categories</span>
              </div>
              {openChildCategories ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {openChildCategories && (
              <ul className="ml-6 mt-1 space-y-1">
                <li>
                  <Link 
                    to="/admin/child-categories" 
                    className={cn(
                      "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                      isActive("/admin/child-categories") && "bg-blue-50 text-blue-600"
                    )}
                  >
                    All ChildCategories
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/child-categories/add" 
                    className={cn(
                      "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                      isActive("/admin/child-categories/add") && "bg-blue-50 text-blue-600"
                    )}
                  >
                    Add NewChildCategory
                  </Link>
                </li>
              </ul>
            )}
          </li> */}

              <li>
                <Link
                  to="/admin/contact-us"
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    isActive("/admin/contact-us") && "bg-blue-50 text-blue-600"
                  )}
                >
                  <MessageSquare className="h-5 w-5 mr-3" />
                  All Contact us
                </Link>
              </li>




              <li>
                <Link
                  to="/admin/membership"
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    isActive("/admin/membership") && "bg-blue-50 text-blue-600"
                  )}
                >
                  <Users className="h-5 w-5 mr-3" />
                  User membership
                </Link>
              </li>

              <li>
                <button
                  onClick={() => setOpenCitiesManage(!openCitiesManage)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    openCitiesManage && "bg-blue-50 text-blue-600"
                  )}
                >
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 mr-3" />
                    <span>State/Cities Manage</span>
                  </div>
                  {openCitiesManage ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openCitiesManage && (
                  <ul className="ml-6 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/admin/state"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/state") && location.pathname !== '/admin/state/create' && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        All State
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/admin/pincode"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/pincode") && location.pathname !== '/admin/pincode/create' && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        All pinCode
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        to="/admin/state/create"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/state/create") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        Create State
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        to="/admin/cities"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/cities") && location.pathname !== '/admin/cities/create' && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        All Cities
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        to="/admin/cities/create"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/cities/create") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Create Cities
                      </Link>
                    </li> */}

                    <li>
                      <Link
                        to="/admin/popular-cities"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/popular-cities") && location.pathname !== '/admin/popular-cities/add' && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        All Popular Cities
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        to="/admin/popular-cities/add"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/popular-cities/add") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        Add Popular Cities
                      </Link>
                    </li> */}
                  </ul>
                )}
              </li>

              {/* <li>

                <button
                  onClick={() => setOpenCollections(!openCollections)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    openCollections && "bg-blue-50 text-blue-600"
                  )}
                >
                  <div className="flex items-center">
                    <Book className="h-5 w-5 mr-3" />
                    <span>Collections</span>
                  </div>
                  {openCollections ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openCollections && (
                  <ul className="ml-6 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/admin/collections"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/collections") && location.pathname !== '/admin/collections/add' && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <Book className="h-4 w-4 mr-2" />
                        All Collections
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/collections/add"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/collections/add") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <Book className="h-4 w-4 mr-2" />
                        Add Collection
                      </Link>
                    </li>
                  </ul>
                )}
              </li> */}

              {/* <li>
                <button
                  onClick={() => setOpenDeals(!openDeals)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    openDeals && "bg-blue-50 text-blue-600"
                  )}
                >
                  <div className="flex items-center">
                    <Gift className="h-5 w-5 mr-3" />
                    <span>Deals</span>
                  </div>
                  {openDeals ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openDeals && (
                  <ul className="ml-6 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/admin/deals"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/deals") && location.pathname !== '/admin/deals/add' && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        All Deals
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/deals/add"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/deals/add") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Add Deal
                      </Link>
                    </li>
                  </ul>
                )}
              </li> */}



              <li>
                <button
                  onClick={() => setOpenSupport(!openSupport)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    openSupport && "bg-blue-50 text-blue-600"
                  )}
                >
                  <div className="flex items-center">
                    <LifeBuoy className="h-5 w-5 mr-3" />
                    <span>Support</span>
                  </div>
                  {openSupport ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {openSupport && (
                  <ul className="ml-6 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/admin/support/department"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/support/department") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        Department
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/support/tickets"
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                          isActive("/admin/support/tickets") && "bg-blue-50 text-blue-600"
                        )}
                      >
                        Support Ticket
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link
                  to="/admin/enquiries"
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    isActive("/admin/enquiries") && "bg-blue-50 text-blue-600"
                  )}
                >
                  <MessageSquare className="h-5 w-5 mr-3" />
                  Enquiries
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/links"
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    isActive("/admin/links") && "bg-blue-50 text-blue-600"
                  )}
                >
                  <LinkIcon className="h-5 w-5 mr-3" />
                  Links
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/reviews"
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600",
                    isActive("/admin/reviews") && "bg-blue-50 text-blue-600"
                  )}
                >
                  <Star className="h-5 w-5 mr-3" />
                  Reviews
                </Link>
              </li>


              <li>
                <Link
                  to="/logout"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Log Out
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div> </>
  );
};