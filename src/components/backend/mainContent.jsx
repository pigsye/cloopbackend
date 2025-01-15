import "./mainContent.scss"
import { Routes, Route } from "react-router-dom";
import Sidebar from "./sidebar/sidebar.jsx"
import Topbar from "./topbar/topbar.jsx"
import Accounts from "./components/accounts/main.jsx"
import User from "./components/accounts/user.jsx"
import Reports from "./components/accounts/reportedusers.jsx"
import NewAccount from "./components/accounts/createnew.jsx"
import Clothes from "./components/clothing/main.jsx"
import ApproveClothes from "./components/clothing/approve.jsx"
import Listing from "./components/clothing/listing.jsx";
import Orders from "./components/orders/main.jsx"
import Order from "./components/orders/orders.jsx"
import Tags from "./components/tags/main.jsx"
import Feedbacks from "./components/feedbacks/main.jsx"
import Feedback from "./components/feedbacks/feedback.jsx"
import ChatLogs from "./components/chat_logs/main.jsx"
import ChatLog from "./components/chat_logs/chatlog.jsx"

export default function MainContent() {

    const user = {name:"Meow"};

    return (
        <>
            <Sidebar />
            <div className="wack">
                <Topbar user={user} />
                <div className="main-content">
                <Routes>
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/accounts/user/:id" element={<User />} /> 
                    <Route path="/accounts/reports" element={<Reports />} />
                    <Route path="/accounts/createAccount" element={<NewAccount />} />
                    <Route path="/clothing" element={<Clothes />} />
                    <Route path="/clothing/approve" element={<ApproveClothes />} />
                    <Route path="/clothing/listing/:id" element={<Listing />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/order/:id" element={<Order />} />
                    <Route path="/tags" element={<Tags />} />
                    <Route path="/feedbacks" element={<Feedbacks />} />
                    <Route path="/feedbacks/feedback/:id" element={<Feedback />} />
                    <Route path="/logs" element={<ChatLogs />} />
                    <Route path="/logs/log/:id" element={<ChatLog />} />
                </Routes>
                </div>
            </div>
        </>
    )
}