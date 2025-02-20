// pages/staff/late-charges/[id].tsx
import { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Table, Form, Button, Badge } from 'react-bootstrap';
import { format } from 'date-fns';
import {
    FiDollarSign,
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiDownload,
    FiPhone,
    FiMapPin,
    FiCalendar
} from 'react-icons/fi';
import { useParams } from 'next/navigation';
import Seo from '@/shared/layout-components/seo/seo';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Link from 'next/link';
import { StaffLateChargesWithDetails } from '@/interfaces/StaffAccumulatedLate';
import { getStaffLateInfo } from '@/utils/clocking';
import React from 'react';
import * as XLSX from 'xlsx';
import LiveImageComponent from '@/pages/dashboard/components/LiveImageComponent';
import { StatCard } from '../../Overtime/[staff]';

const LateChargesPage = () => {
    const [data, setData] = useState<StaffLateChargesWithDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [dateRange, setDateRange] = useState({
        startDate: "2025-01",
        endDate: "2025-01",
    })
    const [error, setError] = useState<string | null>(null);
    const query = useParams();
    const id = query?.staff;
    useEffect(() => {
        getStaffLateInfo(id as string, dateRange.startDate, dateRange.endDate).then((lateData) => {
            setData(lateData);
            setLoading(false);
        }).catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    const handleExport = () => {
        if (!data) return;

        // Create worksheet data
        const wsData = [
            ['Staff Overtime Report'],
            [],
            ['Staff Information'],
            ['Name', `${data.staffId.staff_fname} ${data.staffId.staff_lname}`],
            ['Email', data.staffId.staff_email],
            ['Contact', data.staffId.staff_contact],
            ['Role', data.staffId.staff_role],
            ['School', data.staffId.staff_school],
            [],
            ['Overtime Summary'],
            ['Period', `${format(new Date(data.period.from), 'MMMM dddd yyyy')} - ${format(new Date(data.period.to), 'MMMM dddd yyyy')}`],
            // ['Total Hours', data.accumulation.hours],
            // ['Total Charge', `${data.accumulation.currency} ${data.accumulation.charge}`],
            ['Number of Records', data.accumulation.numberOfRecords]
        ];

        // Create worksheet and workbook
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Overtime Report');

        // Generate filename with staff name and date range
        const fileName = `late_report_${data.staffId.staff_fname}_${data.staffId.staff_lname}_${format(new Date(data.period.from), 'MMM_yyyy')}.xlsx`;

        // Save file
        XLSX.writeFile(wb, fileName);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="alert alert-danger">Error: {error}</div>
        </div>
    );

    if (!data) return null;

    const StatCard: React.FC<{
        icon: React.ReactNode;
        title: string;
        value: string;
        textColor?: string;
        iconColor: string;
    }> = ({ icon, title, textColor = "gray", value, iconColor }) => (
        <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
                <div className={`mr-3 ${iconColor}`}>{icon}</div>
                <div>
                    <h6 className="mb-0 text-gray-600">{title}</h6>
                    <h3 className={`mb-0 font-bold text-${textColor}-800`}>{value}</h3>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <>
            <PageHeader title={`${data.staffId.staff_fname}'s Late charge`} link>
                <li className='breadcrumb-item'><Link href={`/dashboard/`}> Dashboard</Link></li>
                <li className='breadcrumb-item'><Link href={`/dashboard/Staff`}> Staff</Link></li>
                <li className='breadcrumb-item active'>Late Info</li>
            </PageHeader>
            <Seo title={`${data.staffId.staff_fname}'s Late Charges Summary`} />

            <Container fluid className="py-6 px-4 bg-gray-50 min-h-screen">
                {/* Date Range and Export Controls */}
                <Card className="border-0 shadow-sm mb-6">
                    <Card.Body>
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                            <div className="d-flex flex-wrap gap-3">
                                <Form.Group>
                                    <Form.Label className="text-sm text-gray-600">Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="text-sm text-gray-600">End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dateRange.endDate}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </Form.Group>
                            </div>
                            <Button
                                variant="primary"
                                className="d-flex align-items-center gap-2"
                                onClick={handleExport}
                            >
                                <FiDownload />
                                Export Report
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
                {/* Staff Profile Card */}
                <Card className="border-0 shadow-sm mb-6">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col md={3} className="text-center">
                                <LiveImageComponent
                                    url={data.staffId.staff_profilePic}
                                    props={{
                                        style: { width: '220px', height: '220px', objectFit: 'cover' },
                                        className: 'rounded-full'
                                    }}
                                />
                                {/* <Badge bg="primary" className="mb-2">{data.staffId.staff_role}</Badge> */}
                            </Col>
                            <Col md={9}>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                    {data.staffId.staff_fname} {data.staffId.staff_lname}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                                    {/* <div className="flex items-center text-gray-600">
                                    <FiMail className="mr-2" />
                                    {data.staffId.staff_email}
                                </div> */}
                                    <div className="flex items-center text-gray-600">
                                        <FiPhone className="mr-2" />
                                        0{data.staffId.staff_contact}
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <FiCalendar className="mr-2" />
                                        Joined {format(new Date(data.staffId.createdAt), 'MMMM yyyy')}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Stats Cards */}
                <Row className="g-4 mb-6">
                    <Col xs={12} md={6} lg={3}>
                        <StatCard
                            icon={<FiClock size={24} />}
                            title="Total Time Late"
                            value={`${data.accumulation.totalHrsLate} minutes`}
                            iconColor="text-blue-500"
                        />
                    </Col>

                    <Col xs={12} md={6} lg={3}>
                        <StatCard
                            icon={<FiDollarSign color='green' size={24} />}
                            title="Total Charge Accumulated"
                            value={`${data.accumulation.currency ?? 'UGX'} ${data.accumulation.pendingCharges.toLocaleString() ?? '0'}`}
                            iconColor="text-green-500"
                        />
                    </Col>

                    <Col xs={12} md={6} lg={3}>
                        <StatCard
                            icon={<FiDollarSign size={24} />}
                            title="Rate per Hour"
                            value={`${data.accumulation.currency ?? 'UGX'} ${'0'}`}
                            iconColor="text-yellow-500"
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
                        <h5 className="mb-0 text-gray-800">Period Summary</h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="text-center py-4">
                            <h3 className="mb-3 text-gray-800">
                                {format(new Date(data.period.from), 'do MMMM yyyy')} - {format(new Date(data.period.to), 'do MMMM yyyy')}
                            </h3>
                            <div className="row justify-content-center">
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <div className="text-gray-600">Total Hours Late</div>
                                        <div className="text-2xl font-bold text-red-600">
                                            {data.accumulation.numberOfRecords.toFixed(2)} hrs
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <div className="text-gray-600">Total Charge</div>
                                        <div className="text-2xl font-bold text-red-600">
                                            {data.accumulation.totalCharges === 0 ? '' : '-'} {data.accumulation.currency} {data.accumulation.totalCharges}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Container >
        </>
    );
};
LateChargesPage.layout = "Contentlayout";
export default LateChargesPage;