
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { updateGuardianData } from '@/utils/data_fetch';
import { Guardian } from '@/interfaces/GuardiansModel';
import FormElement from './FormElement';
import { StudentsNotPaginated } from '@/interfaces/StudentsNonPaginated';
import SelectComponent, { Option } from '../../Staff/models/SelectComponent';
import { GuardianStudent } from '@/interfaces/GuardianStudents';
import { toast } from 'react-toastify';
const EditGuardian = ({ editModalShow, students, guardianStudent, currentGuardian, setCurrentGuardian, setEditModalShow, handleSaveEdit }: { students: StudentsNotPaginated[]; guardianStudent: GuardianStudent[]; editModalShow: boolean; currentGuardian: Guardian | null; setEditModalShow: React.Dispatch<React.SetStateAction<boolean>>, setCurrentGuardian: React.Dispatch<React.SetStateAction<Guardian | null>>; handleSaveEdit: () => void }) => {
    const options = [] as Option[];
    const [updating, setUpdating] = React.useState(false);
    const [message, setMessage] = React.useState<string>('');
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [guardianData, setGuardianData] = React.useState(currentGuardian as Guardian);
    // function to fetch available classes

    let selectedImage = null;
    // gender options
    const gender: Option[] = [
        {
            name: "Male",
            value: 'Male'
        }, {
            name: "Female",
            value: 'Female'
        }
    ]
    const defaultStudentData: Option[] = [];
    // React.useEffect(() => {
    // guardian students
    if (guardianStudent && guardianStudent.length > 0) {
        guardianStudent?.map(student => defaultStudentData.push({ name: `${student.student_id?.student_fname} ${student.student_id?.student_lname}`, value: student?.student_id?._id }));
        // console.log("Guardian students", guardianStudent);
    }
    // })

    // relationship options
    const relationship: Option[] = [
        { name: "Select relationship", value: "" },
        { name: "Father", value: "Father" },
        { name: "Mother", value: "Mother" },
        { name: "Sister", value: "Sister" },
        { name: "Brother", value: "Brother" },
        { name: "Guardian", value: "Guardian" },
    ]
    // streams
    const studentsOptions: Option[] = [];
    if (students) {
        students.map((r) => studentsOptions.push({ name: `${r.student_fname} ${r.student_lname}`, value: r._id }));
    }
    // function to handle submission
    const handleEditData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setUpdating(true);

        const formData = new FormData();
        formData.append('name', JSON.parse(localStorage.getItem('skooltym_user') as string).schoolName);

        // capturing student guardian
        // formData.append('guardians', []);

        Object.entries(currentGuardian as any).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        formData.append('guardian_key[key]', '');
        // posting data
        updateGuardianData(formData, currentGuardian?._id).then((res) => {
            // console.log(res);
            handleSaveEdit();
            toast.success("Guardian updated successfully");
            setUpdating(false)
        }).catch((err) => {
            console.warn(err);
            toast.error("Error while updating Guardian");
            // setMessage(err.toString());
            setUpdating(false)
        })
        // console.log(currentStudent);
    }

    return (
        <>
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Guardian</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentGuardian && (
                        <Form onSubmit={handleEditData}>
                            {/* {currentStudent._id} */}
                            <FormElement
                                value={currentGuardian.guardian_fname}
                                label='First name'
                                onChange={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    setCurrentGuardian({
                                        ...currentGuardian,
                                        guardian_fname: e.target.value
                                    });
                                }} />
                            <br />
                            <FormElement label='Last Name'
                                value={currentGuardian.guardian_lname}
                                onChange={(e) => setCurrentGuardian({
                                    ...currentGuardian,
                                    guardian_lname: e.target.value
                                })} />
                            <br />

                            <br /> <FormElement label='Contact'
                                value={currentGuardian.guardian_contact.toString()}
                                onChange={(e) => setCurrentGuardian({
                                    ...currentGuardian,
                                    guardian_contact: parseInt(e.target.value)
                                })} />
                            <br />
                            {/* student profile pic */}
                            <Row className='my-0'>
                                <Col className='text-center my-auto'>
                                    <span>Guardian Profile</span>
                                </Col>
                                <Col className='mx-10'>
                                    <img className='rounded-full w-20 h-20' src={selectedImage == null ? currentGuardian.guardian_profile_pic : selectedImage} alt="student profile" />
                                </Col>
                                <Col className='my-auto'>
                                    <input type="file" accept='image/*' id="photo" className='hidden' onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            selectedImage = URL.createObjectURL(file);
                                            setCurrentGuardian({
                                                ...currentGuardian,
                                                guardian_profile_pic: selectedImage
                                            });
                                        }
                                    }} />
                                    <Button onClick={() => {
                                        document.getElementById('photo')?.click();
                                    }} variant='primary'>Upload</Button>

                                </Col>
                            </Row>
                            <br />
                            <SelectComponent defaultData={[{ name: currentGuardian.guardian_gender, value: currentGuardian.guardian_gender }]} options={gender} label='Gender' onSelect={(selected) => {
                                setCurrentGuardian({
                                    ...currentGuardian,
                                    guardian_gender: selected as string,
                                })
                            }} /> <br />
                            <SelectComponent options={studentsOptions} defaultData={[{ name: currentGuardian.type, value: currentGuardian.type }]} label='Type' onSelect={(selected) => {
                                setCurrentGuardian({
                                    ...currentGuardian,
                                    type: selected as string,
                                });
                            }} />
                            {/* updating guardian students */}
                            <SelectComponent
                                multiSelect
                                defaultData={defaultStudentData}
                                options={studentsOptions}
                                label='Students'
                                onSelect={(selected) => {
                                    setCurrentGuardian({
                                        ...currentGuardian,
                                        students: selected as string[]
                                    });
                                }} />

                            <SelectComponent options={relationship} defaultData={[{ name: currentGuardian.relationship, value: currentGuardian.relationship }]} label='Relationship' onSelect={(selected) => {
                                setCurrentGuardian({
                                    ...currentGuardian,
                                    relationship: selected as string,
                                });
                            }} />

                            <Modal.Footer>
                                <Button variant="secondary" disabled={updating} onClick={() => setEditModalShow(false)}>
                                    Close
                                </Button>
                                <Button variant="primary" type='submit' disabled={updating}>
                                    {updating ? 'Updating...' : 'Update'}
                                </Button>
                            </Modal.Footer>
                            {message && <p className="mt-4 bg-[#ee2020cb] p-2 text-white font-semibold text-center">{message}</p>}

                        </Form>
                    )}
                </Modal.Body>

            </Modal>
        </>
    );
};

export default EditGuardian;