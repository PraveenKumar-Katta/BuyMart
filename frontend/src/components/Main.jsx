import { useState } from "react";
import UserDashBoard from "./userDashBoard";
import AdminDashBoard from "./AdminDashBoard";
import VendorDashBoard from "./VendorDashBoard";



const Main = () => {
    const user=JSON.parse(localStorage.getItem("userInfo"))
    const [activeTab,setActiveTab]=useState(user.role)
    
    return (
        <div>
            {activeTab=="user"&&<UserDashBoard/>}
            {activeTab=="admin"&&<AdminDashBoard/>}
            {activeTab=="vendor"&&<VendorDashBoard/>}
        </div>
    )
};

export default Main;
