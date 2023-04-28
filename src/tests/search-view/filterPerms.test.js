import {
  filter,
  filterLabels,
  getEmptyCompanyFilter,
  getPermMapping,
  getPlaceholder,
} from "../../options/views/search-view/components/filter-search/components/utils/filter-util";
import mockEvidence from "../mock-data/mockData.json";

const defaultCompanyFilter = getEmptyCompanyFilter();
export const VOID = () => {};

test("Filter By Location Only", () => {
  const permFilterLabels = getPermMapping("location");
  const filteredWebsites = filter(
    "",
    mockEvidence.labelArrayPerSite,
    permFilterLabels
  );
  expect(getPlaceholder(false, {}, permFilterLabels)).toBe("in: location ");
  expect(Object.entries(filteredWebsites).length === 4).toBeTruthy();
});

test("Filter By Monotization Only", () => {
  const permFilterLabels = getPermMapping("monetization");
  const filteredWebsites = filter(
    "",
    mockEvidence.labelArrayPerSite,
    permFilterLabels
  );
  expect(getPlaceholder(false, {}, permFilterLabels)).toBe("in: monetization ");
  expect(Object.entries(filteredWebsites).length === 4).toBeTruthy();
});

test("Filter By Tracking Only", () => {
  const permFilterLabels = getPermMapping("tracking");
  const filteredWebsites = filter(
    "",
    mockEvidence.labelArrayPerSite,
    permFilterLabels
  );
  expect(getPlaceholder(false, {}, permFilterLabels)).toBe("in: tracking ");
  expect(Object.entries(filteredWebsites).length === 4).toBeTruthy();
});

test("Filter By Watchlist Only", () => {
  const permFilterLabels = getPermMapping("personal");
  const filteredWebsites = filter(
    "",
    mockEvidence.labelArrayPerSite,
    permFilterLabels
  );
  expect(getPlaceholder(false, {}, permFilterLabels)).toBe("in: personal ");
  expect(Object.entries(filteredWebsites).length === 1).toBeTruthy();
});
