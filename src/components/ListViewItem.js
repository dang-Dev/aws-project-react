import React, { useEffect, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import {
    getDoc,
    doc,
  } from "firebase/firestore";
  import { db } from "../firebase";

const ListViewItem = (props) => {
  const { react } = props;
    const [reactUser, setReactUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", `${react.userID}`);
      const data = await getDoc(docRef);
      setReactUser(data.data());
    };
    getUser();
  }, [react]);

  return (
    <ListItem
      secondaryAction={
        <Link href={`/${react.userID}/profile`} underline="none">
          {"See All"}
        </Link>
      }
    >
      <ListItemAvatar>
       <Avatar sx={{ width: 32, height: 32, border: "1px solid #f50057" }} src={reactUser && reactUser.profileURL} />
      </ListItemAvatar>
      <ListItemText primary={reactUser ? <b>{reactUser.firstName + " " + reactUser.lastName}</b> : "No Data!"} secondary="View All Top Post" />
    </ListItem>
  );
};

export default ListViewItem;
