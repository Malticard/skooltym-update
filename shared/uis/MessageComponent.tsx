import { Snackbar, SnackbarCloseReason } from '@mui/material';
import React, { SyntheticEvent } from 'react';

const MessageComponent = (props: { message: string; }) => {
    const [open, setOpen] = React.useState(true);
    function handleClose(event: Event | SyntheticEvent<any, Event>, reason: SnackbarCloseReason): void {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message="This Snackbar will be dismissed in 5 seconds."
            />
        </div>
    );
};

export default MessageComponent;