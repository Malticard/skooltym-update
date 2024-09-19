import React from 'react'
import PageHeader from '@/shared/layout-components/page-header/page-header'
import { Col, Row } from "react-bootstrap";
import Seo from '@/shared/layout-components/seo/seo';
import GuardianDataTable from './GuardiansDataTable';
import { fetchGuardians, fetchStudentsNoPaginate } from '@/utils/data_fetch';
import { IconLoader } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import { StudentsNotPaginated } from '@/interfaces/StudentsNonPaginated';
import { GuardianResponse } from '@/interfaces/GuardiansModel';


const Guardian = () => {
    const [guardians, setGuardians] = React.useState<GuardianResponse>(null as unknown as GuardianResponse);
    const [students, setStudents] = React.useState<StudentsNotPaginated[]>([]);
    const [loadingData, setLoadingData] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [addModalShow, setAddModalShow] = React.useState(false);
    React.useEffect(() => {
        setLoadingData(true);
        // fetch staff data
        fetchGuardians().then((data) => {
            setGuardians(data);
            setLoadingData(false);
        }).catch((error) => {
            console.log(error);
            setLoading(false);
        });
        // roles
        fetchStudentsNoPaginate().then((data) => {
            console.log(data);
            setStudents(data);
        }).catch((error) => {
            console.log(error);
            setLoading(false);
        });
    }, []);
    // methods for change of page
    const onChangePage = (page: number) => {
        // setLoading(true);
        fetchGuardians(page).then((res) => {
            setGuardians(res);
            console.log(res);
            // setLoading(false);
        }).catch((error) => {
            // setLoading(false);
            console.log(error);
        })
    }
    return (
        <>
            <Seo title="Guardians" />

            <PageHeader
                title="Guardians"
                item="Skooltym"
                active_item="Guardians"
                buttonText="Add Guardian"
                onTap={() => {
                    setAddModalShow(true);
                }}
            />

            {/* <!-- Row --> */}
            <Row>
                <Col xl={12}>
                    {loadingData ? (<><IconLoader /></>) : guardians && (<GuardianDataTable addModalShow={addModalShow} setAddModalShow={setAddModalShow} students={students} loadingClasses={false} updatePage={onChangePage} guardians={guardians} />)}
                </Col>
            </Row>
            {/* <!-- End Row --> */}
        </>
    )
}

Guardian.layout = "Contentlayout"


export default Guardian