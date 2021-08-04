export const getStart = (round: number) => 57601 + round * 201600;
export const getEnd = (round: number) => 57601 + (round + 1) * 201600;

export const payoutInterval = 3600;
export const mintTags = [``, ``, `Storage`, `Curators`, `Operators`];
export const salaries: { [key: string]: number } = {
  storageLead: 21000,
  storageProvider: 10500,
  curatorLead: 20678,
  curator: 13500,
  consul: 8571,
};
