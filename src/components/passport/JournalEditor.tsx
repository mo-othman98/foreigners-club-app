"use client";

import { useState, type FormEvent } from "react";
import { POPULAR_COUNTRIES } from "@/lib/mock-data";
import { generateStampId, syncHeritageStamps } from "@/lib/passport-utils";
import type { PassportJournal, PassportStamp, StampType } from "@/types/passport";
import { STAMP_TYPE_LABELS } from "@/types/passport";

interface JournalEditorProps {
  journal: PassportJournal;
  onSave: (journal: PassportJournal) => void;
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
          list="countries"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
        <button
          type="button"
          onClick={addValue}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
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

const EMPTY_STAMP: Omit<PassportStamp, "id"> = {
  country: "",
  type: "visitor",
  entryDate: new Date().getFullYear().toString(),
  cities: [],
  notes: "",
};

export default function JournalEditor({
  journal,
  onSave,
}: JournalEditorProps) {
  const [data, setData] = useState<PassportJournal>(journal);
  const [newStamp, setNewStamp] = useState(EMPTY_STAMP);
  const [cityInput, setCityInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

  function updateField<K extends keyof PassportJournal>(
    field: K,
    value: PassportJournal[K]
  ) {
    setData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function addStamp() {
    if (!newStamp.country.trim()) return;
    const stamp: PassportStamp = {
      ...newStamp,
      id: generateStampId(),
      country: newStamp.country.trim(),
      cities: newStamp.cities,
    };
    setData((prev) => ({
      ...prev,
      stamps: [...prev.stamps, stamp],
    }));
    setNewStamp({ ...EMPTY_STAMP, entryDate: new Date().getFullYear().toString() });
    setCityInput("");
    setSaved(false);
  }

  function removeStamp(id: string) {
    setData((prev) => ({
      ...prev,
      stamps: prev.stamps.filter((s) => s.id !== id),
    }));
    setSaved(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const synced = syncHeritageStamps(data);
    onSave(synced);
    setData(synced);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setShowEditor(!showEditor)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Add passport stamps
          </h2>
          <p className="text-sm text-slate-500">
            Collect stamps from your life journey
          </p>
        </div>
        <span className="text-slate-400">{showEditor ? "▾" : "▸"}</span>
      </button>

      {showEditor && (
        <form onSubmit={handleSubmit} className="space-y-6 border-t border-slate-100 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass}
                placeholder="Alex Chen"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Birth Country
              </label>
              <input
                type="text"
                list="countries"
                value={data.birthCountry}
                onChange={(e) => updateField("birthCountry", e.target.value)}
                className={inputClass}
                placeholder="Palestine"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Birth Year
              </label>
              <input
                type="text"
                value={data.birthDate}
                onChange={(e) => updateField("birthDate", e.target.value)}
                className={inputClass}
                placeholder="1995"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Nationality
              </label>
              <input
                type="text"
                list="countries"
                value={data.nationality}
                onChange={(e) => updateField("nationality", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Current Country
              </label>
              <input
                type="text"
                list="countries"
                value={data.currentCountry}
                onChange={(e) => updateField("currentCountry", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Current City
              </label>
              <input
                type="text"
                value={data.currentCity}
                onChange={(e) => updateField("currentCity", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <datalist id="countries">
            {POPULAR_COUNTRIES.map((c) => (
              <option key={c.code} value={c.name} />
            ))}
            <option value="Palestine" />
            <option value="Turkey" />
            <option value="Morocco" />
          </datalist>

          <TagInput
            label="Languages"
            placeholder="e.g. Arabic, English, Turkish"
            values={data.languages}
            onChange={(languages) => updateField("languages", languages)}
          />

          <TagInput
            label="Heritage Countries"
            placeholder="Family origins — creates Heritage stamps"
            values={data.heritageCountries}
            onChange={(heritageCountries) =>
              updateField("heritageCountries", heritageCountries)
            }
          />

          <div className="rounded-xl border border-dashed border-teal-200 bg-teal-50/30 p-4">
            <h3 className="mb-3 text-sm font-semibold text-teal-800">
              Collect a new stamp
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                list="countries"
                value={newStamp.country}
                onChange={(e) =>
                  setNewStamp((s) => ({ ...s, country: e.target.value }))
                }
                placeholder="Country"
                className={inputClass}
              />
              <select
                value={newStamp.type}
                onChange={(e) =>
                  setNewStamp((s) => ({
                    ...s,
                    type: e.target.value as StampType,
                  }))
                }
                className={inputClass}
              >
                {(Object.keys(STAMP_TYPE_LABELS) as StampType[]).map((t) => (
                  <option key={t} value={t}>
                    {STAMP_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newStamp.entryDate}
                onChange={(e) =>
                  setNewStamp((s) => ({ ...s, entryDate: e.target.value }))
                }
                placeholder="Entry date (e.g. 2018 or 2018-06)"
                className={inputClass}
              />
              <input
                type="text"
                value={newStamp.exitDate ?? ""}
                onChange={(e) =>
                  setNewStamp((s) => ({
                    ...s,
                    exitDate: e.target.value || undefined,
                  }))
                }
                placeholder="Exit date (optional)"
                className={inputClass}
              />
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (cityInput.trim()) {
                      setNewStamp((s) => ({
                        ...s,
                        cities: [...s.cities, cityInput.trim()],
                      }));
                      setCityInput("");
                    }
                  }
                }}
                placeholder="City (press Enter to add)"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addStamp}
                className="shrink-0 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Collect stamp
              </button>
            </div>
            {newStamp.cities.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                Cities: {newStamp.cities.join(", ")}
              </p>
            )}
            <textarea
              value={newStamp.notes ?? ""}
              onChange={(e) =>
                setNewStamp((s) => ({ ...s, notes: e.target.value }))
              }
              placeholder="Notes about this chapter (optional)"
              rows={2}
              className={`${inputClass} mt-3`}
            />
          </div>

          {data.stamps.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Stamps collected ({data.stamps.length})
              </p>
              <div className="space-y-1">
                {data.stamps.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                  >
                    <span>
                      {s.country} · {STAMP_TYPE_LABELS[s.type]} · {s.entryDate}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStamp(s.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Save journal
            </button>
            {saved && (
              <span className="text-sm font-medium text-teal-600">
                Saved locally
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
