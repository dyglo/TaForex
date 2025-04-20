import { useUser } from "@clerk/nextjs";
import { useUserStore } from "../store/userStore";
import { useState } from "react";

const currencyOptions = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"];

export default function ProfilePreferencesPanel() {
  const { user, isSignedIn } = useUser();
  const userStore = useUserStore();
  const [form, setForm] = useState({
    accountCurrency: userStore.accountCurrency,
    riskPercentage: userStore.riskPercentage,
    // Add more preferences as needed
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isSignedIn) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === "riskPercentage" ? Number(value) : value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await user.update({ publicMetadata: { ...user.publicMetadata, ...form } } as any);
      userStore.updateSettings(form);
      setSuccess("Preferences updated!");
    } catch (e) {
      setError("Failed to update preferences. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg p-6 mt-8 shadow" onSubmit={handleSave}>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Profile & Preferences</h2>
      <div className="mb-4">
        <label htmlFor="accountCurrency" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Account Currency</label>
        <select
          id="accountCurrency"
          name="accountCurrency"
          value={form.accountCurrency}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full text-sm"
        >
          {currencyOptions.map(cur => <option key={cur} value={cur}>{cur}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="riskPercentage" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Risk per Trade (%)</label>
        <input
          id="riskPercentage"
          name="riskPercentage"
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={form.riskPercentage}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full text-sm"
        />
      </div>
      {/* Add more preferences here as needed */}
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </form>
  );
}
