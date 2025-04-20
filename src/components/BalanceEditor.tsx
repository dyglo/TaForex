import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "../store/userStore";

export default function BalanceEditor() {
  const { user, isSignedIn } = useUser();
  const initialBalance = useUserStore((s) => s.initialBalance);
  const updateSettings = useUserStore((s) => s.updateSettings);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialBalance);

  // Keep input value in sync with Zustand initialBalance
  React.useEffect(() => {
    if (!editing) setValue(initialBalance);
  }, [initialBalance, editing]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isSignedIn) return null;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Use Clerk's update method for publicMetadata (Clerk v6)
      await user.update({ publicMetadata: { ...user.publicMetadata, initialBalance: value } } as any);
      updateSettings({ initialBalance: value });
      setEditing(false);
      setValue(value); // Ensure input reflects the new value
    } catch (e) {
      setError("Failed to update balance. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      {editing ? (
        <>
          <label htmlFor="balance-input" className="sr-only">Current Balance</label>
          <input
            id="balance-input"
            type="number"
            min={0}
            step={1}
            value={value}
            onChange={e => setValue(Number(e.target.value))}
            className="border px-2 py-1 rounded text-sm w-24"
            disabled={saving}
            placeholder="Enter balance"
            title="Current Balance"
          />
          <button
            className="text-blue-600 font-semibold text-xs px-2 py-1 rounded hover:bg-blue-100 disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            className="text-gray-500 text-xs px-2 py-1 rounded hover:bg-gray-100"
            onClick={() => { setEditing(false); setValue(initialBalance); }}
            disabled={saving}
          >
            Cancel
          </button>
          {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
        </>
      ) : (
        <button
          className="text-blue-600 font-semibold text-xs px-2 py-1 rounded hover:bg-blue-100"
          onClick={() => setEditing(true)}
        >
          Change
        </button>
      )}
    </div>
  );
}
