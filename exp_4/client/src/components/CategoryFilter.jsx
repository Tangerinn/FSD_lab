import { categories } from "../data/events";

function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={
            selected === cat
              ? "rounded-full border border-indigo-600 bg-indigo-600 px-4 py-1.5 text-white"
              : "rounded-full border border-indigo-600 bg-white px-4 py-1.5 text-indigo-600 hover:bg-indigo-50"
          }
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
