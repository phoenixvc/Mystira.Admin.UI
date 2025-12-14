import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  ageGroupsApi,
  archetypesApi,
  compassAxesApi,
  echoTypesApi,
  fantasyThemesApi,
  AgeGroup,
  Archetype,
  CompassAxis,
  EchoType,
  FantasyTheme,
} from "../api/masterData";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";

type MasterDataType =
  | "age-groups"
  | "archetypes"
  | "compass-axes"
  | "echo-types"
  | "fantasy-themes";

interface MasterDataPageConfig {
  title: string;
  icon: string;
  api: {
    getItems: (request?: {
      page?: number;
      pageSize?: number;
      searchTerm?: string;
    }) => Promise<{
      items: unknown[];
      totalCount: number;
      page: number;
      pageSize: number;
    }>;
    deleteItem: (id: string) => Promise<void>;
  };
  getItemName: (item: unknown) => string;
  getItemDescription: (item: unknown) => string;
}

const masterDataConfigs: Record<MasterDataType, MasterDataPageConfig> = {
  "age-groups": {
    title: "Age Groups",
    icon: "👥",
    api: {
      getItems: ageGroupsApi.getAgeGroups,
      deleteItem: ageGroupsApi.deleteAgeGroup,
    },
    getItemName: (item) => (item as AgeGroup).name,
    getItemDescription: (item) => (item as AgeGroup).description || "-",
  },
  archetypes: {
    title: "Archetypes",
    icon: "🎭",
    api: {
      getItems: archetypesApi.getArchetypes,
      deleteItem: archetypesApi.deleteArchetype,
    },
    getItemName: (item) => (item as Archetype).name,
    getItemDescription: (item) => (item as Archetype).description || "-",
  },
  "compass-axes": {
    title: "Compass Axes",
    icon: "🧭",
    api: {
      getItems: compassAxesApi.getCompassAxes,
      deleteItem: compassAxesApi.deleteCompassAxis,
    },
    getItemName: (item) => (item as CompassAxis).name,
    getItemDescription: (item) => (item as CompassAxis).description || "-",
  },
  "echo-types": {
    title: "Echo Types",
    icon: "🔊",
    api: {
      getItems: echoTypesApi.getEchoTypes,
      deleteItem: echoTypesApi.deleteEchoType,
    },
    getItemName: (item) => (item as EchoType).name,
    getItemDescription: (item) => (item as EchoType).description || "-",
  },
  "fantasy-themes": {
    title: "Fantasy Themes",
    icon: "✨",
    api: {
      getItems: fantasyThemesApi.getFantasyThemes,
      deleteItem: fantasyThemesApi.deleteFantasyTheme,
    },
    getItemName: (item) => (item as FantasyTheme).name,
    getItemDescription: (item) => (item as FantasyTheme).description || "-",
  },
};

function MasterDataPage() {
  const { type } = useParams<{ type: MasterDataType }>();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  if (!type || !(type in masterDataConfigs)) {
    return (
      <div className="alert alert-danger" role="alert">
        Invalid master data type
      </div>
    );
  }

  const config = masterDataConfigs[type];

  const { data, isLoading, error } = useQuery({
    queryKey: [type, page, pageSize, searchTerm],
    queryFn: () =>
      config.api.getItems({
        page,
        pageSize,
        searchTerm: searchTerm || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => config.api.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete this ${config.title.toLowerCase()}?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert(`Failed to delete ${config.title.toLowerCase()}`);
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
        Error loading {config.title.toLowerCase()}:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          {config.icon} {config.title}
        </h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                // TODO: Implement create
                alert("Create functionality coming soon");
              }}
            >
              <i className="bi bi-plus-circle"></i> Create
            </button>
          </div>
        </div>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder={`Search ${config.title.toLowerCase()}...`}
        onSearchReset={handleSearchReset}
      />

      <div className="card">
        <div className="card-body">
          {data && data.items.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item: unknown) => {
                      const id = (item as { id: string }).id;
                      return (
                        <tr key={id}>
                          <td>{config.getItemName(item)}</td>
                          <td>{config.getItemDescription(item)}</td>
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
                                onClick={() => handleDelete(id)}
                                disabled={deleteMutation.isPending}
                              >
                                <i className="bi bi-trash"></i> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No {config.title.toLowerCase()} found.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  // TODO: Implement create
                  alert("Create functionality coming soon");
                }}
              >
                Create Your First {config.title.slice(0, -1)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MasterDataPage;
