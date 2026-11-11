import type { Preview } from "@storybook/react-vite";
import { AppProviders } from "../src/AppProviders";

const preview: Preview = {
  // Stories render inside the same providers as the application.
  decorators: [
    (Story) => (
      <AppProviders>
        <Story />
      </AppProviders>
    ),
  ],
};

export default preview;
