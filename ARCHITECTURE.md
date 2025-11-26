# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                      │
│  │  Login Page  │────────▶│  Auth Service│                      │
│  └──────────────┘         └──────┬───────┘                      │
│                                   │                               │
│                                   ▼                               │
│                          ┌─────────────────┐                     │
│                          │ Store JWT+Role  │                     │
│                          └────────┬────────┘                     │
│                                   │                               │
│                                   ▼                               │
│  ┌──────────────┐         ┌──────────────┐                      │
│  │  Dashboard   │────────▶│DynamicSidebar│                      │
│  └──────────────┘         └──────┬───────┘                      │
│                                   │                               │
│                                   ▼                               │
│                          ┌─────────────────┐                     │
│                          │useDynamicMenu() │                     │
│                          └────────┬────────┘                     │
│                                   │                               │
│                                   ▼                               │
│                          ┌─────────────────┐                     │
│                          │ Menu Service    │                     │
│                          └────────┬────────┘                     │
│                                   │                               │
└───────────────────────────────────┼───────────────────────────────┘
                                    │
                                    │ HTTP Request
                                    │ GET /api/menus?populate=*
                                    │ Authorization: Bearer <jwt>
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Strapi v4)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                      │
│  │   Auth API   │         │   Menu API   │                      │
│  └──────────────┘         └──────┬───────┘                      │
│                                   │                               │
│                                   ▼                               │
│                          ┌─────────────────┐                     │
│                          │  Menu Content   │                     │
│                          │      Type       │                     │
│                          └────────┬────────┘                     │
│                                   │                               │
│                                   ▼                               │
│                          ┌─────────────────┐                     │
│                          │    Database     │                     │
│                          └─────────────────┘                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── ThemeProvider
│   └── SidebarProvider
│       └── LayoutProvider
│           └── TooltipProvider
│               └── BrowserRouter
│                   └── Routes
│                       ├── Login (public)
│                       └── ProtectedRoute
│                           └── DashboardLayout
│                               ├── Header
│                               ├── DynamicSidebar
│                               │   └── useDynamicMenu()
│                               └── Page Content
```

## Data Flow

### 1. Authentication Flow

```
User Input (email/password)
    │
    ▼
Login Component
    │
    ▼
auth.login()
    │
    ├─▶ POST /api/auth/local
    │       │
    │       ▼
    │   Strapi Auth
    │       │
    │       ▼
    │   Return { jwt, user }
    │
    ├─▶ GET /api/users/me?populate=role
    │       │
    │       ▼
    │   Return User with Role
    │
    ▼
Store in localStorage:
    ├─▶ auth_token: jwt
    ├─▶ auth_user: user object
    └─▶ user_role: role.type
    │
    ▼
Redirect to Dashboard
```

### 2. Menu Loading Flow

```
Dashboard Mounts
    │
    ▼
DynamicSidebar Renders
    │
    ▼
useDynamicMenu() Hook
    │
    ├─▶ getUserRole() from localStorage
    │
    ▼
fetchMenuForRole(role)
    │
    ├─▶ GET /api/menus?populate=*
    │       │
    │       ▼
    │   Strapi Returns Menu Data
    │
    ▼
buildMenuTree(data)
    │
    ├─▶ Create item map
    ├─▶ Build parent-child relationships
    └─▶ Sort by order
    │
    ▼
getVisibleMenuItems(tree)
    │
    └─▶ Filter visible: true
    │
    ▼
filterMenuByRole(items, role)
    │
    ├─▶ Check visible_roles
    ├─▶ Allow if empty or "all"
    └─▶ Allow if role matches
    │
    ▼
Return Filtered Menu Items
    │
    ▼
DynamicSidebar Renders Menu
```

### 3. Menu Rendering Flow

```
Menu Items Array
    │
    ▼
For Each Item:
    │
    ├─▶ getIconComponent(item.icon)
    │       │
    │       └─▶ Map string to Lucide Icon
    │
    ├─▶ Check if has children
    │   │
    │   ├─▶ Yes: Render dropdown button
    │   │       │
    │   │       └─▶ On click: toggle dropdown
    │   │               │
    │   │               └─▶ Render children
    │   │
    │   └─▶ No: Render NavLink
    │           │
    │           └─▶ Navigate to item.url
    │
    └─▶ Apply collapsed/expanded styling
