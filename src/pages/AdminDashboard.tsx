import React, { useEffect, useState, useCallback } from 'react'
import { Clock, Users, Hospital, AlertCircle } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { QueueTicket, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { priorityColors, priorityText, statusColors, statusName, departmentList } from '../lib/constants';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import EChartsReact, { EChartsOption } from 'echarts-for-react';
import { createClient } from '@supabase/supabase-js'

const pieChartOptionConst = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Department',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1, name: 'General Practice' },
        { value: 1, name: "Cardiology" },
        { value: 1, name: "Orthopedics" },
        { value: 1, name: "Pediatrics" },
      ]
    }
  ]
};

const DepartmentQueue = () => {
  const [tickets, setTickets] = useState<QueueTicket[]>([]);
  const {session, profile, loggedIn, fetchTickets, updateTicket, deleteTicket, signOut } = useAuth()
  const [updateCount, setUpdateCount] = useState(0)
  const [deptData, setDeptData] = useState<{ code: string, name: string, currentLoad: number }[]>([])
  const [pieChartOption, setPieChartOption] = useState(pieChartOptionConst)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('queue_tickets').select('*, profiles(full_name, phone_number)');
  
      if (error) {
        console.error('Supabase error:', error);
        return;
      }
  
      console.log('Fetched data:', data);
      setTickets(data); // ✅ Update queue
  
      const departmentStats = departmentList.map((dept) => ({
        code: dept.code,
        name: dept.name,
        currentLoad: data.filter(ticket => ticket.department === dept.code && ticket.status !== 2).length,
      }));
  
      setDeptData(departmentStats);
  
      setPieChartOption((prevOption) => ({
        ...prevOption,
        series: [
          {
            ...prevOption.series[0],
            data: departmentStats.map(d => ({ value: d.currentLoad, name: d.name })),
          },
        ],
      }));
  
    } catch (e) {
      console.error('Unexpected error:', e);
    }
  }, [setTickets, setDeptData, setPieChartOption, departmentList]);
  
  
  useEffect(() => {
    const subscription = supabase
      .channel('queue_tickets_channel') // ✅ Custom channel name
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue_tickets' },
        (payload) => {
          console.log('Realtime update:', payload);
          fetchData(); // Ensure fetchData is stable (use useCallback)
        }
      )
      .subscribe();
  
      return () => {
        supabase.removeChannel(subscription).catch((err) => console.error("Unsubscribe error:", err));
      };
      
  }, [fetchData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!(await loggedIn()) || !profile || !profile?.isAdmin) navigate('/login');
      const ticketData = await fetchTickets();

      if (ticketData) {
        // Process the ticket data
        setTickets(ticketData);
      }
      setLoading(false);
    };
    fetchData();
  }, [profile, updateCount]);


  // if (!profile || !profile?.isAdmin) {
  //   return <Navigate to={"/login"}/>
  // }

  const handleStatusChange = async (ticket: QueueTicket, status: number) => {
    ticket.status = status
    await updateTicket(ticket)
    setUpdateCount(updateCount + 1)
  };

  const toggleNotify = async (ticket: QueueTicket) => {
    ticket.isReady = !ticket.isReady;
    await updateTicket(ticket);
    setUpdateCount(updateCount + 1);
  
    // Ensure phoneNumber exists before sending SMS
    if (ticket.profiles?.phone_number) {
      try {
        const response = await fetch('http://localhost:5000/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: ticket.profiles?.phone_number,
            message: `Hello ${ticket.profiles?.full_name}, your turn is coming up! Please proceed to the counter.`,
          }),
        });
  
        const result = await response.json();
        if (result.success) {
          console.log('SMS sent successfully', result);
        } else {
          console.error('SMS failed:', result.error);
        }
      } catch (error) {
        console.error('Error sending SMS:', error);
      }
    } else {
      console.warn("No phone number available for this patient.");
    }
  };

  const deleteRow = async (id: string) => {
    const result = await deleteTicket(id)
    if (result) {
      setUpdateCount(updateCount + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Hospital className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">QueueCare</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="ml-2 text-sm text-gray-600">{tickets.filter(v => v.status != 2).length} Active Tickets</span>
              </div>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {deptData.map((dept) => (
                <div key={dept.code} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AlertCircle className={`h-6 w-6 ${dept.currentLoad > 80 ? 'text-red-600' :
                          dept.currentLoad > 50 ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">{dept.name}</h3>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4" />
                          <span className="ml-1">Load: {dept.currentLoad}%</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="overflow-hidden bg-gray-200 h-2 rounded-full">
                          <div
                            className={`h-2 rounded-full ${dept.currentLoad > 80 ? 'bg-red-500' :
                              dept.currentLoad > 50 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                            style={{ width: `${dept.currentLoad}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid mb-8 grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Queue Distribution Chart</h3>
                </div>
                <EChartsReact
                  // opts={ {height: 900} }
                  // autoResize={true}
                  // lazyUpdate={false}
                  showLoading={loading}
                  option={pieChartOption as EChartsOption}
                />
              </div></div>
          </div>
          <div>
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Current Queue</h2>
              </div>
              <div className="border-t border-gray-200">
                <ul role="list" className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <li key={ticket.id} className="px-4 py-4 sm:px-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                         <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {ticket.profiles?.full_name
                              ? ticket.profiles.full_name.split(" ").map(n => n[0]).join("")
                              : "?"}
                           </span>
          </div>
        </div>
        <div className="ml-4">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-900">
              {ticket.profiles?.full_name || "Unknown User"}
            </h3>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${priorityColors[ticket.priority]}`}>
              {priorityText[ticket.priority]}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            <span>{ticket.department}</span>
                              {/* <span className="mx-2">•</span> */}
                              {/* <span>Age: {patient.age}</span> */}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            {ticket.isReady && <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Notified
                            </span>}
                          </div>
                          <div className="flex items-center">
                            <span className="ml-1 text-sm text-gray-500">#{ticket.ticket_number}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="ml-1 text-sm text-gray-500">{new Date(ticket.estimated_time).toLocaleTimeString()}</span>
                          </div>
                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket, Number(e.target.value))}
                            className={`text-sm rounded-full px-3 py-1 ${statusColors[ticket.status]}`}
                          >
                            <option className='bg-neutral-50 text-gray-500' value="0">Waiting</option>
                            <option className='bg-neutral-50 text-gray-500' value="1">In Progress</option>
                            <option className='bg-neutral-50 text-gray-500' value="2">Completed</option>
                          </select>
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={(e) => toggleNotify(ticket)}>
                            Notify
                          </button>
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={(e) => deleteRow(ticket.id)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DepartmentQueue