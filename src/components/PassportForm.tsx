"use client";

import { useState, type FormEvent } from "react";
import type { PassportData } from "@/types";
import { POPULAR_COUNTRIES } from "@/lib/mock-data";

interface PassportFormProps {
  initialData: PassportData;
  onSave: (data: PassportData) => void;
}

function TagInput({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function addValue() {
    const trimmed = input.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setInput("");
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
        <button
          type="button"
          onClick={addValue}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800"
            >
              {value}
              <button
                type="button"
                onClick={() => onChange(values.filter((v) => v !== value))}
                className="text-teal-600 hover:text-teal-900"
                aria-label={`Remove ${value}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PassportForm({
  initialData,
  onSave,
}: PassportFormProps) {
  const [data, setData] = useState<PassportData>(initialData);
  const [saved, setSaved] = useState(false);

  function updateField<K extends keyof PassportData>(
    field: K,
    value: PassportData[K]
  ) {
    setData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            type="text"
            required
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Alex Chen"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Nationality
          </label>
          <input
            type="text"
            required
            list="countries"
            value={data.nationality}
            onChange={(e) => updateField("nationality", e.target.value)}
            placeholder="Canada"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Current Country
          </label>
          <input
            type="text"
            required
            list="countries"
            value={data.currentCountry}
            onChange={(e) => updateField("currentCountry", e.target.value)}
            placeholder="Germany"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Current City
          </label>
          <input
            type="text"
            required
            value={data.currentCity}
            onChange={(e) => updateField("currentCity", e.target.value)}
            placeholder="Berlin"
            className={inputClass}
          />
        </div>
      </div>

      <datalist id="countries">
        {POPULAR_COUNTRIES.map((c) => (
          <option key={c.code} value={c.name} />
        ))}
      </datalist>

      <TagInput
        label="Languages"
        placeholder="e.g. English, German"
        values={data.languages}
        onChange={(languages) => updateField("languages", languages)}
      />

      <TagInput
        label="Countries Lived"
        placeholder="e.g. Japan, Spain"
        values={data.countriesLived}
        onChange={(countriesLived) =>
          updateField("countriesLived", countriesLived)
        }
      />

      <TagInput
        label="Countries Visited"
        placeholder="e.g. Thailand, Portugal"
        values={data.countriesVisited}
        onChange={(countriesVisited) =>
          updateField("countriesVisited", countriesVisited)
        }
      />

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          Save Passport
        </button>
        {saved && (
          <span className="text-sm font-medium text-teal-600">
            Saved to your device
          </span>
        )}
      </div>
    </form>
  );
}
