import React from 'react';
import SettingComponent from '../../Settings/SettingComponent';
import { Button, Form } from 'react-bootstrap';
import DropOffDateModal from '../../Settings/models/dropOffDateModal';
import SliderComponent from '@/pages/components/SliderComponent';
import SwitchComponent from '@/pages/components/SwitchComponent';
import { saveSettings, saveStaffSettings } from '@/utils/data_fetch';
import FormElement from '../../Staff/models/FormElement';
import { IStaffSettings } from '@/interfaces/StaffSettingsModel';

// Default settings to use when props.settings is undefined
const defaultSettings: IStaffSettings = {
    school: '', // Required field
    staff_clock_in_start: '', // Matches default in interface
    staff_clock_in_end: '', // Matches default in interface
    late_clocking: false, // Optional, default is false
    late_interval: 0, // Optional, default is 0
    late_charge_currency: 'UGX', // Optional, default is 0
    late_charge: 0, // Optional, default is 0
    staff_clock_out_start: '', // Matches default in interface
    staff_clock_out_end: '', // Matches default in interface
    staff_currency: 'UGX', // Matches default in interface
    staff_clock_out_allowance: 0, // Matches default in interface
    staff_clock_in_allowance: 0, // Matches default in interface
    staff_overtime: false, // Matches default in interface
    staff_overtime_rate: 0, // Matches default in interface
    staff_interval: 0, // Matches default in interface
};

interface SettingsDataProps {
    settings?: IStaffSettings;
    handleUpdates: () => void;
}

