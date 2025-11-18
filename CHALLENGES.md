# Test Automation Hub - Challenge Catalog

Complete reference guide for all 30 interactive testing challenges. Each challenge is a self-contained mini-application designed to teach specific test automation concepts and techniques.

---

## 🟢 Beginner Challenges (10)

Perfect for learning test automation fundamentals. Focus on basic interactions, locators, and assertions.

---

### 1. Login Form

- **ID**: `beginner-01-login-form`
- **Category**: Forms
- **Time**: ~15 minutes
- **API Endpoints**: `/api/auth/login`

**Description**: Test a login form with email/password validation, error states, and success redirect.

**Learning Objectives**:

- Locate and interact with form inputs
- Test form validation (required fields, email format)
- Verify error messages are displayed
- Test successful login flow
- Assert navigation after successful login

**Testing Hints**:

- Use `page.getByLabel()` to find form inputs
- Use `page.getByRole("button", { name: "Login" })` to find the submit button
- Wait for error messages with `page.getByText()`
- Use `page.waitForURL()` to verify navigation

**Notes**: Excellent starting point for beginners. Covers the most common testing pattern - form submission with validation. Great for learning locator strategies.

---

### 2. Product List

- **ID**: `beginner-02-product-list`
- **Category**: Lists
- **Time**: ~20 minutes
- **API Endpoints**: `/api/items`

**Description**: Test a product listing page with search, filters, and pagination.

**Learning Objectives**:

- Verify all products are loaded and displayed
- Test search functionality
- Test category filters
- Navigate through pagination
- Assert product details are correct

**Testing Hints**:

- Use `page.locator()` with data-testid attributes
- Count items with `.count()`
- Test filters by clicking and verifying results
- Use `page.getByRole("button", { name: "Next" })` for pagination

**Notes**: Introduces list testing patterns, counting elements, and state changes from user interactions. Good practice for filtering and pagination testing.

---

### 3. Shopping Cart

- **ID**: `beginner-03-shopping-cart`
- **Category**: State Management
- **Time**: ~25 minutes
- **API Endpoints**: None (client-side state)

**Description**: Test adding/removing items from cart and quantity updates.

**Learning Objectives**:

- Add products to cart
- Update product quantities
- Remove products from cart
- Verify cart total calculations
- Test empty cart state

**Testing Hints**:

- Use `page.getByRole("button", { name: /add to cart/i })`
- Find quantity inputs with `page.getByRole("spinbutton")`
- Assert text content with `expect(locator).toHaveText()`
- Test cart badge updates

**Notes**: Great for learning state management testing. Requires verifying calculations and UI updates based on user actions. Teaches assertion patterns for dynamic content.

---

### 4. User Profile

- **ID**: `beginner-04-user-profile`
- **Category**: Forms
- **Time**: ~20 minutes
- **API Endpoints**: `/api/auth/me`, `/api/users/:id`

**Description**: Test viewing and editing user profile information.

**Learning Objectives**:

- Load and display user information
- Enable edit mode
- Update profile fields
- Validate required fields
- Save changes and verify updates

**Testing Hints**:

- Use `page.getByRole("button", { name: "Edit" })`
- Fill inputs with `.fill()`
- Use `.clear()` before filling new values
- Wait for success messages

**Notes**: Covers edit-in-place patterns. Good for learning mode switching (view/edit) and form updates with existing data.

---

### 5. Search Bar

- **ID**: `beginner-05-search-bar`
- **Category**: Input
- **Time**: ~15 minutes
- **API Endpoints**: `/api/items`

**Description**: Test search functionality with debouncing and live results.

**Learning Objectives**:

- Type in search input
- Wait for debounced search
- Verify search results appear
- Test "no results" state
- Clear search and verify reset

**Testing Hints**:

- Use `page.getByPlaceholder()` to find search input
- Type slowly with `{ delay: 100 }`
- Wait for results with `page.waitForSelector()`
- Test with various search terms

**Notes**: Introduces timing concepts - debouncing means you need to wait for delayed API calls. Good for learning about async behavior in UIs.

---

### 6. Pagination

- **ID**: `beginner-06-pagination`
- **Category**: Navigation
- **Time**: ~20 minutes
- **API Endpoints**: `/api/items`

**Description**: Test pagination controls and page navigation.

**Learning Objectives**:

- Navigate to next/previous pages
- Click specific page numbers
- Verify current page is highlighted
- Test first/last page buttons
- Change page size

**Testing Hints**:

- Use `page.getByRole("button", { name: "Next" })`
- Assert `.toBeDisabled()` on first/last pages
- Verify URL parameters change
- Count visible items per page

**Notes**: Essential pattern for list-based UIs. Tests both UI state (active page, disabled buttons) and data loading. Good for URL parameter testing.

---

### 7. Modal Dialog

- **ID**: `beginner-07-modal-dialog`
- **Category**: UI Components
- **Time**: ~20 minutes
- **API Endpoints**: None

**Description**: Test opening, closing, and interacting with modal dialogs.

**Learning Objectives**:

- Open modal by clicking trigger button
- Verify modal is visible
- Close modal with X button
- Close modal with overlay click
- Submit form inside modal

**Testing Hints**:

- Use `page.getByRole("dialog")` to find modals
- Assert visibility with `.toBeVisible()`
- Click outside with `page.locator(".overlay").click()`
- Verify modal disappears after closing

**Notes**: Fundamental UI component pattern. Tests visibility states and multiple close mechanisms. Important for accessibility testing (dialog role).

---

### 8. Tabs Component

- **ID**: `beginner-08-tabs-component`
- **Category**: UI Components
- **Time**: ~20 minutes
- **API Endpoints**: None

**Description**: Test tab switching and content visibility.

**Learning Objectives**:

- Click on different tabs
- Verify active tab styling
- Verify correct content is displayed
- Test keyboard navigation (arrow keys)
- Verify URL updates with tab selection

**Testing Hints**:

- Use `page.getByRole("tab")`
- Assert aria-selected attribute
- Use `.press("ArrowRight")` for keyboard nav
- Check URL hash with `page.url()`

**Notes**: Great for learning ARIA attributes and keyboard accessibility testing. URL hash updates are important for bookmarkable state.

