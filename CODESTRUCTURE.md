# Eden Client Portal Code Structure

## App.jsx Overview

### State Management
The application uses several pieces of state to manage different aspects:

1. **User Authentication State**
   - `userName`: Display name of logged-in user
   - `photoURL`: User's profile photo URL
   - `isAdmin`: Whether current user has admin privileges

2. **Client Data State**
   - `serviceData`: List of services for individual client
   - `invoices`: List of invoices for individual client
   - `pricePerMowTrim`: Base service price
   - `hasClientData`: Indicates if client data exists

3. **Admin Management State**
   - `allClients`: Complete list of all clients (admin only)
   - `activeClient`: Currently selected client in admin view
   - `selectedClient`: Derived state from allClients + activeClient

4. **UI State**
   - `isLoading`: Loading indicator for data fetching

### Main Functions

1. **Invoice Management**
   ```javascript
   addInvoice(invoice)
   // Adds new invoice to selected client
   // Parameters: invoice object with id, description, amount, isPaid, dueDate

   updateInvoiceStatus(invoiceId, isPaid)
   // Updates payment status of an invoice
   // Parameters: invoiceId and new isPaid status
   ```

2. **Service Management**
   ```javascript
   addService(service)
   // Adds new service record to client history
   // Parameters: service object with date and type
   ```

3. **Client Management**
   ```javascript
   addClient(clientData, clientNumber)
   // Creates new client with formatted client number
   // Parameters: clientData object and unique client number
   ```

### Data Flow
1. User logs in -> Authentication state updated
2. Based on user type (admin/client):
   - Admin: Loads all clients
   - Client: Loads personal data
3. Data modifications flow through Firebase
4. UI updates reflect database changes

### Component Structure
```
App
├── Nav (Top navigation)
├── Sidebar (Client selection for admins)
└── Main Content
    ├── Dashboard
    ├── Payments
    ├── Services
    ├── Login
    └── Signup
```

### Firebase Integration
- Uses Firestore for data storage
- Authentication for user management
- Real-time data updates on changes
- Structured collections for clients and their data

## Common Tasks

### Adding a New Invoice
1. Admin selects client (sets activeClient)
2. Fills invoice details
3. `addInvoice` function creates record
4. Firestore updated
5. UI refreshes with new data

### Updating Payment Status
1. Admin views invoice list
2. Clicks to mark as paid
3. `updateInvoiceStatus` updates record
4. Firestore updated
5. UI reflects new status

### Adding Service Record
1. Admin selects client
2. Enters service details
3. `addService` creates record
4. Firestore updated
5. Service history refreshes

This structure helps maintain clear data flow and component responsibility throughout the application.