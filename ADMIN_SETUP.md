# Admin Dashboard Setup

## Accessing the Admin Dashboard

The admin dashboard can be accessed in the following ways:

1. **Via URL Parameter**: Add `?admin=true` to the main URL
   - Example: `http://localhost:3000/?admin=true`

2. **Via Admin Link**: Click the "Admin Access" link at the bottom of the registration form

3. **Direct Route**: Navigate to `/admin` (if routing is configured)

## Admin Features

The admin dashboard includes:

### Authentication
- Secure admin login using `/api/v1/backoffice/auth/login`
- Token-based authentication with refresh token support
- Session management

### Dashboard Overview
- Total customers count
- Pending reviews count
- Approved customers count
- Rejected customers count

### Customer Management
- View customer summaries with pagination
- Search and sort customers
- View customer details

### Review Management
- View pending KYC reviews
- Assign reviews to reviewers
- Update review status

## API Endpoints Used

### Authentication
- `POST /api/v1/backoffice/auth/login` - Admin login
- `POST /api/v1/backoffice/auth/logout` - Admin logout
- `POST /api/v1/backoffice/auth/refresh` - Refresh token

### Dashboard Data
- `GET /api/v1/metrics/dashboard` - Dashboard metrics
- `GET /api/v1/backoffice/customer-summaries` - Customer summaries
- `GET /api/v1/backoffice/pending-reviews` - Pending reviews

### User Management
- `GET /api/v1/backoffice/users` - Backoffice users
- `POST /api/v1/backoffice/users` - Create backoffice user

### Review Management
- `POST /api/v1/backoffice/reviews` - Create review
- `PUT /api/v1/backoffice/reviews/{id}/assign/{reviewerId}` - Assign review
- `PUT /api/v1/backoffice/reviews/{id}` - Update review

## Default Admin Credentials

Please contact your system administrator for admin credentials.

## Development Notes

- The admin dashboard uses a separate token management system from the customer portal
- All admin API calls are automatically authenticated using stored tokens
- The dashboard includes error handling and loading states
- Responsive design works on both desktop and mobile devices