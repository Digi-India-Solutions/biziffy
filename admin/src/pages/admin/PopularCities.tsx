import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

// ✅ Updated Type with nested city and categories
interface City {
  id: string;
  banner?: string;
  city: {
    name: string;
    country: string;
    badge?: string;
    cityImage?: string;
    isActive: boolean;
  };
  category: {
    _id: string;
    name: string;
    icon: string;
  }[];
}

const PopularCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:18001/api/populerCity/get-all-popular-cities");

      if (response.data?.status && Array.isArray(response.data.data)) {
        const normalized: City[] = response.data.data.map((item: any) => ({
          id: item._id,
          banner: item.banner,
          city: {
            name: item.city.name,
            country: item.city.country,
            badge: item.city.badge,
            cityImage: item.city.cityImage,
            isActive: item.city.isActive,
          },
          category: item.category?.map((cat: any) => ({
            _id: cat._id,
            name: cat.name,
            icon: cat.icon,
          })) || [],
        }));
        setCities(normalized);
        setFilteredCities(normalized);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load cities." });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredCities(
        cities.filter(c =>
          c.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.city.country.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCities(cities);
    }
  }, [searchTerm, cities]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    try {
      await axios.get(`http://localhost:18001/api/populerCity/delete-popular-city/${id}`);
      setCities(prev => prev.filter(c => c.id !== id));
      toast({ title: "Deleted", description: "City deleted successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete city." });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/popular-cities/edit/${id}`);
  };

  return (
    <AdminLayout title="Popular Cities">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Popular Cities</h1>
          <Button onClick={() => navigate("/admin/popular-cities/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Popular Cities
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <CardTitle>All Cities</CardTitle>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search cities..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading cities...</div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Banner</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCities.length > 0 ? (
                      filteredCities.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <img src={c.banner} alt="banner" className="h-10 w-16 object-cover rounded" />
                          </TableCell>
                          <TableCell>{c.city.name}</TableCell>
                          <TableCell>{c.city.country}</TableCell>
                          <TableCell>{c.city.badge || "—"}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {c.category.map(cat => (
                                <span key={cat._id} className="bg-gray-200 text-xs px-2 py-1 rounded">
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                c.city.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {c.city.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(c.id)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No cities found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PopularCities;
