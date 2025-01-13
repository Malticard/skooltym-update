// pages/staff/overtime/[id].tsx
import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Table, Form, Button, Badge, Alert } from 'react-bootstrap';
import { format } from 'date-fns';
import {
    FiClock,
    FiDollarSign,
    FiUser,
    FiPhone,
    FiMail,
    FiDownload,
    FiCalendar,
    FiMapPin,
    FiSearch
} from 'react-icons/fi';
import * as XLSX from 'xlsx';
import LiveImageComponent from '@/pages/dashboard/components/LiveImageComponent';
import { getStaffOvertimeInfo } from '@/utils/clocking';
import { useParams } from 'next/navigation';
import { StaffOvertimeChargeSummary } from '@/interfaces/StaffAccumulatedOvertime';
import PageHeader from '@/shared/layout-components/page-header/page-header';

interface StaffMember {
    _id: string;
    staff_fname: string;
    staff_lname: string;
    staff_contact: number;
    staff_email: string;
    staff_gender: string;
    staff_profilePic: string;
    staff_role: string;
    staff_school: string;
    createdAt: string;
}

interface Period {
    from: string;
    to: string;
}

interface Accumulation {
    hours: number;
    charge: number;
    currency: string;
    numberOfRecords: number;
}

interface OvertimeData {
    staffId: StaffMember;
    period: Period;
    accumulation: Accumulation;
}

const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    subtitle?: string;
    iconColor: string;
}> = ({ icon, title, value, subtitle, iconColor }) => (
    <Card className="h-100 border-0 shadow-sm">
        <Card.Body>
            <div className="d-flex align-items-center mb-3">
                <div className={`rounded-lg p-2 ${iconColor} bg-opacity-10`}>
                    {icon}
                </div>
            </div>
            <h6 className="text-gray-600 mb-1">{title}</h6>
            <h3 className="font-bold text-gray-800 mb-0">{value}</h3>
            {subtitle && (
                <p className="text-sm text-gray-500 mt-1 mb-0">{subtitle}</p>
            )}
        </Card.Body>
    </Card>
);

const OvertimePage = () => {
    const [data, setData] = useState<StaffOvertimeChargeSummary | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [dateRange, setDateRange] = useState({
        startDate: "2025-01",
        endDate: "2025-01"
    });
    const param = useParams();
    const id = param?.staff;


    useEffect(() => {
        getStaffOvertimeInfo(id as string, dateRange.startDate, dateRange.endDate)
            .then((response) => {
                console.log(response);
                setData(response);
                setLoading(false);
            }).catch((err) => {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            })
    }, [dateRange]);
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
            ['Period', `${format(new Date(data.period.from), 'MMMM yyyy')} - ${format(new Date(data.period.to), 'MMMM yyyy')}`],
            ['Total Hours', data.accumulation.hours],
            ['Total Charge', `${data.accumulation.currency} ${data.accumulation.charge}`],
            ['Number of Records', data.accumulation.numberOfRecords]
        ];

        // Create worksheet and workbook
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Overtime Report');

        // Generate filename with staff name and date range
        const fileName = `overtime_report_${data.staffId.staff_fname}_${data.staffId.staff_lname}_${format(new Date(data.period.from), 'MMM_yyyy')}.xlsx`;

        // Save file
        XLSX.writeFile(wb, fileName);
    };
    const handleData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getStaffOvertimeInfo(id as string, dateRange.startDate, dateRange.endDate)
            .then((response) => {
                console.log(response);
                setData(response);
                setLoading(false);
            }).catch((err) => {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            })
    }
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            {dateRange.startDate}
            <Card className="border-0 shadow-sm mb-6">
                <Card.Body>
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <Form onSubmit={handleData} className="d-flex flex-wrap gap-3">
                            <Form.Group>
                                <Form.Label className="text-sm text-gray-600">Start Date</Form.Label>
                                <Form.Control
                                    type="month"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-sm text-gray-600">End Date</Form.Label>
                                <Form.Control
                                    type="month"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                />
                            </Form.Group>
                            {/* submit button */}
                            <Form.Group>
                                <Form.Label><br /></Form.Label>
                                <Button
                                    variant="outline-primary"
                                    className="h-10 align-items-center"
                                    type='submit'
                                >
                                    <FiSearch className='w-4' />
                                </Button>
                            </Form.Group>
                        </Form>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Alert variant="danger">Error: {error}</Alert>
                </Card.Footer>
            </Card>
        </div >
    );

    if (!data) return null;

    return (
        <>
            <PageHeader title={`${data.staffId.staff_fname}'s Overtime`} link>
                <Link> Dashboard</Link>
            </PageHeader>
            <Container fluid className="py-6 px-4 bg-gray-50 min-h-screen">
                {/* Date Range and Export Controls */}
                <Card className="border-0 shadow-sm mb-6">
                    <Card.Body>
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                            <div className="d-flex flex-wrap gap-3">
                                <Form.Group>
                                    <Form.Label className="text-sm text-gray-600">Start Date</Form.Label>
                                    <Form.Control
                                        type="month"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="text-sm text-gray-600">End Date</Form.Label>
                                    <Form.Control
                                        type="month"
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
                                <Badge bg="primary" className="mb-2">{data.staffId.staff_role.role_type}</Badge>
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
                                        {data.staffId.staff_contact}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FiMapPin className="mr-2" />
                                        {data.staffId.staff_school.school_name}
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
                            title="Total Hours"
                            value={`${data.accumulation.hours.toFixed(2)} hrs`}
                            iconColor="text-blue-500"
                        />
                    </Col>

                    <Col xs={12} md={6} lg={3}>
                        <StatCard
                            icon={<FiDollarSign size={24} />}
                            title="Total Charge"
                            value={`${data.accumulation.currency} ${data.accumulation.charge.toLocaleString()}`}
                            iconColor="text-green-500"
                        />
                    </Col>

                    <Col xs={12} md={6} lg={3}>
                        <StatCard
                            icon={<FiDollarSign size={24} />}
                            title="Rate per Hour"
                            value={`${data.accumulation.currency} ${(data.accumulation.charge / data.accumulation.hours).toFixed(0)}`}
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

                {/* Monthly Summary Card */}
                <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-0">
                        <h5 className="mb-0 text-gray-800">Period Summary</h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="text-center py-4">
                            <h3 className="mb-3 text-gray-800">
                                {format(new Date(data.period.from), 'MMMM yyyy')} - {format(new Date(data.period.to), 'MMMM yyyy')}
                            </h3>
                            <div className="row justify-content-center">
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <div className="text-gray-600">Total Hours Worked</div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {data.accumulation.hours.toFixed(2)} hrs
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <div className="text-gray-600">Total Earnings</div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {data.accumulation.currency} {data.accumulation.charge.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};
OvertimePage.layout = "Contentlayout";
export default OvertimePage;