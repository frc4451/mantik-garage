import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ResourceEntry, ResourceMajor } from '@/lib/resources/schema';
import { RESOURCE_MAJOR_LABELS, resourceMajorSchema } from '@/lib/resources/schema';
import ResourceCard from './ResourceCard';
import ResourceFilters from './ResourceFilters';

interface Props {
  resources: ResourceEntry[];
  minorTags: string[];
}

function parseInitialMajors(): Set<ResourceMajor> {
  if (typeof window === 'undefined') return new Set();
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('major');
  if (!raw) return new Set();
  const majors = raw.split(',').map((s) => s.trim().toLowerCase());
  const valid = majors.filter((m): m is ResourceMajor => resourceMajorSchema.safeParse(m).success);
  return new Set(valid);
}

function parseInitialMinors(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('minor');
  if (!raw) return new Set();
  return new Set(raw.split(',').map((s) => s.trim()).filter(Boolean));
}

export default function ResourcesApp({ resources, minorTags }: Props) {
  const [query, setQuery] = useState('');
  const [selectedMajors, setSelectedMajors] = useState<Set<ResourceMajor>>(() => new Set());
  const [selectedMinors, setSelectedMinors] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setSelectedMajors(parseInitialMajors());
    setSelectedMinors(parseInitialMinors());
  }, []);

  const majors = useMemo(
    () => [...new Set(resources.map((r) => r.major))].sort() as ResourceMajor[],
    [resources],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      if (selectedMajors.size > 0 && !selectedMajors.has(r.major)) return false;
      if (selectedMinors.size > 0 && !selectedMinors.has(r.minor)) return false;
      if (!q) return true;
      const haystack = [
        r.title,
        r.description,
        r.minor,
        RESOURCE_MAJOR_LABELS[r.major],
        ...(r.tags ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [resources, query, selectedMajors, selectedMinors]);

  const toggleMajor = useCallback((major: ResourceMajor) => {
    setSelectedMajors((prev) => {
      const next = new Set(prev);
      if (next.has(major)) next.delete(major);
      else next.add(major);
      return next;
    });
  }, []);

  const toggleMinor = useCallback((minor: string) => {
    setSelectedMinors((prev) => {
      const next = new Set(prev);
      if (next.has(minor)) next.delete(minor);
      else next.add(minor);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedMajors(new Set());
    setSelectedMinors(new Set());
    setQuery('');
  }, []);

  return (
    <div className="resources-app">
      <div className="resources-toolbar">
        <label className="resources-search-wrap">
          <span className="visually-hidden">Search resources</span>
          <input
            type="search"
            className="resources-search"
            placeholder="Search by title, topic, or keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <p className="resources-count">
          {filtered.length} of {resources.length} resources
        </p>
      </div>

      <ResourceFilters
        majors={majors}
        minors={minorTags}
        selectedMajors={selectedMajors}
        selectedMinors={selectedMinors}
        onToggleMajor={toggleMajor}
        onToggleMinor={toggleMinor}
        onClearFilters={clearFilters}
      />

      {filtered.length === 0 ? (
        <p className="resources-empty">No resources match your search or filters.</p>
      ) : (
        <div className="resources-grid">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
