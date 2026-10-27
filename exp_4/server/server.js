const express = require("express");
const cors = require("cors");

// 1. Create the Express server
const app = express();
const PORT = 5000;

// 2. Middleware
app.use(cors());          // allow the React frontend (another port) to call this API
app.use(express.json());  // parse JSON request bodies into req.body

// In-memory data (acts as our database)
let events = [
  { id: 1, title: "Tech Fest 2026", category: "Technical", description: "A technology event for students.", date: "20 September 2026", location: "Mumbai", seats: 100 },
  { id: 2, title: "React Workshop", category: "Technical", description: "Learn React from basics to advanced.", date: "25 September 2026", location: "Pune", seats: 40 },
  { id: 3, title: "AI Conference", category: "Technical", description: "Explore the latest developments in AI.", date: "30 September 2026", location: "Bangalore", seats: 150 },
  { id: 4, title: "Cultural Night", category: "Cultural", description: "Music, dance and drama performances.", date: "5 October 2026", location: "Mumbai", seats: 300 },
  { id: 5, title: "Photography Walk", category: "Cultural", description: "Guided city photo walk with experts.", date: "10 October 2026", location: "Pune", seats: 30 },
  { id: 6, title: "Inter-College Cricket", category: "Sports", description: "Knockout cricket tournament.", date: "15 October 2026", location: "Nagpur", seats: 60 },
  { id: 7, title: "Football League", category: "Sports", description: "5-a-side football league.", date: "20 October 2026", location: "Bangalore", seats: 50 },
  { id: 8, title: "Startup Pitch Day", category: "Business", description: "Pitch your idea to industry mentors.", date: "28 October 2026", location: "Mumbai", seats: 80 },
];
let nextId = 9;

// Helper: validate event data from req.body
function validateEvent(body) {
  const { title, category, date, location, seats } = body;
  if (!title || !category || !date || !location) {
    return "title, category, date and location are required";
  }
  if (seats !== undefined && (typeof seats !== "number" || seats < 0)) {
    return "seats must be a non-negative number";
  }
  return null;
}

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Event Management API is running" });
});

// 3. RESTful routes

// GET all events (optional ?category=Sports&search=react)
app.get("/api/events", (req, res) => {
  const { category, search } = req.query;
  let result = events;

  if (category) {
    result = result.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (e) => e.title.toLowerCase().includes(term) || e.location.toLowerCase().includes(term)
    );
  }

  res.status(200).json(result);
});

// GET one event by id (req.params)
app.get("/api/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const event = events.find((e) => e.id === id);

  if (!event) {
    return res.status(404).json({ error: `Event with id ${req.params.id} not found` });
  }
  res.status(200).json(event);
});

// POST create a new event (req.body)
app.post("/api/events", (req, res) => {
  const error = validateEvent(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { title, category, description = "", date, location, seats = 0 } = req.body;
  const newEvent = { id: nextId++, title, category, description, date, location, seats };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

// PUT update an existing event
app.put("/api/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = events.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Event with id ${req.params.id} not found` });
  }

  const error = validateEvent(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  events[index] = { ...events[index], ...req.body, id }; // id can never change
  res.status(200).json(events[index]);
});

// DELETE remove an event
app.delete("/api/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = events.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Event with id ${req.params.id} not found` });
  }

  const [deleted] = events.splice(index, 1);
  res.status(200).json({ message: "Event deleted successfully", event: deleted });
});

// Unknown route -> 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error-handling middleware (e.g. invalid JSON body) -> 400 / 500
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
