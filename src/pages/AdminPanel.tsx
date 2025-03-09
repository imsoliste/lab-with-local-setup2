import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, Plus, Trash2, Save, FileText, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import AdminNavbar from '../components/AdminNavbar';
import { supabase } from '../lib/supabase';
import Papa from 'papaparse';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import OffersManager from '../components/OffersManager';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  text: {
    fontSize: 12,
    marginBottom: 10
  }
});

const TestReport = ({ data }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Test Report</Text>
        <Text style={styles.text}>Patient Name: {data.patientName}</Text>
        <Text style={styles.text}>Test Name: {data.testName}</Text>
        <Text style={styles.text}>Date: {data.date}</Text>
        <Text style={styles.text}>Result: {data.result}</Text>
      </View>
    </Page>
  </Document>
);

const AdminPanel = () => {
  const navigate = useNavigate();
  const [labs, setLabs] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'labs' | 'tests' | 'reports' | 'offers'>('labs');
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch labs
      const { data: labsData } = await supabase
        .from('labs')
        .select('*')
        .order('name');
      
      if (labsData) setLabs(labsData);

      // Fetch tests
      const { data: testsData } = await supabase
        .from('tests')
        .select('*')
        .order('name');
      
      if (testsData) setTests(testsData);

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          users (*),
          tests (*),
          labs (*)
        `)
        .order('created_at', { ascending: false });
      
      if (bookingsData) setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const processCSV = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError('');

    try {
      const text = await selectedFile.text();
      Papa.parse(text, {
        header: true,
        complete: async (results) => {
          try {
            // Process labs data
            for (const row of results.data) {
              if (!row.name || !row.address || !row.city) continue;

              const { data, error } = await supabase
                .from('labs')
                .upsert([
                  {
                    name: row.name,
                    address: row.address,
                    city: row.city,
                    rating: parseFloat(row.rating) || null,
                    accredited: row.accredited === 'true'
                  }
                ]);

              if (error) throw error;
            }

            await fetchData();
            setSelectedFile(null);
          } catch (error) {
            console.error('Error processing CSV:', error);
            setError('Failed to process CSV file');
          }
        }
      });
    } catch (error) {
      console.error('Error reading file:', error);
      setError('Failed to read CSV file');
    } finally {
      setLoading(false);
    }
  };

  const uploadReport = async (bookingId: string, file: File) => {
    try {
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('reports')
        .upload(`${bookingId}/${file.name}`, file);

      if (error) throw error;

      // Update test_results table
      await supabase
        .from('test_results')
        .upsert([
          {
            booking_id: bookingId,
            report_url: data.path,
            status: 'completed',
            result_data: { fileName: file.name }
          }
        ]);

      await fetchData();
    } catch (error) {
      console.error('Error uploading report:', error);
      setError('Failed to upload report');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('labs')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'labs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manage Labs
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'tests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manage Tests
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Test Reports
              </button>
              <button
                onClick={() => setActiveTab('offers')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'offers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Tag className="h-4 w-4 mb-1 mx-auto" />
                Offers
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'labs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Labs</h2>
                  <div className="flex space-x-4">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload">
                      <Button 
                        variant="outline" 
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload CSV</span>
                      </Button>
                    </label>
                    {selectedFile && (
                      <Button 
                        onClick={processCSV}
                        disabled={loading}
                        className="flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>{loading ? 'Processing...' : 'Process CSV'}</span>
                      </Button>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                    {error}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Address</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">City</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rating</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {labs.map(lab => (
                        <tr key={lab.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{lab.name}</td>
                          <td className="px-4 py-3">{lab.address}</td>
                          <td className="px-4 py-3">{lab.city}</td>
                          <td className="px-4 py-3">{lab.rating}</td>
                          <td className="px-4 py-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => {/* Handle delete */}}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Tests</h2>
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Test</span>
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Report Time</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tests.map(test => (
                        <tr key={test.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{test.name}</td>
                          <td className="px-4 py-3">{test.category}</td>
                          <td className="px-4 py-3">{test.report_time_hours} hours</td>
                          <td className="px-4 py-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => {/* Handle delete */}}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Test Reports</h2>

                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{booking.tests?.name}</h3>
                          <p className="text-sm text-gray-600">
                            Patient: {booking.users?.name} • Lab: {booking.labs?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(booking.booking_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadReport(booking.id, file);
                            }}
                            className="hidden"
                            id={`report-upload-${booking.id}`}
                          />
                          <label htmlFor={`report-upload-${booking.id}`}>
                            <Button 
                              variant="outline" 
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Upload Report</span>
                            </Button>
                          </label>
                          
                          <PDFDownloadLink
                            document={
                              <TestReport
                                data={{
                                  patientName: booking.users?.name,
                                  testName: booking.tests?.name,
                                  date: new Date(booking.booking_date).toLocaleDateString(),
                                  result: 'Normal'
                                }}
                              />
                            }
                            fileName={`report-${booking.id}.pdf`}
                          >
                            {({ loading }) => (
                              <Button 
                                variant="outline"
                                disabled={loading}
                                className="flex items-center space-x-2"
                              >
                                <Download className="h-4 w-4" />
                                <span>Download Report</span>
                              </Button>
                            )}
                          </PDFDownloadLink>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'offers' && <OffersManager />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;