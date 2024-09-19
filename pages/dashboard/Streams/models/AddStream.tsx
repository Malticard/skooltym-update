
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { postStreamData } from '@/utils/data_fetch';
import { Stream } from '@/interfaces/StreamModel';
import { SchoolClass } from '@/interfaces/ClassModel';
import FormElement from '../../Staff/models/FormElement';

const AddClass = ({ addModalShow, loadingClasses = false, setAddModalShow, handleSave }: { loadingClasses: boolean; addModalShow: boolean; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, handleSave: (classData: Stream) => void }) => {
    const [classData, setClassData] = React.useState({} as any);
    const [message, setMessage] = React.useState<string>('');
    const [posting, setPosting] = React.useState(false);
    // pickup subtitle
    // function to handle submission
    const handleSubmitData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('')
        setPosting(true);

        const formData = new FormData();
        // capturing school
        formData.append('school', JSON.parse(localStorage.getItem('skooltym_user') as string).school);

        Object.entries(classData).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        // posting data
        postStreamData(formData).then((res) => {
            setMessage('Stream added successfully');
            handleSave(res);
            setPosting(false)
        }).catch((err) => {
            console.warn(err);
            setMessage(err.toString());
            setPosting(false)
        })
    }
    return (
        <>
            <Modal show={addModalShow} onHide={() => setAddModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Stream</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitData}>
                    <Modal.Body>
                        <FormElement
                            value={classData.class_name}
                            label='Stream Name'
                            onChange={(e) => setClassData({
                                ...classData,
                                staff_fname: e.target.value
                            })} />
                        <br />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={posting} onClick={() => setAddModalShow(false)}>
                            Close
                        </Button>
                        <Button disabled={posting} type='submit' variant="primary">
                            {posting == false ? `Add Stream` : `Saving...`}
                        </Button>
                    </Modal.Footer>
                    {message && <p className="mt-4 bg-[#ee2020cb] p-2 text-white font-semibold text-center">{message}</p>}
                </Form>
            </Modal>
        </>
    );
};

export default AddClass;