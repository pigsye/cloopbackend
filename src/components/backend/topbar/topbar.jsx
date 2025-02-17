import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api";
import "./topbar.scss";

export default function Topbar() {
    return (
        <>
            <div className="topbar">
                <div className="user-info">
                    
                </div>
            </div>
            <div className="faketopbar"></div>
        </>
    );
}