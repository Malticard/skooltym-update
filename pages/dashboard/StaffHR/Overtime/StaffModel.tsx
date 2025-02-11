import { StaffOvertimeResult } from '@/interfaces/StaffOvertimeModel';
import Image from 'next/image';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
interface StaffIF {
    staff: StaffOvertimeResult | null;
    show: boolean;
    close: React.Dispatch<React.SetStateAction<boolean>>;
    size: "lg" | "sm" | "xl" | undefined
}
const StaffModel: React.FC<StaffIF> = ({ staff, close, show, size = "lg" }) => {
    return (
        <Modal show={show} size={size} centered>
            {/*  */}
            <Modal.Header>
                <Modal.Title>Staff Overtime</Modal.Title>
            </Modal.Header>
            {/* body */}
            <Modal.Body>
                {staff && (
                    <>
                        <img src={staff.staff.staff_profilePic} alt="Staff profile picture" className='rounded-full w-20 h-20' width={100} height={100} />
                    </>
                )}
            </Modal.Body>
            {/* footer */}
            <Modal.Footer>
                <Button variant="outline-primary" onClick={() => close(!show)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StaffModel;