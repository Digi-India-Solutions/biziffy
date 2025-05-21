import { AdminLayout } from "@/components/Layout/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Building } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { getData } from "@/services/FetchNodeServices";
import Swal from "sweetalert2";
import moment from "moment";

interface States {
  _id: string;
  name: string;
  stateImage: string;
  createdAt: string;
  updatedAt: string;
  uniqueStateId?: string;
}

const AllStates = () => {
  const [states, setStates] = useState<States[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const response = await getData("state/get-all-states");
        if (response.status) {
          setStates(response.data);
          setLoading(false);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching states:", error);
        setLoading(false);
        toast({ variant: "destructive", title: "Error", description: "Failed to load states. Please try again later.", });
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [toast]);

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this state?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        const response = await getData(`state/delete-state/${id}`);
        if (response.status) {
          setStates(states.filter((state) => state._id !== id));
          setLoading(false);
          toast({ title: "Deleted", description: "State has been deleted successfully.", });
        } else {
          setLoading(false);
          toast({ variant: "destructive", title: "Failed", description: "Could not delete the state.", });
        }
      } catch (error) {
        console.error("Delete error:", error);
        setLoading(false);
        toast({ variant: "destructive", title: "Error", description: "Something went wrong while deleting.", });
      }
    }
  };

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="All States">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">States Management</h1>
          <Link to="/admin/state/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New State
            </Button>
          </Link>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Search States..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-[200px] bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : filteredStates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStates.map((state) => (
              <Card key={state._id} className="overflow-hidden">
                <div
                  className="h-[120px] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${state?.stateImage || "/placeholder.svg"})`,
                  }}
                />

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{state.name}</CardTitle>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        ID: {state?.uniqueStateId || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Link to={`/admin/state/edit/${state._id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(state._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {moment(state.createdAt).format("DD MMM, YYYY")}
                    </span>
                    {/* <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {state.isActive}
                    </span> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 col-span-3">
            No states found matching your search.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllStates;