---

### 9. Accordion

- **ID**: `beginner-09-accordion`
- **Category**: UI Components
- **Time**: ~15 minutes
- **API Endpoints**: None

**Description**: Test expandable/collapsible accordion sections.

**Learning Objectives**:

- Expand accordion sections
- Collapse accordion sections
- Test single vs multiple open mode
- Verify content visibility
- Test nested accordions

**Testing Hints**:

- Use `page.getByRole("button", { expanded: false })`
- Assert aria-expanded attribute
- Use `.toBeHidden()` and `.toBeVisible()`
- Test all sections one by one

**Notes**: Common content organization pattern. Tests visibility toggles and ARIA states. Good for learning state assertions (expanded/collapsed).

---

### 10. Tooltip

- **ID**: `beginner-10-tooltip`
- **Category**: UI Components
- **Time**: ~15 minutes
- **API Endpoints**: None

**Description**: Test hover tooltips and accessibility.

**Learning Objectives**:

- Hover over elements to show tooltips
- Verify tooltip content
- Test tooltip positioning
- Test tooltip hiding on mouse out
- Verify keyboard accessibility

**Testing Hints**:

- Use `.hover()` to trigger tooltips
- Use `page.getByRole("tooltip")`
- Wait for tooltip with `waitForSelector()`
- Test focus for keyboard users

**Notes**: Introduces hover interactions. Important for accessibility - tooltips should work with keyboard navigation too, not just mouse hover.

---

## 🟡 Intermediate Challenges (10)

Build on fundamentals with more complex interactions, API integration, and advanced UI patterns.

---

### 11. Multi-Step Form

- **ID**: `intermediate-01-multi-step-form`
- **Category**: Forms
- **Time**: ~30 minutes
- **API Endpoints**: None (client-side)

**Description**: Test a wizard-style form with multiple steps and validation.

**Learning Objectives**:

- Navigate through form steps
- Validate each step before proceeding
- Test back button functionality
- Verify progress indicator
- Submit complete form

**Testing Hints**:

- Track current step with data attributes
- Test validation on "Next" click
- Verify previous data is retained
- Use `.nth()` for step indicators

**Notes**: Complex form pattern with state persistence across steps. Tests progressive disclosure and validation at multiple points. Good for learning conditional navigation.

---

### 12. File Upload

- **ID**: `intermediate-02-file-upload`
- **Category**: File Handling
- **Time**: ~25 minutes
- **API Endpoints**: `/api/files/upload`

**Description**: Test file upload with drag-and-drop and progress tracking.

**Learning Objectives**:

- Upload files via input
- Test drag-and-drop upload
- Verify upload progress
- Test file type validation
- Remove uploaded files

**Testing Hints**:

- Use `page.setInputFiles()` for uploads
- Test drag events with `dispatchEvent`
- Wait for progress bars to complete
- Verify file size limits

**Notes**: File upload testing is unique in Playwright. Uses `setInputFiles()` instead of manual clicking. Progress tracking requires waiting for async operations. Drag-and-drop adds complexity.

---

### 13. Real-Time Chat

- **ID**: `intermediate-03-realtime-chat`
- **Category**: WebSocket
- **Time**: ~35 minutes
- **API Endpoints**: `/api/ws/chat`

**Description**: Test WebSocket chat with multiple users and rooms.

**Learning Objectives**:

- Connect to chat room
- Send messages
- Receive messages in real-time
- Test multiple browser contexts
- Verify message timestamps

**Testing Hints**:

- Use multiple browser contexts for multi-user testing
- Wait for WebSocket connections
- Assert message order and content
- Test disconnect/reconnect scenarios

**Notes**: Advanced challenge requiring multiple browser contexts to simulate different users. Tests real-time communication patterns. Important for learning WebSocket testing strategies.

---

### 14. Drag and Drop

- **ID**: `intermediate-04-drag-drop`
- **Category**: Interactions
- **Time**: ~25 minutes
- **API Endpoints**: None

**Description**: Test drag-and-drop interactions for reordering items.

**Learning Objectives**:

- Drag items
- Drop in new positions
- Verify order updates

**Testing Hints**:

- Use `page.dragAndDrop()`
- Verify data-index attributes

**Notes**: Playwright's `dragAndDrop()` method simplifies complex mouse interactions. Important pattern for sortable lists and kanban boards.

---

### 15. Infinite Scroll

- **ID**: `intermediate-05-infinite-scroll`
- **Category**: Lists
- **Time**: ~20 minutes
- **API Endpoints**: None (uses Product List API)

**Description**: Test infinite scroll pagination.

**Learning Objectives**:

- Scroll to trigger load
- Verify new items appear
- Test scroll to top

**Testing Hints**:

- Use `page.evaluate()` to scroll
- Wait for loading indicators

**Notes**: Alternative to traditional pagination. Tests scroll-triggered events and progressive loading. Requires waiting for dynamic content.

---

### 16. Autocomplete

- **ID**: `intermediate-06-autocomplete`
- **Category**: Input
- **Time**: ~20 minutes
- **API Endpoints**: None (client-side filtering)

**Description**: Test autocomplete dropdown with keyboard navigation.

**Learning Objectives**:

- Type to show suggestions
- Navigate with arrow keys
- Select suggestion

**Testing Hints**:

- Use `.press("ArrowDown")`
- Assert `role="option"`

**Notes**: Combines typing, waiting for suggestions, and keyboard navigation. Important for accessibility - must work without mouse.

---

### 17. Date Picker

- **ID**: `intermediate-07-date-picker`
- **Category**: Input
- **Time**: ~25 minutes
- **API Endpoints**: None

**Description**: Test calendar date picker component.

**Learning Objectives**:

- Open calendar
- Select date
- Navigate months
- Verify input value

**Testing Hints**:

- Use `page.getByRole("gridcell")`
- Test date formatting

**Notes**: Complex UI component with calendar grid. Tests date selection, month navigation, and proper formatting. Calendar cells use gridcell role.

---

### 18. Rich Text Editor

- **ID**: `intermediate-08-rich-text-editor`
- **Category**: Input
- **Time**: ~30 minutes
- **API Endpoints**: None

