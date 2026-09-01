// Global styles for component tests
import "../../app/globals.css";

// Import shared commands
import "./commands";

// React 19 compatible mount - use cypress/react (not react18)
import type { MountOptions, MountReturn } from "cypress/react";
import { mount } from "cypress/react";

declare global {
  namespace Cypress {
    interface Chainable {
      mount(
        component: React.ReactNode,
        options?: MountOptions,
      ): Cypress.Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add("mount", mount);
