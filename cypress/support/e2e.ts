import { addCompareSnapshotCommand } from "cypress-visual-regression/dist/command";

addCompareSnapshotCommand({
  overwrite: true, // Make sure old images are overwritten
});
