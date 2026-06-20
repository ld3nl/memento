bun test  
bun test v1.3.9 (cf6cdbbb)

lib/week-calculations.test.ts:

114 | const yearsAlive = calculateYearsAlive(dob);
115 | const weeksFromBday = calculateWeeksFromLastBirthday(dob);
116 |
117 | // differenceInCalendarISOWeekYears returns 35, minus 1 = 34 completed years
118 | // ISO week years can differ from calendar years at year boundaries
119 | expect(yearsAlive).toBe(34);
^
error: expect(received).toBe(expected)

Expected: 34
Received: 33

      at <anonymous> (/Users/denis/Documents/GitHub/memento/lib/week-calculations.test.ts:119:28)

✗ Week Calculations - Comprehensive DOB Tests > Weekly Progress Tracking > End-to-End Week Calculation Scenarios > correctly calculates for a person born on Jan 1, 1990 on June 15, 2024 [4.23ms]

lib/utils.test.ts:

lib/date-utils.test.ts:

lib/common.test.ts:

lib/url-utils.test.ts:

lib/life-table-utils.test.ts:

lib/validation.test.ts:

components/Week/Week.test.tsx:
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/Week/Week.test.tsx:6:5)
✗ Week > renders a week cell [4.72ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/Week/Week.test.tsx:12:27)
✗ Week > applies filled styling when isFilled is true
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/Week/Week.test.tsx:18:27)
✗ Week > does not apply filled styling when isFilled is false [0.15ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/Week/Week.test.tsx:24:5)
✗ Week > displays year label when yearsAlive is provided [0.12ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/Week/Week.test.tsx:30:27)
✗ Week > applies ml-auto class for weeks after week 26 [0.11ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/Week/Week.test.tsx:36:27)
✗ Week > does not apply ml-auto class for weeks 26 and below [0.11ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/Week/Week.test.tsx:42:27)
✗ Week > renders current week with partial fill [0.12ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/Week/Week.test.tsx:56:27)
✗ Week > renders inner fill div with correct percentage for current week [0.13ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/Week/Week.test.tsx:71:27)
✗ Week > applies custom className when provided [0.14ms]

components/LifeTable/LifeTable.test.tsx:
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/LifeTable/LifeTable.test.tsx:37:5)
✗ LifeTable > renders the life table container [0.27ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/LifeTable/LifeTable.test.tsx:43:5)
✗ LifeTable > renders correct number of decade grids [0.16ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/LifeTable/LifeTable.test.tsx:52:27)
✗ LifeTable > returns null when dob is missing [0.14ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/LifeTable/LifeTable.test.tsx:59:27)
✗ LifeTable > returns null when dob is invalid [0.12ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/LifeTable/LifeTable.test.tsx:65:5)
✗ LifeTable > accepts Date object as dob [0.11ms]

components/YearGrid/utils.test.ts:

components/YearGrid/YearGrid.test.tsx:
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/YearGrid/YearGrid.test.tsx:39:5)
✗ YearGrid > renders the year grid container [0.18ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/YearGrid/YearGrid.test.tsx:45:5)
✗ YearGrid > renders correct number of weeks [0.13ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/YearGrid/YearGrid.test.tsx:52:5)
✗ YearGrid > marks past weeks as filled in current year [0.11ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/YearGrid/YearGrid.test.tsx:61:5)
✗ YearGrid > marks future weeks as not filled [0.12ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/YearGrid/YearGrid.test.tsx:70:5)
✗ YearGrid > marks current week correctly [0.11ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/YearGrid/YearGrid.test.tsx:81:5)
✗ YearGrid > fills all weeks for completed years [0.14ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/YearGrid/YearGrid.test.tsx:94:5)
✗ YearGrid > does not fill any weeks for future years [0.11ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/YearGrid/YearGrid.test.tsx:107:5)
✗ YearGrid > shows year label on last week for year 1 [0.11ms]
251 | throw error;
252 | }
253 | if (!baseElement) {
254 | // default to document.body instead of documentElement to avoid output of potentially-large
255 | // head elements (such as JSS style blocks) in debug output
256 | baseElement = document.body;
^
ReferenceError: document is not defined
at render (/Users/denis/Documents/GitHub/memento/node_modules/@testing-library/react/dist/pure.js:256:19)
at <anonymous> (/Users/denis/Documents/GitHub/memento/components/YearGrid/YearGrid.test.tsx:117:5)
✗ YearGrid > shows year label on last week for multiples of 5 [0.11ms]

components/BurstScene/utils/layout.test.ts:

components/BurstScene/utils/math.test.ts:

24 tests failed:
✗ Week Calculations - Comprehensive DOB Tests > Weekly Progress Tracking > End-to-End Week Calculation Scenarios > correctly calculates for a person born on Jan 1, 1990 on June 15, 2024 [4.23ms]
✗ Week > renders a week cell [4.72ms]
✗ Week > applies filled styling when isFilled is true
✗ Week > does not apply filled styling when isFilled is false [0.15ms]
✗ Week > displays year label when yearsAlive is provided [0.12ms]
✗ Week > applies ml-auto class for weeks after week 26 [0.11ms]
✗ Week > does not apply ml-auto class for weeks 26 and below [0.11ms]
✗ Week > renders current week with partial fill [0.12ms]
✗ Week > renders inner fill div with correct percentage for current week [0.13ms]
✗ Week > applies custom className when provided [0.14ms]
✗ LifeTable > renders the life table container [0.27ms]
✗ LifeTable > renders correct number of decade grids [0.16ms]
✗ LifeTable > returns null when dob is missing [0.14ms]
✗ LifeTable > returns null when dob is invalid [0.12ms]
✗ LifeTable > accepts Date object as dob [0.11ms]
✗ YearGrid > renders the year grid container [0.18ms]
✗ YearGrid > renders correct number of weeks [0.13ms]
✗ YearGrid > marks past weeks as filled in current year [0.11ms]
✗ YearGrid > marks future weeks as not filled [0.12ms]
✗ YearGrid > marks current week correctly [0.11ms]
✗ YearGrid > fills all weeks for completed years [0.14ms]
✗ YearGrid > does not fill any weeks for future years [0.11ms]
✗ YearGrid > shows year label on last week for year 1 [0.11ms]
✗ YearGrid > shows year label on last week for multiples of 5 [0.11ms]

114 pass
24 fail
1087 expect() calls
Ran 138 tests across 13 files. [739.00ms]