**Description**: Test WYSIWYG editor with formatting.

**Learning Objectives**:

- Type text
- Apply formatting
- Insert links
- Verify HTML output

**Testing Hints**:

- Use contenteditable elements
- Test toolbar buttons

**Notes**: ContentEditable makes testing complex. Need to verify both visual formatting and underlying HTML. Tests selection and formatting commands.

---

### 19. Image Gallery

- **ID**: `intermediate-09-image-gallery`
- **Category**: Media
- **Time**: ~25 minutes
- **API Endpoints**: None

**Description**: Test image gallery with lightbox and navigation.

**Learning Objectives**:

- Open images
- Navigate gallery
- Close lightbox
- Test thumbnails

**Testing Hints**:

- Test keyboard shortcuts
- Verify image loading

**Notes**: Combines modal testing with keyboard navigation (arrow keys for next/prev). Tests image loading states and thumbnail-to-full-size interaction.

---

### 20. Data Table

- **ID**: `intermediate-10-data-table`
- **Category**: Lists
- **Time**: ~30 minutes
- **API Endpoints**: None (uses existing data)

**Description**: Test sortable, filterable data table.

**Learning Objectives**:

- Sort columns
- Filter rows
- Select rows
- Export data

**Testing Hints**:

- Test column headers
- Verify sort indicators

**Notes**: Complex component with multiple interactions. Tests sorting (ascending/descending), filtering, row selection, and data export. Important enterprise UI pattern.

---

## 🔴 Senior Challenges (10)

Advanced scenarios combining multiple concepts, complex state management, and real-world application patterns.

---

### 21. Admin Dashboard

- **ID**: `senior-01-admin-dashboard`
- **Category**: Dashboard
- **Time**: ~45 minutes
- **API Endpoints**: `/api/items`, `/api/users`, `/api/orders`

**Description**: Test complex dashboard with charts, filters, and real-time updates.

**Learning Objectives**:

- Load dashboard data
- Apply date range filters
- Interact with charts
- Test real-time data updates
- Export reports

**Testing Hints**:

- Use canvas for chart interactions
- Test multiple data sources
- Verify calculations
- Test refresh mechanisms

**Notes**: Comprehensive challenge combining multiple APIs, data visualization, filtering, and calculations. Tests ability to handle complex application state. Chart interaction requires canvas/SVG testing skills.

---

### 22. Admin Panel CRUD

- **ID**: `senior-02-admin-panel`
- **Category**: CRUD
- **Time**: ~40 minutes
- **API Endpoints**: `/api/users` (full CRUD)

**Description**: Test complete admin panel with user management.

**Learning Objectives**:

- Create users
- Edit users
- Delete users
- Test permissions

**Testing Hints**:

- Test role-based access
- Verify audit logs

**Notes**: Full CRUD operations in realistic admin context. Tests create, read, update, delete flows with proper validation and error handling. Role-based access adds authentication complexity.

---

### 23. E-commerce Checkout

- **ID**: `senior-03-ecommerce-checkout`
- **Category**: E-commerce
- **Time**: ~50 minutes
- **API Endpoints**: `/api/orders` (create order)

**Description**: Test complete checkout flow with payment simulation.

**Learning Objectives**:

- Add to cart
- Enter shipping
- Select payment
- Complete order

**Testing Hints**:

- Test validation at each step
- Verify order confirmation

**Notes**: Multi-step transaction flow with validation at each stage. Tests cart → shipping → payment → confirmation. Good for learning end-to-end flow testing with state persistence.

---

### 24. Social Media Feed

- **ID**: `senior-04-social-feed`
- **Category**: Social
- **Time**: ~40 minutes
- **API Endpoints**: None (simulated data)

**Description**: Test infinite social feed with likes, comments, shares.

**Learning Objectives**:

- Load posts
- Like/unlike
- Add comments
- Share posts

**Testing Hints**:

- Test optimistic updates
- Verify real-time counts

**Notes**: Complex social interactions with optimistic UI updates. Tests immediate UI response before API confirmation. Infinite scroll + real-time updates add complexity.

---

### 25. Analytics Charts

- **ID**: `senior-05-analytics-charts`
- **Category**: Visualization
- **Time**: ~35 minutes
- **API Endpoints**: `/api/items` (for data)

**Description**: Test interactive analytics with multiple chart types.

**Learning Objectives**:

- Switch chart types
- Filter data
- Hover tooltips
- Export charts

**Testing Hints**:

- Test SVG/Canvas elements
- Verify data accuracy

**Notes**: Data visualization testing with multiple chart types (bar, line, pie). Tests chart interaction, tooltips on hover, and data export. Requires verifying visual accuracy through DOM assertions.

---

### 26. Kanban Board

- **ID**: `senior-06-kanban-board`
- **Category**: Project Management
- **Time**: ~45 minutes
- **API Endpoints**: `/api/tasks` (planned)

**Description**: Test kanban board with drag-and-drop and status updates.

**Learning Objectives**:

- Drag cards
- Change status
- Edit cards
- Filter by assignee

**Testing Hints**:

- Test column limits
- Verify persistence

**Notes**: Advanced drag-and-drop with column constraints and state management. Tests task movement between columns, inline editing, and filtering. Real-world project management pattern.

---

### 27. Video Player

- **ID**: `senior-07-video-player`
- **Category**: Media
- **Time**: ~30 minutes
- **API Endpoints**: None

**Description**: Test custom video player controls.

**Learning Objectives**:

- Play/pause
- Seek
- Volume control
- Fullscreen
- Playback speed

**Testing Hints**:

- Test video element
- Verify time updates

**Notes**: Custom video controls testing. Interacts with HTML5 video element. Tests play/pause, seeking, volume, fullscreen, and playback speed. Good for learning media element testing.

---

### 28. Map Integration

- **ID**: `senior-08-map-integration`
- **Category**: Maps
- **Time**: ~40 minutes
- **API Endpoints**: None (uses map API)

**Description**: Test interactive map with markers and routes.

**Learning Objectives**:

- Load map
- Add markers
- Draw routes
- Search locations

**Testing Hints**:

- Test map library integration
- Verify coordinates

