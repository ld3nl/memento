// Import the actual schema from the file
const { formSchema } = require("./components/Form/schema");

// Test age over 80
console.log("Testing age over 80:");
const eightyYearsAgo = new Date();
eightyYearsAgo.setFullYear(eightyYearsAgo.getFullYear() - 81);
const result1 = formSchema.safeParse({
  name: "John",
  date: eightyYearsAgo.toISOString().split("T")[0],
});
console.log(
  "Errors:",
  result1.error?.issues.map((issue) => issue.message),
);

// Test normal age
console.log("\nTesting normal age:");
const thirtyYearsAgo = new Date();
thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
const result2 = formSchema.safeParse({
  name: "Jane",
  date: thirtyYearsAgo.toISOString().split("T")[0],
});
console.log("Success:", result2.success);

// Test ~80 years old (born 1944)
console.log("\nTesting ~80 years old (born 1944):");
const result3 = formSchema.safeParse({
  name: "Bob",
  date: "1944-01-01",
});
console.log("Success:", result3.success);
if (!result3.success) {
  console.log(
    "Errors:",
    result3.error?.issues.map((issue) => issue.message),
  );
}

// Test clearly over 80 (born 1940)
console.log("\nTesting clearly over 80 (born 1940):");
const result4 = formSchema.safeParse({
  name: "Alice",
  date: "1940-01-01",
});
console.log("Success:", result4.success);
if (!result4.success) {
  console.log(
    "Errors:",
    result4.error?.issues.map((issue) => issue.message),
  );
}
