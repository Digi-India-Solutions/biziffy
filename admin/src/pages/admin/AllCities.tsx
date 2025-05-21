import { AdminLayout } from "@/components/Layout/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { getData } from "@/services/FetchNodeServices";
import Swal from "sweetalert2";

interface City {
  _id: string;
  name: string;
  country: string;
  imageUrl: string;
  color?: string;
  status: "active" | "inactive";
  topCity: boolean;
}

const AllCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getData("city/get-all-city");
        console.log("res", res.data);
        if (res.status === true) setCities(res.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load cities. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [toast]);

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this city?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        const response = await getData(`city/delete-city/${id}`);
        if (response.status) {
          setCities(prev => prev.filter(city => city._id !== id));
          toast({
            title: "City Deleted",
            description: "The city has been successfully deleted.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Failed",
            description: "Could not delete the city.",
          });
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong while deleting.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="All Cities">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cities Management</h1>
          <Link to="/admin/cities/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New City
            </Button>
          </Link>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-[200px] bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.length > 0 ? (
              filteredCities.map(city => (
                <Card key={city._id} className="overflow-hidden shadow hover:shadow-lg transition-shadow">
                  <div
                    className="h-[120px] bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${city.cityImage || '/placeholder.svg'})`,
                      backgroundColor: city.color || '#f3f4f6',
                    }}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{city.name}</CardTitle>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {city.country}
                        </p>
                      </div>
                      {city.topCity && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Top City
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Link to={`/admin/cities/edit/${city._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(city._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${city.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {city.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">No cities found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllCities;
