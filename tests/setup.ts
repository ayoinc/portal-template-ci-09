import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { installApiDouble } from "./support/api";

installApiDouble();

afterEach(() => {
  cleanup();
});
