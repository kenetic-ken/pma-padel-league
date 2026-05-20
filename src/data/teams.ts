export interface Team {
  id: number;
  name: string;
}

export const teams: Team[] = [
  { id: 1, name: "Damon & Scott" },
  { id: 2, name: "Ken & Niko" },
  { id: 3, name: "Troy & Fab" },
  { id: 4, name: "JB & Dave" },
  { id: 5, name: "Rick & Mehdi" },
  { id: 6, name: "Tim, Adam & Todd" },
  { id: 7, name: "Justin & Ben" },
  { id: 8, name: "Phil & Adam H" },
];

export function getTeamById(id: number): Team | undefined {
  return teams.find((t) => t.id === id);
}

export function getTeamName(id: number): string {
  return getTeamById(id)?.name ?? `Team ${id}`;
}
