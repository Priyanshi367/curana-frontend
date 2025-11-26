# Quick Reference Card

## 🚀 Quick Start

```bash
# Start dev server
npm run dev

# Login with test users
provider@test.com / 123456
health@test.com / 123456
corp@test.com / 123456

# Debug menu
http://localhost:5173/menu-debug
```

## 📋 Strapi Menu Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| title | Text | Yes | "Home" |
| url | Text | Yes | "/home" |
| icon | Text | Yes | "home" |
| visible | Boolean | No | true |
| order | Number | No | 10 |
| visible_roles | Component | No | [provider, all] |
| parent | Relation | No | Departments |

## 🎨 Available Icons

```
home, folder, calendar, news, newspaper
doctor, stethoscope, building, users, network
briefcase, bar-chart, file, scale, help
info, book, cpu
```

Add more in: `src/utils/iconMapping.ts`

## 🔐 User Roles

- `provider` - Provider users
- `health_plan_user` - Health plan users
- `corporate` - Corporate users
- `all` - All users (universal)

## 📁 Key Files

### Created
```
src/types/menu.ts              - Type definitions
src/utils/menuUtils.ts         - Menu utilities
src/utils/iconMapping.ts       - Icon mapping
src/utils/menuDebug.ts         - Debug tools
src/hooks/useDynamicMenu.ts    - Menu hook
src/components/DynamicSidebar.tsx - Sidebar component
src/components/ProtectedRoute.tsx - Route protection
src/pages/MenuDebug.tsx        - Debug page
```

### Modified
```
src/services/auth.ts           - Role storage
src/services/menuService.ts    - Menu fetching
src/components/DashboardLayout.tsx - Use DynamicSidebar
src/App.tsx                    - Protected routes
```

## 🔧 Common Tasks

### Add New Icon
```typescript
// src/utils/iconMapping.ts
import { NewIcon } from 'lucide-react';

const iconMap = {
  // ...
  'new-icon': NewIcon,
};
```

### Add New Route
```typescript
// src/App.tsx
<Route 
  path="/new-page" 
  element={<ProtectedRoute><NewPage /></ProtectedRoute>} 
/>
```

### Create Menu Item in Strapi
```
1. Go to Content Manager → Menu
2. Click "Create new entry"
3. Fill in:
   - Title: "My Page"
   - URL: "/my-page"
   - Icon: "folder"
   - Visible: true
   - Order: 50
   - Visible Roles: Add roles
4. Save & Publish
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Menu not loading | Check console, verify Strapi running |
| Wrong items showing | Visit /menu-debug, check visible_roles |
| Icons not showing | Add to iconMapping.ts |
| Auth issues | Clear localStorage, re-login |
| API errors | Check network tab, verify JWT token |

## 📊 Debug Commands

```javascript
// In browser console

// Check user role
localStorage.getItem('user_role')

// Check JWT token
localStorage.getItem('auth_token')

// Check stored user
JSON.parse(localStorage.getItem('auth_user'))

// Clear auth data
localStorage.clear()
```

## 🎯 Testing Checklist

- [ ] Login with provider user
- [ ] Verify provider menu items
- [ ] Login with health_plan_user
- [ ] Verify different menu items
- [ ] Login with corporate user
- [ ] Verify corporate menu items
- [ ] Test nested menu items
- [ ] Test collapsed sidebar
- [ ] Test mobile view
- [ ] Visit /menu-debug
- [ ] Check console logs
- [ ] Test logout/re-login

## 📞 API Endpoints

```
POST /api/auth/local
GET  /api/users/me?populate=role
GET  /api/menus?populate=*
```

## 🔑 LocalStorage Keys

```
auth_token    - JWT token
auth_user     - User object
user_role     - User role (provider, health_plan_user, corporate)
```

## 💡 Tips

1. **Use gaps in order**: 10, 20, 30 (easy to reorder)
2. **Test with all roles**: Ensure filtering works
3. **Check console logs**: Detailed debug info
4. **Use /menu-debug**: Visual inspection
5. **Clear cache**: If menu doesn't update
6. **Lowercase icons**: Use lowercase names in Strapi
7. **Full URLs**: Start with / (e.g., /home not home)

## 🎨 Customization

### Change Sidebar Width
```typescript
// src/components/DynamicSidebar.tsx
className={`... ${isCollapsed ? 'w-0 md:w-[60px]' : 'w-[280px]'}`}
```

### Change Icon Size
```typescript
// src/components/DynamicSidebar.tsx
<IconComponent className="h-5 w-5" /> // Change h-5 w-5
```

### Add Custom Styling
```typescript
// src/components/DynamicSidebar.tsx
className="your-custom-classes"
```

## 📚 Documentation

- `IMPLEMENTATION_SUMMARY.md` - Complete overview
- `SETUP_GUIDE.md` - Setup instructions
- `DYNAMIC_MENU_IMPLEMENTATION.md` - Technical details
- `QUICK_REFERENCE.md` - This file

## ✅ Success Indicators

- Menu loads without errors
- Different roles see different items
- Nested menus work
- Icons display correctly
- Navigation works
- Mobile responsive
- Debug page shows data
