
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Stream } from '@/interfaces/StreamModel';
import { updateStreamData } from '@/utils/data_fetch';
import FormElement from '../../Staff/models/FormElement';
import { toast } from 'react-toastify';
const EditClass = ({ editModalShow, currentStream, setCurrentStream, setEditModalShow, handleSaveEdit }: { editModalShow: boolean; currentStream: Stream | null; setEditModalShow: React.Dispatch<React.SetStateAction<boolean>>, setCurrentStream: React.Dispatch<React.SetStateAction<Stream | null>>; handleSaveEdit: () => void }) => {
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
        // formData.append('stream_key[key]', '');
        // posting data
        updateStreamData(formData, currentStream?._id).then((res) => {
            toast.info(' added successfully', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
            console.log(res);
            handleSaveEdit();
            setUpdating(false)
            window.location.reload();
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