**Notes**: Third-party library integration (map provider). Tests map interactions, marker placement, route drawing. Complex because map libraries often use canvas/WebGL.

---

### 29. Feature Flags

- **ID**: `senior-09-feature-flags`
- **Category**: Configuration
- **Time**: ~35 minutes
- **API Endpoints**: `/api/flags`

**Description**: Test A/B testing with feature flag toggling.

**Learning Objectives**:

- Toggle features
- Test variants
- Verify UI changes
- Test persistence

**Testing Hints**:

- Test different user segments
- Verify analytics

**Notes**: Modern deployment pattern. Tests feature toggle on/off, variant testing (A/B), and UI changes based on flags. Important for testing conditional features without code changes.

---

### 30. Multi-Tab Sync

- **ID**: `senior-10-multi-tab-sync`
- **Category**: Advanced
- **Time**: ~45 minutes
- **API Endpoints**: `/api/auth/login`, `/api/auth/logout`

**Description**: Test session synchronization across multiple tabs.

**Learning Objectives**:

- Open multiple tabs
- Sync state
- Test logout propagation
- Verify conflicts

**Testing Hints**:

- Use multiple browser contexts
- Test localStorage events

**Notes**: Advanced scenario using multiple browser contexts. Tests state synchronization via localStorage/BroadcastChannel. Logout in one tab should log out all tabs. Tests race conditions and conflict resolution.

---

## 📊 Summary Statistics

| Difficulty   | Count  | Total Time   | Avg Time    |
| ------------ | ------ | ------------ | ----------- |
| Beginner     | 10     | ~185 min     | ~19 min     |
| Intermediate | 10     | ~265 min     | ~27 min     |
| Senior       | 10     | ~405 min     | ~41 min     |
| **Total**    | **30** | **~855 min** | **~29 min** |

## 🎯 Challenge Categories

- **Forms**: 3 challenges (Login, User Profile, Multi-Step Form)
- **UI Components**: 5 challenges (Modal, Tabs, Accordion, Tooltip, Date Picker)
- **Lists**: 4 challenges (Product List, Pagination, Infinite Scroll, Data Table)
- **State Management**: 1 challenge (Shopping Cart)
- **Input**: 4 challenges (Search Bar, Autocomplete, Rich Text Editor)
- **File Handling**: 1 challenge (File Upload)
- **WebSocket**: 1 challenge (Real-Time Chat)
- **Interactions**: 1 challenge (Drag and Drop)
- **Media**: 2 challenges (Image Gallery, Video Player)
- **Dashboard**: 1 challenge (Admin Dashboard)
- **CRUD**: 1 challenge (Admin Panel)
- **E-commerce**: 1 challenge (E-commerce Checkout)
- **Social**: 1 challenge (Social Feed)
- **Visualization**: 1 challenge (Analytics Charts)
- **Project Management**: 1 challenge (Kanban Board)
- **Maps**: 1 challenge (Map Integration)
- **Configuration**: 1 challenge (Feature Flags)
- **Advanced**: 1 challenge (Multi-Tab Sync)

---

## 🆕 NEW CHALLENGES (20 Additional)

### Beginner Level - NEW (5 challenges)

---

### 11. Registration Form

- **ID**: `beginner-11-registration-form`
- **Category**: Forms
- **Time**: ~20 minutes
- **API Endpoints**: `/api/auth/register`

**Description**: Test user registration with password confirmation and terms acceptance.

**Learning Objectives**:

- Fill registration form fields
- Test password confirmation matching
- Verify password strength indicator
- Test terms and conditions checkbox
- Verify successful registration

**Testing Hints**:

- Use `page.getByLabel()` for form inputs
- Compare password and confirm password values
- Assert checkbox with `.toBeChecked()`
- Wait for success message or redirect

**Notes**: Complements Login Form challenge. Tests password confirmation logic, strength indicators, and checkbox validation. Great for learning multi-field validation patterns.

---

### 12. Notification Toast

- **ID**: `beginner-12-notification-toast`
- **Category**: UI Components
- **Time**: ~15 minutes
- **API Endpoints**: None

**Description**: Test toast notifications with auto-dismiss and multiple types.

**Learning Objectives**:

- Trigger different toast types (success, error, info, warning)
- Verify toast content and styling
- Test auto-dismiss after timeout
- Test manual dismiss with close button
- Verify multiple toasts queue correctly

**Testing Hints**:

- Use `page.getByRole("alert")` or data-testid
- Wait for toast to disappear with `waitForSelector({ state: "hidden" })`
- Test timing with `page.waitForTimeout()`
- Count visible toasts with `.count()`

**Notes**: Common feedback pattern. Tests timing (auto-dismiss), queuing multiple notifications, and different notification types. Important for UX feedback testing.

---

### 13. Breadcrumb Navigation

- **ID**: `beginner-13-breadcrumb-navigation`
- **Category**: Navigation
- **Time**: ~15 minutes
- **API Endpoints**: None

**Description**: Test hierarchical breadcrumb navigation.

**Learning Objectives**:

- Verify breadcrumb trail is displayed
- Click breadcrumb links to navigate
- Verify current page is highlighted
- Test breadcrumb updates on navigation
- Verify separator elements

**Testing Hints**:

- Use `page.getByRole("navigation")` with `aria-label="breadcrumb"`
- Use `page.getByRole("link")` for breadcrumb items
- Assert `aria-current="page"` for current item
- Verify URL updates after clicks

**Notes**: Essential navigation pattern for hierarchical content. Tests link navigation, current page indication with ARIA attributes, and breadcrumb updates.

---

### 14. Loading States

- **ID**: `beginner-14-loading-states`
- **Category**: UI Components
- **Time**: ~15 minutes
- **API Endpoints**: None

**Description**: Test various loading indicators and skeleton screens.

**Learning Objectives**:

- Verify loading spinner appears during data fetch
- Test skeleton screen rendering
- Verify loading state disappears when data loads
- Test progress indicators
- Verify error state after failed load

**Testing Hints**:

- Use `page.getByRole("status")` or aria-busy attribute
- Wait for loading to disappear with `waitForSelector({ state: "hidden" })`
- Test with network delay simulation
- Assert skeleton elements before content loads

