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
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

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
        <Avatar {...stringAvatar(reactUser ? reactUser.firstName + " " + reactUser.lastName: "No Data!")} />
      </ListItemAvatar>
      <ListItemText primary={reactUser ? <b>{reactUser.firstName + " " + reactUser.lastName}</b> : "No Data!"} secondary="View All Top Post" />
    </ListItem>
  );
};

export default ListViewItem;
