
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import FormElement from './FormElement';
import { postGuardianData } from '@/utils/data_fetch';
import { Guardian } from '@/interfaces/GuardiansModel';

import { StudentsNotPaginated } from '@/interfaces/StudentsNonPaginated';
import SelectComponent, { Option } from '../../Staff/models/SelectComponent';

const AddGuardian = ({ addModalShow, students, loadingClasses = false, setAddModalShow, handleSave }: { students: StudentsNotPaginated[]; loadingClasses: boolean; addModalShow: boolean; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, handleSave: (student: Guardian) => void }) => {

    const [guardianData, setGuardianData] = React.useState({} as any);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [message, setMessage] = React.useState<string>('');
    const [posting, setPosting] = React.useState(false);
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
    // relationship options
    const relationship: Option[] = [
        { name: "Select relationship", value: "" },
        { name: "Father", value: "Father" },
        { name: "Mother", value: "Mother" },
        { name: "Sister", value: "Sister" },
        { name: "Brother", value: "Brother" },
        { name: "Guardian", value: "Guardian" },
    ]
    // relationship type
    const relationshipType: Option[] = [
        { name: "Select relationship type", value: '' }, { name: "Primary", value: 'Primary' }, { name: "Secondary", value: 'Secondary' },
    ]
    // streams
    const studentsOptions: Option[] = [];
    students.map((st) => studentsOptions.push({ name: `${st.student_fname} ${st.student_lname}`, value: st._id }));
    // pickup subtitle
    // function to handle submission
    const handleSubmitData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('')
        setPosting(true);
        // if (!imageFile) {
        //     setPosting(false)
        //     setMessage('Please select an image file');
        //     return;
        // }
        const formData = new FormData();
        // capturing school
        formData.append('school', JSON.parse(localStorage.getItem('skooltym_user') as string).school);
        // capturing school name
        formData.append('name', JSON.parse(localStorage.getItem('skooltym_user') as string).schoolName);

        Object.entries(guardianData).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        // posting data
        postGuardianData(formData).then((res) => {
            setMessage('Staff added successfully');
            handleSave(res);
            // setPosting(false)
            window.location.reload();
        }).catch((err) => {
            console.warn(err);
            setMessage(err.toString());
            // setPosting(false)
        })
    }
    return (
        <>
            <Modal show={addModalShow} onHide={() => setAddModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Guardian</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitData}>
                    <Modal.Body>
                        <FormElement
                            value={guardianData.guardian_fname}
                            label='FirstName'
                            onChange={(e) => setGuardianData({
                                ...guardianData,
                                guardian_fname: e.target.value
                            })} />
                        <br />
                        <FormElement label='LastName'
                            value={guardianData.guardian_lname}
                            onChange={(e) => setGuardianData({
                                ...guardianData,
                                guardian_lname: e.target.value
                            })} />
                        {/* <br />
                        <FormElement label='Email'
                            value={guardianData.guardian_email}
                            onChange={(e) => setGuardianData({
                                ...guardianData,
                                guardian_email: e.target.value
                            })} /> */}
                        <br />
                        <FormElement label='Phone Number'
                            value={guardianData?.guardian_contact}
                            onChange={(e) => setGuardianData({
                                ...guardianData,
                                guardian_contact: parseInt(e.target.value)
                            })} />
                        <br />
                        {/* student profile pic */}
                        <Row className='my-0'>
                            <Col className='text-center my-auto'>
                                <span>Student Profile</span>
                            </Col>
                            <Col className='mx-20'>
                                <img className='rounded-full w-20 h-20' src={imageFile == null ? "https://via.placeholder.com/500" : URL.createObjectURL(imageFile as Blob)} alt="student profile" />
                            </Col>
                            <Col className='my-auto'>
                                <input type="file" accept='image/*' id="photo" className='hidden' onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (e.target.files && e.target.files[0]) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }
                                }} />
                                <Button onClick={() => {
                                    document.getElementById('photo')?.click();
                                }} variant='primary'>Upload</Button>

                            </Col>
                        </Row>
                        <br />
                        <SelectComponent options={gender} label='Gender' onSelect={(selected) => {
                            setGuardianData({
                                ...guardianData,
                                guardian_gender: selected,
                            })
                        }} />
                        <br /> <SelectComponent options={relationshipType} label='Type' onSelect={(selected) => {
                            setGuardianData({
                                ...guardianData,
                                type: selected,
                            })
                        }} /><br /> <SelectComponent multiSelect options={studentsOptions} label='Students' onSelect={(selected) => {
                            setGuardianData({
                                ...guardianData,
                                students: selected,
                            })
                        }} /><br /> <SelectComponent options={relationship} label='Relationship' onSelect={(selected) => {
                            setGuardianData({
                                ...guardianData,
                                relationship: selected,
                            })
                        }} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={posting} onClick={() => setAddModalShow(false)}>
                            Close
                        </Button>
                        <Button disabled={posting} type='submit' variant="primary">
                            {posting == false ? `Save Changes` : `Saving...`}
                        </Button>
                    </Modal.Footer>
                    {message && <p className="mt-4 bg-[#ee2020cb] p-2 text-white font-semibold text-center">{message}</p>}
                </Form>
            </Modal>
        </>
    );
};

export default AddGuardian;