**Notes**: Critical UX pattern. Tests loading spinners, skeleton screens, and progress bars. Teaches waiting strategies and loading state verification.

---

### 15. Cookie Banner

- **ID**: `beginner-15-cookie-banner`
- **Category**: Compliance
- **Time**: ~15 minutes
- **API Endpoints**: None

**Description**: Test GDPR cookie consent banner.

**Learning Objectives**:

- Verify cookie banner appears on first visit
- Test accept all cookies
- Test reject all cookies
- Test customize cookie preferences
- Verify banner persistence after choice

**Testing Hints**:

- Use `page.getByRole("dialog")` or data-testid for banner
- Check localStorage after cookie choice
- Test banner does not appear after consent
- Use `context.clearCookies()` to reset

**Notes**: Real-world compliance requirement. Tests localStorage persistence, modal dialogs, and state management across page loads. Important for GDPR testing.

---

### 16. API GET Requests

- **ID**: `beginner-16-api-get-requests`
- **Category**: API Testing
- **Time**: ~15 minutes
- **API Endpoints**: `/api/items`

**Description**: Test basic API GET requests and response validation.

**Learning Objectives**:

- Send GET request to fetch items
- Verify response status code (200)
- Validate response JSON structure
- Test query parameters (limit, offset)
- Verify response data matches UI

**Testing Hints**:

- Use `page.request.get('/api/items')` for API calls
- Assert `response.status() === 200`
- Parse JSON with `response.json()`
- Test query params: `/api/items?limit=10&offset=0`
- Compare API data with UI using `page.locator().textContent()`

**Notes**: Foundation of API testing. Tests HTTP GET requests, response parsing, query parameters, and data validation. Essential for headless API testing.

---

### 17. API POST Requests

- **ID**: `beginner-17-api-post-requests`
- **Category**: API Testing
- **Time**: ~20 minutes
- **API Endpoints**: `/api/items`

**Description**: Test API POST requests for creating resources.

**Learning Objectives**:

- Send POST request with JSON body
- Verify 201 Created status code
- Validate response contains created resource
- Test error handling for invalid data (400)
- Verify resource appears in UI

**Testing Hints**:

- Use `page.request.post('/api/items', { data: {...} })`
- Set header: `Content-Type: application/json`
- Assert `response.status() === 201`
- Test with missing required fields (expect 400)
- Verify Location header for created resource

**Notes**: Tests resource creation via API. Important for testing form submissions, validating error responses, and verifying status codes. Tests proper HTTP method usage.

---

### 18. Responsive Layout

- **ID**: `beginner-18-responsive-layout`
- **Category**: Mobile
- **Time**: ~20 minutes
- **API Endpoints**: None

**Description**: Test responsive design across different viewport sizes.

**Learning Objectives**:

- Test desktop viewport (1920x1080)
- Test tablet viewport (768x1024)
- Test mobile viewport (375x667)
- Verify layout changes at breakpoints
- Test elements visibility across viewports

**Testing Hints**:

- Use `page.setViewportSize({ width: 375, height: 667 })`
- Assert element visibility with `.toBeVisible()`
- Test CSS grid/flexbox behavior
- Verify responsive images and text scaling

**Notes**: Essential modern web pattern. Tests responsive design fundamentals, breakpoint behavior, and mobile-first approach. Critical for cross-device compatibility.

---

### 19. Mobile Navigation

- **ID**: `beginner-19-mobile-navigation`
- **Category**: Mobile
- **Time**: ~20 minutes
- **API Endpoints**: None

**Description**: Test mobile hamburger menu and navigation drawer.

**Learning Objectives**:

- Open hamburger menu on mobile viewport
- Navigate through menu items
- Close menu with overlay click
- Test menu animations
- Verify desktop menu vs mobile menu

**Testing Hints**:

- Set mobile viewport first
- Use `page.getByRole("button", { name: /menu/i })`
- Test menu drawer with slide-in animation
- Assert `aria-expanded` attribute

**Notes**: Common mobile navigation pattern. Tests hamburger menus, drawer navigation, overlay interactions, and responsive navigation switching.

---

### 18. Touch Gestures

- **ID**: `beginner-18-touch-gestures`
- **Category**: Mobile
- **Time**: ~20 minutes
- **API Endpoints**: None

**Description**: Test basic touch interactions: tap, long press, double tap.

**Learning Objectives**:

- Test tap interaction
- Test long press (touch and hold)
- Test double tap
- Verify touch feedback
- Test touch target size (44x44px minimum)

**Testing Hints**:

- Use `page.tap()` for touch events
- Simulate long press with touchstart/touchend
- Test with mobile viewport
- Verify visual feedback on touch

**Notes**: Fundamental mobile interaction testing. Tests touch events, gesture recognition, and WCAG touch target size requirements (minimum 44x44px).

---

### Intermediate Level - NEW (8 challenges)

---

### 21. Color Picker

- **ID**: `intermediate-11-color-picker`
- **Category**: Input
- **Time**: ~25 minutes
- **API Endpoints**: None

**Description**: Test color picker component with hex, RGB, and preset colors.

**Learning Objectives**:

- Open color picker
- Select color from palette
- Enter hex color code
- Use RGB sliders
- Select from preset colors

**Testing Hints**:

- Use `page.locator('input[type="color"]')` for native picker
- Test custom color picker interactions
- Verify color value updates in different formats
- Test color preview updates

**Notes**: Specialized input component. Tests color format conversion (hex/RGB), range sliders, and preset selection. Good for learning custom input testing.

---

### 22. Slider / Range Input

- **ID**: `intermediate-12-slider-range`
- **Category**: Input
- **Time**: ~20 minutes
- **API Endpoints**: None

**Description**: Test slider and dual-handle range inputs.

**Learning Objectives**:

- Drag single slider handle
- Test dual-handle range slider
- Verify min/max constraints
- Test step increments
- Verify value display updates

**Testing Hints**:

- Use `page.locator('input[type="range"]')` for native sliders
- Use `.fill()` with value or `dragTo` for custom sliders
- Assert slider value with `.inputValue()`
- Test keyboard arrow keys for increments

