# Dynamic Menu Setup Guide

## Quick Start

### 1. Install Dependencies
All dependencies are already in package.json. If needed:
```bash
npm install
```

### 2. Configure Environment
Ensure `.env` has the correct Strapi API URL:
```env
VITE_STRAPI_API_URL=http://localhost:1337/api
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the Implementation

#### Login with Test Users
1. **Provider User**
   - Email: `provider@test.com`
   - Password: `123456`
   - Should see: Home, Resources, Departments (with Learning submenu), Providers

2. **Health Plan User**
   - Email: `health@test.com`
   - Password: `123456`
   - Should see: Home, Resources, Calendar, Departments

3. **Corporate User**
   - Email: `corp@test.com`
   - Password: `123456`
   - Should see: Home, Resources, Departments

#### Debug Menu Data
Visit `/menu-debug` after logging in to see:
- Current user information
- User role
- All menu items filtered by role
- Menu tree structure

## What Changed

### New Files Created
1. `src/types/menu.ts` - Type definitions for menu system
2. `src/utils/menuUtils.ts` - Menu filtering and tree building utilities
3. `src/utils/iconMapping.ts` - Icon name to component mapping
4. `src/hooks/useDynamicMenu.ts` - Hook to fetch role-based menus
5. `src/components/DynamicSidebar.tsx` - New dynamic sidebar component
6. `src/components/ProtectedRoute.tsx` - Route protection wrapper
7. `src/pages/MenuDebug.tsx` - Debug page for testing

### Modified Files
1. `src/services/auth.ts` - Enhanced to store user role
2. `src/services/menuService.ts` - Updated to fetch from `/menus` endpoint
3. `src/components/DashboardLayout.tsx` - Now uses DynamicSidebar
4. `src/App.tsx` - Added protected routes and menu debug route

## How It Works

### 1. Authentication Flow
```
User Login → Fetch User with Role → Store JWT + Role → Redirect to Dashboard
```

### 2. Menu Loading Flow
```
Dashboard Loads → useDynamicMenu Hook → Fetch Menus from Strapi → Filter by Role → Build Tree → Render
```

### 3. Role-Based Filtering
- Menu items with empty `visible_roles` = shown to everyone
- Menu items with `role: "all"` = shown to everyone
- Menu items with specific roles = shown only to those roles

### 4. Menu Structure
```
Root Items (parent = null)
  ├── Child Items (parent = root)
  └── Child Items (parent = root)
```

## Strapi Menu Configuration

### Creating Menu Items

#### Top-Level Item
```
Title: Home
URL: /home
Icon: home
Visible: true
Order: 10
Visible Roles: [provider, health_plan_user, corporate]
Parent: (none)
```

#### Child Item
```
Title: Learning
URL: /learning
Icon: book
Visible: true
Order: 10
Visible Roles: [all]
Parent: Departments
```

### Important Notes
1. **URL Field**: Use the full path (e.g., `/learning` not `learning`)
2. **Icon Field**: Use lowercase icon names (e.g., `home`, `folder`, `calendar`)
3. **Order Field**: Use gaps (10, 20, 30) for easy reordering
4. **Visible Roles**: Add multiple roles by clicking "Add an entry"

## Testing Checklist

- [ ] Login with provider user
- [ ] Verify provider-specific menu items show
- [ ] Login with health_plan_user
- [ ] Verify different menu items show
- [ ] Login with corporate user
- [ ] Verify corporate menu items show
- [ ] Test menu item with "all" role shows for everyone
- [ ] Test nested menu items (parent-child)
- [ ] Test collapsed sidebar shows tooltips
- [ ] Test expanded sidebar shows full menu
- [ ] Visit `/menu-debug` to verify data structure
- [ ] Test logout and re-login

## Troubleshooting

### Menu Not Loading
**Problem**: Sidebar shows "Loading menu..." forever

**Solutions**:
1. Check browser console for errors
2. Verify Strapi is running on `http://localhost:1337`
3. Check network tab for API calls
4. Verify JWT token in localStorage
5. Check Strapi permissions for authenticated users

### Wrong Menu Items Showing
**Problem**: User sees menu items they shouldn't

**Solutions**:
1. Visit `/menu-debug` to see current role
2. Check `visible_roles` in Strapi for each menu item
3. Verify user role in Strapi admin
4. Clear localStorage and re-login

### Icons Not Displaying
**Problem**: Icons show as default Home icon

**Solutions**:
1. Check icon name in Strapi matches `iconMapping.ts`
2. Add missing icons to `src/utils/iconMapping.ts`
3. Use lowercase icon names in Strapi

### Authentication Issues
**Problem**: Redirected to login after successful login

**Solutions**:
1. Check JWT token is stored in localStorage
2. Verify token is valid (not expired)
3. Check browser console for errors
4. Clear localStorage and try again

## API Endpoints Used

### Authentication
```
POST /api/auth/local
Body: { identifier: email, password: password }
Response: { jwt: string, user: User }
```

### Get User with Role
```
GET /api/users/me?populate=role
Headers: { Authorization: Bearer <jwt> }
Response: User with role information
```

### Get Menus
```
GET /api/menus?populate=*
Headers: { Authorization: Bearer <jwt> }
Response: { data: MenuItem[], meta: {...} }
```

## Next Steps

1. **Add More Icons**: Edit `src/utils/iconMapping.ts`
2. **Add More Routes**: Update `src/App.tsx` with new routes
3. **Customize Styling**: Modify `src/components/DynamicSidebar.tsx`
4. **Add Role-Based Landing**: Implement default landing page per role
5. **Add Menu Search**: Implement search functionality
6. **Cache Menu Data**: Use React Query for caching

## Support

For issues or questions:
1. Check the console for errors
2. Visit `/menu-debug` to inspect data
3. Review Strapi admin for menu configuration
4. Check network tab for API responses
