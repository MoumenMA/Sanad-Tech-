import { useEffect, useState, useRef } from "react";
import { AlertCircle, Loader2, Search, X } from "lucide-react";

interface ApiResponse {
  data: string[];
  page: number;
  limit: number;
}

function App() {
  const [users, setUsers] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [letter, setLetter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const LIMIT = 50;
  const MAX_RENDER = 200;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const controllerRef = useRef<AbortController | null>(null);

  const fetchUsers = async (reset = false): Promise<void> => {
    try {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://localhost:8888/display?page=${page}&limit=${LIMIT}&letter=${letter}`,
        { signal: controller.signal }
      );

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json: ApiResponse = await res.json();

      setUsers((prev) => (reset ? json.data : [...prev, ...json.data]));
    } catch (err) {
      if ((err as any).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Fetch failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when letter changes or reset search
  useEffect(() => {
    setPage(1);
    fetchUsers(true);
  }, [letter]);

  // Fetch more users when page changes
  useEffect(() => {
    if (page > 1) fetchUsers();
  }, [page]);

  // Filter all loaded users first, then slice
  const filteredUsers = users
    .filter((u) => u.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, MAX_RENDER);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Users</h2>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Alphabet Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-2">
            {alphabet.map((l) => (
              <button
                key={l}
                disabled={loading}
                onClick={() => {
                  setUsers([]);
                  setPage(1);
                  setLetter(l);
                  setSearchQuery(""); // reset search when filtering by letter
                }}
                className={`px-3 py-2 rounded font-medium transition-all ${
                  letter === l
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {l}
              </button>
            ))}

            {letter && (
              <button
                disabled={loading}
                onClick={() => {
                  setLetter("");
                  setUsers([]);
                  setPage(1);
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded font-medium bg-red-500 text-white hover:bg-red-600 transition-all ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {filteredUsers.length > 0 ? (
            <ul className="space-y-2">
              {filteredUsers.map((u, i) => (
                <li
                  key={`${u}-${i}`}
                  className="px-4 py-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  {u}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? "No users found matching your search"
                : "No users to display"}
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-6">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading users...</span>
          </div>
        )}

        {/* Load More Button */}
        {!loading && filteredUsers.length > 0 && users.length >= LIMIT && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