**Notes**: Range input testing pattern. Tests drag interactions, value constraints, and keyboard controls. Dual-handle slider adds complexity.

---

### 23. Form Validation Library

- **ID**: `intermediate-13-form-validation`
- **Category**: Forms
- **Time**: ~30 minutes
- **API Endpoints**: None (async validation simulated)

**Description**: Test comprehensive form validation with real-time feedback.

**Learning Objectives**:

- Test field-level validation on blur
- Test async validation (unique email)
- Verify multiple validation rules
- Test form-level validation on submit
- Verify error message aggregation

**Testing Hints**:

- Trigger blur events with `.blur()`
- Wait for async validation with `waitForSelector`
- Test required, email, minLength, pattern rules
- Verify error messages appear and disappear

**Notes**: Advanced form testing. Tests real-time validation, async validation (email uniqueness check), multiple rules per field, and error aggregation.

---

### 24. Virtual Scrolling List

- **ID**: `intermediate-14-virtual-scroll`
- **Category**: Performance
- **Time**: ~30 minutes
- **API Endpoints**: None

**Description**: Test virtual scrolling with large datasets.

**Learning Objectives**:

- Load large dataset (1000+ items)
- Verify only visible items are rendered
- Scroll through list
- Verify DOM recycling
- Test scroll performance

**Testing Hints**:

- Count rendered DOM elements with `.count()`
- Use `page.evaluate()` to scroll to specific positions
- Verify items update as you scroll
- Test scroll to specific item by index

**Notes**: Performance optimization pattern. Tests that only visible items are rendered in DOM. Important for large dataset handling.

---

### 25. Lazy Loading Images

- **ID**: `intermediate-15-lazy-loading`
- **Category**: Performance
- **Time**: ~25 minutes
- **API Endpoints**: None

**Description**: Test image lazy loading with Intersection Observer.

**Learning Objectives**:

- Verify placeholder images initially
- Scroll to trigger image loading
- Verify images load on viewport entry
- Test loading attribute
- Verify error state for broken images

**Testing Hints**:

- Assert src attribute changes from placeholder to actual
- Use `page.evaluate()` to scroll images into view
- Test `loading="lazy"` attribute
- Verify alt text for accessibility

**Notes**: Modern performance pattern. Tests Intersection Observer behavior, lazy loading attribute, and progressive image loading.

---

### 26. Keyboard Shortcuts

- **ID**: `intermediate-16-keyboard-shortcuts`
- **Category**: Accessibility
- **Time**: ~25 minutes
- **API Endpoints**: None

**Description**: Test global and contextual keyboard shortcuts.

**Learning Objectives**:

- Test global shortcuts (Ctrl+K for search)
- Test context-specific shortcuts
- Open keyboard shortcuts help dialog
- Verify shortcuts work across different contexts
- Test shortcut conflict prevention

**Testing Hints**:

- Use `page.keyboard.press("Control+K")`
- Test Meta key for Mac: `"Meta+K"`
- Verify focus changes after shortcuts
- Test Escape key to close dialogs

**Notes**: Power-user feature. Tests keyboard event handling, shortcut combinations, and help dialog. Important for accessibility and productivity.

---

### 27. Context Menu

- **ID**: `intermediate-17-context-menu`
- **Category**: Interactions
- **Time**: ~25 minutes
- **API Endpoints**: None

**Description**: Test right-click context menus.

**Learning Objectives**:

- Right-click to open context menu
- Select menu items
- Test nested submenus
- Test keyboard navigation in menu
- Verify menu closes on click outside

**Testing Hints**:

- Use `page.click({ button: "right" })` for right-click
- Use `page.getByRole("menu")` and `role="menuitem"`
- Test arrow keys for menu navigation
- Verify menu position relative to click

**Notes**: Right-click interaction pattern. Tests context menus, nested submenus, keyboard navigation, and positioning.

---

### 28. Clipboard Operations

- **ID**: `intermediate-18-clipboard`
- **Category**: Browser APIs
- **Time**: ~20 minutes
- **API Endpoints**: None

**Description**: Test copy and paste functionality.

**Learning Objectives**:

- Copy text to clipboard
- Verify clipboard contents
- Paste from clipboard
- Test clipboard permissions
- Test fallback methods

**Testing Hints**:

- Use `context.grantPermissions(["clipboard-read", "clipboard-write"])`
- Use `page.evaluate()` to access `navigator.clipboard`
- Test `execCommand` fallback
- Verify success/error messages

**Notes**: Browser API testing. Tests Clipboard API, permissions, and fallback methods. Important for copy/paste features.

---

### 29. API CRUD Operations

- **ID**: `intermediate-19-api-crud-operations`
- **Category**: API Testing
- **Time**: ~30 minutes
- **API Endpoints**: `/api/items`, `/api/items/:id`

**Description**: Test complete Create, Read, Update, Delete API operations.

**Learning Objectives**:

- Create resource with POST (201)
- Read resource with GET (200)
- Update resource with PUT/PATCH (200)
- Delete resource with DELETE (204)
- Verify 404 after deletion

**Testing Hints**:

- Use `page.request.post/get/put/delete()`
- Store created resource ID for subsequent operations
- Assert `404` status after deletion
- Test partial updates with PATCH vs full updates with PUT
- Test complete lifecycle: CREATE → READ → UPDATE → DELETE → verify 404

**Notes**: Complete API testing workflow. Tests all CRUD operations, proper HTTP methods, status codes, and resource lifecycle. Foundation for REST API testing.

---

### 30. API Authentication

- **ID**: `intermediate-20-api-authentication`
- **Category**: API Testing
- **Time**: ~30 minutes
- **API Endpoints**: `/api/auth/login`, `/api/users/me`

**Description**: Test API authentication with tokens and protected endpoints.

**Learning Objectives**:

- Login and obtain JWT token
- Send authenticated requests with Bearer token
- Test 401 Unauthorized without token
- Test 403 Forbidden with invalid token
- Test token expiration and refresh

**Testing Hints**:

- Store token from login response: `const { token } = await response.json()`
- Add Authorization header: `{ headers: { 'Authorization': 'Bearer <token>' } }`
- Test protected endpoints without auth (expect 401)
- Use `page.request.storageState()` to persist authentication
- Test token expiration by waiting or manipulating timestamps

