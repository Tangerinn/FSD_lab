import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { useEvents } from "../context/EventContext";

function EventCard({ id, title, category, description, date, location, seats }) {
  const { user } = useAuth();
  const { register, unregister, isRegistered } = useEvents();

  const registered = isRegistered(id);
  const seatsLeft = seats - (registered ? 1 : 0);

  return (
    <div
      className={
        registered
          ? "rounded-xl border-2 border-green-500 bg-white p-6 shadow-md"
          : "rounded-xl border-2 border-transparent bg-white p-6 shadow-md"
      }
    >
      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
        {category}
      </span>

      <h2 className="mt-3 text-xl font-bold text-slate-900">{title}</h2>

      <p className="mt-2 text-slate-600">{description}</p>

      <p className="mt-3 text-slate-600">Date: {date}</p>
      <p className="text-slate-600">Location: {location}</p>
      <p className="text-slate-600">Seats left: {seatsLeft}</p>

      {/* Conditional rendering: 3 possible states */}
      {!user ? (
        <Link
          to="/login"
          className="mt-4 inline-block rounded-lg bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-800"
        >
          Login to Register
        </Link>
      ) : registered ? (
        <div className="mt-4">
          <p className="font-semibold text-green-600">Successfully Registered!</p>
          <button
            onClick={() => unregister(id)}
            className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Cancel Registration
          </button>
        </div>
      ) : (
        <button
          onClick={() => register(id)}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
        >
          Register
        </button>
      )}
    </div>
  );
}

export default EventCard;
