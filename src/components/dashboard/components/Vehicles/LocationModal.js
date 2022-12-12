import moment from "moment-timezone";
import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import copy from "copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { createShareLocation, expireLocationUrl } from "../../../../actions/locationsharingAction";
import ReactTooltip from "react-tooltip";

const LocationShareModal = (props) => {
    const { locationUrl } = useSelector(state => state.locationsharing)
    const [inputModalTitle, setInputModalTitle] = useState("");
    const [copyText, setCopyText] = useState('');
    const [share, setShare] = useState(false);
    const [shareList, setShareList] = useState(false);
    const [isSlideDriverInfo, setIsSlideDriverInfo] = useState(false);
    const [isSlideTrailerInfo, setIsSlideTrailerInfo] = useState(false);
    const [expiryDate, setExpiryDate] = useState("");
    const [copySuccess, setCopySuccess] = useState('');
    const dispatch = useDispatch();

    console.log(inputModalTitle, copySuccess, copyText)
    const handleSubmit = async (e) => {
        const dataValue = {
            expiry_time: expiryDate,
            isDriverInfo: isSlideDriverInfo,
            isDriverTrallerInfo: isSlideTrailerInfo,
            driverId: props?.driverId,
            vehicleId: props?.vehicleId,
        };
        dispatch(createShareLocation(dataValue));
        handleShare()
    };
    // console.log(props, 67)
    useEffect(() => {
        setInputModalTitle("Create Live Share Link");
    }, [setInputModalTitle]);

    const handleShare = (e) => {
        setShare(true)
    }
    const handleShareList = (e) => {
        setShareList(true)
    }
    // console.log(shareList, share)
    const handleShareCLose = (e) => {
        setShare(false)
        setShareList(false)
        setExpiryDate('')
        props?.close()
    }

    const handleSlideDriverInfo = () => {
        setIsSlideDriverInfo(!isSlideDriverInfo)
    }
    const handleSlideTrailerInfo = () => {
        setIsSlideTrailerInfo(!isSlideTrailerInfo)
    }
    const handleChange = (e) => {
        setExpiryDate(e.target.value)
    }
    const handleUnlink = (e, item) => {
        let tokenId = item.tokenId;
        let driverIdExpire = item.driver
        dispatch(expireLocationUrl(driverIdExpire, tokenId))

    }
    const handleCopyText = (e) => {
        setCopyText(e.target.value);
    }
    const handleCopyTextCreateModal = (e) => {
        setCopyText(e.target.value);
    }
    const copyToClipboard = (e, item) => {
        // console.log(item, 109)
        copy(item.link_url);
    }
    const copyToClipboardCreateModal = (e, item) => {
        // console.log(e, 109)
        copy(locationUrl);
        setCopySuccess("copied")
    }
    let disableCondition = expiryDate === "";

    return (
        props.open && (
            <Modal show={props.open} onHide={props.close} className="create-live-modal">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title">Create Live Share Link</Modal.Title>
                    <Button variant="outline-danger" onClick={(e) => handleShareCLose(e)}><i className="fa fa-close"></i></Button>
                </Modal.Header>
                {props?.historyLocation.length === 0 || shareList ?
                    <Modal.Body>
                        <form className="search-data add-driver create-live-share">

                            <div className="modal-body">
                                <label>Expiration Date</label>
                                <input type="datetime-local" placeholder="hello" min={new Date().toISOString().slice(0, 16)} onChange={(e) => handleChange(e)} />
                                <div className="toggle-create-live">
                                    <p>Drive Phone Number
                                        <label className="switch">
                                            <input type="checkbox" onClick={() => handleSlideDriverInfo()} />
                                            <span className="slider round"></span>
                                        </label>
                                    </p>

                                    <p>Driver Trailer and Shipping Documents
                                        <label className="switch">
                                            <input type="checkbox" onClick={() => handleSlideTrailerInfo()} />
                                            <span className="slider round"></span>
                                        </label>
                                    </p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {!share &&
                                    <button type="button" disabled={disableCondition} onClick={() => handleSubmit()} className="btn btn-primary">Create Live Share Link</button>
                                }
                                {share &&
                                    <div class="input_email_copy">
                                        <div className="location_url">URL</div>
                                        <input
                                            onChange={(e) => handleCopyTextCreateModal(e)}
                                            value={locationUrl ? locationUrl : ""}
                                        />
                                        <button data-tip data-for="registerTip" type="button" onClick={(e) => copyToClipboardCreateModal(e)} ><i class="ti ti-copy"></i></button>
                                        <ReactTooltip id="registerTip" place="top" effect="solid" event="click" afterShow={() => { setTimeout(ReactTooltip.hide, 700) }}>
                                            Copied!
                                        </ReactTooltip>
                                    </div>


                                }
                            </div>
                        </form>
                    </Modal.Body>
                    : ''}

                {props?.historyLocation.length > 0 && !shareList &&
                    <Modal.Body className="location_sharing_body">
                        <form className="search-data add-driver create-live-share">
                            <div className="location_sharing_scroll">
                                {props?.historyLocation.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <div className="modal-body for_modal_deisgn_box">

                                                <label>Expiration Date</label>
                                                <div class="input_unlink">
                                                    <div className="calender_with_icon">
                                                        <i class="ti ti-calendar-time"></i>
                                                        <input type="text"
                                                            value={moment(item?.expiry_time).format('lll')} />
                                                    </div>
                                                    <button type="button" onClick={(e) => handleUnlink(e, item)} className="unlink_btn" ><i class="ti ti-unlink"></i></button>

                                                </div>
                                                <div className={item?.isDriverInfo === true ? "allow_div" : "dis_allow_div"}>
                                                    <p>Drive Information</p>
                                                    {item?.isDriverInfo === true ?
                                                        <span>Allowed</span> : <span>Disallowed</span>
                                                    }
                                                </div>
                                                <div className={item?.isDriverTrallerInfo === true ? "allow_div" : "dis_allow_div"}>
                                                    <p>Driver Trailer and Shipping Documents </p>

                                                    {item?.isDriverTrallerInfo === true ?
                                                        <span>Allowed</span> : <span>Disallowed</span>
                                                    }
                                                </div>
                                                <div class="input_email_copy">
                                                    <div className="location_url">URL</div>
                                                    <input
                                                        onChange={(e) => handleCopyText(e)}
                                                        value={item?.link_url}
                                                    />
                                                    <button data-tip data-for="registerTip" type="button" onClick={(e) => copyToClipboard(e, item)} ><i class="ti ti-copy"></i></button>
                                                    <ReactTooltip id="registerTip" place="top" effect="solid" event="click" afterShow={() => { setTimeout(ReactTooltip.hide, 700) }}>
                                                     Copied!
                                                    </ReactTooltip>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="modal-footer">
                                <button type="submit" onClick={(e) => handleShareList(e)} className="btn btn-primary">Create Live Share Link</button>
                            </div>
                        </form>
                    </Modal.Body>
                }
            </Modal>

        )
    )
}

export default LocationShareModal;