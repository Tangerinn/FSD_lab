import { useEffect, useState } from "react";

import EventCard from "../components/EventCard";
import Loading from "../components/Loading";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import { useEvents } from "../context/EventContext";
import useAuth from "../hooks/useAuth";

function Events() {
  // Shared state from Context (useContext)
  const { events, loading, error, isRegistered } = useEvents();
  const { user } = useAuth();

  // Local state (useState)
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [onlyRegistered, setOnlyRegistered] = useState(false);

  // useEffect: runs when the page loads and on unmount
  useEffect(() => {
    console.log("Events page loaded");
    return () => console.log("Events page cleanup");
  }, []);

  // Search + category + registered filtering
  const filteredEvents = events.filter((event) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      event.title.toLowerCase().includes(term) ||
      event.location.toLowerCase().includes(term);

    const matchesCategory = category === "All" || event.category === category;

    const matchesRegistered = !onlyRegistered || isRegistered(event.id);

    return matchesSearch && matchesCategory && matchesRegistered;
  });

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-900">Upcoming Events</h1>

        <p className="mt-2 text-slate-600">
          Explore our upcoming events and register for the ones you like.
        </p>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <CategoryFilter selected={category} onSelect={setCategory} />

        {user && (
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-slate-700">
            <input
              type="checkbox"
              checked={onlyRegistered}
              onChange={(e) => setOnlyRegistered(e.target.checked)}
            />
            Show only my registered events
          </label>
        )}

        {loading ? (
          <Loading />
        ) : error ? (
          <p className="mt-10 text-center text-lg text-red-600">{error}</p>
        ) : filteredEvents.length === 0 ? (
          <p className="mt-10 text-center text-lg text-slate-500">
            No events found.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
