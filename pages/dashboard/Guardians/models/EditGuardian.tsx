
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { updateStaffData } from '@/utils/data_fetch';
import { StudentResult } from '@/interfaces/StudentsModel';
import { Guardian } from '@/interfaces/GuardiansModel';
import SelectComponent, { Option } from './SelectComponent';
import FormElement from './FormElement';
import { StudentsNotPaginated } from '@/interfaces/StudentsNonPaginated';
const EditGuardian = ({ editModalShow, students, loadingClasses = false, currentGuardian, setCurrentGuardian, setEditModalShow, handleSaveEdit }: { students: StudentsNotPaginated[]; loadingClasses: boolean; editModalShow: boolean; currentGuardian: Guardian | null; setEditModalShow: React.Dispatch<React.SetStateAction<boolean>>, setCurrentGuardian: React.Dispatch<React.SetStateAction<Guardian | null>>; handleSaveEdit: () => void }) => {
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
    // streams
    const studentsOptions: Option[] = [];
    students.map((r) => studentsOptions.push({ name: `${r.student_fname} ${r.student_lname}`, value: r._id }));
    // function to handle submission
    const handleEditData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setUpdating(true);

        const formData = new FormData();
        // capturing school
        // formData.append('school', JSON.parse(localStorage.getItem('skooltym_user') as string).school);

        // capturing student guardian
        // formData.append('guardians', []);

        Object.entries(currentGuardian as any).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        // capturing school name
        if (imageFile) {
            formData.append('name', JSON.parse(localStorage.getItem('skooltym_user') as string).schoolName);
        }
        // console.log(JSON.parse(localStorage.getItem('skooltym_user') as string).schoolName);
        // // student username
        // formData.append('username', `${currentStudent?.student_fname.toLowerCase()}${currentStudent?.student_lname.toLowerCase()}${Math.floor(Math.random() * 1000)}`);
        // student key
        formData.append('guardian_key[key]', '');
        // posting data
        updateStaffData(formData, currentGuardian?._id).then((res) => {
            setMessage('Guardian added successfully');
            console.log(res);
            handleSaveEdit();
            setUpdating(false)
        }).catch((err) => {
            console.warn(err);
            setMessage(err.toString());
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
                                onChange={(e) => setCurrentGuardian({
                                    ...currentGuardian,
                                    guardian_fname: e.target.value
                                })} />
                            <br />
                            <FormElement label='Last Name'
                                value={currentGuardian.guardian_lname}
                                onChange={(e) => setCurrentGuardian({
                                    ...currentGuardian,
                                    guardian_lname: e.target.value
                                })} />
                            <br />
                            <FormElement label='Email'
                                value={currentGuardian.guardian_email}
                                onChange={(e) => setCurrentGuardian({
                                    ...currentGuardian,
                                    guardian_email: e.target.value
                                })} />
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
                                    <span>Student Profile</span>
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
                            <SelectComponent options={gender} label='Gender' onSelect={(selected) => {
                                setCurrentGuardian({
                                    ...currentGuardian,
                                    guardian_gender: selected,
                                })
                            }} /> <br />
                            <SelectComponent options={studentsOptions} label='Type' onSelect={(selected) => {
                                setCurrentGuardian({
                                    ...currentGuardian,
                                    type: selected
                                });
                            }} />

                            <SelectComponent options={studentsOptions} label='Students' onSelect={(selected) => {
                                setCurrentGuardian({
                                    ...currentGuardian,
                                    type: selected
                                });
                            }} />

                            <SelectComponent options={studentsOptions} label='Relationship' onSelect={(selected) => {
                                setCurrentGuardian({
                                    ...currentGuardian,
                                    type: selected
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