**Notes**: Security testing essentials. Tests JWT authentication, Bearer tokens, authorization headers, and proper 401/403 error handling. Critical for secured API testing.

---

### 31. Swipe Cards

- **ID**: `intermediate-21-swipe-cards`
- **Category**: Mobile
- **Time**: ~30 minutes
- **API Endpoints**: None

**Description**: Test swipeable card interface (Tinder-style).

**Learning Objectives**:

- Swipe card left to reject
- Swipe card right to accept
- Test swipe threshold
- Verify card stack behavior
- Test undo last swipe

**Testing Hints**:

- Use `page.mouse.move()` to simulate swipe
- Test swipe distance and velocity
- Verify card removal animation
- Test on mobile viewport

**Notes**: Popular mobile UI pattern. Tests swipe gestures, gesture thresholds, animations, and stack management. Common in dating apps and content discovery.

---

### 32. Mobile Form Inputs

- **ID**: `intermediate-22-mobile-form-inputs`
- **Category**: Mobile
- **Time**: ~25 minutes
- **API Endpoints**: None

**Description**: Test mobile-specific input types and keyboard behavior.

**Learning Objectives**:

- Test tel input with numeric keyboard
- Test email input with @ keyboard
- Test number input with numeric keyboard
- Test date/time pickers on mobile
- Verify input zoom prevention

**Testing Hints**:

- Set mobile viewport
- Use `input type="tel"`, `type="email"`, etc.
- Test `inputmode` attribute
- Verify `font-size >= 16px` to prevent zoom

**Notes**: Mobile-specific input optimization. Tests proper mobile keyboards (numeric, email), input modes, and zoom prevention (16px font minimum).

---

### 31. Pull to Refresh

- **ID**: `intermediate-21-pull-to-refresh`
- **Category**: Mobile
- **Time**: ~25 minutes
- **API Endpoints**: None

**Description**: Test pull-to-refresh interaction on mobile.

**Learning Objectives**:

- Pull down at top of page
- Verify refresh indicator appears
- Test content reload on release
- Verify refresh animation
- Test overscroll behavior

**Testing Hints**:

- Use `page.mouse.move()` to simulate pull gesture
- Start from top of scrollable container
- Verify loading state during refresh
- Test on mobile viewport

**Notes**: Native mobile pattern popularized by iOS/Android. Tests pull-down gesture, refresh indicators, and content reload on mobile.

---

### Senior Level - NEW (9 challenges)

---

### 31. API Rate Limiting

- **ID**: `senior-1-api-rate-limiting`
- **Category**: API Testing
- **Time**: ~35 minutes
- **API Endpoints**: `/api/items`

**Description**: Test API rate limiting and throttling behavior.

**Learning Objectives**:

- Send multiple rapid concurrent requests
- Verify 429 Too Many Requests status
- Test rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining)
- Test Retry-After header
- Verify rate limit reset after time period

**Testing Hints**:

- Use `Promise.all()` to send concurrent requests
- Assert response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Test different rate limits per endpoint
- Implement exponential backoff retry logic
- Verify rate limit resets after specified time

**Notes**: Advanced API testing. Tests rate limiting, throttling, 429 responses, retry strategies, and proper handling of rate limit headers. Essential for production API testing.

---

### 32. API Schema Validation

- **ID**: `senior-2-api-schema-validation`
- **Category**: API Testing
- **Time**: ~40 minutes
- **API Endpoints**: `/api/items`, `/api/users`

**Description**: Test API response schema validation with JSON Schema.

**Learning Objectives**:

- Define JSON schema for API response
- Validate response structure against schema
- Test required vs optional fields
- Test field types, formats, and patterns
- Test array and nested object validation

**Testing Hints**:

- Use JSON Schema validator library (e.g., Ajv)
- Define schema with required/optional fields, types, formats
- Test with valid and invalid responses
- Assert specific validation error messages
- Test edge cases: null values, empty arrays, extra fields, missing required fields

**Notes**: Professional API testing practice. Tests schema validation, contract testing, type safety, and API documentation accuracy. Critical for API contract testing and versioning.

---

### 33. Multi-Language (i18n)

- **ID**: `senior-11-multi-language`
- **Category**: Internationalization
- **Time**: ~40 minutes
- **API Endpoints**: None

**Description**: Test internationalization and localization.

**Learning Objectives**:

- Switch between languages
- Verify translations load correctly
- Test RTL layout for Arabic/Hebrew
- Test number and date formatting
- Verify language persistence

**Testing Hints**:

- Use language selector dropdown
- Assert text content changes after language switch
- Test `dir="rtl"` attribute for RTL languages
- Verify localStorage saves language preference

**Notes**: Critical for global applications. Tests translation loading, RTL layouts, locale-specific formatting, and persistence.

---

### 34. Theme Switcher

- **ID**: `senior-12-theme-switcher`
- **Category**: Theming
- **Time**: ~35 minutes
- **API Endpoints**: None

**Description**: Test theme switching with light, dark, and custom themes.

**Learning Objectives**:

- Switch between light and dark themes
- Create custom theme with color picker
- Test system preference detection
- Verify theme persistence
- Test CSS variable updates

**Testing Hints**:

- Use theme selector buttons
- Assert `data-theme` or class attributes on html/body
- Test `prefers-color-scheme` media query
- Verify localStorage saves theme preference

**Notes**: Modern UX pattern. Tests theme switching, CSS variables, system preference detection, and custom theme builder.

---

### 33. Code Editor

- **ID**: `senior-13-code-editor`
- **Category**: Advanced Input
- **Time**: ~45 minutes
- **API Endpoints**: None

**Description**: Test code editor with syntax highlighting and autocomplete.

**Learning Objectives**:

- Type code in editor
- Verify syntax highlighting
- Test line numbers
- Test code folding
- Test autocomplete suggestions

**Testing Hints**:

- Locate editor with `.monaco-editor` or `.CodeMirror`
- Use `page.locator(".view-line")` for code lines
- Test keyboard shortcuts (Ctrl+Space for autocomplete)
- Verify syntax tokens with CSS classes

