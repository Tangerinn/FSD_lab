function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search events by title or location..."
      className="mt-6 w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}

export default SearchBar;
