import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { useEvents } from "../context/EventContext";

function MyRegistrations() {
  const { user } = useAuth();
  const { events, registeredIds, unregister } = useEvents();

  const myEvents = events.filter((e) => registeredIds.includes(e.id));

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-900">My Registrations</h1>

        {user ? (
          <>
            <p className="mt-4 text-slate-600">
              Welcome,{" "}
              <span className="font-semibold">{user.name}</span>. You have
              registered for {registeredIds.length} event(s).
            </p>

            {myEvents.length === 0 ? (
              <p className="mt-6 text-slate-500">
                No registrations yet.{" "}
                <Link to="/events" className="text-indigo-600 underline">
                  Browse events
                </Link>
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {myEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-xl bg-white p-5 shadow-md"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {event.title}
                      </h2>
                      <p className="text-sm text-slate-600">
                        {event.date} | {event.location}
                      </p>
                    </div>
                    <button
                      onClick={() => unregister(event.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="mt-4 text-red-600">
            Please login to view your registrations.
          </p>
        )}
      </div>
    </div>
  );
}

export default MyRegistrations;