**Notes**: Complex input component like Monaco/CodeMirror. Tests contenteditable alternatives, syntax highlighting, and autocomplete.

---

### 34. Calendar / Scheduler

- **ID**: `senior-14-calendar-scheduler`
- **Category**: Complex UI
- **Time**: ~50 minutes
- **API Endpoints**: None (planned: `/api/events`)

**Description**: Test full calendar with event scheduling.

**Learning Objectives**:

- Switch calendar views (day/week/month)
- Create new events
- Edit existing events
- Drag to resize events
- Test recurring events

**Testing Hints**:

- Use view switcher buttons
- Click on calendar cells to create events
- Use `dragAndDrop` for event resize
- Test event conflict detection

**Notes**: Complex scheduling interface. Tests calendar views, event CRUD, drag-to-resize, and recurring event patterns.

---

### 35. Offline Mode / PWA

- **ID**: `senior-15-offline-mode`
- **Category**: PWA
- **Time**: ~45 minutes
- **API Endpoints**: None (service worker)

**Description**: Test Progressive Web App offline functionality.

**Learning Objectives**:

- Test offline detection
- Verify cached content works offline
- Test background sync when online
- Test service worker registration
- Test install prompt

**Testing Hints**:

- Use `context.setOffline(true)` to simulate offline
- Verify offline indicator appears
- Test cached API responses
- Use `page.evaluate()` to check service worker

**Notes**: PWA testing pattern. Tests service workers, offline mode, cache strategies, and background sync.

---

### 36. OAuth / SSO Authentication

- **ID**: `senior-16-oauth-flows`
- **Category**: Security
- **Time**: ~50 minutes
- **API Endpoints**: `/api/auth/oauth`

**Description**: Test OAuth login flows and single sign-on.

**Learning Objectives**:

- Test OAuth provider redirect
- Handle popup-based OAuth
- Test redirect-based OAuth
- Verify token exchange
- Test multi-factor authentication

**Testing Hints**:

- Use `context.waitForEvent("page")` for popups
- Handle OAuth redirects with `waitForURL`
- Test different providers (Google, GitHub, etc.)
- Verify access token storage

**Notes**: Advanced auth testing. Tests OAuth flows, popup handling, redirects, and token management. Beyond basic login.

---

### 37. Performance Monitoring

- **ID**: `senior-17-performance-monitoring`
- **Category**: Performance
- **Time**: ~45 minutes
- **API Endpoints**: None (Performance API)

**Description**: Test performance metrics and Web Vitals dashboard.

**Learning Objectives**:

- Capture Core Web Vitals (LCP, FID, CLS)
- Test Performance API metrics
- Visualize resource timing waterfall
- Monitor network requests
- Test performance budgets

**Testing Hints**:

- Use `page.evaluate()` to access performance APIs
- Test web-vitals library integration
- Verify metric thresholds (good/needs improvement/poor)
- Assert performance marks and measures

**Notes**: Performance testing dashboard. Tests Web Vitals, Performance API, resource timing, and performance budgets.

---

### 38. Orientation Changes

- **ID**: `senior-18-orientation-changes`
- **Category**: Mobile
- **Time**: ~35 minutes
- **API Endpoints**: None

**Description**: Test device orientation changes and adaptive layouts.

**Learning Objectives**:

- Test portrait orientation
- Test landscape orientation
- Verify layout adaptation on orientation change
- Test orientation lock
- Verify media query behavior

**Testing Hints**:

- Use `page.setViewportSize()` with rotated dimensions
- Test with tablet viewport (768x1024 vs 1024x768)
- Verify CSS media queries (`orientation: portrait/landscape`)
- Test orientation change events

**Notes**: Advanced mobile testing. Tests orientation detection, layout adaptation, and CSS media queries for portrait/landscape modes. Important for tablet apps.

---

## 📊 Updated Summary Statistics

| Difficulty   | Count   | Total Time    | Avg Time    |
| ------------ | ------- | ------------- | ----------- |
| Beginner     | 18 (+3) | ~340 min      | ~19 min     |
| Intermediate | 21 (+3) | ~540 min      | ~26 min     |
| Senior       | 18 (+1) | ~745 min      | ~41 min     |
| **Total**    | **57**  | **~1625 min** | **~29 min** |

## 🎯 Challenge Categories (Updated)

**NEW - API Testing**: 6 challenges

- Beginner: API GET Requests, API POST Requests
- Intermediate: API CRUD Operations, API Authentication
- Senior: API Rate Limiting, API Schema Validation

**Mobile Testing**: 7 challenges

- Beginner: Responsive Layout, Mobile Navigation, Touch Gestures
- Intermediate: Swipe Cards, Mobile Form Inputs, Pull to Refresh
- Senior: Orientation Changes

**Other Categories**: Forms (3), UI Components (5), Lists (4), State Management (1), Input (4), Navigation (2), Compliance (1), File Handling (1), WebSocket (1), Interactions (2), Media (2), Performance (4), Dashboard (1), CRUD (1), E-commerce (1), Social (1), Visualization (1), Project Management (1), Maps (1), Configuration (1), Advanced (1), Internationalization (1), Theming (1), Advanced Input (1), Complex UI (1), PWA (1), Security (1), Browser APIs (1), Accessibility (1)

## 📊 Updated Summary Statistics

| Difficulty   | Count   | Total Time    | Avg Time    |
| ------------ | ------- | ------------- | ----------- |
| Beginner     | 20 (+2) | ~375 min      | ~19 min     |
| Intermediate | 23 (+2) | ~600 min      | ~26 min     |
| Senior       | 20 (+2) | ~820 min      | ~41 min     |
| **Total**    | **63**  | **~1795 min** | **~28 min** |

---

**Last Updated**: Phase 15 - 6 API Testing Challenges Added (November 2025)
**Platform**: Test Automation Hub - Framework-agnostic testing training platform
**Tech Stack**: React 18.3.1, Fastify 5.2.0, SQLite, TailwindCSS (Dark Theme)
**Challenge Count**: 63 total (20 beginner, 23 intermediate, 20 senior)
**NEW**: API testing category with 6 challenges covering GET/POST, CRUD, authentication, rate limiting, and schema validation
