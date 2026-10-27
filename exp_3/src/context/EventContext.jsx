import { createContext, useContext, useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";
import { eventData } from "../data/events";

// 1. createContext() - creates the shared "container" for event data
// eslint-disable-next-line react-refresh/only-export-components
export const EventContext = createContext();

function EventProvider({ children }) {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Registrations of ALL users: { "email": [eventId, ...] }
  // Lazy initial state: restored from localStorage on first render
  const [registrations, setRegistrations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eventHubRegistrations")) || {};
    } catch {
      return {};
    }
  });

  // useEffect #1: load events once (simulated API call)
  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(eventData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // useEffect #2: save registrations whenever they change
  useEffect(() => {
    localStorage.setItem(
      "eventHubRegistrations",
      JSON.stringify(registrations)
    );
  }, [registrations]);

  // Registered event ids of the logged-in user
  const registeredIds = user ? registrations[user.email] || [] : [];

  // State update functions
  function register(eventId) {
    if (!user) return;

    setRegistrations((prev) => {
      const current = prev[user.email] || [];
      if (current.includes(eventId)) return prev;
      return { ...prev, [user.email]: [...current, eventId] };
    });
  }

  function unregister(eventId) {
    if (!user) return;

    setRegistrations((prev) => ({
      ...prev,
      [user.email]: (prev[user.email] || []).filter((id) => id !== eventId),
    }));
  }

  function isRegistered(eventId) {
    return registeredIds.includes(eventId);
  }

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        registeredIds,
        register,
        unregister,
        isRegistered,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

// Custom hook: useContext() to read the shared state
// eslint-disable-next-line react-refresh/only-export-components
export function useEvents() {
  return useContext(EventContext);
}

export default EventProvider;
