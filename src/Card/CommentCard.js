import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import { Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "@mui/material";


export default function AvatarCard(props) {
  const { commentUserID, comment, createdAt } = props;
  const [currentUserData, setCurrentUserData] = useState({});
  const [timePassed, setTimePassed] = useState();
  const [fullName, setFullName] = useState();

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", `${commentUserID}`);
      const data = await getDoc(docRef);
      setCurrentUserData(data.data());
    };
    getUser();
    setFullName(currentUserData.firstName + " " + currentUserData.lastName);
  }, [commentUserID, currentUserData]);

  useEffect(() => {
    const todayDateTime = new Date();
    const newFormatDateTime = new Date(createdAt && createdAt.seconds * 1000);
    const passedTime = Math.round(
      todayDateTime.getTime() - newFormatDateTime.getTime()
    );
    const in_day = passedTime / (1000 * 60 * 60 * 24);
    const in_hour = (passedTime / (1000 * 60 * 60)) % 24;
    const in_minute = (passedTime / (1000 * 60)) % 60;
    const in_second = (passedTime / 1000) % 60;
    
    if(Number(in_minute.toFixed(0)) === 0){
      setTimePassed(in_second.toFixed(0)+ " s")
    }else if (Number(in_hour.toFixed(0)) === 0){
      setTimePassed(in_minute.toFixed(0)+ " m")
    }else if (Number(in_day.toFixed(0)) === 0){
      setTimePassed(in_hour.toFixed(0)+ " h")
    }else{
      setTimePassed(in_day.toFixed(0)+ " d")
    }
    
  }, [createdAt]);

  return (
    <CardHeader
      sx={{ p: 1.5, textAlign: "left", fontSize: "10px", boxShadow: "none" }}
      avatar={<Avatar sx={{ width: 32, height: 32, border: "1px solid #f50057" }} src={currentUserData && currentUserData.profileURL} />}
      action={
        <IconButton aria-label="heart">
          <FavoriteBorderIcon sx={{ width: "16px", height: "16px" }} />
        </IconButton>
      }
      title={
        <Typography >
          <Link
              href={`/${commentUserID}/profile`}
              underline="none"
              variant="body1"
              color="black"
              sx={{ fontSize: "15px", fontWeight: "600" }}
            >
              {fullName
                ? String(fullName)
                : "NO DATA!"}
            </Link> {comment}
        </Typography>
      }
      subheader={
        <Typography sx={{ mt: 0.5, fontSize: "13px" }}>{timePassed} ago</Typography>
      }
    />
  );
}
