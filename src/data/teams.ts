export interface Team {
  id: number;
  name: string;
  players: string;
}

export const teams: Team[] = [
  { id: 1, name: "Lobsters", players: "Damon & Scott" },
  { id: 2, name: "Singkenken", players: "Ken & Niko" },
  { id: 3, name: "Padel to the Metal", players: "Troy & Fab" },
  { id: 4, name: "The B Team", players: "JB & Dave" },
  { id: 5, name: "The Silver Nagas", players: "Rick & Mehdi" },
  { id: 6, name: "Island Storm", players: "Tim & Adam & Todd" },
  { id: 7, name: "Eight Eyes", players: "Justin & Ben" },
  { id: 8, name: "Anzacs", players: "Phil & Adam" },
];

export function getTeamById(id: number): Team | undefined {
  return teams.find((t) => t.id === id);
}

export function getTeamName(id: number): string {
  const team = getTeamById(id);
  return team ? `${team.name} (${team.players})` : `Team ${id}`;
}
