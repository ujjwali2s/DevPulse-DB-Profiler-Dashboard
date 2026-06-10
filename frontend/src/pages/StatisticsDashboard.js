import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { Calendar, Filter, TrendingUp, Book, Users, Star, Clock } from 'lucide-react';
import StaffTopBar from './StaffTopBar';
import './statistics.css';

const StatisticsDashboard = ({ userRole = 'member' }) => {
  const [selectedMetric, setSelectedMetric] = useState('popular-books');
  const [timeFilter, setTimeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [overview, setOverview] = useState({});
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  const metrics = [
    { value: 'popular-books', label: 'Most Popular Books', icon: Book, colorClass: 'icon-blue' },
    { value: 'requested-books', label: 'Most Requested Books', icon: Clock, colorClass: 'icon-orange' },
    { value: 'unmet-demand', label: 'High Demand Books', icon: TrendingUp, colorClass: 'icon-cyan' },
    { value: 'popular-genres', label: 'Popular Genres', icon: Book, colorClass: 'icon-blue' },
    { value: 'popular-authors', label: 'Popular Authors', icon: Users, colorClass: 'icon-green' },
    { value: 'rated-books', label: 'Highest Rated Books', icon: Star, colorClass: 'icon-yellow' },
  ];

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const COLORS = ['#77f1f7', '#ed2d83', '#f2e03d', '#d377f7', '#2a24ed', '#5ef20f', '#5ef20f'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (timeFilter === 'range' && startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
      } else if (timeFilter === 'month' && selectedMonth) {
        params.append('month', selectedMonth);
        params.append('year', selectedYear);
      } else if (timeFilter === 'year' && selectedYear) {
        params.append('year', selectedYear);
      }

      const url = `/api/statistics/${selectedMetric}?${params.toString()}`;
      console.log(`📡 Fetching metric "${selectedMetric}" from:`, url);

      const response = await fetch(url);
      const result = await response.json();

      console.log('📊 Fetched data result:', result);

      setData(result || []);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const params = new URLSearchParams();

      if (timeFilter === 'range' && startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
      } else if (timeFilter === 'month' && selectedMonth) {
        params.append('month', selectedMonth);
        params.append('year', selectedYear);
      } else if (timeFilter === 'year' && selectedYear) {
        params.append('year', selectedYear);
      }

      const response = await fetch(`/api/statistics/overview?${params.toString()}`);
      const result = await response.json();

      console.log('📊 Overview data:', result);
      setOverview(result || {});
    } catch (error) {
      console.error('❌ Error fetching overview:', error);
      setOverview({});
    }
  };

  const fetchTrends = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedYear) params.append('year', selectedYear);
      params.append('type', 'monthly');

      const response = await fetch(`/api/statistics/trends?${params.toString()}`);
      const result = await response.json();

      console.log('📈 Trends data:', result);
      setTrends(result || []);
    } catch (error) {
      console.error('❌ Error fetching trends:', error);
      setTrends([]);
    }
  };

  useEffect(() => {
    console.log('🔁 Metric changed:', selectedMetric);
    fetchData();
    fetchOverview();
    fetchTrends();
  }, [selectedMetric, timeFilter, startDate, endDate, selectedMonth, selectedYear]);

  const renderChart = () => {
    console.log('📈 renderChart called for:', selectedMetric);
    console.log('📦 chart data =', data);

    if (!data || data.length === 0) {
      return <div className="text-center text-gray-500">No data available</div>;
    }

    switch (selectedMetric) {
      case 'popular-books':
      case 'requested-books':
      case 'rated-books':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={
                  selectedMetric === 'rated-books'
                    ? 'avg_rating'
                    : selectedMetric === 'requested-books'
                    ? 'request_count'
                    : 'borrow_count'
                }
                fill="#2563eb"
              />
            </BarChart>
          </ResponsiveContainer>
        );

    //   case 'popular-genres':
    //   case 'popular-authors':
    //     return (
    //       <ResponsiveContainer width="100%" height={400}>
    //         <PieChart>
    //           <Pie
    //             data={data}
    //             cx="50%"
    //             cy="50%"
    //             labelLine={false}
    //             label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
    //             outerRadius={80}
    //             fill="#2563eb"
    //             dataKey="borrow_count"
    //             nameKey={selectedMetric === 'popular-genres' ? 'genre' : 'author'}
    //           >
    //             {data.map((entry, index) => (
    //               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //             ))}
    //           </Pie>
    //           <Tooltip />
    //         </PieChart>
    //       </ResponsiveContainer>
    //     );
            case 'popular-genres':
            case 'popular-authors': {
            const nameKey = selectedMetric === 'popular-genres' ? 'genre' : 'author';

            // Convert borrow_count to number in case backend sends it as string
            // const parsedData = data.map(item => ({
            //     ...item,
            //     borrow_count: Number(item.borrow_count),
            // }));

              const parsedData = data.map(item => ({
                ...item,
                borrow_count: Number(item.borrow_count),
            }));

            // Filter out zero borrow_count entries
            const filteredData = parsedData.filter(item => item.borrow_count > 0);

            return (
                <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                    data={parsedData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // label={({ [nameKey]: name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    label={({ [nameKey]: name, percent }) => {
                        if (percent > 0.01) {
                        return `${name} ${(percent * 100).toFixed(0)}%`;
                        }
                        return null;
                    }}
                    outerRadius={150}
                    fill="#2563eb"
                    dataKey="borrow_count"
                    nameKey={nameKey}
                    >
                    {parsedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            );
            }

                //  case 'popular-genres':
                // case 'popular-authors': {
                // const nameKey = selectedMetric === 'popular-genres' ? 'genre' : 'author';

                // // Ensure borrow_count is numeric
                // const parsedData = data.map(item => ({
                //     ...item,
                //     borrow_count: Number(item.borrow_count),
                // }));

                // return (
                //     <ResponsiveContainer width="100%" height={400}>
                //     <BarChart data={parsedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                //         <CartesianGrid strokeDasharray="3 3" />
                //         <XAxis 
                //         dataKey={nameKey} 
                //         angle={-45} 
                //         textAnchor="end" 
                //         interval={0} 
                //         height={100} 
                //         />
                //         <YAxis />
                //         <Tooltip />
                //         <Legend />
                //         <Bar dataKey="borrow_count" fill="#2563eb" name="Borrow Count" />
                //     </BarChart>
                //     </ResponsiveContainer>
                // );
                // }

// case 'popular-genres':
// case 'popular-authors': {
//   const nameKey = selectedMetric === 'popular-genres' ? 'genre' : 'author';

//   // Filter out data entries where borrow_count is 0 or falsy
//   const filteredData = data.filter(item => Number(item.borrow_count) > 0);

//   return (
//     <ResponsiveContainer width="100%" height={450}>  {/* increased height for bigger pie */}
//       <PieChart>
//         <Pie
//           data={filteredData}
//           cx="50%"
//           cy="50%"
//           labelLine={false}
//           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//           outerRadius={120}  
//           fill="#2563eb"
//           dataKey="borrow_count"
//           nameKey={nameKey}
//         >
//           {filteredData.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// }

// case 'popular-genres':
// case 'popular-authors': {
//   const nameKey = selectedMetric === 'popular-genres' ? 'genre' : 'author';

//   // Filter out data entries where borrow_count is 0 or falsy
//   const filteredData = data.filter(item => Number(item.borrow_count) > 0);

//   return (
//     <ResponsiveContainer width="100%" height={450}>
//       <PieChart>
//         <Pie
//           data={filteredData}
//           cx="50%"
//           cy="50%"
//           labelLine={false}
//           label={({ payload, percent }) => `${payload[nameKey]} ${(percent * 100).toFixed(0)}%`}
//           outerRadius={120}
//           fill="#2563eb"
//           dataKey="borrow_count"
//           nameKey={nameKey}
//         >
//           {filteredData.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// }





      case 'unmet-demand':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_requests" fill="#2563eb" name="Total Requests" />
              <Bar dataKey="unmet_requests" fill="#ff7c7c" name="Unmet Requests" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
  <div className="dashboard-container">
    <StaffTopBar />
    <header className="dashboard-header">
      <h1>Library Statistics</h1>
      <p>{userRole === 'staff' ? 'Staff Dashboard' : 'Member Dashboard'}</p>
    </header>

    {overview && (
      <section className="overview-cards" aria-label="Overview statistics">
        <div className="card">
          <Book className={`card-icon ${metrics.find(m => m.value === 'popular-books')?.colorClass || 'icon-blue'}`} />
          <div>
            <p className="card-label">Total Books</p>
            <p className="card-value">{overview.total_books}</p>
          </div>
        </div>

        <div className="card">
          <Users className={`card-icon ${metrics.find(m => m.value === 'popular-authors')?.colorClass || 'icon-green'}`} />
          <div>
            <p className="card-label">Total Members</p>
            <p className="card-value">{overview.total_members}</p>
          </div>
        </div>

        <div className="card">
          <TrendingUp className={`card-icon ${metrics.find(m => m.value === 'unmet-demand')?.colorClass || 'icon-cyan'}`} />
          <div>
            <p className="card-label">Borrowings</p>
            <p className="card-value">{overview.total_borrowings}</p>
          </div>
        </div>

        <div className="card">
          <Clock className={`card-icon ${metrics.find(m => m.value === 'requested-books')?.colorClass || 'icon-orange'}`} />
          <div>
            <p className="card-label">Reservations</p>
            <p className="card-value">{overview.total_reservations}</p>
          </div>
        </div>

        <div className="card">
          <Star className={`card-icon ${metrics.find(m => m.value === 'rated-books')?.colorClass || 'icon-yellow'}`} />
          <div>
            <p className="card-label">Reviews</p>
            <p className="card-value">{overview.total_reviews}</p>
          </div>
        </div>

        <div className="card">
          <Star className={`card-icon ${metrics.find(m => m.value === 'rated-books')?.colorClass || 'icon-yellow'}`} />
          <div>
            <p className="card-label">Avg Rating</p>
            <p className="card-value">{overview.avg_rating || 'N/A'}</p>
          </div>
        </div>
      </section>
    )}

    <section className="filters-container" aria-label="Filter statistics">
      <div className="filters-header">
        <Filter className="h-5 w-5 text-gray-500" />
        <h2>Filters</h2>
      </div>

      <form className="filters-grid" onSubmit={e => e.preventDefault()}>
        <div>
          <label htmlFor="metric-select">Metric</label>
          <select
            id="metric-select"
            value={selectedMetric}
            onChange={e => setSelectedMetric(e.target.value)}
          >
            {metrics.map(metric => (
              <option key={metric.value} value={metric.value}>{metric.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="time-filter-select">Time Filter</label>
          <select
            id="time-filter-select"
            value={timeFilter}
            onChange={e => setTimeFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="range">Date Range</option>
            <option value="month">Specific Month</option>
            <option value="year">Specific Year</option>
          </select>
        </div>

        {timeFilter === 'range' && (
          <>
            <div>
              <label htmlFor="start-date">Start Date</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="end-date">End Date</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </>
        )}

        {timeFilter === 'month' && (
          <>
            <div>
              <label htmlFor="month-select">Month</label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year-select-month">Year</label>
              <select
                id="year-select-month"
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {timeFilter === 'year' && (
          <div>
            <label htmlFor="year-select">Year</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}
      </form>
    </section>

    <section className="chart-container" aria-label="Statistics chart">
      <h2 className="chart-header">{metrics.find(m => m.value === selectedMetric)?.label}</h2>

      {loading ? (
        <div className="loading-spinner">
          <div></div>
        </div>
      ) : (
        renderChart()
      )}
    </section>

    {trends.length > 0 && (
      <section className="chart-container" aria-label="Monthly trends chart">
        <h2 className="chart-header">Monthly Trends ({selectedYear})</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="borrowings" stroke="#8884d8" name="Borrowings" />
            <Line type="monotone" dataKey="active_members" stroke="#82ca9d" name="Active Members" />
          </LineChart>
        </ResponsiveContainer>
      </section>
    )}
  </div>
);

};

export default StatisticsDashboard;