```

## State Management

### LocalStorage
```
┌─────────────────────────────────────┐
│         LocalStorage Keys            │
├─────────────────────────────────────┤
│ auth_token    │ JWT token           │
│ auth_user     │ User object         │
│ user_role     │ provider/health/... │
│ sidebar:state │ expanded/collapsed  │
└─────────────────────────────────────┘
```

### React State
```
┌─────────────────────────────────────┐
│          Component State             │
├─────────────────────────────────────┤
│ useDynamicMenu                       │
│   ├─▶ menuItems: MenuItem[]         │
│   ├─▶ loading: boolean              │
│   └─▶ error: string | null          │
│                                      │
│ DynamicSidebar                       │
│   └─▶ openDropdown: string | null   │
│                                      │
│ SidebarContext                       │
│   ├─▶ isCollapsed: boolean          │
│   └─▶ toggleSidebar: () => void     │
└─────────────────────────────────────┘
```

## Type System

```
┌─────────────────────────────────────────────────────────┐
│                    Type Hierarchy                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  UserRole = 'provider' | 'health_plan_user' |           │
│             'corporate' | 'all'                          │
│                                                          │
│  VisibleRole {                                           │
│    id: number                                            │
│    role: UserRole                                        │
│  }                                                       │
│                                                          │
│  MenuItem {                                              │
│    id: number                                            │
│    documentId: string                                    │
│    title: string                                         │
│    url: string                                           │
│    icon: string                                          │
│    visible: boolean                                      │
│    order: number | null                                  │
│    visible_roles: VisibleRole[]                          │
│    parent: { id, documentId, title, url } | null         │
│    children?: MenuItem[]                                 │
│  }                                                       │
│                                                          │
│  User {                                                  │
│    id: number                                            │
│    email: string                                         │
│    username?: string                                     │
│    role?: {                                              │
│      id: number                                          │
│      name: string                                        │
│      type: string                                        │
│    }                                                     │
│  }                                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
frontend/src/
├── types/
│   └── menu.ts                    # Type definitions
│
├── utils/
│   ├── menuUtils.ts              # Menu filtering & tree building
│   ├── iconMapping.ts            # Icon name to component mapping
│   └── menuDebug.ts              # Debug utilities
│
├── services/
│   ├── auth.ts                   # Authentication service
│   └── menuService.ts            # Menu fetching service
│
├── hooks/
│   └── useDynamicMenu.ts         # Menu loading hook
│
├── components/
│   ├── DynamicSidebar.tsx        # Dynamic sidebar component
│   ├── ProtectedRoute.tsx        # Route protection
│   └── DashboardLayout.tsx       # Layout wrapper
│
└── pages/
    ├── Login.tsx                 # Login page
    └── MenuDebug.tsx             # Debug page
```

## Security Model

```
┌─────────────────────────────────────────────────────────┐
│                   Security Layers                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Authentication                                       │
│     ├─▶ JWT token required for API calls                │
│     └─▶ Token stored in localStorage                    │
│                                                          │
│  2. Route Protection                                     │
│     ├─▶ ProtectedRoute wrapper                          │
│     └─▶ Redirect to login if no token                   │
│                                                          │
│  3. Role-Based Filtering                                 │
│     ├─▶ Menu items filtered by user role                │
│     └─▶ Server-side permissions in Strapi               │
│                                                          │
│  4. API Authorization                                    │
│     ├─▶ Bearer token in request headers                 │
│     └─▶ Strapi validates token                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Performance Considerations

```
┌─────────────────────────────────────────────────────────┐
│                  Performance Strategy                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Single API Call                                      │
│     └─▶ Fetch all menus with populate=*                 │
│                                                          │
│  2. Client-Side Filtering                                │
│     ├─▶ Filter by visibility                            │
│     └─▶ Filter by role                                  │
│                                                          │
│  3. Memoization Opportunities                            │
│     ├─▶ useMemo for tree building                       │
│     ├─▶ useMemo for filtering                           │
│     └─▶ useCallback for handlers                        │
│                                                          │
│  4. Future: React Query Caching                          │
│     ├─▶ Cache menu data                                 │
│     ├─▶ Stale-while-revalidate                          │
│     └─▶ Reduce API calls                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────────────────────────┐
│                   Error Flow                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  API Error                                               │
│     │                                                    │
│     ├─▶ Network Error                                   │
│     │   └─▶ Show "Failed to load menu"                  │
│     │                                                    │
│     ├─▶ 401 Unauthorized                                │
│     │   └─▶ Redirect to login                           │
│     │                                                    │
│     ├─▶ 403 Forbidden                                   │
│     │   └─▶ Show "Access denied"                        │
│     │                                                    │
│     └─▶ 500 Server Error                                │
│         └─▶ Show "Server error"                         │
│                                                          │
│  Validation Error                                        │
│     │                                                    │
│     ├─▶ No user role                                    │
│     │   └─▶ Show "Please log in again"                  │
│     │                                                    │
│     └─▶ Invalid menu data                               │
│         └─▶ Log to console, show fallback               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Extension Points

```
┌─────────────────────────────────────────────────────────┐
│              How to Extend the System                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Add New Role                                         │
│     ├─▶ Add to UserRole type                            │
│     ├─▶ Create role in Strapi                           │
│     └─▶ Add to visible_roles enum                       │
│                                                          │
│  2. Add New Icon                                         │
│     ├─▶ Import from lucide-react                        │
│     └─▶ Add to iconMap in iconMapping.ts                │
│                                                          │
│  3. Add Menu Badge                                       │
│     ├─▶ Add badge field to MenuItem type                │
│     ├─▶ Add to Strapi content type                      │
│     └─▶ Render in DynamicSidebar                        │
│                                                          │
│  4. Add External Links                                   │
│     ├─▶ Add external field to MenuItem                  │
│     ├─▶ Check in renderMenuItem                         │
│     └─▶ Render <a> instead of NavLink                   │
│                                                          │
│  5. Add Menu Search                                      │
│     ├─▶ Use flattenMenuTree()                           │
│     ├─▶ Filter by search term                           │
│     └─▶ Highlight matches                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```
