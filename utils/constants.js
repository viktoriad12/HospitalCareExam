export const HEALTH_READING_INTERVAL = 3600;

const Statuses = {
  GREEN: "GREEN",
  ORANGE: "ORANGE",
  RED: "RED",
  GREY: "GREY",
};

export const validStatusTransitions = [
  { from: Statuses.GREEN, to: Statuses.RED },
  { from: Statuses.GREEN, to: Statuses.ORANGE },
  { from: Statuses.GREY, to: Statuses.ORANGE },
  { from: Statuses.GREY, to: Statuses.RED },
  { from: Statuses.ORANGE, to: Statuses.RED },
  { from: Statuses.GREEN, to: Statuses.GREY },
];

Object.freeze(Statuses);