const SettingsSection: React.FC<SettingsDataProps> = ({ settings, handleUpdates }) => {
    // Initialize with either provided settings or default values
    const initialSettings = settings || defaultSettings;

    // booleans
    const [open, setOpen] = React.useState(false);
    const [openHalfDay, setOpenHalfDay] = React.useState(false);
    const [openHalfDayAllowance, setOpenHalfDayAllowance] = React.useState(false);
    // const [openFullDay, setOpenFullDay] = React.useState(false);
    // const [openFullDayAllowance, setOpenFullDayAllowance] = React.useState(false);
    const [openOvertimeInterval, setOpenOvertimeInterval] = React.useState(false);
    const [openDropAllowance, setOpenDropAllowance] = React.useState(false);
    const [openOvertimeRate, setOpenOvertimeRate] = React.useState(false);
    const [openOvertimeCurrency, setOpenOvertimeCurrency] = React.useState(false);
    const [process, setProcess] = React.useState(false);
    const [lateInterval, setOpenLateInterval] = React.useState(false);
    const [lateCharge, setOpenLateCharge] = React.useState(false);

    // values
    const [updateSettings, setUpdateSettings] = React.useState<IStaffSettings>(initialSettings);

    // handle form 
    const handleForm = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setProcess(true);
        try {
            const form = new FormData();
            Object.entries(updateSettings).forEach(([key, value]) => {
                console.log(key, value);
                form.append(key, String(value)); // Ensure value is converted to string
            });

            await saveStaffSettings(form);
            handleUpdates();
        } catch (err) {
            console.error('Error saving settings:', err);
        } finally {
            setProcess(false);
        }
    };

    // Safely get setting value with fallback
    const getSettingValue = (value: string | undefined, fallback: string): string => {
        return value || fallback;
    };
    return (
        <div className='sm:mx-25 xsm:mx-2'>
            <Form method='POST' onSubmit={handleForm}>
                {/* drop offs */}
                <SettingComponent
                    onTap={() => setOpen(true)}
                    title='Staff Clock In Time'
                    subTitle='Set the start time and end time for clocking in.'
                    trailing={`${getSettingValue(updateSettings.staff_clock_in_start, '00:00')} - ${getSettingValue(updateSettings.staff_clock_in_end, '00:00')}`}
                />
                {/* clocking in allowance */}
                <SettingComponent onTap={() => setOpenDropAllowance(true)} title='Staff Clocking In allowance time' subTitle='Set extra time for staff clock in' trailing={`${getSettingValue(`${updateSettings.staff_clock_in_allowance}`, '0')} mins`} />
                {/* half day */}
                {
                    (<>
                        <SettingComponent title='Late Clocking' subTitle={updateSettings.late_clocking ? 'enabled' : 'disabled'} trailing={<SwitchComponent defaultChecked={updateSettings.late_clocking} onChange={(b) => setUpdateSettings({
                            ...updateSettings,
                            late_clocking: b
                        })} />
                        } />
                        {
                            updateSettings.late_clocking ? (
                                <>
                                    <SettingComponent onTap={() => setOpenOvertimeCurrency(true)} title='Late Fee Currency' subTitle='Select overtime currency' trailing={updateSettings.late_charge_currency} />
                                    <SettingComponent onTap={() => setOpenLateInterval(true)} title='Late Fee interval' subTitle='Set the amount of time after which an overtime will be charged. e.g every after 10mins.' trailing={`${updateSettings.late_interval} mins`} />
                                    <SettingComponent onTap={() => setOpenLateCharge(true)} title='Late Fee Rate' subTitle='Set the amount of money to be charge every after the set interval e.g 10min.' trailing={`UGX ${updateSettings.late_charge?.toLocaleString()}`} />
                                </>
                            ) : (<></>)
                        }</>)
                }
                <SettingComponent onTap={() => setOpenHalfDay(true)} title='Staff Clocking Out Time ' subTitle='Set the start and end time for staff clock out.' trailing={`${getSettingValue(updateSettings.staff_clock_out_start, '00:00')} - ${getSettingValue(updateSettings.staff_clock_out_end, '00:00')}`} />
                <SettingComponent onTap={() => setOpenHalfDayAllowance(true)} title='Staff Clocking Out allowance time' subTitle='Set the extra time for staff clock out.' trailing={`${getSettingValue(`${updateSettings.staff_clock_out_allowance}`, '0')} mins`} />

                {
                    (<>
                        <SettingComponent title='Overtime' subTitle={updateSettings.staff_overtime ? 'enabled' : 'disabled'} trailing={<SwitchComponent defaultChecked={updateSettings.staff_overtime} onChange={(b) => setUpdateSettings({
                            ...updateSettings,
                            staff_overtime: b
                        })} />
                        } />
                        {
                            updateSettings.staff_overtime ? (
                                <>
                                    <SettingComponent onTap={() => setOpenOvertimeCurrency(true)} title='Overtime Currency' subTitle='Select overtime currency' trailing={updateSettings.staff_currency} />
                                    <SettingComponent onTap={() => setOpenOvertimeInterval(true)} title='Overtime interval' subTitle='Set the amount of time after which an overtime will be charged. e.g every after 10mins.' trailing={`${updateSettings.staff_interval} mins`} />
                                    <SettingComponent onTap={() => setOpenOvertimeRate(true)} title='Overtime rate' subTitle='Set the amount of money to be charge every after the set interval e.g 10min.' trailing={`UGX ${updateSettings.staff_overtime_rate?.toLocaleString()}`} />
                                </>
                            ) : (<></>)
                        }</>)
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
                        <label htmlFor="pickUpDate" className='font-bold p-1'>Staff clock in start time.</label> <br />
                        <input type="time" className='p-2 border' id="pickUpDate" value={updateSettings.staff_clock_in_start} onChange={(e) => setUpdateSettings({
                            ...updateSettings,
                            staff_clock_in_start: e.target.value
                        })} name="pickUpDate" />
                    </div>
                    <div>
                        <label htmlFor="pickUpTime" className='font-bold p-1'>Staff clock in stop time</label> <br />
                        <input type="time" className='border p-2' value={updateSettings.staff_clock_in_end} id="pickUpTime" onChange={(e) => setUpdateSettings({
                            ...updateSettings,
                            staff_clock_in_end: e.target.value
                        })} name="pickUpTime" />
                    </div>
                </div>
            </DropOffDateModal>

            {/* Half day pickups */}
            <DropOffDateModal onTap={() => {
                setOpenHalfDay(false);
            }} title='Setting Clock out Time' open={openHalfDay} setOpen={setOpenHalfDay}>
                <div className='p-3 flex flex-row justify-between mx-5'>
                    <div>
                        <label htmlFor="pickUpDate" className='font-bold p-1'>Staff clock out start time.</label> <br />
                        <input type="time" className='p-2 border' id="pickUpDate" value={updateSettings.staff_clock_out_start} onChange={(e) => setUpdateSettings({
                            ...updateSettings,
                            staff_clock_out_start: e.target.value
                        })} name="pickUpDate" />
                    </div>
                    <div>
                        <label htmlFor="pickUpTime" className='font-bold p-1'>Staff clock out end time</label> <br />
                        <input type="time" className='border p-2' id="pickUpTime" value={updateSettings.staff_clock_out_end} onChange={(e) => setUpdateSettings({
                            ...updateSettings,
                            staff_clock_out_end: e.target.value
                        })} name="pickUpTime" />
                    </div>
                </div>
            </DropOffDateModal>
            {/* half day allowance */}
            <DropOffDateModal onTap={() => {
                setOpenHalfDayAllowance(false);
            }} title='Setting clock out allowance time' open={openHalfDayAllowance} setOpen={setOpenHalfDayAllowance}>
                <div className='p-3 mx-5'>
                    <div>
                        <SliderComponent min={0} max={100} step={1} defaultValue={updateSettings.staff_clock_out_allowance} onChange={(value) => setUpdateSettings({
                            ...updateSettings,
                            staff_clock_out_allowance: value
                        })} />
                        <b>{updateSettings.staff_clock_out_allowance} mins</b>
                    </div>

                </div>
            </DropOffDateModal>
            {/* staff clock in allowance */}
            <DropOffDateModal onTap={() => {
                setOpenDropAllowance(false);
            }} title='Setting staff clock in allowance time' open={openDropAllowance} setOpen={setOpenDropAllowance}>
                <div className='p-3 mx-5'>
                    <div>
                        <SliderComponent min={0} max={100} step={1} defaultValue={updateSettings.staff_clock_in_allowance} onChange={(value) => setUpdateSettings({
                            ...updateSettings,
                            staff_clock_in_allowance: value
                        })} />
                        <b>{updateSettings.staff_clock_in_allowance} mins</b>
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
                            value={`${updateSettings.staff_overtime_rate}`}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateSettings({
                                ...updateSettings,
                                staff_overtime_rate: parseInt(e.target.value)
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
                        <FormElement value={`${updateSettings.staff_interval}`} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateSettings(
                            {
                                ...updateSettings,
                                staff_interval: parseInt(e.target.value)
                            }
                        )} label='Overtime interval' />

                        {/* <b>{updateSettings.overtime_interval} mins</b> */}
                    </div>
                </div>
            </DropOffDateModal>


            {/* handle late input settings */}

            <DropOffDateModal onTap={() => {
                setOpenLateCharge(false);
            }} title='Setting Late charge' open={lateCharge} setOpen={setOpenLateCharge}>
                <div className='p-3 mx-5'>
                    <div>
                        <FormElement
                            value={`${updateSettings.late_charge}`}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateSettings({
                                ...updateSettings,
                                late_charge: parseInt(e.target.value)
                            })}
                            label='Late Charge (UGX)'
                        />
                        {/* <b>UGX {updateSettings.overtime_rate}</b> */}
                    </div>
                </div>
            </DropOffDateModal>
            {/* set overtime interval */}
            <DropOffDateModal onTap={() => {
                setOpenLateInterval(false);
            }} title='Setting Late interval' open={lateInterval} setOpen={setOpenLateInterval}>
                <div className='p-3 mx-5'>
                    <div>
                        <FormElement value={`${updateSettings.late_interval}`} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateSettings(
                            {
                                ...updateSettings,
                                late_interval: parseInt(e.target.value)
                            }
                        )} label='Late interval' />

                        {/* <b>{updateSettings.overtime_interval} mins</b> */}
                    </div>
                </div>
            </DropOffDateModal>
            {/* snack bar */}
        </div>
    );
};

export default SettingsSection;