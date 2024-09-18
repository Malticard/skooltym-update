
import { StudentResult } from '@/interfaces/StudentsModel';
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import FormElement from './FormElement';
import SelectComponent, { Option } from './SelectComponent';
import SwitchTile from './SwitchTile';
import { SchoolClass } from '@/interfaces/ClassModel';
import { Stream } from '@/interfaces/StreamModel';
import { updateStudentData } from '@/utils/data_fetch';

const EditStudent = ({ editModalShow, streams, loadingClasses = false, classes, currentStudent, setCurrentStudent, setEditModalShow, handleSaveEdit }: { streams: Stream[]; loadingClasses: boolean; classes: SchoolClass[]; editModalShow: boolean; currentStudent: any; setEditModalShow: React.Dispatch<React.SetStateAction<boolean>>, setCurrentStudent: React.Dispatch<React.SetStateAction<StudentResult | null>>; handleSaveEdit: () => void }) => {
    const options = [] as Option[];
    const [updating, setUpdating] = React.useState(false);
    const [message, setMessage] = React.useState<string>('');
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [studentData, setStudentData] = React.useState(currentStudent as any);
    // function to fetch available classes
    if (loadingClasses == false) {
        classes.map((cls) => options.push({ name: cls.class_name, value: cls.class_name }));
    }
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
    const streamOptions: Option[] = [];
    streams.map((stream) => streamOptions.push({ name: stream.stream_name, value: stream.stream_name }));
    // pickup subtitle
    const enabled = currentStudent?.isHalfDay;
    const picked = currentStudent?.isVanStudent;
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

        Object.entries(currentStudent as any).forEach(([key, value]) => {
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
        formData.append('student_key[key]', '');
        // posting data
        updateStudentData(formData, currentStudent._id).then((res) => {
            setMessage('Student added successfully');
            console.log(res);
            handleSaveEdit();
            setUpdating(false)
        }).catch((err) => {
            console.warn(err);
            setMessage(err.toString());
            setUpdating(false)
        })
        console.log(currentStudent);
    }

    return (
        <>
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentStudent && (
                        <Form onSubmit={handleEditData}>
                            {/* {currentStudent._id} */}
                            <FormElement
                                value={currentStudent.student_fname}
                                label='FirstName'
                                onChange={(e) => setCurrentStudent({
                                    ...currentStudent,
                                    student_fname: e.target.value
                                })} />
                            <br />
                            <FormElement label='LastName'
                                value={currentStudent.student_lname}
                                onChange={(e) => setCurrentStudent({
                                    ...currentStudent,
                                    student_lname: e.target.value
                                })} />
                            <br />
                            <FormElement label='Other Name'
                                value={currentStudent.other_name}
                                onChange={(e) => setCurrentStudent({
                                    ...currentStudent,
                                    other_name: e.target.value
                                })} />
                            <br />
                            {/* student profile pic */}
                            <Row className='my-0'>
                                <Col className='text-center my-auto'>
                                    <span>Student Profile</span>
                                </Col>
                                <Col className='mx-20'>
                                    <img className='rounded-full w-20 h-20' src={selectedImage == null ? currentStudent.student_profile_pic : selectedImage} alt="student profile" />
                                </Col>
                                <Col className='my-auto'>
                                    <input type="file" accept='image/*' id="photo" className='hidden' onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            selectedImage = URL.createObjectURL(file);
                                            setCurrentStudent({
                                                ...currentStudent,
                                                student_profile_pic: selectedImage
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
                                setCurrentStudent({
                                    ...currentStudent,
                                    student_gender: selected,
                                })
                            }} />
                            <SelectComponent options={options} label='Class' onSelect={(selected) => {
                                setCurrentStudent({
                                    ...currentStudent,
                                    _class: selected
                                })
                            }} />
                            <SelectComponent options={streamOptions} label='Stream' onSelect={(selected) => {
                                setCurrentStudent({
                                    ...currentStudent,
                                    stream: selected
                                });
                            }} />
                            <SwitchTile label='Pick Up Session' subtitle={enabled ? 'Half day student' : 'Full day student'} onChange={(value) => {
                                setCurrentStudent({
                                    ...currentStudent,
                                    isHalfDay: value
                                })

                            }} /> <SwitchTile label='Van Student' subtitle={picked ? 'Van student' : 'Not a van student'} onChange={(value) => {
                                setCurrentStudent({
                                    ...currentStudent,
                                    isVanStudent: value
                                })

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

export default EditStudent;