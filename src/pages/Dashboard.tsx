import React, { useEffect, useState } from 'react';
import { useAuth, QueueTicket, Profile } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Clock, Users, Hospital, AlertCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { statusColors, statusName, priorityColors, priorityText, departmentList } from '../lib/constants';

export default function Dashboard() {
  const { user, profile, session, loggedIn, signOut, fetchTickets, createTicket, deleteTicket } = useAuth();
  const [tickets, setTickets] = useState<QueueTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('general');
  const [priority, setPriority] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!(await loggedIn()) || !user) navigate("/login");

      if (user) {
        const ticketData = await fetchTickets(user.id);
        if (ticketData) setTickets(ticketData);
        setLoading(false);
      }
    };

    fetchData();

    // **Subscribe to real-time ticket updates**
    const subscription = supabase
  .channel('queue_tickets')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'queue_tickets' }, (payload) => {
    console.log("Change detected: ", payload);

    if (payload.eventType === 'INSERT') {
      setTickets((prev) => [...prev, payload.new as QueueTicket]);
    }

    if (payload.eventType === 'UPDATE') {
      setTickets((prev) => 
        prev.map(ticket => (ticket.id === (payload.new as QueueTicket).id ? (payload.new as QueueTicket) : ticket))
      );
    }

    if (payload.eventType === 'DELETE') {
      setTickets((prev) => prev.filter(ticket => ticket.id !== (payload.old as QueueTicket).id));
    }
  })
  .subscribe();


    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  if (!profile) {
    return <></>;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getTicket = async () => {
    const result = await createTicket(profile.id, Number(priority), department);
    if (!result) {
      setError("Failed to add new ticket");
    }
  };

  const deleteRow = async (id: string) => {
    const result = await deleteTicket(id);
    if (!result) {
      setError("Failed to delete ticket");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center">
              <Hospital className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">QueueCare</h1>
            </Link>
            <div className="flex items-center">
              {profile && <span className="mr-4 text-sm text-gray-600">Welcome, {profile.full_name}</span>}
              <button onClick={handleSignOut} className="text-gray-500 hover:text-gray-700">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Get a Queue Ticket</h2>
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex gap-4 mb-6">
              <select value={department} onChange={(e) => setDepartment(e.target.value)}
                className="border-gray-300 rounded-md">
                {departmentList.map((v) => (
                  <option key={v.code} value={v.code}>{v.name}</option>
                ))}
              </select>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}
                className="border-gray-300 rounded-md">
                <option value="0">Normal</option>
                <option value="1">Urgent</option>
                <option value="2">Emergency</option>
              </select>
              <button onClick={getTicket} className="bg-blue-600 text-white px-4 py-2 rounded-md">Get Ticket</button>
            </div>

            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Queue Tickets</h2>
            {loading ? (
              <p>Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <p className="text-gray-500">No tickets found</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimated Time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{ticket.ticket_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ticket.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {(!ticket.isReady || ticket.status !== 0) && (
                          <span className={`px-2 text-xs font-semibold rounded-full ${statusColors[ticket.status]}`}>
                            {statusName[ticket.status]}
                          </span>
                        )}
                        {ticket.isReady && ticket.status === 0 && (
                          <span className="px-2 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Calling
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className={`px-2 text-xs font-semibold rounded-full ${priorityColors[ticket.priority]}`}>
                          {priorityText[ticket.priority]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(ticket.estimated_time).toLocaleTimeString()}
                      </td>
                      <td>
                        <button onClick={() => deleteRow(ticket.id)} className="bg-red-600 text-white px-4 py-2 rounded-md">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
