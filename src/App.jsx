import { useState } from "react";
import "./App.css";
import { Moon, Sun } from "lucide-react";

import Charts from "./components/Charts";
const App = () => {
  const [income, setIncome] = useState(10000);
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  // Filters
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  const handleAddOrUpdate = () => {
    const numericAmount = parseFloat(amount);
    if (!description || isNaN(numericAmount) || numericAmount <= 0 || !date) {
      alert("Please fill all fields with valid data.");
      return;
    }

    const newExpense = { description, amount: numericAmount, category, date };

    if (editIndex !== null) {
      const updated = [...expenses];
      updated[editIndex] = newExpense;
      setExpenses(updated);
      setEditIndex(null);
    } else {
      setExpenses([...expenses, newExpense]);
    }

    // Reset
    setAmount("");
    setDescription("");
    setCategory("Food");
    setDate("");
  };

  const handleEdit = (index) => {
    const exp = expenses[index];
    setDescription(exp.description);
    setAmount(exp.amount);
    setCategory(exp.category);
    setDate(exp.date);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = expenses.filter((_, i) => i !== index);
    setExpenses(updated);
    if (editIndex === index) {
      setEditIndex(null);
      setAmount("");
      setDescription("");
      setDate("");
      setCategory("Food");
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchCategory =
      filterCategory === "All" || exp.category === filterCategory;
    const matchDate = !filterDate || exp.date === filterDate;
    return matchCategory && matchDate;
  });

  // Group by category
  const categoryData = filteredExpenses.reduce((acc, curr) => {
    const existing = acc.find((item) => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  // Group by date
  const dateData = filteredExpenses.reduce((acc, curr) => {
    const existing = acc.find((item) => item.date === curr.date);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ date: curr.date, amount: curr.amount });
    }
    return acc;
  }, []);

  return (
    <div
      className={`app ${darkMode ? "dark" : "light"}`}
      style={{
        maxWidth: "2600px",
        margin: "auto",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex" }}>
        <h1 style={{ textAlign: "center" }}>Expense Tracker</h1>
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider"></span>
        </label>{" "}
      </div>
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          textAlign: "center",
          display: "flex",
          position: "sticky",
          justifyContent: "space-around",
        }}
      >
        <h2>Income: ₹{income}</h2>
        <h2>Total Expenses: ₹{totalExpenses}</h2>
        <h2>Balance: ₹{income - totalExpenses}</h2>
        {/* {income - totalExpenses < 0 && <p style={{ color: "red" }}>(Loss)</p>} */}
      </div>
      {/* Input Form */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Others">Others</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>
          {editIndex !== null ? "Update" : "Add"} Expense
        </button>
      </div>
      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Others">Others</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button
          onClick={() => {
            setFilterCategory("All");
            setFilterDate("");
          }}
        >
          Clear Filters
        </button>
      </div>
      {/* Expenses List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((exp, index) => (
            <li
              key={index}
              style={{
                border: "1px solid #ccc",
                marginBottom: "10px",
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{exp.description}</strong> - ₹{exp.amount} <br />
                <small>
                  {exp.category} | {exp.date}
                </small>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(index)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            No expenses found.
          </p>
        )}
      </ul>
      {totalExpenses >= income && (
        <>
          <p style={{ color: "red" }}>⚠️ You have exhausted your income.</p>
        </>
      )}
      <Charts categoryData={categoryData} dateData={dateData} />
      {/* Pie Chart by Category */}
    </div>
  );
};

export default App;
