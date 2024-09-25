import React from 'react';
import SettingComponent from './SettingComponent';
import { Button, Form } from 'react-bootstrap';
import DropOffDateModal from './models/dropOffDateModal';
// import { Input, Slider } from '@mui/material';
import SliderComponent from '@/pages/components/SliderComponent';
import SwitchComponent from '@/pages/components/SwitchComponent';
import { SettingsModel } from '@/interfaces/SettingsModel';
import { saveSettings } from '@/utils/data_fetch';
import FormElement from '../Staff/models/FormElement';
import { Snackbar } from '@mui/material';

const SettingsData = ({ settings, handleUpdates }: { settings: SettingsModel; handleUpdates: () => void }) => {

    // booleans
    const [open, setOpen] = React.useState(false)
    const [openHalfDay, setOpenHalfDay] = React.useState(false);
    const [openHalfDayAllowance, setOpenHalfDayAllowance] = React.useState(false);
    const [openFullDay, setOpenFullDay] = React.useState(false)
    const [openFullDayAllowance, setOpenFullDayAllowance] = React.useState(false)
    const [openOvertimeInterval, setOpenOvertimeInterval] = React.useState(false)
    const [openDropAllowance, setOpenDropAllowance] = React.useState(false)
    const [openOvertimeRate, setOpenOvertimeRate] = React.useState(false)
    const [openOvertimeCurrency, setOpenOvertimeCurrency] = React.useState(false)
    const [process, setProcess] = React.useState(false);

    // values
    const [updateSettings, setUpdateSettings] = React.useState<SettingsModel>(settings);

    // handle form 
    const handleForm = function (e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        setProcess(true);
        const form = new FormData();
        Object.entries(updateSettings).forEach(([key, value]) => {
            form.append(key, value);
            // console.log(key, value);
        });
        // save new changes
        saveSettings(form).then((res) => {
            setProcess(false);
            console.log(res)
            handleUpdates();

        }).catch((err) => {
            console.log(err);
            setProcess(false);
        })
    }

    return (
        <div className='sm:mx-25 xsm:mx-2'>
            <Form method='POST' onSubmit={handleForm}>
                {/* drop offs */}
                <SettingComponent onTap={() => setOpen(true)} title='Drop Off Time' subTitle='Set the start time  and end time for drop offs' trailing={`${updateSettings.drop_off_start_time} - ${updateSettings.drop_off_end_time}`} />
                <SettingComponent onTap={() => setOpenDropAllowance(true)} title='Drop off time allowance' subTitle='Set the allowance time student drop offs' trailing={`${updateSettings.drop_off_allowance} mins`} />
                {/* half day */}
                <SettingComponent onTap={() => setOpenHalfDay(true)} title='Half Day PickUps' subTitle='Set the start and end time for half day pickups.' trailing={`${updateSettings.halfDay_pick_up_start_time} - ${updateSettings.halfDay_pick_up_end_time}`} />
                <SettingComponent onTap={() => setOpenHalfDayAllowance(true)} title='Half Day pick up allowance time' subTitle='Set the time for half day pickup.' trailing={`${updateSettings.halfDay_pick_up_allowance} mins`} />
                {/* full day */}
                <SettingComponent onTap={() => setOpenFullDay(true)} title='Full Day Pickups' subTitle='Set the start and end time for full day pickups' trailing={`${updateSettings.pick_up_start_time} - ${updateSettings.pick_up_end_time}`} />
                <SettingComponent onTap={() => setOpenFullDayAllowance(true)} title='PickUp allowance' subTitle='Set the allowance time for pickup.' trailing={`${updateSettings.pick_up_allowance} mins`} />
                {/* clocking */}
                <SettingComponent title='Clock in / Clock out' subTitle='Clock in / Clock out' trailing={<SwitchComponent defaultChecked={updateSettings.clock_in_clock_out} onChange={(b) => setUpdateSettings({
                    ...updateSettings,
                    clock_in_clock_out: b
                })} />} />

                {
                    !updateSettings.clock_in_clock_out ? (<>
                        <SettingComponent title='Overtime' subTitle={updateSettings.allow_overtime ? 'enabled' : 'disabled'} trailing={<SwitchComponent defaultChecked={updateSettings.allow_overtime} onChange={(b) => setUpdateSettings({
                            ...updateSettings,
                            allow_overtime: b
                        })} />
                        } />
                        {
                            updateSettings.allow_overtime ? (
                                <>
                                    <SettingComponent onTap={() => setOpenOvertimeCurrency(true)} title='Overtime Currency' subTitle='Select overtime currency' trailing={updateSettings.overtime_rate_currency} />
                                    <SettingComponent onTap={() => setOpenOvertimeInterval(true)} title='Overtime interval' subTitle='Set the amount of time after which an overtime will be charged. e.g every after 10mins.' trailing={`${updateSettings.overtime_interval} mins`} />
                                    <SettingComponent onTap={() => setOpenOvertimeRate(true)} title='Overtime rate' subTitle='Set the amount of money to be charge every after the set interval e.g 10min.' trailing={`UGX ${updateSettings.overtime_rate}`} />
                                </>
                            ) : (<></>)
                        }</>) : (<></>)
                }
                <br />
                <Button type='submit' disabled={process} variant='primary' className='w-full mb-10'>{process ? 'Saving...' : 'Save Settings'}</Button>
            </Form>


            {/* drop off time */}
            <DropOffDateModal onTap={() => {
                setOpen(false);
            }} title='Setting Drop Off Time' open={open} setOpen={setOpen}>
                <div className='p-3 flex flex-row justify-between mx-5'>
                    <div>
                        <label htmlFor="pickUpDate" className='font-bold p-1'>DropOff start time.</label> <br />
                        <input type="time" className='p-2 border' id="pickUpDate" value={updateSettings.drop_off_start_time} onChange={(e) => setUpdateSettings({
                            ...updateSettings,
                            drop_off_start_time: e.target.value
                        })} name="pickUpDate" />
                    </div>
                    <div>
                        <label htmlFor="pickUpTime" className='font-bold p-1'>DropOff stop time</label> <br />
                        <input type="time" className='border p-2' value={updateSettings.drop_off_end_time} id="pickUpTime" onChange={(e) => setUpdateSettings({
                            ...updateSettings,
                            drop_off_end_time: e.target.value
                        })} name="pickUpTime" />
                    </div>
                </div>
            </DropOffDateModal>
            {/* drop allowance */}
            <DropOffDateModal onTap={() => {
                setOpenDropAllowance(false);
            }} title='Setting drop off allowance time' open={openDropAllowance} setOpen={setOpenDropAllowance}>
                <div className='p-3 mx-5'>
                    <div>
                        <SliderComponent min={0} max={100} step={1} defaultValue={parseInt(updateSettings.drop_off_allowance)} onChange={(e) => {
                            setUpdateSettings({
                                ...updateSettings,
                                drop_off_allowance: `${e}`
                            })
                        }} />
                        <b>{updateSettings.drop_off_allowance} mins</b>
                    </div>

                </div>
            </DropOffDateModal>
            {/* Half day pickups */}
            <DropOffDateModal onTap={() => {
                setOpenHalfDay(false);
            }} title='Setting Half day Time' open={openHalfDay} setOpen={setOpenHalfDay}>
                <div className='p-3 flex flex-row justify-between mx-5'>
                    <div>
                        <label htmlFor="pickUpDate" className='font-bold p-1'>Half day start time.</label> <br />
                        <input type="time" className='p-2 border' id="pickUpDate" value={updateSettings.halfDay_pick_up_start_time} onChange={(e) => setUpdateSettings({
                            ...updateSettings,
                            halfDay_pick_up_start_time: e.target.value
                        })} name="pickUpDate" />
                    </div>
                    <div>
                        <label htmlFor="pickUpTime" className='font-bold p-1'>Half day stop time</label> <br />
                        <input type="time" className='border p-2' id="pickUpTime" value={updateSettings.halfDay_pick_up_end_time} onChange={(e) => setUpdateSettings({
                            ...updateSettings,
                            halfDay_pick_up_end_time: e.target.value
                        })} name="pickUpTime" />
                    </div>
                </div>
            </DropOffDateModal>
            {/* half day allowance */}
            <DropOffDateModal onTap={() => {
                setOpenHalfDayAllowance(false);
            }} title='Setting Half day allowance time' open={openHalfDayAllowance} setOpen={setOpenHalfDayAllowance}>
                <div className='p-3 mx-5'>
                    <div>
                        <SliderComponent min={0} max={100} step={1} defaultValue={parseInt(updateSettings.halfDay_pick_up_allowance)} onChange={(value) => setUpdateSettings({
                            ...updateSettings,
                            halfDay_pick_up_allowance: `${value}`
                        })} />
                        <b>{updateSettings.halfDay_pick_up_allowance} mins</b>
                    </div>

                </div>
            </DropOffDateModal>

            {/* full day time */}
            <DropOffDateModal onTap={() => {
                setOpenFullDay(false);
            }} title='Setting full day pickup time' open={openFullDay} setOpen={setOpenFullDay}>
                <div className='p-3 flex flex-row justify-between mx-5'>
                    <div>
                        <label htmlFor="pickUpDate" className='font-bold p-1'>Full day start time.</label> <br />
                        <input type="time" className='p-2 border' value={updateSettings.pick_up_start_time} onChange={(e) => setUpdateSettings({
                            ...updateSettings,
                            pick_up_start_time: e.target.value
                        })} id="pickUpDate" name="pickUpDate" />
                    </div>
                    <div>
                        <label htmlFor="pickUpTime" className='font-bold p-1'>Full day stop time</label> <br />
                        <input type="time" className='border p-2' value={updateSettings.pick_up_end_time} id="pickUpTime" onChange={(e) => setUpdateSettings({
                            ...updateSettings,
                            pick_up_end_time: e.target.value
                        })} name="pickUpTime" />
                    </div>
                </div>
            </DropOffDateModal>
            {/* ful day pickup allowance */}
            <DropOffDateModal onTap={() => {
                setOpenFullDayAllowance(false);
            }} title='Setting Full day allowance time' open={openFullDayAllowance} setOpen={setOpenFullDayAllowance}>
                <div className='p-3 mx-5'>
                    <div>
                        <SliderComponent min={0} max={100} step={1} defaultValue={parseInt(updateSettings.pick_up_allowance)} onChange={(value) => setUpdateSettings({
                            ...updateSettings,
                            pick_up_allowance: `${value}`
                        })} />
                        <b>{updateSettings.pick_up_allowance} mins</b>
                    </div>

                </div>
            </DropOffDateModal>
            {/* set the ovetime rate */}
            <DropOffDateModal onTap={() => {
                setOpenOvertimeRate(false);
            }} title='Setting Overtime rate' open={openOvertimeRate} setOpen={setOpenOvertimeRate}>
                <div className='p-3 mx-5'>
                    <div>
                        <FormElement
                            value={`${updateSettings.overtime_rate}`}
                            onChange={(e) => setUpdateSettings({
                                ...updateSettings,
                                overtime_rate: parseInt(e.target.value)
                            })}
                            label='Overtime rate (UGX)'
                        />
                        {/* <b>UGX {updateSettings.overtime_rate}</b> */}
                    </div>
                </div>
            </DropOffDateModal>
            {/* set overtime interval */}
            <DropOffDateModal onTap={() => {
                setOpenOvertimeInterval(false);
            }} title='Setting Overtime interval' open={openOvertimeInterval} setOpen={setOpenOvertimeInterval}>
                <div className='p-3 mx-5'>
                    <div>
                        <FormElement value={updateSettings.overtime_interval} onChange={(e) => setUpdateSettings(
                            {
                                ...updateSettings,
                                overtime_interval: e.target.value
                            }
                        )} label='Overtime interval' />

                        {/* <b>{updateSettings.overtime_interval} mins</b> */}
                    </div>
                </div>
            </DropOffDateModal>
            {/* snack bar */}

        </div>
    );
};

export default SettingsData;