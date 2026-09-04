
export const TEXT_KEY = "customText";

const EMPTY_LABEL = "—";


export const normalizePairs = (pairs) => {
  if (!Array.isArray(pairs)) {
    return {};
  }

  return pairs.reduce((accumulated, pair) => {
    const key = (pair?.key ?? "").trim();

    if (key) {
      accumulated[key] = pair?.value ?? "";
    }

    return accumulated;
  }, {});
};


export const isEmptyEntry = (entry) =>
  !entry ||
  (!(entry.text ?? "").trim() &&
    Object.keys(normalizePairs(entry.pairs)).length === 0);


export const describeEntry = (entry) => {
  if (isEmptyEntry(entry)) {
    return EMPTY_LABEL;
  }

  const hasText = Boolean((entry.text ?? "").trim());
  const pairCount = Object.keys(normalizePairs(entry.pairs)).length;

  if (pairCount === 0) {
    return "text";
  }

  const pairLabel = `${pairCount} ${pairCount === 1 ? "attr" : "attrs"}`;

  return hasText ? `text + ${pairLabel}` : pairLabel;
};


export const findCollisions = (row, entry) => {
  if (!row || !entry) {
    return [];
  }

  const collisions = [];
  const has = (key) => Object.prototype.hasOwnProperty.call(row, key);

  if ((entry.text ?? "").trim() && has(TEXT_KEY)) {
    collisions.push(TEXT_KEY);
  }

  Object.keys(normalizePairs(entry.pairs)).forEach((key) => {
    if (has(key) && !collisions.includes(key)) {
      collisions.push(key);
    }
  });

  return collisions;
};


export const mergeCustomData = (row, entry) => {
  if (!row || !entry) {
    return row;
  }

  const merged = { ...row };
  const text = (entry.text ?? "").trim();

  if (text) {
    merged[TEXT_KEY] = text;
  }

  return { ...merged, ...normalizePairs(entry.pairs) };
};
