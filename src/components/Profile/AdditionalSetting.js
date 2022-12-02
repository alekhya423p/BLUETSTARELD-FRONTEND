import React, { useEffect } from 'react';
import { updateProfileSetting } from '../../actions/authAction'
import { UPDATE_PROFILE_SETTING_RESET } from '../../constants/actionTypes'
import Loading from '../layout/Loading';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
const AdditionalSetting = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, userSetting } = useSelector(state => state.updateProfile)

    useEffect(() => {
        return () => {
            dispatch({ type: UPDATE_PROFILE_SETTING_RESET })
        }
    }, [userSetting, dispatch]);

    const validationSchema = yup.object().shape({
        timeZones: yup.string().required('Time Zones is required'),
        landingPage: yup.string().required('Landing Page is required'),
    });
    const { register, handleSubmit, reset, setValue, formState: { errors, ...formState } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    })

    const { isValid } = formState
    const onSubmit = async (values, e) => {
        values.id = (userSetting.id !== false) ? userSetting.id : ''
        dispatch(updateProfileSetting(values, navigate))
    };
    useEffect(() => {
        if (userSetting) {
            setValue('timeZones', userSetting.firstName)
            setValue('landingPage', userSetting.lastName)
        } 
    }, [reset, setValue, userSetting]);

    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                    <form className="search-data add-driver" onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="mb-4">
                                    <label className="form-label">Time Zones</label>
                                    <select className="form-control select2" {...register('timeZones')}>
                                        <option value={''}>Select</option>
                                        {db.timeZone.map((e, key) => {
                                            return <option key={key} value={e.value}>{e.key}</option>
                                        })}
                                    </select>
                                    {errors.timeZones && (
                                    <div className="text-danger">{errors.timeZones.message}</div>
                                )}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="mb-4">
                                    <label htmlFor="validationCustom01" className="form-label">Landing Page</label>
                                    <select className="form-control form-select" {...register('landingPage')}>
                                        <option value={''}>Select</option>
                                        <option value="AK">Dashboard</option>
                                        <option value="HI">Driver HOS</option>
                                        <option value="Ho">Logs</option>
                                    </select>
                                    {errors.landingPage && (
                                    <div className="text-danger">{errors.landingPage.message}</div>
                                )}
                                </div>
                            </div>
                        </div>
                        <div className="dropdown-divider m-0 pb-4"></div>
                        <div className="d-inline-flex float-end me-2">
                            <div className="col-sm-5">
                                <div className="form-group">
                                    <button className="btn cancel-btn btn border border-color d-block  bg-white ">Cancel</button>
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <div className="form-group">
                                    <button type="submit" disabled={isValid} className="btn d-block add-button">{ loading ? <Loading /> : 'Save Changes' }</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AdditionalSetting;