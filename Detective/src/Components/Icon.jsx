const paths = {
  search: 'm21 21-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  folder: 'M3 7V4h6l2 3h10v13H3Z',
  mail: 'M3 5h18v14H3ZM3 5l9 8 9-8',
  clock: 'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  shield: 'M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7ZM8 12l3 3 5-6',
  trophy: 'M8 3h8v8a4 4 0 0 1-8 0ZM8 5H3v3a5 5 0 0 0 5 5m8-8h5v3a5 5 0 0 1-5 5m-4 2v6m-5 0h10',
  bulb: 'M9 18h6m-6 3h6M8 15a7 7 0 1 1 8 0l-1 2H9Z',
  link: 'm10 14 4-4m-5 6-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 0 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0',
  file: 'M5 3h9l5 5v13H5Zm9 0v5h5M8 12h8m-8 4h6',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-3a8 8 0 0 1 16 0v3Z',
  warning: 'M12 3 2 21h20ZM12 9v5m0 3v1',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  board: 'M4 4h16v14H4Zm3 18 2-4m8 4-2-4M7 8h3m4 0h3M9 12l6 3',
  retry: 'M3 4v6h6M3 10a9 9 0 1 1 2 9',
  book: 'M12 5v16M3 3h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z',
  check: 'm5 12 4 4L19 6',
}
export default function Icon({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.search} /></svg>
}
