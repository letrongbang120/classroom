import React from 'react'
import AdminHeader from '../../components/AdminHeader/AdminHeader'
import Users from '../../components/Users/Users'

export default function AdminPage() {
    return (
        <div>
            {/* Check role before navigate to Admin... */}
            <AdminHeader />
            <Users />
        </div>
    )
}