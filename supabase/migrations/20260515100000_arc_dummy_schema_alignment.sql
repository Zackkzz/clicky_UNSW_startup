-- Align public schema with ARC / Rubric dummy shapes and in-app bundled JSON:
--   - societies: multi-value tags (JSON "tags" / future ARC facets; category remains primary bucket)
--   - activities: optional long description; multi-value tags (XLSX "Event Type / Tag" seeds into tags; event_type kept)

alter table public.societies
  add column if not exists tags text[] not null default '{}';

comment on column public.societies.tags is 'Discovery tags from ARC or app dummy JSON; may include category as one facet.';

alter table public.activities
  add column if not exists description text,
  add column if not exists tags text[] not null default '{}';

comment on column public.activities.description is 'Event body copy when ARC supplies it (not in the Feb–Mar 2026 XLSX columns).';
comment on column public.activities.tags is 'Faceted tags; seed maps workbook "Event Type / Tag" here; event_type remains the single-label column for simple filters.';

create index if not exists societies_tags_idx on public.societies using gin (tags);
create index if not exists activities_tags_idx on public.activities using gin (tags);

-- Backfill from legacy single-label columns when upgrading an already-seeded database.
update public.societies
set tags = ARRAY[category]::text[]
where category is not null
  and array_length(tags, 1) is null;

update public.activities
set tags = ARRAY[event_type]::text[]
where event_type is not null
  and array_length(tags, 1) is null;
