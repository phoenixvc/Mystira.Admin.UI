import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { characterMapsApi } from "../api/characterMaps";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";

function CharacterMapsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["characterMaps", page, pageSize, searchTerm],
    queryFn: () =>
      characterMapsApi.getCharacterMaps({
        page,
        pageSize,
        searchTerm: searchTerm || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => characterMapsApi.deleteCharacterMap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characterMaps"] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this character map?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert("Failed to delete character map");
      }
    }
  };

  const handleSearchReset = () => {
    setSearchTerm("");
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading character maps: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">🗺️ Character Maps</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <Link to="/admin/character-maps/import" className="btn btn-sm btn-primary">
              <i className="bi bi-plus-circle"></i> Import Character Map
            </Link>
          </div>
        </div>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={value => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Search character maps..."
        onSearchReset={handleSearchReset}
      />

      <div className="card">
        <div className="card-body">
          {data && data.characterMaps.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Image ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.characterMaps.map(map => (
                      <tr key={map.id}>
                        <td>{map.name}</td>
                        <td>{map.description || "-"}</td>
                        <td>{map.imageId || "-"}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => {
                                // TODO: Implement edit
                                alert("Edit functionality coming soon");
                              }}
                            >
                              <i className="bi bi-pencil"></i> Edit
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(map.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No character maps found.</p>
              <Link to="/admin/character-maps/import" className="btn btn-primary">
                Import Your First Character Map
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CharacterMapsPage;
