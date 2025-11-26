# Dynamic Menu Implementation Guide

## Overview
This implementation provides a role-based dynamic menu system that fetches menu items from Strapi v4 and filters them based on the logged-in user's role.

## Features
- ✅ Role-based menu filtering (provider, health_plan_user, corporate)
- ✅ Hierarchical menu structure with parent-child relationships
- ✅ Dynamic icon mapping from Strapi icon names to Lucide icons
- ✅ Automatic URL computation from parent + child aliases
- ✅ Visibility toggle support
- ✅ Protected routes with authentication
- ✅ User profile display with role information

## Architecture

### 1. Type Definitions (`src/types/menu.ts`)
- `UserRole`: Type for user roles
- `MenuItem`: Menu item structure
- `MenuResponse`: API response structure
- `User`: User with role information

### 2. Utilities

#### Menu Utils (`src/utils/menuUtils.ts`)
- `filterMenuByRole()`: Filter menu items by user role
- `buildMenuTree()`: Build hierarchical tree from flat menu data
- `computeFullUrl()`: Compute full URL paths
- `getVisibleMenuItems()`: Filter only visible items
- `flattenMenuTree()`: Flatten tree for search

#### Icon Mapping (`src/utils/iconMapping.ts`)
- `getIconComponent()`: Map icon name strings to Lucide icon components
- Supports common icons: home, folder, calendar, news, etc.

### 3. Services

#### Auth Service (`src/services/auth.ts`)
- Enhanced to fetch and store user role
- `login()`: Authenticates and stores user + role
- `getUserRole()`: Get current user's role
- `getStoredUser()`: Get stored user data

#### Menu Service (`src/services/menuService.ts`)
- `fetchMenuItems()`: Fetch all menu items from Strapi
- `fetchMenuForRole()`: Fetch and filter menu for specific role

### 4. Hooks

#### useDynamicMenu (`src/hooks/useDynamicMenu.ts`)
- Fetches menu items on mount
- Filters by current user's role
- Provides loading and error states

### 5. Components

#### DynamicSidebar (`src/components/DynamicSidebar.tsx`)
- Renders role-based menu items
- Supports collapsed/expanded states
- Handles nested menu items with dropdowns
- Shows user profile with role

#### ProtectedRoute (`src/components/ProtectedRoute.tsx`)
- Wraps routes requiring authentication
- Redirects to login if not authenticated

## Usage

### 1. Login Flow
```typescript
// User logs in
await login(email, password);
// Auth service automatically:
// - Stores JWT token
// - Fetches user with role
// - Stores user role (provider, health_plan_user, corporate)
```

### 2. Menu Rendering
```typescript
// DynamicSidebar automatically:
// - Fetches menu items from Strapi
// - Filters by user's role
// - Builds tree structure
// - Renders with appropriate icons
```

### 3. Role-Based Filtering
Menu items are filtered based on `visible_roles`:
- Empty array = visible to all
- `role: "all"` = visible to all
- Specific roles = visible only to those roles

## Strapi Configuration

### Menu Content Type Fields
- `title`: Menu item label
- `url`: Full URL path (e.g., `/departments/learning`)
- `icon`: Icon name (e.g., "home", "folder", "calendar")
- `visible`: Boolean toggle
- `order`: Sort order (nullable)
- `visible_roles`: Repeatable component with role enum
- `parent`: Relation to parent menu item

### Example Menu Data
```json
{
  "title": "Departments",
  "url": "/departments",
  "icon": "building",
  "visible": true,
  "order": 60,
  "visible_roles": [
    { "role": "provider" },
    { "role": "health_plan_user" },
    { "role": "corporate" }
  ],
  "parent": null
}
```

### Child Menu Item
```json
{
  "title": "Learning",
  "url": "/learning",
  "icon": "book",
  "visible": true,
  "order": 10,
  "visible_roles": [{ "role": "all" }],
  "parent": { "id": 7 }
}
```

## Testing Different Roles

### Test Users
1. **Provider**: `provider@test.com` / `123456`
2. **Health Plan User**: `health@test.com` / `123456`
3. **Corporate**: `corp@test.com` / `123456`

### Testing Steps
1. Log in with different test users
2. Observe different menu items based on role
3. Verify role-specific items are hidden/shown correctly

## Icon Mapping

### Available Icons
- `home` → Home
- `folder` → Folder
- `calendar` → Calendar
- `news` → Newspaper
- `doctor` / `stethoscope` → Stethoscope
- `building` → Building2
- `users` → Users
- `network` → Network
- `briefcase` → Briefcase
- `bar-chart` → BarChart3
- `file` → FileText
- `scale` → Scale
- `help` → HelpCircle
- `info` → Info
- `book` → BookOpen
- `cpu` → Cpu

Add more icons in `src/utils/iconMapping.ts` as needed.

## API Endpoints

### Fetch Menus
```
GET /api/menus?populate=*
Authorization: Bearer <jwt>
```

### User with Role
```
GET /api/users/me?populate=role
Authorization: Bearer <jwt>
```

## Environment Variables
```env
VITE_STRAPI_API_URL=http://localhost:1337/api
```

## Troubleshooting

### Menu Not Loading
- Check browser console for errors
- Verify JWT token is stored in localStorage
- Ensure Strapi permissions allow authenticated users to read menus

### Wrong Menu Items Showing
- Verify user role is correctly stored
- Check `visible_roles` configuration in Strapi
- Ensure menu items have correct parent relationships

### Icons Not Displaying
- Check icon name in Strapi matches mapping in `iconMapping.ts`
- Add missing icons to the icon map
- Default fallback is Home icon

## Future Enhancements
- [ ] Add manual_url override support
- [ ] Implement role-based default landing pages
- [ ] Add menu item search functionality
- [ ] Support external links
- [ ] Add menu item badges/notifications
- [ ] Cache menu data with React Query
