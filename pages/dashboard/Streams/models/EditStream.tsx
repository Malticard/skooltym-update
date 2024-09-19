
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { Stream } from '@/interfaces/StreamModel';
import { SchoolClass } from '@/interfaces/ClassModel';
import SelectComponent, { Option } from '../../Staff/models/SelectComponent';
import { updateClassData } from '@/utils/data_fetch';
import FormElement from '../../Staff/models/FormElement';
const EditClass = ({ editModalShow, currentStream, setCurrentStream, setEditModalShow, handleSaveEdit }: { loadingClasses: boolean; editModalShow: boolean; currentStream: Stream | null; setEditModalShow: React.Dispatch<React.SetStateAction<boolean>>, setCurrentStream: React.Dispatch<React.SetStateAction<Stream | null>>; handleSaveEdit: () => void }) => {
    const [updating, setUpdating] = React.useState(false);
    const [message, setMessage] = React.useState<string>('');
    // function to handle submission
    const handleEditData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setUpdating(true);

        const formData = new FormData();

        Object.entries(currentStream as any).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        formData.append('class_key[key]', '');
        // posting data
        updateClassData(formData, currentStream?._id).then((res) => {
            setMessage('Class added successfully');
            console.log(res);
            handleSaveEdit();
            setUpdating(false)
        }).catch((err) => {
            console.warn(err);
            setMessage(err.toString());
            setUpdating(false)
        });
    }

    return (
        <>
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit stream</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentStream && (
                        <Form onSubmit={handleEditData}>
                            {/* {currentStudent._id} */}
                            <FormElement label='Stream Name'
                                value={currentStream.stream_name}
                                onChange={(e) => setCurrentStream({
                                    ...currentStream,
                                    stream_name: e.target.value
                                })} />
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

export default EditClass;