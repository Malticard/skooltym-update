// pages/staff/late-charges/[id].tsx
import { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';
import { format } from 'date-fns';
import {
    FiDollarSign,
    FiAlertCircle,
    FiCheckCircle,
    FiClock
} from 'react-icons/fi';
import { useParams } from 'next/navigation';
import Seo from '@/shared/layout-components/seo/seo';

interface LateEntry {
    date: string;
    time: string;
    charge: number;
}

interface Accumulation {
    totalCharges: number;
    pendingCharges: number;
    clearedCharges: number;
    currency: string;
    numberOfRecords: number;
}

interface Period {
    from: string;
    to: string;
}

interface LateChargesData {
    staffId: string;
    period: Period;
    accumulation: Accumulation;
    lateEntries: LateEntry[];
}

const LateChargesPage = () => {
    const [data, setData] = useState<LateChargesData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const query = useParams();
    const id = query?.staff;
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Example data - replace with actual API call
                const response: LateChargesData = {
                    staffId: "12345",
                    period: {
                        from: "2025-01-01T00:00:00.000Z",
                        to: "2025-03-31T23:59:59.999Z"
                    },
                    accumulation: {
                        totalCharges: 25000.00,
                        pendingCharges: 15000.00,
                        clearedCharges: 10000.00,
                        currency: "UGX",
                        numberOfRecords: 10
                    },
                    lateEntries: [
                        {
                            date: "2025-03-15T08:30:00.000Z",
                            time: "08:30",
                            charge: 2500.00
                        },
                        // Add more entries as needed
                    ]
                };
                setData(response);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-500">Error: {error}</div>
        </div>
    );

    if (!data) return null;

    const StatCard: React.FC<{
        icon: React.ReactNode;
        title: string;
        value: string;
        iconColor: string;
    }> = ({ icon, title, value, iconColor }) => (
        <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
                <div className={`mr-3 ${iconColor}`}>{icon}</div>
                <div>
                    <h6 className="mb-0 text-gray-600">{title}</h6>
                    <h3 className="mb-0 font-bold text-gray-800">{value}</h3>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <Container fluid className="py-6 px-4 bg-gray-50 min-h-screen">
            <Seo title="Late Charges Summary" />
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Late Charges Summary</h1>
                <p className="text-gray-600">
                    Period: {format(new Date(data.period.from), 'MMMM yyyy')} - {format(new Date(data.period.to), 'MMMM yyyy')}
                </p>
            </div>

            {/* Stats Cards */}
            <Row className="g-4 mb-6">
                <Col xs={12} md={6} lg={3}>
                    <StatCard
                        icon={<FiDollarSign size={24} />}
                        title="Total Charges"
                        value={`${data.accumulation.currency} ${data.accumulation.totalCharges.toLocaleString()}`}
                        iconColor="text-blue-500"
                    />
                </Col>

                <Col xs={12} md={6} lg={3}>
                    <StatCard
                        icon={<FiAlertCircle size={24} />}
                        title="Pending Charges"
                        value={`${data.accumulation.currency} ${data.accumulation.pendingCharges.toLocaleString()}`}
                        iconColor="text-yellow-500"
                    />
                </Col>

                <Col xs={12} md={6} lg={3}>
                    <StatCard
                        icon={<FiCheckCircle size={24} />}
                        title="Cleared Charges"
                        value={`${data.accumulation.currency} ${data.accumulation.clearedCharges.toLocaleString()}`}
                        iconColor="text-green-500"
                    />
                </Col>

                <Col xs={12} md={6} lg={3}>
                    <StatCard
                        icon={<FiClock size={24} />}
                        title="Total Records"
                        value={data.accumulation.numberOfRecords.toString()}
                        iconColor="text-purple-500"
                    />
                </Col>
            </Row>

            {/* Recent Late Entries Table */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0">
                    <h5 className="mb-0 text-gray-800">Recent Late Entries</h5>
                </Card.Header>
                <Card.Body>
                    <div className="overflow-x-auto">
                        <Table responsive hover className="mb-0">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Time</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Charge</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.lateEntries.map((entry, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {format(new Date(entry.date), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{entry.time}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {data.accumulation.currency} {entry.charge.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};
LateChargesPage.layout = "Contentlayout";
export default LateChargesPage;